import * as R from 'ramda';

import { createElement } from 'utils/vdom';
import mergeClasses from 'utils/mergeClasses';

import styles from './Button.module.scss';

const getClassByType = R.cond([
  [R.equals('primary'), R.always(styles.primary)],
  [R.T, R.always(styles.default)],
]);

const classFromAttrs = R.pipe(
  R.prop('type'),
  getClassByType,
);

export default function Button(textLabel, buttonType, attrs) {
  return createElement(
    'button',
    Object.assign(
      {
        type: R.defaultTo('button', buttonType),
        class: mergeClasses(styles.button, attrs, classFromAttrs(attrs)),
      },
      R.omit('type', attrs),
    ),
    textLabel,
  );
}
