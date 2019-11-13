import { API_ID, API_HASH } from './constants';

export function getSendAuthPayload(phone) {
  const buffer = new ArrayBuffer(
    20 + (16 + 4 + 36 + 4)
  );

  const auth_key_id = new BigUint64Array(buffer, 0, 1);
  auth_key_id[0] = BigInt(0);

  const message_id = new BigUint64Array(buffer, 8, 1);
  message_id[0] = BigInt(+Date.now()) * BigInt(Math.pow(2, 32));

  const message_length = new Uint32Array(buffer, 16, 4);
  message_length[0] = 48;

  const phone_bytes = new Uint8Array(buffer, 20, 16);
  phone_bytes[0] = buffer.length;
  phone_bytes[1] = 0;
  phone_bytes[2] = 0;
  for (let i=0; i < phone.length; i += 1) {
    phone_bytes[3+i] = phone.charCodeAt(i);
  }

  const api_id = new Uint32Array(buffer, 36, 1);
  api_id[0] = API_ID;

  const api_hash = new Uint32Array(buffer, 40, 36);
  api_hash[0] = api_hash.length;
  api_hash[1] = 0;
  api_hash[2] = 0;
  for (let i=0; i< api_hash.length; i += 1) {
    api_hash[3+i] = phone.charCodeAt(i);
  }

  const code_settings = new Uint32Array(buffer, 76);
  code_settings[0] = 1;

  return buffer;
}