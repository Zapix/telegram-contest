import { createElement } from 'utils/vdom';
import { Button, Input } from 'components/atoms';

import styles from './VerifyForm.module.scss';
import mergeClasses from '../../../utils/mergeClasses';

function handleSubmit(e) {
  e.preventDefault();
  const verifyCode = document.getElementById('verifyCode').value;
  console.log(verifyCode);
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
