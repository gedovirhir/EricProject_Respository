export interface State {
  isAuthorized: boolean;
  signInErrorMsg: string;
  isLoaderNecessary: boolean;
}

export interface LoginData {
  login: string;
  password: string;
  remember?: boolean | undefined;
}