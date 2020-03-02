import sendAuthMiddleware from './sendAuthMiddleware';
import sendVerifyCodeMiddleware from './sendVerifyCodeMiddleware';

export default function applyMiddleware(action$, state$, connection) {
  sendAuthMiddleware(action$, state$, connection);
  sendVerifyCodeMiddleware(action$, state$, connection);
}
