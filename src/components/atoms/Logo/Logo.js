import { createElement } from 'utils/vdom';

import logo from './Telegram_logo.svg';

export default function Logo() {
  return createElement(
    'img',
    {
      src: logo,
      width: '200px',
      height: '200px',
    },
    null,
  );
}
