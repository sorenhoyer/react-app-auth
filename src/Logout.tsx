import React from 'react';
import { LogoutProps } from './types';
import useAuth from './useAuth';

const Logout: React.FC<LogoutProps> = ({ fallback }) => {
  const { logout } = useAuth();

  logout();

  if (fallback) {
    if (typeof fallback === 'function') {
      return fallback();
    }

    return fallback;
  }
  
  return <div>Loading...</div>;
};

export default Logout;
