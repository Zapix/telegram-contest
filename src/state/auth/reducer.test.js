import reducer from './reducer';
import {
  AUTH_SEND_CODE,
  AUTH_SEND_CODE_ERROR,
  AUTH_SEND_CODE_SUCCESS,
  CLEAR_AUTH_STATE, SIGN_UP, SIGN_UP_ERROR,
  VERIFY_CODE,
  VERIFY_CODE_ERROR,
} from './constants';

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
      const action = {
        type: AUTH_SEND_CODE_SUCCESS,
        payload: {
          phone: '+9996621212',
          phone_code_hash: 'e6476b05a321aa7001',
          phone_registered: true,
        },
      };
      expect(reducer({ sendingAuthCode: true }, action)).toEqual({
        currentPhone: '+9996621212',
        phoneRegistered: true,
        phoneCodeHash: 'e6476b05a321aa7001',
      });
    });
  });

  describe('VERIFY_CODE', () => {
    const action = {
      type: VERIFY_CODE,
      payload: '12312',
    };

    it('without error', () => {
      const state = {
        currentPhone: '+9996621212',
        phoneRegistered: true,
        phoneCodeHash: 'e6476b05a321aa7001',
      };

      expect(reducer(state, action)).toEqual({
        currentPhone: '+9996621212',
        phoneRegistered: true,
        phoneCodeHash: 'e6476b05a321aa7001',
        verifyCode: '12312',
      });
    });

    it('with error', () => {
      const state = {
        currentPhone: '+9996621212',
        phoneRegistered: true,
        phoneCodeHash: 'e6476b05a321aa7001',
        verifyCode: '232',
        verifyError: 'INVALID_ERROR',
      };

      expect(reducer(state, action)).toEqual({
        currentPhone: '+9996621212',
        phoneRegistered: true,
        phoneCodeHash: 'e6476b05a321aa7001',
        verifyCode: '12312',
      });
    });
  });

  describe('VERIFY_CODE_ERROR', () => {
    const action = {
      type: VERIFY_CODE_ERROR,
      payload: 'INVALID_CODE',
    };

    it('set error', () => {
      const state = {
        currentPhone: '+9996621212',
        phoneRegistered: true,
        phoneCodeHash: 'e6476b05a321aa7001',
        verifyCode: '232',
      };

      expect(reducer(state, action)).toEqual({
        currentPhone: '+9996621212',
        phoneRegistered: true,
        phoneCodeHash: 'e6476b05a321aa7001',
        verifyCode: '232',
        verifyError: 'INVALID_CODE',
      });
    });
  });

  describe('CLEAR_AUTH_STATE', () => {
    it('test', () => {
      const action = {
        type: CLEAR_AUTH_STATE,
        payload: null,
      };

      const state = {
        currentPhone: '+9996621212',
        phoneRegistered: true,
        phoneCodeHash: 'e6476b05a321aa7001',
        verifyCode: '232',
        verifyError: 'INVALID_CODE',
      };

      expect(reducer(state, action)).toEqual({});
    });
  });

  describe('SIGN_UP', () => {
    const action = {
      type: SIGN_UP,
      payload: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };

    it('without error', () => {
      const state = {
        currentPhone: '+9996621212',
        phoneRegistered: true,
        phoneCodeHash: 'e6476b05a321aa7001',
        verifyCode: '232',
      };

      expect(reducer(state, action)).toEqual({
        ...state,
        firstName: 'John',
        lastName: 'Doe',
      });
    });

    it('with error', () => {
      const state = {
        currentPhone: '+9996621212',
        phoneRegistered: true,
        phoneCodeHash: 'e6476b05a321aa7001',
        verifyCode: '232',
        signUpError: 'ERROR',
      };

      expect(reducer(state, action)).toEqual({
        currentPhone: '+9996621212',
        phoneRegistered: true,
        phoneCodeHash: 'e6476b05a321aa7001',
        verifyCode: '232',
        firstName: 'John',
        lastName: 'Doe',
      });
    });
  });

  describe('SIGN_UP_ERROR', () => {
    it('error', () => {
      const state = {
        currentPhone: '+9996621212',
        phoneRegistered: true,
        phoneCodeHash: 'e6476b05a321aa7001',
        verifyCode: '232',
        firstName: 'John',
        lastName: 'Doe',
      };

      const action = {
        type: SIGN_UP_ERROR,
        payload: 'ERROR',
      };

      expect(reducer(state, action)).toEqual({
        ...state,
        signUpError: 'ERROR',
      });
    });
  });
});
