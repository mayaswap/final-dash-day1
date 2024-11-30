export interface Position {
  id: string;
  owner: string;
  liquidity: string;
  tickLower: number;
  tickUpper: number;
  depositedToken0: string;
  depositedToken1: string;
  withdrawnToken0: string;
  withdrawnToken1: string;
  collectedFeesToken0: string;
  collectedFeesToken1: string;
  pool: {
    id: string;
    token0: {
      id: string;
      symbol: string;
      decimals: number;
    };
    token1: {
      id: string;
      symbol: string;
      decimals: number;
    };
    feeTier: number;
    totalValueLockedUSD: string;
    volumeUSD: string;
    token0Price: string;
    token1Price: string;
  };
}