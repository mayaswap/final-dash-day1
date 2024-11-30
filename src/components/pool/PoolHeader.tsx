import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Waves, RefreshCw, ExternalLink } from 'lucide-react';
import { Pool } from '../../types/pool';
import { formatPrice } from '../../utils/format';

interface PoolHeaderProps {
  pool: Pool;
  price: string;
  isRefreshing: boolean;
}

const PoolHeader = ({ pool, price, isRefreshing }: PoolHeaderProps) => {
  const handleExplorerClick = () => {
    window.open(`https://dex.9mm.pro/info/v3/pairs/${pool.id}?chain=pulsechain`, '_blank');
  };

  return (
    <div className="bg-surface border-b border-surface-border">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/all-pools" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center space-x-3">
              <Waves className="h-6 w-6 text-primary" />
              <span className="text-white text-lg font-medium">{pool.name}</span>
              <span className="text-primary text-sm px-2 py-0.5 rounded bg-primary/10">
                {pool.fee}%
              </span>
              <button
                onClick={handleExplorerClick}
                className="text-gray-400 hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-white text-lg">
              {formatPrice(price)} PLS per {pool.token0Symbol}
            </span>
            <button 
              className={`p-1 rounded-full hover:bg-surface-hover ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolHeader;