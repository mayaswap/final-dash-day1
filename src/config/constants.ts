export const NETWORK = {
  chainId: 369,
  name: 'PulseChain',
  rpcUrl: 'https://rpc.pulsechain.com',
  explorerUrl: 'https://scan.pulsechain.com',
};

export const CONTRACTS = {
  router: '0xf6076d61A0C46C944852F65838E1b12A2910a717',
  factory: '0xe50DbDC88E87a2C92984d794bcF3D1d76f619C68',
};

export const SUBGRAPH_URL = 'https://graph.9mm.pro/subgraphs/name/pulsechain/9mm-v3';

export const FEE_TIERS = [
  { value: 100, label: '0.01%' },
  { value: 500, label: '0.05%' },
  { value: 2500, label: '0.25%' },
  { value: 10000, label: '1%' },
  { value: 20000, label: '2%' },
];