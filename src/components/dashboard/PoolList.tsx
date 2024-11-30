import React from 'react';
import PoolRow from './PoolRow';
import { Pool } from '../../types/pool';

interface PoolListProps {
  pools: Pool[];
}

const PoolList = ({ pools }: PoolListProps) => {
  return (
    <div>
      {pools.map((pool) => (
        <PoolRow key={pool.id} pool={pool} />
      ))}
    </div>
  );
};

export default PoolList;