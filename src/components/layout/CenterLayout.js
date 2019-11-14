import { createElement } from 'utils/vdom';

import styles from './CenterLayout.module.scss';

export default function CenterLayout(content) {
  return createElement(
    'div',
    {
      class: styles.wrapper,
    },
    [
      createElement(
        'div',
        {
          class: styles.inner,
        },
        [content],
      ),
    ],
  );
}
