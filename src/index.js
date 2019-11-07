import { render, createElement } from './utils/vdom';
import './style.css';
import Avatar from './zap.avatar.png';

const div = document.createElement('h1');
div.setAttribute('id', 'app');
document.body.append(div);

const vNode = createElement(
  'div',
  { class: 'base-app' },
  [
    createElement(
      'h1',
      { class: 'red' },
      'Best Telegram Application',
    ),
    createElement('img', { src: Avatar }, null),
    createElement('button', { id: 'btn', onclick: () => console.log('hello world') } , 'Click Me'),
    createElement(
      'ul',
      null,
      [
        createElement('li', null, '[x] - First rendering'),
        createElement('li', null, '[ ] - Re-rendering vdom and dom node'),
        createElement('li', null, '[ ] - Integrate value'),
      ],
    ),
  ],
);

render(div, vNode);
