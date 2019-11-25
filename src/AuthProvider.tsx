import React from 'react';
import AuthService from './AuthService';
import { ContextProps, ProviderProps } from './types';

const Context = React.createContext<ContextProps | null>(null);

const { Consumer } = Context;

const Provider: React.FC<ProviderProps> = ({ children, settings, accessTokenStorageKey, idTokenStorageKey }) => {
  return <Context.Provider value={new AuthService(settings, accessTokenStorageKey, idTokenStorageKey)}>{children}</Context.Provider>;
};

export { Consumer as AuthConsumer, Context as AuthContext, Provider as AuthProvider };
