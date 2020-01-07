import * as R from 'ramda';

import { toTlString } from '../tlSerialization';
import { debug, uint8ToArrayBuffer } from '../../utils';

export default R.pipe(
  toTlString,
  uint8ToArrayBuffer,
);
