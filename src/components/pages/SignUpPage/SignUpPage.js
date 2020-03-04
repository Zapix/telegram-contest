import { createElement } from 'utils/vdom';
import { CenterLayout } from 'components/layout';
import {
  Logo,
  Header,
  HelpText,
} from 'components/atoms';

import styles from './SignUpPage.module.scss';

export default function SignUpPage() {
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
            Header('You Name'),
          ],
        ),
        HelpText('Enter your name and add a profile picture'),
      ],
    ),
  );
}
