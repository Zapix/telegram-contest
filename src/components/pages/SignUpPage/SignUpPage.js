import { createElement } from 'utils/vdom';
import { CenterLayout } from 'components/layout';
import {
  Logo,
  Header,
  HelpText,
} from 'components/atoms';
import { SignUpForm } from 'components/organisms';

import styles from './SignUpPage.module.scss';

export default function SignUpPage(state) {
  return CenterLayout(
    createElement(
      'div',
      { id: 'sign-up', class: styles.signUpPage },
      [
        Logo(),
        createElement(
          'div',
          { class: styles.headerGroup },
          [
            Header('Your Name'),
          ],
        ),
        HelpText('Enter your name and add a profile picture'),
        SignUpForm(state),
      ],
    ),
  );
}
