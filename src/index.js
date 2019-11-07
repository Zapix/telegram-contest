import { render, rerender, createElement } from './utils/vdom';
import './style.css';
import Avatar from './zap.avatar.png';

const div = document.createElement('h1');
div.setAttribute('id', 'app');
document.body.append(div);

let oldVersion;

function App(updated) {
  const updatedSign = updated ? 'x' : ' ';
  return createElement(
    'div',
    { class: 'base-app' },
    [
      createElement(
        'h1',
        { class: 'red' },
        'Best Telegram Application',
      ),
      createElement('img', { src: Avatar }, null),
      createElement(
        'ul',
        null,
        updated ? (
          [
            createElement('li', null, '[x] - First rendering'),
            createElement('li', null, `[${updatedSign}] - Re-rendering vdom and dom node`),
            createElement('li', null, '[ ] - Prepare function for tracking state changes'),
          ]

        ) : (
          [
            createElement('li', null, '[x] - First rendering'),
            createElement('li', null, `[${updatedSign}] - Re-rendering vdom and dom node`),
          ]
        ),
      ),
      createElement(
        'button', {
          id: 'btn',
          onclick: () => rerender(div, oldVersion, App(true)),
        },
        'Mark re-rendering as done',
      ),
    ],
  );
}

oldVersion = App();
render(div, oldVersion);
