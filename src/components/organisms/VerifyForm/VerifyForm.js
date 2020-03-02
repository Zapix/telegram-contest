import { createElement } from 'utils/vdom';
import mergeClasses from 'utils/mergeClasses';
import { Button, Input } from 'components/atoms';
import { sendVerifyCode } from 'state/auth';

import styles from './VerifyForm.module.scss';

function handleSubmit(e) {
  e.preventDefault();
  const verifyCode = document.getElementById('verifyCode').value;
  sendVerifyCode(verifyCode);
}

export default function VerifyForm() {
  return createElement(
    'form',
    {
      id: 'verifyCodeForm',
      class: styles.form,
      onsubmit: handleSubmit,
    },
    [
      createElement(
        'div',
        { class: styles.inputGroup },
        [
          Input(
            'text',
            {
              id: 'verifyCode',
              name: 'verifyCode',
              class: styles.input,
            },
          ),
        ],
      ),
      createElement(
        'div',
        { class: mergeClasses(styles.inputGroup) },
        [
          Button(
            'Next',
            'submit',
            { type: 'primary' },
          ),
        ],
      ),
    ],
  );
}
