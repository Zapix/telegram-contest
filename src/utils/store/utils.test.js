import {
  isActionOf,
  buildReducer,
  wrapActionTypeChecker,
  toReducerCondition,
} from './utils';


describe('isActionOf()', () => {
  const isSimpleAction = isActionOf('SIMPLE_ACTION');
  test('check current action has been passed', () => {
    expect(isSimpleAction({ type: 'SIMPLE_ACTION' })).toBeTruthy();
  });

  test('check wrong action has been passed', () => {
    expect(isSimpleAction({ type: 'ANOTHER_ACTION' })).toBeFalsy();
  });
});

describe('wrapActionTypeChecker()', () => {
  const isSimpleAction = isActionOf('SIMPLE_ACTION');
  const wrappedChecker = wrapActionTypeChecker(isSimpleAction);

  test('check current action has been passed', () => {
    expect(wrappedChecker([null, { type: 'SIMPLE_ACTION' }])).toBeTruthy();
  });

  test('check wrong action has been passed', () => {
    expect(wrappedChecker([null, { type: 'ANOTHER_ACTION' }])).toBeFalsy();
  });
});

describe('toReducerCondition()', () => {
  test('success', () => {
    const [checker, reducerHandler] = toReducerCondition([isActionOf('SIMPLE_ACTION'), (x) => x]);

    expect(checker([null, { type: 'SIMPLE_ACTION' }])).toBeTruthy();
    expect(reducerHandler(true)).toBeTruthy();
  });
});

describe('buildReducer()', () => {
  test('test', () => {
    const initialState = { value: 'init' };

    const reducer = buildReducer(
      initialState,
      [
        [isActionOf('SIMPLE'), () => ({ value: 'updated' })],
      ],
    );

    const fakeAction = { type: 'FAKE' };
    let state = reducer(null, fakeAction);
    expect(state).toHaveProperty('value', 'init');

    const simpleAction = { type: 'SIMPLE' };
    state = reducer(state, simpleAction);
    expect(state).toHaveProperty('value', 'updated');

    state = reducer(state, fakeAction);
    expect(state).toHaveProperty('value', 'updated');
  });
});
