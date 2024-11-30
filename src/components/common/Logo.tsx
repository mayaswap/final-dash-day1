import React from 'react';
import { Hash } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Hash className="h-8 w-8 text-primary" />
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary font-bold">
          9
        </span>
      </div>
      <span className="text-white text-xl font-bold">9mm</span>
    </div>
  );
};

export default Logo;