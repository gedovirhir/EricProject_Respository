import { LoginData } from "../types/redux";
import appConfig from "../appConfig";

interface AuthorizationService {
  backendProtocol: string;
  backendAddress: string;
  controller: AbortController;
  signal: AbortSignal;
};

class AuthorizationService implements AuthorizationService {
  constructor() {
    this.backendProtocol = appConfig.backendProtocol;
    this.backendAddress = appConfig.backendAddress;
  }

  signIn = async (loginData: LoginData): Promise<any> => {
    const response = await fetch(`${this.backendProtocol}://${this.backendAddress}/user/aut?username=${loginData.login}&password=${loginData.password}`)
      .then((response: any) => {
        return response.json();
      });

    return response;
  }

  signUp = async (loginData: LoginData): Promise<any> => {
    const response = await fetch(`${this.backendProtocol}://${this.backendAddress}/user/reg?username=${loginData.login}&password=${loginData.password}`)
      .then((response: any) => {
        return response.json();
      });

    return response;
  }
}

export default AuthorizationService;
