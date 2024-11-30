import React from 'react';
import { Waves, ExternalLink } from 'lucide-react';
import { Pool } from '../../types/pool';
import { Link } from 'react-router-dom';
import { formatTokenAmount } from '../../utils/format';
import { isPoolInactive } from '../../utils/pools';

interface MyPoolRowProps {
  pool: Pool;
}

const MyPoolRow = ({ pool }: MyPoolRowProps) => {
  const handleExplorerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(`https://dex.9mm.pro/info/v3/pairs/${pool.id}?chain=pulsechain`, '_blank');
  };

  const isInactive = isPoolInactive(pool);

  return (
    <Link to={`/pool/${pool.id}`}>
      <div className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-surface-border hover:bg-surface-hover transition-colors ${
        isInactive ? 'bg-red-900/20' : ''
      }`}>
        <div className="flex items-center space-x-2">
          <Waves className={`h-5 w-5 ${isInactive ? 'text-red-500' : 'text-primary'} flex-shrink-0`} />
          <span className="text-sm text-white font-medium truncate">
            {pool.name}
            <span className={`ml-2 text-xs ${isInactive ? 'text-red-500' : 'text-primary'}`}>
              ({pool.fee}%)
            </span>
            <button
              onClick={handleExplorerClick}
              className="ml-2 inline-flex items-center text-gray-400 hover:text-primary"
            >
              <ExternalLink className="h-3 w-3" />
            </button>
          </span>
        </div>
        <div className="text-sm text-white text-center flex flex-col">
          <span>{formatTokenAmount(pool.depositedToken0)} {pool.token0Symbol}</span>
          <span>{formatTokenAmount(pool.depositedToken1)} {pool.token1Symbol}</span>
        </div>
        <div className="text-sm text-white text-center flex flex-col">
          <span>{formatTokenAmount(pool.withdrawnToken0)} {pool.token0Symbol}</span>
          <span>{formatTokenAmount(pool.withdrawnToken1)} {pool.token1Symbol}</span>
        </div>
        <div className={`text-sm ${isInactive ? 'text-red-500' : 'text-primary'} text-center flex flex-col`}>
          <span>{formatTokenAmount(pool.collectedFeesToken0)} {pool.token0Symbol}</span>
          <span>{formatTokenAmount(pool.collectedFeesToken1)} {pool.token1Symbol}</span>
        </div>
        <div className="text-sm text-white text-center flex flex-col">
          <span>{formatTokenAmount(pool.currentToken0)} {pool.token0Symbol}</span>
          <span>{formatTokenAmount(pool.currentToken1)} {pool.token1Symbol}</span>
        </div>
      </div>
    </Link>
  );
};

export default MyPoolRow;