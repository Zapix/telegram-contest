import * as R from 'ramda';
import { createElement } from 'utils/vdom';

import editIcon from './icons/edit_svg.svg';

const getIconSrc = R.propOr(
  editIcon,
  R.__,
  {
    edit: editIcon,
  },
);

export default function Icon(iconType, attrs) {
  return createElement(
    'img',
    R.mergeLeft(attrs, { src: getIconSrc(iconType) }),
    null,
  );
}
