/**
 * Parses array buffer with pong schema
 * @param {ArrayBuffer} buffer
 * @returns {{ msgId: BigInt, pingId: BigInt }}
 */
import { buildLoadFunction, buildTypeLoader } from '../../utils';
import { PONG_TYPE, TYPE_KEY } from '../../constants';
import { loadBigInt } from '../bigInt';

const loadType = buildTypeLoader(PONG_TYPE);
const loadMsgId = loadBigInt;
const loadPingId = loadBigInt;

export default buildLoadFunction([
  [TYPE_KEY, loadType],
  ['msgId', loadMsgId],
  ['pingId', loadPingId],
]);
