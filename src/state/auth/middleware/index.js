import sendAuthMiddleware from './sendAuthMiddleware';

export default function applyMiddleware(action$, state$, connection) {
  sendAuthMiddleware(action$, state$, connection);
}
