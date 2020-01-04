/**
 * @param {ArrayBuffer} buffer
 * @returns {BigInt}
 */
export default function loadBigInt(buffer) {
  return (new BigUint64Array(buffer, 0, 1))[0];
}
