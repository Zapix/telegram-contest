import * as R from 'ramda';
import { createElement } from 'utils/vdom';
import mergeClasses from 'utils/mergeClasses'

import styles from './Input.module.scss';

const buildClasses = R.pipe(
  R.nthArg(1),
  R.defaultTo({}),
  R.pick('class'),
);

export default function Input(type, attrs, error) {
  console.log(styles.input);
  return createElement(
    'input',
    Object.assign(
      attrs,
      { class: mergeClasses(styles.input, attrs, error ? 'error' : null)},
    ),
    null,
  );
}
