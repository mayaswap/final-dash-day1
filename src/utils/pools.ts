import { Pool } from '../types/pool';

export const isPoolClosed = (pool: Pool): boolean => {
  const currentToken0 = parseFloat(pool.currentToken0);
  const currentToken1 = parseFloat(pool.currentToken1);
  return currentToken0 <= 0 && currentToken1 <= 0;
};

export const isPoolInactive = (pool: Pool): boolean => {
  const currentToken0 = parseFloat(pool.currentToken0);
  const currentToken1 = parseFloat(pool.currentToken1);
  // A pool is inactive if either token is fully withdrawn but not both (which would make it closed)
  return (currentToken0 <= 0 || currentToken1 <= 0) && !isPoolClosed(pool);
};