import React from 'react';
import Service from './Service';
import { ContextProps, ProviderProps } from './types';

const Context = React.createContext<ContextProps | null>(null);

const { Consumer } = Context;

const Provider: React.FC<ProviderProps> = ({ children, userManagerSettings, accessTokenStorageKey, idTokenStorageKey, postSignoutRedirectCallbackUri }) => {
  return <Context.Provider value={new Service(userManagerSettings, accessTokenStorageKey, idTokenStorageKey, postSignoutRedirectCallbackUri)}>{children}</Context.Provider>;
};

export { Consumer as AuthConsumer, Context as AuthContext, Provider as AuthProvider };
