import { createElement } from 'utils/vdom';
import styles from './Header.module.scss';

/**
 * @param {string} text
 * @constructor
 */
export default function Header(text) {
  return createElement(
    'h2',
    {
      class: styles.title,
    },
    text,
  );
}
