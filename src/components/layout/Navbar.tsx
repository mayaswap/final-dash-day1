import React from 'react';
import { Link } from 'react-router-dom';
import NavLink from './NavLink';
import Logo from '../common/Logo';
import WalletButton from '../common/WalletButton';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-surface border-b border-surface-border z-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/all-pools" className="flex-shrink-0">
              <Logo />
            </Link>
            <div className="ml-10">
              <div className="flex items-center space-x-4">
                <NavLink href="/all-pools">All Pools</NavLink>
                <NavLink href="/my-pools">My Pools</NavLink>
              </div>
            </div>
          </div>
          <div>
            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;