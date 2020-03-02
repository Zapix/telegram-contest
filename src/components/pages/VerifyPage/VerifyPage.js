import { createElement } from 'utils/vdom';

import { CenterLayout } from 'components/layout';
import { Logo, Header, HelpText } from 'components/atoms';

export default function VerifyPage() {
  return CenterLayout(createElement(
    'div',
    { id: 'verify' },
    [
      Logo(),
      Header('+79625213997'),
      createElement(
        'p',
        null,
        HelpText('We have sent you sms with code'),
      ),
    ],
  ));
}
