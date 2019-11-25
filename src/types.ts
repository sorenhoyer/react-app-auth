import React from 'react';
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

export interface CallbackProps {
  fallback?: (() => React.ReactNode) | React.ReactNode;
}

export interface LogoutProps {
  fallback?: (() => React.ReactNode) | React.ReactNode;
}

export interface LogoutCallbackProps {
  fallback?: (() => React.ReactNode) | React.ReactNode;
}

export interface SilentRenewProps {
  fallback?: (() => React.ReactNode) | React.ReactNode;
}