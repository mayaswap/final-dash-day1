import React from 'react';
import { useAccount } from 'wagmi';
import { Waves } from 'lucide-react';
import WalletButton from '../components/common/WalletButton';
import MyPoolsList from '../components/mypools/MyPoolsList';

const MyPools = () => {
  const { isConnected } = useAccount();

  return (
    <>
      <div className="bg-black border-b border-gray-800">
        <div className="w-full lg:max-w-[80%] xl:max-w-[60%] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2">
            <Waves className="h-4 w-4 text-white" />
            <h1 className="text-lg font-bold text-white">My Pools</h1>
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!isConnected ? (
          <div className="bg-surface rounded-lg border border-surface-border p-8 text-center">
            <h2 className="text-xl font-medium text-white mb-4">Connect Wallet</h2>
            <p className="text-gray-400 mb-6">Connect your wallet to view your pool positions</p>
            <WalletButton />
          </div>
        ) : (
          <MyPoolsList />
        )}
      </div>
    </>
  );
};

export default MyPools;