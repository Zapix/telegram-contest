import { createElement } from 'utils/vdom';
import { Input, Button } from 'components/atoms';

import styles from './SignUpForm.module.scss';
import mergeClasses from '../../../utils/mergeClasses';

export default function SignUpForm() {
  return createElement(
    'form',
    {
      id: 'signUpForm',
      name: 'signUpForm',
      class: styles.form,
    },
    [
      createElement(
        'div',
        {
          class: styles.inputGroup,
        },
        [
          Input(
            'text',
            {
              id: 'firstName',
              name: 'firstName',
              class: styles.input,
              placeholder: 'First Name',
            },
          ),
        ],
      ),
      createElement(
        'div',
        {
          class: styles.inputGroup,
        },
        [
          Input(
            'text',
            {
              id: 'lastName',
              name: 'lastName',
              class: styles.input,
              placeholder: 'Last Name(optional)',
            },
          ),
        ],
      ),
      createElement(
        'div',
        {
          class: mergeClasses(styles.inputGroup),
        },
        [
          Button('Sign Up', 'submit', { type: 'primary' }),
        ],
      ),
    ],
  );
}
