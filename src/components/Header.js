import { createElement } from 'utils/vdom';
import Avatar from '../zap.avatar.png';

export default function Header() {
  return createElement(
    'div',
    { id: 'header' },
    [
      createElement('img', { src: Avatar }, null),
      createElement(
        'h1',
        { id: 'title' },
        'Best Telegram Application',
      ),
    ],
  );
}
