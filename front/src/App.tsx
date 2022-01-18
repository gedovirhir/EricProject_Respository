import './App.scss';
import {Route, BrowserRouter, Routes, HashRouter} from "react-router-dom";
import useReduxStatePropertie from "./hooks/useReduxStatePropertie";
import { useMemo, useEffect } from "react";
import Main from "./components/main";
import Authorization from "./components/authorization";
import {useDispatch} from "react-redux";
import {checkAuthorizationStatus, setAuthorized} from "./redux/actionCreators";
import CustomSpinner from "./components/UI/customSpinner";
import Profile from "./components/profile";
import Admin from "./components/admin";

function App() {
  const dispatch = useDispatch();
  const isAuthorized = useReduxStatePropertie('isAuthorized');
  const isLoaderNecessary = useReduxStatePropertie('isLoaderNecessary');
  const content = useMemo(() => {
    return <Route path="/" element={isAuthorized ? <Main/> : <Authorization/>}/>
  }, [isAuthorized]);
  const isAdmin = localStorage.getItem('isAdmin');

  useEffect(() => {
    dispatch(checkAuthorizationStatus());
   }, [ ]);

  return (
    <HashRouter>
      {
        isLoaderNecessary ?
          <CustomSpinner color={'primary'}/>
          :
          <Routes>
            <Route path={'/profile'} element={isAuthorized ? <Profile/> : <Authorization/>}></Route>
            <Route path={'/admin'} element={isAuthorized && isAdmin ? <Admin/> : <Main/>}></Route>
            { content }
          </Routes>
      }
    </HashRouter>
  );
}

export default App;
