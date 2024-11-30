import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PoolHeader from '../components/pool/PoolHeader';
import PoolInfo from '../components/pool/PoolInfo';
import PoolPositionsPanel from '../components/pool/PoolPositionsPanel';
import LoadingTriangle from '../components/common/LoadingTriangle';
import { fetchPool } from '../services/pools';
import type { Pool } from '../types/pool';

const PoolDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pool, setPool] = useState<Pool | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeframe, setTimeframe] = useState<'24H' | '7D'>('24H');

  useEffect(() => {
    const loadPool = async () => {
      if (!id) {
        navigate('/all-pools');
        return;
      }
      try {
        setLoading(true);
        const poolData = await fetchPool(id, false); // Don't force refresh on initial load
        if (!poolData) {
          navigate('/all-pools');
          return;
        }
        setPool(poolData);
      } catch (error) {
        console.error('Failed to fetch pool:', error);
        navigate('/all-pools');
      } finally {
        setLoading(false);
      }
    };

    loadPool();
  }, [id, navigate]);

  useEffect(() => {
    if (!pool) return;

    const interval = setInterval(async () => {
      try {
        setIsRefreshing(true);
        const updatedPool = await fetchPool(pool.id, true); // Force refresh for periodic updates
        if (updatedPool) {
          setPool(updatedPool);
        }
      } catch (error) {
        console.error('Failed to refresh pool:', error);
      } finally {
        setIsRefreshing(false);
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [pool]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <LoadingTriangle />
      </div>
    );
  }

  if (!pool) return null;

  return (
    <>
      <PoolHeader 
        pool={pool}
        price={pool.token0Price}
        isRefreshing={isRefreshing}
      />
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <div className="flex-1">
            <PoolInfo
              pool={pool}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />
          </div>
          <PoolPositionsPanel />
        </div>
      </div>
    </>
  );
};

export default PoolDetails;