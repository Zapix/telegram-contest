// 016d5cf300000000bc860b5ebdbc1522b57572991235646130343337306165386264323132373800
// f35c6d01 5e0b86bc00000000 2215bcbd 997275b5
import * as R from 'ramda';

import { RPC_RESULT_TYPE, TYPE_KEY } from '../../constants';
import { sliceBuffer } from '../../utils';
import { loadBigInt } from '../bigInt';
import { computeOffset, isWithOffset } from '../utils';

const loadType = R.pipe(
  R.always(RPC_RESULT_TYPE),
  R.of,
  R.ap([R.identity, R.always(4)]),
  R.zipObj(['value', 'offset']),
);

const loadMsgId = R.pipe(
  R.partialRight(sliceBuffer, [4, 12]),
  R.partialRight(loadBigInt, [true]),
);

const loadWithOffset = R.partialRight(R.__, [true]);

/**
 * Parse rpc result by schema
 * @param {ArrayBuffer} buffer
 * @param {boolean} withOffset
 * @param {Function} parseMessage
 * @return {{
 *   msgId: BigInt,
 *   message: *
 * }}
 */
function loadRpcResult(buffer, withOffset, parseMessage) {
  const loadRpcMessage = R.pipe(
    R.partialRight(sliceBuffer, [12, undefined]),
    loadWithOffset(parseMessage),
  );
  const loadData = R.ap([loadType, loadMsgId, loadRpcMessage]);

  const buildRpcResult = R.pipe(
    R.ap([R.prop('value')]),
    R.zipObj([TYPE_KEY, 'msgId', 'result']),
  );

  const buildWithOffset = R.pipe(
    R.of,
    R.ap([buildRpcResult, computeOffset]),
    R.zipObj(['value', 'offset']),
  );

  return R.cond([
    [isWithOffset, R.pipe(R.of, loadData, buildWithOffset)],
    [R.T, R.pipe(R.of, loadData, buildRpcResult)],
  ])(buffer, withOffset);
}

export default R.unapply(R.pipe(
  R.of,
  R.ap([R.nth(0), R.pipe(R.nth(1), R.equals(true)), R.nth(-1)]),
  R.apply(loadRpcResult),
));
