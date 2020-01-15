import * as R from 'ramda';

import { GET_FUTURE_SALTS, TYPE_KEY } from '../../constants';
import { buildLoadFunction } from '../../utils';
import { loadInt } from '../int';


const loadType = R.always({ value: GET_FUTURE_SALTS, offset: 4 });
const loadNum = loadInt;

export default buildLoadFunction([
  [TYPE_KEY, loadType],
  ['num', loadNum],
]);
