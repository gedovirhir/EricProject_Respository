import {IAction, setLoader, setSigninErrorMsg} from './../redux/actionCreators';
import { put, call, takeEvery } from 'redux-saga/effects'
import { setAuthorized } from "../redux/actionCreators";
import actionTypes from "../redux/actionTypes";
import AuthorizationService from '../services/authorizationService';
import {AuthDTO} from '../types/dto';

const service: any = new AuthorizationService();

function* signInWorker(action: IAction) {
  try {
    const authorizationData: AuthDTO = yield call(service.signIn, action.payload)

    if (authorizationData.message === 'bigBlackCock') {
      yield put(setSigninErrorMsg('Введены некорректные данные'));
    }

    localStorage.setItem('isAdmin', authorizationData.isAdmin as any !== 'false' ? 'true' : '');
    if (authorizationData?.message === 'success') {
      localStorage.setItem('login', action.payload.login);
      localStorage.setItem('password', action.payload.password);

      yield put(setAuthorized(true));
      yield put(setSigninErrorMsg(''));
    }
  } catch(e: any) {
    console.error('An error thrown while dispatching signing, result: ', e.message);
  }
}

function* signUpWorker(action: IAction) {
  try {
    const authorizationData: AuthDTO = yield call(service.signUp, action.payload)

    if (authorizationData.message === 'bigBlackCock') {
      yield put(setSigninErrorMsg('Такой логин уже существует'));
    }

    localStorage.setItem('isAdmin', '');

    if (authorizationData?.message === 'success') {
      localStorage.setItem('login', action.payload.login);
      localStorage.setItem('password', action.payload.password);

      yield put(setAuthorized(true));
      yield put(setSigninErrorMsg(''));
    }
  } catch(e: any) {
    console.error('An error thrown while dispatching signing, result: ', e.message);
  }
}


function* checkAuthorizationStatus() {
  yield put(setLoader(true));
  if (localStorage.getItem('login') && localStorage.getItem('password')) {
    const authorizationData: AuthDTO = yield call(service.signIn, {
      login: localStorage.getItem('login'),
      password: localStorage.getItem('password')
    });
    if (authorizationData?.message === 'success') {
      yield put(setAuthorized(true));
      yield put(setSigninErrorMsg(''));
    } else {
      yield put(setAuthorized(false));
    }
  } else {
    yield put(setAuthorized(false));
  }
  yield put(setLoader(false));
}

function* authorizationSaga() {
  yield takeEvery(actionTypes.CHECK_AUTHORIZATION_STATUS, checkAuthorizationStatus);
  yield takeEvery(actionTypes.SIGNIN, signInWorker);
  yield takeEvery(actionTypes.SIGNUP, signUpWorker);
}

export default authorizationSaga;