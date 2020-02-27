import { Log, SigninRequest, User, UserManager, UserManagerSettings } from 'oidc-client';

class Service {
  public UserManager: UserManager;

  public postSignoutRedirectCallbackUri?: string;

  constructor(userManagerSettings: UserManagerSettings, postSignoutRedirectCallbackUri?: string) {
    this.UserManager = new UserManager(userManagerSettings);
    this.postSignoutRedirectCallbackUri = postSignoutRedirectCallbackUri;

    Log.logger = console;
    Log.level = Log.DEBUG;

    this.UserManager.events.addUserLoaded(user => {
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
      this.logout();
    });
  }

  public signinRedirectCallback = (): void => {
    this.UserManager.signinRedirectCallback().then(() => {
      '';
    });
  };

  public getUser = async (): Promise<User> => {
    const user = await this.UserManager.getUser();

    // eslint-disable-next-line no-return-await
    if (!user) return await this.UserManager.signinRedirectCallback();

    return user;
  };

  public parseJwt = (token: string): JSON => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');

    return JSON.parse(window.atob(base64));
  };

  public signinRedirect = (): void => {
    localStorage.setItem('redirectUri', window.location.pathname);
    this.UserManager.signinRedirect({});
  };

  public navigateToScreen = (): void => {
    const redirectUri = localStorage.getItem('redirectUri');
    window.location.replace(redirectUri || '');
  };

  public isAuthenticated = (): boolean => {
    const serializedOidcStorage = sessionStorage.getItem(
      `oidc.user:${this.UserManager.settings.authority}:${this.UserManager.settings.client_id}`,
    );

    const oidcStorage = serializedOidcStorage && JSON.parse(serializedOidcStorage);

    return !!oidcStorage && !!oidcStorage.access_token;
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
      // eslint-disable-next-line @typescript-eslint/camelcase
      id_token_hint: localStorage.getItem('id_token'),
    });

    this.UserManager.clearStaleState();
  };

  public signoutRedirectCallback = (): void => {
    this.UserManager.signoutRedirectCallback().then(() => {
      localStorage.clear();
      if (this.postSignoutRedirectCallbackUri) window.location.replace(this.postSignoutRedirectCallbackUri);
    });

    this.UserManager.clearStaleState();
  };
}

export default Service;
