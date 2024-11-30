import { Pool } from '../types/pool';
import { normalizeTokenSymbol } from '../utils/tokens';

const DEBANK_API_BASE = 'https://pro-openapi.debank.com/v1';
const API_KEY = import.meta.env.VITE_DEBANK_API_KEY;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const REQUEST_TIMEOUT = 10000;

interface DebankPosition {
  id: string;
  protocol_id: string;
  chain: string;
  detail: {
    supply_token_list: Array<{
      amount: number;
      symbol: string;
    }>;
    withdraw_token_list: Array<{
      amount: number;
      symbol: string;
    }>;
    reward_token_list: Array<{
      amount: number;
      symbol: string;
    }>;
  };
}

interface DebankCache {
  positions: {
    [address: string]: {
      data: Pool[];
      timestamp: number;
    };
  };
  poolInfo: {
    [key: string]: {
      data: Pool;
      timestamp: number;
    };
  };
}

const CACHE_DURATION = 30000;
const cache: DebankCache = {
  positions: {},
  poolInfo: {},
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, retries = MAX_RETRIES): Promise<any> => {
  if (!API_KEY) {
    throw new Error('DeBank API key not configured');
  }

  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'AccessKey': API_KEY,
          'Accept': 'application/json',
          'User-Agent': '9mm-interface'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }

      return data;
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await sleep(RETRY_DELAY * (i + 1));
    }
  }
  throw new Error('Max retries reached');
};

const processTokenLists = (
  supply: DebankPosition['detail']['supply_token_list'],
  withdraw: DebankPosition['detail']['withdraw_token_list'],
  rewards: DebankPosition['detail']['reward_token_list']
) => {
  const getAmount = (list: typeof supply, index: number) => 
    (list[index]?.amount || 0).toString();

  return {
    depositedToken0: getAmount(supply, 0),
    depositedToken1: getAmount(supply, 1),
    withdrawnToken0: getAmount(withdraw, 0),
    withdrawnToken1: getAmount(withdraw, 1),
    collectedFeesToken0: getAmount(rewards, 0),
    collectedFeesToken1: getAmount(rewards, 1),
  };
};

export const fetchDebankPositions = async (address: string): Promise<Pool[]> => {
  try {
    const cached = cache.positions[address];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const data = await fetchWithRetry(
      `${DEBANK_API_BASE}/user/all_complex_protocol_list?user_addr=${address}&chain_ids[]=pls`
    );

    const nineMMProtocol = data?.find((protocol: any) => 
      protocol.id === '9mm' && protocol.chain === 'pls'
    );

    if (!nineMMProtocol?.portfolio_item_list?.length) {
      return [];
    }

    const pools = nineMMProtocol.portfolio_item_list
      .map((pos: DebankPosition) => {
        const { supply_token_list, withdraw_token_list, reward_token_list } = pos.detail;
        
        if (!supply_token_list?.[0] || !supply_token_list?.[1]) {
          return null;
        }

        const token0Symbol = normalizeTokenSymbol(supply_token_list[0].symbol, '');
        const token1Symbol = normalizeTokenSymbol(supply_token_list[1].symbol, '');

        const tokenAmounts = processTokenLists(
          supply_token_list,
          withdraw_token_list || [],
          reward_token_list || []
        );

        const currentToken0 = Math.max(
          0,
          parseFloat(tokenAmounts.depositedToken0) - parseFloat(tokenAmounts.withdrawnToken0)
        ).toString();

        const currentToken1 = Math.max(
          0,
          parseFloat(tokenAmounts.depositedToken1) - parseFloat(tokenAmounts.withdrawnToken1)
        ).toString();

        return {
          id: pos.id,
          name: `${token0Symbol}-${token1Symbol}`,
          fee: 0, // Will be enriched later
          tvl: '0',
          volume24h: '0',
          volume30d: '0',
          fees24h: '0',
          token0Symbol,
          token1Symbol,
          token0Price: '0',
          token1Price: '0',
          positionValue: '0',
          depositedUSD: '0',
          currentUSD: '0',
          ...tokenAmounts,
          currentToken0,
          currentToken1,
        };
      })
      .filter((pool): pool is Pool => pool !== null);

    cache.positions[address] = {
      data: pools,
      timestamp: Date.now(),
    };

    return pools;
  } catch (error) {
    console.error('Failed to fetch DeBank data:', error);
    return cache.positions[address]?.data || [];
  }
};

export const enrichPoolWithDebankData = async (pool: Pool, address: string): Promise<Pool> => {
  try {
    const cacheKey = `${address}-${pool.id}`;
    const cached = cache.poolInfo[cacheKey];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const data = await fetchWithRetry(
      `${DEBANK_API_BASE}/user/pool_info?protocol_id=9mm&chain_id=pls&user_addr=${address}&pool_id=${pool.id}`
    );

    if (!data?.supply_token_list) {
      return pool;
    }

    const tokenAmounts = processTokenLists(
      data.supply_token_list,
      data.withdraw_token_list || [],
      data.reward_token_list || []
    );

    const enrichedPool = {
      ...pool,
      ...tokenAmounts,
      currentToken0: Math.max(
        0,
        parseFloat(tokenAmounts.depositedToken0) - parseFloat(tokenAmounts.withdrawnToken0)
      ).toString(),
      currentToken1: Math.max(
        0,
        parseFloat(tokenAmounts.depositedToken1) - parseFloat(tokenAmounts.withdrawnToken1)
      ).toString(),
    };

    cache.poolInfo[cacheKey] = {
      data: enrichedPool,
      timestamp: Date.now(),
    };

    return enrichedPool;
  } catch (error) {
    console.error('Failed to enrich pool with DeBank data:', error);
    return pool;
  }
};