import { Log, SigninRequest, User, UserManager, UserManagerSettings } from 'oidc-client';

class Service {
  public UserManager: UserManager;

  public accessToken?: string;

  public idToken?: string;

  public accessTokenStorageKey: string;

  public idTokenStorageKey: string;

  public postSignoutRedirectCallbackUri?: string;

  constructor(settings: UserManagerSettings, accessTokenStorageKey: string, idTokenStorageKey: string, postSignoutRedirectCallbackUri?: string) {
    this.UserManager = new UserManager(settings);
    this.accessTokenStorageKey = accessTokenStorageKey;
    this.idTokenStorageKey = idTokenStorageKey;
    this.postSignoutRedirectCallbackUri = postSignoutRedirectCallbackUri;

    Log.logger = console;
    Log.level = Log.DEBUG;

    this.UserManager.events.addUserLoaded(user => {
      this.accessToken = user.access_token;
      this.idToken = user.id_token;
      sessionStorage.setItem(this.accessTokenStorageKey, user.access_token);
      sessionStorage.setItem(this.idTokenStorageKey, user.id_token);

      this.setUserInfo({
        accessToken: this.accessToken,
        idToken: this.idToken,
      });

      const path = window.location.pathname;

      if (path.indexOf('callback') !== -1 && path.indexOf('logout/callback') === -1) {
        this.navigateToScreen();
      }
    });

    this.UserManager.events.addSilentRenewError(e => {
      // eslint-disable-next-line no-console
      console.log('silent renew error', e.message);
    });

    this.UserManager.events.addAccessTokenExpired(() => {
      // eslint-disable-next-line no-console
      console.log('token expired');
      this.signinSilent();
    });
  }

  public signinRedirectCallback = (): void => {
    this.UserManager.signinRedirectCallback().then(() => {
      '';
    });
  };

  public getUser = (): Promise<User | null> => {
    const user = this.UserManager.getUser();

    if (!user) return this.UserManager.signinRedirectCallback();

    return user;
  };

  public parseJwt = (token: string): JSON => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');

    return JSON.parse(window.atob(base64));
  };

  public setUserInfo = (authResult: { accessToken: string; idToken: string }): void => {
    if (this.accessToken && this.idToken) {
      const data = this.parseJwt(this.idToken);
      this.setSessionInfo(authResult);
      this.setUser(data);
    }
  };

  public signinRedirect = (): void => {
    sessionStorage.setItem('redirectUri', window.location.pathname);
    this.UserManager.signinRedirect({});
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public setUser = (data: any): void => {
    sessionStorage.setItem('userId', data.sub);
  };

  public navigateToScreen = (): void => {
    const redirectUri = sessionStorage.getItem('redirectUri');
    window.location.replace(redirectUri && redirectUri !== null ? redirectUri : '');
  };

  public setSessionInfo = (authResult: { accessToken: string; idToken: string }): void => {
    sessionStorage.setItem(this.accessTokenStorageKey, authResult.accessToken);
    sessionStorage.setItem(this.idTokenStorageKey, authResult.idToken);
  };

  public isAuthenticated = (): boolean => {
    const accessToken = sessionStorage.getItem(this.accessTokenStorageKey);
    return !!accessToken;
  };

  public signinSilent = (): void => {
    this.UserManager.signinSilent()
      .then(user => {
        // eslint-disable-next-line no-console
        console.log('signed in', user);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log(err);
      });
  };

  public signinSilentCallback = (): void => {
    this.UserManager.signinSilentCallback();
  };

  public createSigninRequest = (): Promise<SigninRequest> => {
    return this.UserManager.createSigninRequest();
  };

  public logout = (): void => {
    this.UserManager.signoutRedirect({
      id_token_hint: sessionStorage.getItem(this.idTokenStorageKey),
    });

    this.UserManager.clearStaleState();
  };

  public signoutRedirectCallback = (): void => {
    this.UserManager.signoutRedirectCallback().then(() => {
      sessionStorage.clear();
      if (this.postSignoutRedirectCallbackUri) window.location.replace(this.postSignoutRedirectCallbackUri);
    });

    this.UserManager.clearStaleState();
  };
}

export default Service;
