import React from 'react';
import Service from './Service';
import { ContextProps, ProviderProps } from './types';

const Context = React.createContext<ContextProps | null>(null);

const { Consumer } = Context;

const Provider: React.FC<ProviderProps> = ({ children, userManagerSettings, postSignoutRedirectCallbackUri }) => {
  return <Context.Provider value={new Service(userManagerSettings, postSignoutRedirectCallbackUri)}>{children}</Context.Provider>;
};

export { Consumer as AuthConsumer, Context as AuthContext, Provider as AuthProvider };
