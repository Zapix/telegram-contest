/* eslint-disable */
import { methodFromSchema } from './tl';

jest.mock('./createAuthorizationKey');
jest.mock('./sendRequest');
jest.mock('./decryptMessage');

import createAuthorizationKey from './createAuthorizationKey';
import sendRequest from './sendRequest';
import decryptMessage from './decryptMessage';

import * as R from 'ramda';

import { API_HASH, API_ID, HTTP_WAIT_TYPE, PING_TYPE, TYPE_KEY } from './constants';
import MTProto, { STATUS_CHANGED_EVENT, AUTH_KEY_CREATED, AUTH_KEY_CREATE_FAILED } from './MTProto';
import schema from './tl/schema/layer5';
import { hexToArrayBuffer } from './utils';
/* eslint-enable */

describe('MTProto', () => {
  const url = 'http://exapmle.com/';
  it('auth key created', (done) => {
    createAuthorizationKey.mockResolvedValueOnce({
      authKey: 'key',
      authKeyId: 12312,
      serverSalt: 'asdfasdf',
    });

    const connection = new MTProto(url, schema);
    connection.addEventListener(STATUS_CHANGED_EVENT, (e) => {
      expect(e.status).toEqual(AUTH_KEY_CREATED);
      expect(connection.authKey).toEqual('key');
      expect(connection.authKeyId).toEqual(12312);
      expect(connection.serverSalt).toEqual('asdfasdf');
      done();
    });

    connection.init();
  });

  it('auth key create failed', (done) => {
    createAuthorizationKey.mockRejectedValueOnce('some reason');

    const connection = new MTProto(url, schema);
    connection.addEventListener(STATUS_CHANGED_EVENT, (e) => {
      expect(e.status).toEqual(AUTH_KEY_CREATE_FAILED);
      done();
    });

    connection.init();
  });

  describe('request', () => {
    it('wrong connection status', () => {
      const connection = new MTProto(url, schema);
      return connection.request({ a: 1 }).catch((reason) => {
        expect(reason).toEqual(new Error('Auth key has not been created'));
      });
    });

    it('empty array buffer error', (done) => {
      createAuthorizationKey.mockResolvedValueOnce({
        authKey: [51, 226, 44, 202, 188, 62, 184, 113, 57, 203, 114, 87, 206, 49, 208, 130, 207, 59,
          41, 19],
        authKeyId: [206, 49, 208, 130, 207, 59, 41, 19],
        serverSalt: new Uint8Array([199, 141, 234, 177, 54, 191, 107, 190]),
      });

      const connection = new MTProto(url, schema);
      connection.addEventListener(STATUS_CHANGED_EVENT, () => {
        connection.request({}).catch((reason) => {
          expect(reason).toEqual(new Error('empty array buffer of message'));
          done();
        });
      });
      connection.init();
    });

    it('send http wait request', (done) => {
      createAuthorizationKey.mockResolvedValueOnce({
        authKey: [51, 226, 44, 202, 188, 62, 184, 113, 57, 203, 114, 87, 206, 49, 208, 130, 207, 59,
          41, 19],
        authKeyId: [206, 49, 208, 130, 207, 59, 41, 19],
        serverSalt: new Uint8Array([199, 141, 234, 177, 54, 191, 107, 190]),
      });

      const hexStr = '0809c29e00000000452d075e078cde63a724558fb73e6267c6ab026b';
      const response = {
        arrayBuffer: jest.fn(),
      };
      response.arrayBuffer.mockReturnValueOnce(hexToArrayBuffer(hexStr));
      sendRequest.mockResolvedValue(response);
      decryptMessage.mockResolvedValueOnce({
        messageId: BigInt('2342143274123'),
        seqNo: 13,
        message: hexToArrayBuffer(hexStr),
      });

      const connection = new MTProto(url, schema);
      connection.addEventListener(STATUS_CHANGED_EVENT, () => {
        connection.request({
          [TYPE_KEY]: HTTP_WAIT_TYPE,
          maxDelay: 0,
          waitAfter: 0,
          maxWait: 25000,
        }).then(() => {
          done();
        });
      });
      connection.init();
    });

    it('send ping request', (done) => {
      createAuthorizationKey.mockResolvedValueOnce({
        authKey: [51, 226, 44, 202, 188, 62, 184, 113, 57, 203, 114, 87, 206, 49, 208, 130, 207, 59,
          41, 19],
        authKeyId: [206, 49, 208, 130, 207, 59, 41, 19],
        serverSalt: new Uint8Array([199, 141, 234, 177, 54, 191, 107, 190]),
      });

      const hexStr = 'ec77be7a000000000e800b5e';
      const response = {
        arrayBuffer: jest.fn(),
      };
      response.arrayBuffer.mockReturnValueOnce(hexToArrayBuffer(hexStr));
      sendRequest.mockResolvedValue(response);


      const connection = new MTProto(url, schema);
      connection.addEventListener(STATUS_CHANGED_EVENT, () => {
        connection.request({
          pingId: BigInt(2323423423),
          [TYPE_KEY]: PING_TYPE,
        }).then((value) => {
          expect(value).toEqual('OK');
          done();
        });

        const promisesList = R.values(connection.rpcPromises);
        expect(promisesList.length).toBeGreaterThan(0);
        promisesList[0].resolve('OK');
      });
      connection.init();
    });

    it('send rpc call', (done) => {
      createAuthorizationKey.mockResolvedValueOnce({
        authKey: [51, 226, 44, 202, 188, 62, 184, 113, 57, 203, 114, 87, 206, 49, 208, 130, 207, 59,
          41, 19],
        authKeyId: [206, 49, 208, 130, 207, 59, 41, 19],
        serverSalt: new Uint8Array([199, 141, 234, 177, 54, 191, 107, 190]),
      });
      sendRequest.mockResolvedValue(new ArrayBuffer());


      const connection = new MTProto(url, schema);
      connection.addEventListener(STATUS_CHANGED_EVENT, () => {
        const method = R.partial(methodFromSchema, [schema]);
        const message = method(
          'auth.sendCode',
          {
            phone_number: '+79625213997',
            api_id: API_ID,
            sms_type: 0,
            lang_code: 'ru',
            api_hash: API_HASH,
          },
        );

        connection.request(message).then((value) => {
          expect(value).toEqual('OK');
          done();
        });

        const promisesList = R.values(connection.rpcPromises);
        expect(promisesList.length).toBeGreaterThan(0);
        promisesList[0].resolve('OK');
      });
      connection.init();
    });

    it('send with message previous acknowledgements', (done) => {
      createAuthorizationKey.mockResolvedValueOnce({
        authKey: [51, 226, 44, 202, 188, 62, 184, 113, 57, 203, 114, 87, 206, 49, 208, 130, 207, 59,
          41, 19],
        authKeyId: [206, 49, 208, 130, 207, 59, 41, 19],
        serverSalt: new Uint8Array([199, 141, 234, 177, 54, 191, 107, 190]),
      });

      const hexStr = 'ec77be7a000000000e800b5e';
      const response = {
        arrayBuffer: jest.fn(),
      };
      response.arrayBuffer.mockReturnValueOnce(hexToArrayBuffer(hexStr));
      sendRequest.mockResolvedValue(response);

      const connection = new MTProto(url, schema);
      connection.acknowledgements = [BigInt(1), BigInt(2)];
      connection.addEventListener(STATUS_CHANGED_EVENT, () => {
        const method = R.partial(methodFromSchema, [schema]);
        const message = method(
          'auth.sendCode',
          {
            phone_number: '+79625213997',
            api_id: API_ID,
            sms_type: 0,
            lang_code: 'ru',
            api_hash: API_HASH,
          },
        );

        connection.request(message).then((value) => {
          expect(value).toEqual('OK');
          done();
        });

        const promisesList = R.values(connection.rpcPromises);
        expect(promisesList.length).toBeGreaterThan(0);
        promisesList[0].resolve('OK');
      });
      connection.init();
    });
  });
});
