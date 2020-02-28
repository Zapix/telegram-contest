import { createElement } from 'utils/vdom';
import mergeClasses from 'utils/mergeClasses';

import styles from './Input.module.scss';

export default function Input(type, attrs, error) {
  return createElement(
    'input',
    Object.assign(
      attrs,
      { class: mergeClasses(styles.input, attrs, error ? styles.error : null) },
    ),
    null,
  );
}
