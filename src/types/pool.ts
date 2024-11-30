export interface Pool {
  id: string;
  name: string;
  fee: number;
  tvl: string;
  volume24h: string;
  volume30d: string;
  fees24h: string;
  token0Symbol: string;
  token1Symbol: string;
  token0Price: string;
  token1Price: string;
  positionValue: string;
  depositedToken0: string;
  depositedToken1: string;
  withdrawnToken0: string;
  withdrawnToken1: string;
  currentToken0: string;
  currentToken1: string;
  collectedFeesToken0: string;
  collectedFeesToken1: string;
}