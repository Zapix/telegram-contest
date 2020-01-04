export default function loadInt(buffer) {
  return new Uint32Array(buffer, 0, 1)[0];
}
