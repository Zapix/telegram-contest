import * as R from 'ramda';

import { createElement } from 'utils/vdom';
import mergeClasses from 'utils/mergeClasses';
import { Input, Button } from 'components/atoms';
import { signUp } from 'state/auth';

import styles from './SignUpForm.module.scss';


const getError = R.cond([
  [R.equals('FIRSTNAME_INVALID'), R.always('Invalid first name')],
  [R.T, R.identity],
]);

const hasSignUpError = R.hasPath(['auth', 'signUpError']);

const getSignUpError = R.cond([
  [hasSignUpError, R.pipe(R.path(['auth', 'signUpError']), getError)],
  [R.T, R.always('')],
]);

function handleSubmit(e) {
  e.preventDefault();
  const firstName = document.getElementById('firstName').value || '';
  const lastName = document.getElementById('lastName').value || '';

  signUp({ firstName, lastName });
}

export default function SignUpForm(state) {
  return createElement(
    'form',
    {
      id: 'signUpForm',
      name: 'signUpForm',
      class: styles.form,
      onsubmit: handleSubmit,
    },
    [
      createElement(
        'div',
        { class: 'commonError' },
        [getSignUpError(state)],
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
              id: 'firstName',
              name: 'firstName',
              class: styles.input,
              placeholder: 'First Name',
            },
            hasSignUpError(state),
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
