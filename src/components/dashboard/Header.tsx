import React from 'react';
import { Waves } from 'lucide-react';

const Header = () => {
  return (
    <div className="bg-black border-b border-gray-800">
      <div className="w-full lg:max-w-[80%] xl:max-w-[60%] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center space-x-2">
          <Waves className="h-4 w-4 text-white" />
          <h1 className="text-lg font-bold text-white">Pools</h1>
        </div>
      </div>
    </div>
  );
};

export default Header;