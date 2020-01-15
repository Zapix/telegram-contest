import * as R from 'ramda';

import { GET_FUTURE_SALTS, TYPE_KEY } from '../../constants';
import { sliceBuffer } from '../../utils';
import { loadInt } from '../int';
import { isWithOffset, withConstantOffset } from '../utils';


const loadType = R.always(GET_FUTURE_SALTS);
const loadNums = R.pipe(R.partialRight(sliceBuffer, [4, 8]), loadInt);

const loader = R.pipe(
  R.of,
  R.ap([loadType, loadNums]),
  R.zipObj([TYPE_KEY, 'num']),
);

/**
 * get_future_salts#b921bd04 num:int = FutureSalts;
 * @param buffer
 * @returns {{}}
 */
export default R.cond([
  [isWithOffset, withConstantOffset(loader, 8)],
  [R.T, loader],
]);
