import buildStateStream from './buildStateStream';
import dispatch from './dispatch';
import { INIT_ACTION } from './constants';

test('buildStateStream', (done) => {
  const reducer = jest.fn();
  reducer.mockReturnValue('hello');

  const state$ = buildStateStream(reducer);
  state$.subscribe(
    (state) => {
      expect(state).toEqual('hello');
      done();
    },
  );

  dispatch(INIT_ACTION, true);
});
