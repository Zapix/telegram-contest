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
  console.log('Submit phone number:', phoneNumber);
}

export default function SignInForm() {
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
        { class: mergeClasses(styles.inputGroup, styles.submitGroup) },
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
