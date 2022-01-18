import {Reducer} from "redux";
import {IAction} from './actionCreators';
import actionTypes from "./actionTypes";
import {State} from '../types/redux';

const initialState: State = {
  isAuthorized: false,
  signInErrorMsg: '',
  isLoaderNecessary: false
};

const reducer: Reducer = (state: State = initialState, action: IAction): State => {
  switch (action.type) {
    case actionTypes.SET_AUTHORIZED:
      return {
        ...state,
        isAuthorized: action.payload
      };
    case actionTypes.SET_LOADER:
      return {
        ...state,
        isLoaderNecessary: action.payload
      };
    case actionTypes.SIGNOUT:
      return {
        ...state,
        isAuthorized: false
      };
    case actionTypes.SET_SIGNIN_ERROR_MSG:
      return {
        ...state,
        signInErrorMsg: action.payload
      };
    default:
      return state;
  }
};

export default reducer;