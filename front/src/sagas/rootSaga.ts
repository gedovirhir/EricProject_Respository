import authorizationSaga from "./authorizationSaga";

function* rootSaga() {
  yield authorizationSaga()
}

export default rootSaga;