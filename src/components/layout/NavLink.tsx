import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'text-primary bg-surface-hover'
          : 'text-gray-300 hover:text-primary hover:bg-surface-hover'
      }`}
    >
      {children}
    </Link>
  );
};

export default NavLink;