import { createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { pulsechain } from './chains';
import { web3ModalTheme } from './theme';

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

const { chains, publicClient } = configureChains(
  [pulsechain],
  [publicProvider()]
);

export const config = createConfig({
  autoConnect: true,
  publicClient,
});

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  chains,
  ...web3ModalTheme,
});