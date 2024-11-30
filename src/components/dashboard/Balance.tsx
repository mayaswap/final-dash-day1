import React from 'react';

interface BalanceProps {
  value: string;
}

const Balance = ({ value }: BalanceProps) => {
  return (
    <div className="inline-flex items-center justify-center border border-surface-border rounded px-3 py-1 bg-surface-hover min-w-[80px]">
      <span className="text-white text-sm">{value}</span>
    </div>
  );
}

export default Balance;