import combineReducer, { nameReducer } from './combineReducers';

describe('nameReducer', () => {
  test('return without state', () => {
    const reducer = jest.fn();
    reducer.mockReturnValue('test');
    const namedReducer = nameReducer(['a', reducer]);

    const currentState = null;
    const action = { type: 'SIMPLE_ACTION' };
    const result = namedReducer(currentState, action);

    expect(reducer).toHaveBeenCalled();
    expect(reducer).toHaveBeenCalledWith(null, action);
    expect(result).toEqual(['a', 'test']);
  });

  test('return with state', () => {
    const reducer = jest.fn();
    reducer.mockReturnValue('test');
    const namedReducer = nameReducer(['a', reducer]);

    const currentState = { a: 'init' };
    const action = { type: 'SIMPLE_ACTION' };
    const result = namedReducer(currentState, action);

    expect(reducer).toHaveBeenCalledWith('init', action);
    expect(result).toEqual(['a', 'test']);
  });
});

describe('combineReducer()', () => {
  test('test empty state', () => {
    const reducerA = jest.fn();
    reducerA.mockReturnValue(1);

    const reducerB = jest.fn();
    reducerB.mockReturnValue('b');

    const reducer = combineReducer({ a: reducerA, b: reducerB });

    const currentState = null;
    const action = { type: 'INIT' };
    const state = reducer(currentState, action);

    expect(state).toEqual({ a: 1, b: 'b' });
    expect(reducerA).toHaveBeenCalledWith(null, action);
    expect(reducerB).toHaveBeenCalledWith(null, action);
  });

  test('update state', () => {
    const reducerA = jest.fn();
    reducerA.mockReturnValue(1);

    const reducerB = jest.fn();
    reducerB.mockReturnValue('b');

    const reducer = combineReducer({ a: reducerA, b: reducerB });

    const currentState = { a: 2, b: 'a' };
    const action = { type: 'UPDATE' };
    const state = reducer(currentState, action);

    expect(state).toEqual({ a: 1, b: 'b' });
    expect(reducerA).toHaveBeenCalledWith(2, action);
    expect(reducerB).toHaveBeenCalledWith('a', action);
  });
});
