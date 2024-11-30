import React from 'react';

const MyPoolHeader = () => {
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-surface-border">
      <div className="text-xs text-gray-400">POOL</div>
      <div className="text-xs text-gray-400 text-center">DEPOSITED</div>
      <div className="text-xs text-gray-400 text-center">WITHDRAWN</div>
      <div className="text-xs text-gray-400 text-center">COLLECTED FEES</div>
      <div className="text-xs text-gray-400 text-center">BALANCE</div>
    </div>
  );
};

export default MyPoolHeader;