import actionTypes from './actionTypes';
import {AnyAction} from "redux";
import {LoginData} from "../types/redux";

export interface IAction extends AnyAction {
  type: actionTypes,
  payload?: any
}

export const setAuthorized = (isAuthorized: boolean): IAction => ({
  type: actionTypes.SET_AUTHORIZED,
  payload: isAuthorized
});

export const signIn = (loginData: LoginData): IAction => ({
  type: actionTypes.SIGNIN,
  payload: loginData
});

export const signUp = (loginData: LoginData): IAction => ({
  type: actionTypes.SIGNUP,
  payload: loginData
});

export const setSigninErrorMsg = (errorMessage: string): IAction => ({
  type: actionTypes.SET_SIGNIN_ERROR_MSG,
  payload: errorMessage
});

export const setLoader = (isLoaderNecessary: boolean): IAction => ({
  type: actionTypes.SET_LOADER,
  payload: isLoaderNecessary
});

export const checkAuthorizationStatus = (): IAction => ({
  type: actionTypes.CHECK_AUTHORIZATION_STATUS
});

export const signOut = (): IAction => ({
  type: actionTypes.SIGNOUT
});
