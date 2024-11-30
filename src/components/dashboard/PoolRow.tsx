import React from 'react';
import { Waves, ExternalLink } from 'lucide-react';
import { Pool } from '../../types/pool';
import { Link } from 'react-router-dom';

interface PoolRowProps {
  pool: Pool;
}

const PoolRow = ({ pool }: PoolRowProps) => {
  const handleExplorerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(`https://dex.9mm.pro/info/v3/pairs/${pool.id}?chain=pulsechain`, '_blank');
  };

  return (
    <Link to={`/pool/${pool.id}`}>
      <div className="border-b border-surface-border hover:bg-surface-hover transition-colors">
        <div className="grid grid-cols-[2fr_repeat(4,_1fr)] items-center px-4 sm:px-6 py-4 gap-4">
          <div className="flex items-center space-x-2">
            <Waves className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="text-sm text-white font-medium truncate">
              {pool.name}
              <span className="ml-2 text-primary text-xs">
                ({pool.fee}%)
              </span>
              <button
                onClick={handleExplorerClick}
                className="ml-2 inline-flex items-center text-gray-400 hover:text-primary"
              >
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="text-center">
            <div className="text-white text-sm">{pool.tvl}</div>
          </div>
          <div className="text-center">
            <div className="text-white text-sm">{pool.volume24h}</div>
          </div>
          <div className="text-center">
            <div className="text-white text-sm">{pool.volume30d}</div>
          </div>
          <div className="text-center">
            <div className="text-primary text-sm">{pool.fees24h}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PoolRow;