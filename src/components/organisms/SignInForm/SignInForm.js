import * as R from 'ramda';

import { requestPing, httpWait } from 'state/todo/actions';
import { sendAuthCode } from 'state/auth';
import { createElement } from 'utils/vdom';
import mergeClasses from 'utils/mergeClasses';
import { Input, Button } from 'components/atoms';
import { CountrySelect } from 'components/molecules';

import styles from './SignInForm.module.scss';

function handleChange(e) {
  const { target: { value: phone } } = e;
  const form = document.getElementById('signInForm');
  if (phone.length > 8) {
    form.classList.add(styles.valid);
  } else {
    form.classList.remove(styles.valid);
  }
}

function handleSubmit(e) {
  e.preventDefault();
  const phoneNumber = document.getElementById('phoneNumber').value;
  sendAuthCode(phoneNumber);
}

function handleClick(e) {
  e.preventDefault();
  requestPing();
}

function handleHttpWait(e) {
  e.preventDefault();
  httpWait();
}

const getError = R.cond([
  [R.equals('PHONE_NUMBER_INVALID'), R.always('Invalid phone number')],
  [R.T, R.identity],
]);

const hasSendAuthError = R.hasPath(['auth', 'sendAuthCodeError']);

const getSendAuthError = R.cond([
  [hasSendAuthError, R.pipe(R.path(['auth', 'sendAuthCodeError']), getError)],
  [R.T, R.always('')],
]);

export default function SignInForm(state) {
  console.log(hasSendAuthError(state));
  return createElement(
    'form',
    {
      id: 'signInForm',
      class: styles.form,
      onsubmit: handleSubmit,
    },
    [
      createElement(
        'div',
        { class: 'commonError' },
        [getSendAuthError(state)],
      ),
      createElement(
        'div',
        { class: styles.inputGroup },
        [
          CountrySelect(
            {
              class: styles.input,
              placeholder: 'Country',
            },
          ),
        ],
      ),
      createElement(
        'div',
        { class: styles.inputGroup },
        Input(
          'text',
          {
            id: 'phoneNumber',
            placeholder: 'Phone number',
            class: styles.input,
            oninput: handleChange,
          },
          hasSendAuthError(state),
        ),
      ),
      createElement(
        'div',
        { class: styles.inputGroup },
        [
          createElement('input', { type: 'checkbox', id: 'keepLogged' }, null),
          createElement('label', { for: 'keepLogged' }, 'Keep Me Logged In'),
        ],
      ),
      createElement(
        'div',
        { class: mergeClasses(styles.inputGroup) },
        [
          Button(
            'Send Ping',
            'button',
            {
              id: 'sendPing',
              onclick: handleClick,
            },
          ),
        ],
      ),
      createElement(
        'div',
        { class: mergeClasses(styles.inputGroup) },
        [
          Button(
            'Http Wait',
            'button',
            {
              id: 'httpWait',
              onclick: handleHttpWait,
            },
          ),
        ],
      ),
      createElement(
        'div',
        { class: mergeClasses(styles.inputGroup) },
        [
          Button(
            'Sign In',
            'submit',
            { type: 'primary' },
          ),
        ],
      ),
    ],
  );
}
