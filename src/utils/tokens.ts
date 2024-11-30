import { Token } from '../types/token';

const TOKEN_MAPPINGS: Record<string, string> = {
  'WETH': 'pWETH',
  'DAI': 'pDAI'
};

export const normalizeTokenSymbol = (symbol: string, tokenAddress: string): string => {
  const normalizedSymbol = TOKEN_MAPPINGS[symbol] || symbol;
  return normalizedSymbol;
};

export const calculateTokenAmounts = (position: any) => {
  const currentToken0 = parseFloat(position.depositedToken0) - parseFloat(position.withdrawnToken0);
  const currentToken1 = parseFloat(position.depositedToken1) - parseFloat(position.withdrawnToken1);
  
  return {
    currentToken0,
    currentToken1,
    hasLiquidity: currentToken0 > 0 && currentToken1 > 0
  };
};