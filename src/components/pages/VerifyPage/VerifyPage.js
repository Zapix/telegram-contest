import * as R from 'ramda';

import { createElement } from 'utils/vdom';
import { CenterLayout } from 'components/layout';
import {
  Logo,
  Header,
  HelpText,
  Icon,
} from 'components/atoms';
import { VerifyFrom } from 'components/organisms';
import { setPage } from 'state/pages';

import styles from './VerifyPage.module.scss';

const getCurrentPhone = R.pathOr('', ['auth', 'currentPhone']);

function handleEditPhone(e) {
  e.preventDefault();
  setPage('login');
}

export default function VerifyPage(state) {
  return CenterLayout(createElement(
    'div',
    {
      id: 'verify',
      class: styles.verifyPage,
    },
    [
      Logo(),
      createElement(
        'div',
        { class: styles.headerGroup },
        [
          Header(getCurrentPhone(state)),
          createElement(
            'a',
            {
              href: '#',
              class: styles.editIcon,
              onclick: handleEditPhone,
            },
            [
              Icon('edit', { width: '20px', height: '20px' }),
            ],
          ),
        ],
      ),
      createElement(
        'p',
        null,
        HelpText('We have sent you sms with code'),
      ),
      VerifyFrom(state),
    ],
  ));
}
