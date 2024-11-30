import React from 'react';

const LoadingTriangle = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="w-48 h-2 rounded-full bg-surface-hover relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-surface-hover via-primary to-surface-hover"
          style={{
            animation: 'loading 2s infinite linear',
            backgroundSize: '200% 100%'
          }}
        />
      </div>
    </div>
  );
};

export default LoadingTriangle;