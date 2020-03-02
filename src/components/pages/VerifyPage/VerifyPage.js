import * as R from 'ramda';

import { createElement } from 'utils/vdom';

import { CenterLayout } from 'components/layout';
import { Logo, Header, HelpText } from 'components/atoms';
import { VerifyFrom } from 'components/organisms';

import styles from './VerifyPage.module.scss';

const getCurrentPhone = R.pathOr('', ['auth', 'currentPhone']);

export default function VerifyPage(state) {
  return CenterLayout(createElement(
    'div',
    {
      id: 'verify',
      class: styles.verifyPage,
    },
    [
      Logo(),
      Header(getCurrentPhone(state)),
      createElement(
        'p',
        null,
        HelpText('We have sent you sms with code'),
      ),
      VerifyFrom(state),
    ],
  ));
}
