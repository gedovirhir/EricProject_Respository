import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import createSagaMiddleware from "redux-saga";
import { applyMiddleware, createStore, compose  } from "redux";
import {Provider} from "react-redux";
import reducer from "./redux/reducer";
import rootSaga from "./sagas/rootSaga";
console.log(require('dotenv').config())

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enchancer = process.env.NODE_ENV === 'development'
  ? composeEnhancers(applyMiddleware(sagaMiddleware))
  : applyMiddleware(sagaMiddleware);

const store = createStore(reducer, enchancer);
sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);