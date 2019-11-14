import { createElement } from 'utils/vdom';
import mergeClasses from 'utils/mergeClasses';

import styles from './Input.module.scss';

export default function Input(type, attrs, error) {
  console.log(attrs);
  return createElement(
    'input',
    Object.assign(
      attrs,
      { class: mergeClasses(styles.input, attrs, error ? 'error' : null) },
    ),
    null,
  );
}
