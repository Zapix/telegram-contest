import sendAuthMiddleware from './sendAuthMiddleware';
import sendVerifyCodeMiddleware from './sendVerifyCodeMiddleware';
import signUpMiddleware from './signUpMiddleware';

export default function applyMiddleware(action$, state$, connection) {
  sendAuthMiddleware(action$, state$, connection);
  sendVerifyCodeMiddleware(action$, state$, connection);
  signUpMiddleware(action$, state$, connection);
}
