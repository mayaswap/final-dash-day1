export interface Token {
  id: string;
  symbol: string;
  decimals: number;
}

export interface TokenAmount {
  amount: string;
  token: Token;
}