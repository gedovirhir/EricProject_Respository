import './Authorization.scss';
import TextInput from "../UI/textInput";
import {setLoader, signIn, signUp} from "../../redux/actionCreators";
import {FormEvent, useEffect} from "react";
import {useDispatch} from "react-redux";
import FormButton from "../UI/loginButton";
import useReduxStatePropertie from "../../hooks/useReduxStatePropertie";

export default function Authorization() {
  const errorMessage = useReduxStatePropertie('signInErrorMsg');
  const dispatch = useDispatch();

  function signInForm(e: FormEvent) {
    e.preventDefault();
    const {login, password} = document.forms.namedItem('loginForm')!;
    dispatch(signIn({
      login: login.value,
      password: password.value
    }));
  }

  function signUpForm(e: FormEvent) {
    e.preventDefault();
    const {login, password} = document.forms.namedItem('loginForm')!;
    dispatch(signUp({
      login: login.value,
      password: password.value
    }));
  }

  useEffect(() => {
    document.forms.namedItem('loginForm')!.login.focus();
  }, []);

  useEffect(() => {
    errorMessage && setLoader(false);
  }, [ errorMessage ]);

  return (
    <main className={'authorization'}>
      <form className={'authorization-loginForm'} name={'loginForm'}>
        { errorMessage ? <span className={'authorization-errorMessage'}>{errorMessage}</span> : null}
        <TextInput
          name={'login'}
          placeholder={'Логин'}/>
        <TextInput
          name={'password'}
          placeholder={'Пароль'}
          type={'password'}/>
        <div className={'authorization-buttons'}>
          <FormButton name={'Войти'} onClick={signInForm}></FormButton>
          <FormButton name={'Зарегистрироваться'} onClick={signUpForm}></FormButton>
        </div>
      </form>
    </main>
  )
}