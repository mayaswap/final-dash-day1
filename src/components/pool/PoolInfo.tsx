import React from 'react';
import { Droplet, Copy } from 'lucide-react';
import { Pool } from '../../types/pool';
import { formatPrice } from '../../utils/format';

interface PoolInfoProps {
  pool: Pool;
  timeframe: '24H' | '7D';
  onTimeframeChange: (timeframe: '24H' | '7D') => void;
}

const TimeframeButton = ({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded text-sm ${
      active ? 'bg-surface-hover text-white' : 'text-gray-400'
    }`}
  >
    {children}
  </button>
);

const PoolInfo = ({ pool, timeframe, onTimeframeChange }: PoolInfoProps) => {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(pool.id);
  };

  return (
    <div className="bg-surface rounded-lg border border-surface-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Droplet className="h-5 w-5 text-primary" />
          <span className="text-white text-lg font-medium">Pool Information</span>
        </div>
        <div className="flex space-x-2">
          <TimeframeButton
            active={timeframe === '24H'}
            onClick={() => onTimeframeChange('24H')}
          >
            24H
          </TimeframeButton>
          <TimeframeButton
            active={timeframe === '7D'}
            onClick={() => onTimeframeChange('7D')}
          >
            7D
          </TimeframeButton>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="text-gray-400 text-sm mb-2">TVL</div>
          <div className="text-white text-2xl font-bold">{pool.tvl}</div>
        </div>
        <div>
          <div className="text-gray-400 text-sm mb-2">24H VOLUME</div>
          <div className="text-white text-2xl font-bold">{pool.volume24h}</div>
        </div>
        <div>
          <div className="text-gray-400 text-sm mb-2">24H FEES</div>
          <div className="text-primary text-2xl font-bold">{pool.fees24h}</div>
        </div>
        <div>
          <div className="text-gray-400 text-sm mb-2">30D VOLUME</div>
          <div className="text-white text-2xl font-bold">{pool.volume30d}</div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">PROTOCOL</span>
          <span className="text-white">9mm</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">FEE TIER</span>
          <span className="text-white">{pool.fee}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">CURRENT PRICE</span>
          <div className="flex items-center space-x-2">
            <span className="text-white">{formatPrice(pool.token0Price)} PLS per {pool.token0Symbol}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-primary" />
            <span className="text-gray-400">9MM POOL ADDRESS</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-white">{`${pool.id.slice(0, 6)}...${pool.id.slice(-4)}`}</span>
            <button 
              onClick={handleCopyAddress}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolInfo;