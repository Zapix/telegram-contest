import { API_ID } from './constants';
import { getMessageId } from './utils';

export function buildAuthMessage(phone) {
  const buffer = new ArrayBuffer(
    20 + (16 + 4 + 36 + 4),
  );

  const authKeyId = new BigUint64Array(buffer, 0, 1);
  authKeyId[0] = BigInt(0);

  const messageId = new BigUint64Array(buffer, 8, 1);
  messageId[0] = getMessageId();

  const messageLength = new Uint32Array(buffer, 16, 4);
  messageLength[0] = 48;

  const phoneBytes = new Uint8Array(buffer, 20, 16);
  phoneBytes[0] = buffer.length;
  phoneBytes[1] = 0;
  phoneBytes[2] = 0;
  for (let i = 0; i < phone.length; i += 1) {
    phoneBytes[3 + i] = phone.charCodeAt(i);
  }

  const apiId = new Uint32Array(buffer, 36, 1);
  apiId[0] = API_ID;

  const apiHash = new Uint32Array(buffer, 40, 36);
  apiHash[0] = apiHash.length;
  apiHash[1] = 0;
  apiHash[2] = 0;
  for (let i = 0; i < apiHash.length; i += 1) {
    apiHash[3 + i] = phone.charCodeAt(i);
  }

  const codeSettings = new Uint32Array(buffer, 76);
  codeSettings[0] = 1;

  return buffer;
}

export default function sendAuthCode() {}
