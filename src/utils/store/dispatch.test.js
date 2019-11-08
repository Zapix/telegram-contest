import { STORE_UPDATE_EVENT } from './constants';
import dispatch from './dispatch';

describe('dispatch()', () => {
  test('event has been dispatched', (done) => {
    document.addEventListener(STORE_UPDATE_EVENT, (e) => {
      const { type, payload } = e.detail;

      expect(type).toEqual('SIMPLE_ACTION');
      expect(payload).toEqual(true);
      done();
    });

    dispatch('SIMPLE_ACTION', true);
  });
});
