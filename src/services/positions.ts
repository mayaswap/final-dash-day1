import { request } from 'graphql-request';
import { SUBGRAPH_URL } from '../config/constants';
import { POSITION_QUERY } from './graphql';
import { normalizeTokenSymbol } from '../utils/tokens';
import type { Pool } from '../types/pool';

interface PositionCache {
  [id: string]: {
    data: any;
    timestamp: number;
  }
}

const cache: PositionCache = {};
const CACHE_DURATION = 30000; // 30 seconds

export const fetchPosition = async (positionId: string, forceRefresh = false): Promise<Pool | null> => {
  try {
    if (!forceRefresh && cache[positionId] && Date.now() - cache[positionId].timestamp < CACHE_DURATION) {
      return cache[positionId].data;
    }

    const { position } = await request(SUBGRAPH_URL, POSITION_QUERY, { positionId });
    
    if (!position || !position.pool) return null;

    const token0Symbol = normalizeTokenSymbol(position.pool.token0.symbol, position.pool.token0.id);
    const token1Symbol = normalizeTokenSymbol(position.pool.token1.symbol, position.pool.token1.id);

    const poolData: Pool = {
      id: position.pool.id,
      name: `${token0Symbol}-${token1Symbol}`,
      fee: position.pool.feeTier / 10000,
      tvl: position.pool.totalValueLockedUSD,
      volume24h: '0',
      volume30d: '0',
      fees24h: '0',
      token0Symbol,
      token1Symbol,
      token0Price: position.pool.token0Price,
      token1Price: position.pool.token1Price,
      depositedToken0: position.depositedToken0,
      depositedToken1: position.depositedToken1,
      withdrawnToken0: position.withdrawnToken0,
      withdrawnToken1: position.withdrawnToken1,
      collectedFeesToken0: position.collectedFeesToken0,
      collectedFeesToken1: position.collectedFeesToken1,
      currentToken0: (parseFloat(position.depositedToken0) - parseFloat(position.withdrawnToken0)).toString(),
      currentToken1: (parseFloat(position.depositedToken1) - parseFloat(position.withdrawnToken1)).toString(),
    };

    cache[positionId] = {
      data: poolData,
      timestamp: Date.now()
    };

    return poolData;
  } catch (error) {
    console.error('Failed to fetch position:', error);
    return cache[positionId]?.data || null;
  }
};