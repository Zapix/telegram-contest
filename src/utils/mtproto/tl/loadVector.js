import * as R from 'ramda';

/**
 * @param {ArrayBuffer} buffer
 * @param {Number} start
 * @param {Number} end
 * @returns {ArrayBuffer}
 */
function sliceBuffer(buffer, start, end) {
  return buffer.slice(start, end);
}

/**
 * Splits vector to buffer array of each values
 * @param {ArrayBuffer} buffer
 * @returns {*[]}
 */
export default function loadVector(buffer) {
  // TODO: allow to parse vectors with any values
  const count = (new Uint32Array(buffer.slice(4), 0, 1))[0];
  const messagesBuffer = buffer.slice(8);
  const itemLength = messagesBuffer.byteLength / count;

  console.log(itemLength);
  return R.pipe(
    R.times(R.identity),
    R.map(
      R.pipe(
        R.of(),
        R.ap([R.identity, R.add(1)]),
        R.map(R.multiply(itemLength)),
        R.apply(R.partial(sliceBuffer, [messagesBuffer])),
      ),
    ),
  )(count);
}
