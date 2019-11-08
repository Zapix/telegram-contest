import dispatch from './dispatch';
import getActionStream from './getActionStream';

test('getActionStream()', (done) => {
  const action$ = getActionStream();
  action$.subscribe((value) => {
    expect(value).toHaveProperty('type', 'SIMPLE');
    expect(value).toHaveProperty('payload', true);
    done();
  });

  dispatch('SIMPLE', true);
});
