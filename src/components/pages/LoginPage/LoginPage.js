import { createElement } from 'utils/vdom';

import { CenterLayout } from 'components/layout';
import { Logo, Header, HelpText } from 'components/atoms';
import { SignInForm } from 'components/organisms';

import styles from './LoginPage.module.scss';

export default function LoginPage(state) {
  return CenterLayout(createElement(
    'div',
    {
      class: styles.loginPage,
    },
    [
      Logo(),
      Header('Sign in to Telegram'),
      createElement(
        'p',
        null,
        HelpText('Please confirm your country and enter your phone number'),
      ),
      SignInForm(state),
    ],
  ));
}
