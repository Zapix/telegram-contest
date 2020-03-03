import * as R from 'ramda';
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

const hasVerifyError = R.hasPath(['auth', 'verifyError']);

export default function VerifyForm(state) {
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
            hasVerifyError(state),
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
