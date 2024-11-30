import { request } from 'graphql-request';
import { SUBGRAPH_URL } from '../config/constants';
import { POOLS_QUERY, POOL_QUERY, USER_POSITIONS_QUERY } from './graphql';
import { formatDollarAmount } from '../utils/format';
import { fetchDexScreenerPairs } from './dexscreener';
import { normalizeTokenSymbol } from '../utils/tokens';
import type { Pool } from '../types/pool';

interface PoolCache {
  pools: Pool[];
  timestamp: number;
  singlePools: Record<string, { pool: Pool; timestamp: number }>;
}

const CACHE_DURATION = 30000;
const cache: PoolCache = {
  pools: [],
  timestamp: 0,
  singlePools: {},
};

const processPoolData = (pool: any, dexScreenerData: any): Pool => {
  const token0Symbol = normalizeTokenSymbol(pool.token0.symbol, pool.token0.id);
  const token1Symbol = normalizeTokenSymbol(pool.token1.symbol, pool.token1.id);
  const name = `${token0Symbol}-${token1Symbol}`;
  const fee = pool.feeTier / 10000;
  const tvl = formatDollarAmount(pool.totalValueLockedUSD);
  
  const volume24h = dexScreenerData?.volume?.h24 || 0;
  const fees24h = formatDollarAmount((volume24h * (fee / 100) * 0.67).toString());
  
  const formattedVolume24h = formatDollarAmount(volume24h.toString());
  const formattedVolume30d = formatDollarAmount(
    (dexScreenerData?.volume?.d30 || 0).toString()
  );

  return {
    id: pool.id,
    name,
    fee,
    tvl,
    volume24h: formattedVolume24h,
    volume30d: formattedVolume30d,
    fees24h,
    token0Symbol,
    token1Symbol,
    token0Price: pool.token0Price,
    token1Price: pool.token1Price,
    depositedToken0: '0',
    depositedToken1: '0',
    withdrawnToken0: '0',
    withdrawnToken1: '0',
    currentToken0: '0',
    currentToken1: '0',
    collectedFeesToken0: '0',
    collectedFeesToken1: '0',
    positionValue: '0'
  };
};

export const fetchPools = async (forceRefresh = false): Promise<Pool[]> => {
  try {
    if (!forceRefresh && Date.now() - cache.timestamp < CACHE_DURATION) {
      return cache.pools;
    }

    const { pools } = await request(SUBGRAPH_URL, POOLS_QUERY, {
      first: 100,
      skip: 0,
      orderBy: 'totalValueLockedUSD',
      orderDirection: 'desc',
    });

    if (!pools?.length) return [];

    const dexScreenerData = await fetchDexScreenerPairs(
      pools.map((pool: any) => pool.id)
    );

    const processedPools = pools
      .map((pool: any) => processPoolData(pool, dexScreenerData[pool.id.toLowerCase()]))
      .filter((pool: Pool) => parseFloat(pool.tvl.replace(/[^0-9.]/g, '')) > 0)
      .slice(0, 45);

    cache.pools = processedPools;
    cache.timestamp = Date.now();

    return processedPools;
  } catch (error) {
    console.error('Failed to fetch pools:', error);
    return cache.pools;
  }
};

export const fetchPool = async (id: string, forceRefresh = false): Promise<Pool | null> => {
  try {
    const cachedPool = cache.singlePools[id];
    if (!forceRefresh && cachedPool && Date.now() - cachedPool.timestamp < CACHE_DURATION) {
      return cachedPool.pool;
    }

    const poolFromCache = cache.pools.find(p => p.id === id);
    if (!forceRefresh && poolFromCache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return poolFromCache;
    }

    const { pool } = await request(SUBGRAPH_URL, POOL_QUERY, { id });
    if (!pool) return null;

    const dexScreenerData = await fetchDexScreenerPairs([id]);
    const processedPool = processPoolData(pool, dexScreenerData[id.toLowerCase()]);

    cache.singlePools[id] = {
      pool: processedPool,
      timestamp: Date.now(),
    };

    return processedPool;
  } catch (error) {
    console.error('Failed to fetch pool:', error);
    return cache.singlePools[id]?.pool || null;
  }
};

export const fetchUserPools = async (address: string): Promise<Pool[]> => {
  try {
    const { positions } = await request(SUBGRAPH_URL, USER_POSITIONS_QUERY, {
      user: address.toLowerCase(),
    });

    if (!positions?.length) return [];

    const poolsMap = new Map<string, { pool: any; positions: any[] }>();
    positions.forEach((position: any) => {
      if (!position.pool) return;
      
      const poolId = position.pool.id;
      if (!poolsMap.has(poolId)) {
        poolsMap.set(poolId, { pool: position.pool, positions: [] });
      }
      poolsMap.get(poolId)!.positions.push(position);
    });

    const pools = Array.from(poolsMap.values());
    const dexScreenerData = await fetchDexScreenerPairs(
      pools.map(({ pool }) => pool.id)
    );

    return pools.map(({ pool, positions }) => {
      const processedPool = processPoolData(pool, dexScreenerData[pool.id.toLowerCase()]);
      
      const totals = positions.reduce((acc, position) => ({
        depositedToken0: (parseFloat(acc.depositedToken0) + parseFloat(position.depositedToken0 || '0')).toString(),
        depositedToken1: (parseFloat(acc.depositedToken1) + parseFloat(position.depositedToken1 || '0')).toString(),
        withdrawnToken0: (parseFloat(acc.withdrawnToken0) + parseFloat(position.withdrawnToken0 || '0')).toString(),
        withdrawnToken1: (parseFloat(acc.withdrawnToken1) + parseFloat(position.withdrawnToken1 || '0')).toString(),
        collectedFeesToken0: (parseFloat(acc.collectedFeesToken0) + parseFloat(position.collectedFeesToken0 || '0')).toString(),
        collectedFeesToken1: (parseFloat(acc.collectedFeesToken1) + parseFloat(position.collectedFeesToken1 || '0')).toString(),
      }), {
        depositedToken0: '0',
        depositedToken1: '0',
        withdrawnToken0: '0',
        withdrawnToken1: '0',
        collectedFeesToken0: '0',
        collectedFeesToken1: '0'
      });

      const currentToken0 = Math.max(0, parseFloat(totals.depositedToken0) - parseFloat(totals.withdrawnToken0));
      const currentToken1 = Math.max(0, parseFloat(totals.depositedToken1) - parseFloat(totals.withdrawnToken1));

      return {
        ...processedPool,
        ...totals,
        currentToken0: currentToken0.toString(),
        currentToken1: currentToken1.toString(),
      };
    });
  } catch (error) {
    console.error('Failed to fetch user pools:', error);
    return [];
  }
};