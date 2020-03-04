import * as R from 'ramda';
import { createElement } from 'utils/vdom';
import {
  LoginPage,
  VerifyPage,
  NotFoundPage,
  SignUpPage,
} from './pages';


const getPageComponent = R.pipe(
  R.prop('page'),
  R.cond([
    [R.equals('login'), R.always(LoginPage)],
    [R.equals('verify'), R.always(VerifyPage)],
    [R.equals('sign-up'), R.always(SignUpPage)],
    [R.T, R.always(NotFoundPage)],
  ]),
);

const renderPage = R.pipe(
  R.of,
  R.ap([getPageComponent, R.identity]),
  R.apply(R.call),
);

export default function App(state) {
  /* eslint-disable */
  // Need to check state changes for now
  console.log(state);
  /* eslint-enable */

  if (!state) {
    return createElement('h4', null, 'Loading...');
  }

  return createElement(
    'div',
    { id: 'base-app' },
    [
      renderPage(state),
    ],
  );
}
