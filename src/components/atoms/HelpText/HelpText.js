import { createElement } from 'utils/vdom';

import styles from './HelpText.module.scss';

export default function HelpText(text) {
  return createElement(
    'small',
    { class: styles.helpText },
    text,
  );
}
