import React from 'react';
import { LogoutCallbackProps } from './types';
import useAuth from './useAuth';

const LogoutCallback: React.FC<LogoutCallbackProps> = ({ fallback }) => {
  const { signoutRedirectCallback } = useAuth();

  signoutRedirectCallback();

  if (fallback) {
    if (typeof fallback === 'function') {
      return fallback();
    }

    return fallback;
  }
  
  return <div>Loading...</div>;
};

export default LogoutCallback;
