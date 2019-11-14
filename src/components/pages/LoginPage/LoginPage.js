import { createElement } from 'utils/vdom';

import { CenterLayout } from 'components/layout';
import { Logo, Header, HelpText } from 'components/atoms';

import styles from './LoginPage.module.scss';

export default function LoginPage() {
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
    ],
  ));
}
