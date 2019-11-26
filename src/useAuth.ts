import { useContext } from 'react';
import { AuthContext } from './Provider';
import { ContextProps } from './types';

const useAuth = (): ContextProps => {
  const ctx = useContext(AuthContext)

  if (ctx === null) throw new Error('You forgot the provider');

  return ctx;
}

export default useAuth;