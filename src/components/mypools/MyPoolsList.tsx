import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Pool } from '../../types/pool';
import { fetchUserPools } from '../../services/pools';
import { isPoolClosed } from '../../utils/pools';
import LoadingTriangle from '../common/LoadingTriangle';
import MyPoolHeader from './MyPoolHeader';
import MyPoolRow from './MyPoolRow';

const MyPoolsList = () => {
  const { address } = useAccount();
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserPools = async () => {
      if (!address) return;
      
      try {
        setLoading(true);
        const userPools = await fetchUserPools(address);
        // Filter out closed pools but keep inactive ones
        const activePools = userPools.filter(pool => !isPoolClosed(pool));
        setPools(activePools);
      } catch (error) {
        console.error('Failed to fetch user pools:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserPools();
  }, [address]);

  if (loading) {
    return <LoadingTriangle />;
  }

  if (pools.length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-surface-border p-8 text-center">
        <h2 className="text-xl font-medium text-white mb-4">No Pools Found</h2>
        <p className="text-gray-400">You don't have any active pool positions</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-surface-border shadow-lg overflow-hidden">
      <MyPoolHeader />
      <div className="divide-y divide-surface-border">
        {pools.map((pool) => (
          <MyPoolRow 
            key={pool.id} 
            pool={pool}
          />
        ))}
      </div>
    </div>
  );
};

export default MyPoolsList;