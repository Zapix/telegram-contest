import { createElement } from '../utils/vdom';

export default function MainSection(content) {
  return createElement(
    'div',
    { id: 'main-section' },
    [content],
  );
}
