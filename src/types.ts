import { SigninRequest, User, UserManagerSettings } from 'oidc-client';

export interface ContextProps {
  signinRedirectCallback: () => void;
  logout: () => void;
  signoutRedirectCallback: () => void;
  isAuthenticated: () => boolean;
  signinRedirect: () => void;
  signinSilentCallback: () => void;
  createSigninRequest: () => Promise<SigninRequest>;
  getUser: () => Promise<User | null>;
}

export interface ProviderProps {
  settings: UserManagerSettings;
  accessTokenStorageKey: string;
  idTokenStorageKey: string;
}
