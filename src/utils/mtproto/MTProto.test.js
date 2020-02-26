/* eslint-disable */
jest.mock('./createAuthorizationKey');

import createAuthorizationKey from './createAuthorizationKey';

import MTProto, { STATUS_CHANGED_EVENT, AUTH_KEY_CREATED, AUTH_KEY_CREATE_FAILED } from './MTProto';
import schema from './tl/schema/layer5';
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
});
