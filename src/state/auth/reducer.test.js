import reducer from './reducer';
import { AUTH_SEND_CODE, AUTH_SEND_CODE_ERROR, AUTH_SEND_CODE_SUCCESS } from './constants';

describe('auth', () => {
  describe('AUTH_SEND_CODE', () => {
    it('first send', () => {
      const action = {
        type: AUTH_SEND_CODE,
        payload: '+79625213997',
      };

      expect(reducer({}, action)).toEqual({ sendingAuthCode: true });
    });

    it('with error', () => {
      const action = {
        type: AUTH_SEND_CODE,
        payload: '+79625213997',
      };
      expect(reducer(
        { sendAuthCodeError: 'INVALID_PHONE_NUMBER' },
        action,
      )).toEqual({ sendingAuthCode: true });
    });
  });

  describe('AUTH_SEND_CODE_ERROR', () => {
    it('set error', () => {
      const action = {
        type: AUTH_SEND_CODE_ERROR,
        payload: 'INVALID_PHONE_NUMBER',
      };

      expect(reducer({ sendingAuthCode: true }, action)).toEqual(
        { sendAuthCodeError: 'INVALID_PHONE_NUMBER' },
      );
    });
  });

  describe('AUTH_SEND_CODE_SUCCESS', () => {
    it('set success', () => {
      const action = { type: AUTH_SEND_CODE_SUCCESS, payload: '+79625213997' };
      expect(reducer({ sendingAuthCode: true }, action)).toEqual({
        currentPhone: '+79625213997',
      });
    });
  });
});
