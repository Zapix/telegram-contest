import { createElement, mount } from './utils/vdom';
import './style.css';
import Avatar from './zap.avatar.png';

const div = document.createElement('h1');
div.setAttribute('id', 'app');
document.body.append(div);

function dispatch() {
  const event = new CustomEvent('stateUpdate');
  document.dispatchEvent(event);
}

function Header() {
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

function Footer() {
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

function MainSection(content) {
  return createElement(
    'div',
    { id: 'main-section' },
    [content],
  );
}


function SomeContent(updated) {
  const updatedSign = updated ? 'x' : ' ';
  return createElement(
    'div',
    null,
    [
      createElement(
        'ul',
        null,
        updated ? (
          [
            createElement('li', null, '[x] - First rendering'),
            createElement('li', null, `[${updatedSign}] - Re-rendering vdom and dom node`),
            createElement('li', null, '[x] - Prepare function for tracking state changes'),
          ]

        ) : (
          [
            createElement('li', null, '[x] - First rendering'),
            createElement('li', null, `[${updatedSign}] - Re-rendering vdom and dom node`),
          ]
        ),
      ),
      updated ? (
        null
      ) : (
        createElement(
          'button', {
            class: 'btn',
            onclick: (e) => {
              e.preventDefault();
              dispatch();
            },
          },
          'Mark re-rendering as done',
        )
      ),
    ],
  );
}

function App(state) {
  return createElement(
    'div',
    { id: 'base-app' },
    [
      Header(),
      MainSection(SomeContent(state)),
      Footer(),
    ],
  );
}

const updateView = mount(div, App, false);

document.addEventListener('stateUpdate', () => {
  updateView(true);
});
