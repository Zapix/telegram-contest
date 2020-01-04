import * as R from 'ramda';

import { getStringFromArrayBuffer } from './tlSerialization';

const loadString = R.partialRight(getStringFromArrayBuffer, [0]);

export default loadString;
