import React, { useState } from 'react';
import { Layers, History, RefreshCw, DollarSign } from 'lucide-react';

const TimeframeButton = ({ active, children }: { active: boolean; children: React.ReactNode }) => (
  <button
    className={`px-3 py-1 rounded text-sm ${
      active ? 'bg-surface text-white' : 'text-gray-400'
    }`}
  >
    {children}
  </button>
);

const PoolPositionsPanel = () => {
  const [activeTab, setActiveTab] = useState<'positions' | 'activity'>('positions');

  return (
    <div className="w-[400px]">
      <div className="space-y-4">
        {/* Balance Cards */}
        <div className="bg-surface rounded-lg border border-surface-border p-4">
          <div className="text-gray-400 text-sm mb-4">TOTAL BALANCE</div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl text-white font-bold">-</span>
            <div className="flex space-x-2">
              <button className="px-2 py-1 bg-surface-hover rounded text-xs text-white border border-surface-border">
                USD
              </button>
              <button className="px-2 py-1 text-xs text-gray-400">PLS</button>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg border border-surface-border p-4">
          <div className="text-gray-400 text-sm mb-4">TOTAL ASSETS</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-red-500" />
                <span className="text-white">-</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-primary" />
                <span className="text-white">-</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg border border-surface-border p-4">
          <div className="text-gray-400 text-sm mb-4">TOTAL FEES</div>
          <div className="text-gray-400 text-lg">Data unavailable</div>
          <div className="flex items-center space-x-2 mt-4">
            <TimeframeButton active={true}>24H</TimeframeButton>
            <TimeframeButton active={false}>7D</TimeframeButton>
            <TimeframeButton active={false}>ALL-TIME</TimeframeButton>
          </div>
        </div>

        <div className="bg-surface rounded-lg border border-surface-border p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-400 text-sm">TOTAL UNCLAIMED FEES</div>
            <span className="text-white text-lg">-</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-gray-400 text-sm">TOTAL UNCLAIMED REWARDS</div>
            <span className="text-white text-lg">-</span>
          </div>
          <button className="w-full mt-4 py-2 bg-surface-hover rounded-lg border border-surface-border text-gray-400 hover:text-white transition-colors">
            <DollarSign className="h-4 w-4 inline-block mr-2" />
            CLAIM ALL
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-surface-border">
          <button
            onClick={() => setActiveTab('positions')}
            className={`flex items-center space-x-2 px-4 py-2 ${
              activeTab === 'positions'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Positions</span>
            <span className="bg-surface-hover px-2 rounded-full text-sm">0</span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center space-x-2 px-4 py-2 ${
              activeTab === 'activity'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400'
            }`}
          >
            <History className="h-4 w-4" />
            <span>Activity</span>
          </button>
          <div className="ml-auto px-4 py-2">
            <RefreshCw className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Empty State */}
        <div className="border border-dashed border-surface-border rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">Connect wallet to see your positions or create one.</div>
          <button className="text-primary hover:underline">Connect wallet</button>
        </div>
      </div>
    </div>
  );
};

export default PoolPositionsPanel;