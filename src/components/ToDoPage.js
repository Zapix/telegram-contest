import { createElement } from 'utils/vdom';
import { setUpdated } from 'state/todo';

export default function ToDoPage(updated) {
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
              setUpdated();
            },
          },
          'Mark re-rendering as done',
        )
      ),
    ],
  );
}
