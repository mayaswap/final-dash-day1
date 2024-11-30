import React from 'react';
import { DollarSign } from 'lucide-react';
import { Pool } from '../../types/pool';
import { formatDollarAmount, parseDollarAmount } from '../../utils/format';

interface TotalFeesProps {
  pools: Pool[];
}

const TotalFees = ({ pools }: TotalFeesProps) => {
  const total24hFees = pools.reduce((total, pool) => {
    const volume24h = parseDollarAmount(pool.volume24h);
    const feePercentage = pool.fee / 100; // Convert fee to percentage
    const protocolFeeSplit = 0.67;
    
    // Calculate fees using the same formula as in pools.ts
    const poolFees = volume24h * feePercentage * protocolFeeSplit;
    return total + poolFees;
  }, 0);

  return (
    <div className="flex items-center space-x-2 bg-surface rounded-lg px-4 py-2 border border-surface-border">
      <DollarSign className="h-5 w-5 text-primary" />
      <span className="text-white font-medium">
        Total 24h fees = {formatDollarAmount(total24hFees.toString())}
      </span>
    </div>
  );
};

export default TotalFees;