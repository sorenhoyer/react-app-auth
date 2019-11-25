import React from 'react';
import { CallbackProps } from './types';
import useAuth from './useAuth';

const Callback: React.FC<CallbackProps> = ({ fallback }) => {
  const { signinRedirectCallback } = useAuth();

  signinRedirectCallback();

  if (fallback) {
    if (typeof fallback === 'function') {
      return fallback();
    }

    return fallback;
  }
  
  return <div>Loading...</div>;
};

export default Callback;
