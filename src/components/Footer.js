import { createElement } from '../utils/vdom';

export default function Footer() {
  return createElement(
    'div',
    { id: 'footer' },
    [
      createElement(
        'strong',
        null,
        '(c) With Love By Zapix',
      ),
    ],
  );
}
