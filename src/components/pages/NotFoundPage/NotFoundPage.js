import { createElement } from 'utils/vdom';

import { CenterLayout } from 'components/layout';

export default function NotFoundPage() {
  return CenterLayout(createElement(
    'div',
    { id: 'not-found' },
    [createElement('h2', {}, 'Not Found')],
  ));
}
