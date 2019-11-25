import React from 'react';
import { SilentRenewProps } from './types';
import useAuth from './useAuth';

const SilentRenew: React.FC<SilentRenewProps> = ({ fallback }) => {
  const { signinSilentCallback } = useAuth();

  signinSilentCallback();

  if (fallback) {
    if (typeof fallback === 'function') {
      return fallback();
    }

    return fallback;
  }
  
  return <div>Loading...</div>;
};

export default SilentRenew;
