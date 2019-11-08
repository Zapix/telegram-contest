import * as R from 'ramda';

const getLocalState = R.propOr(null);


/**
 * Builds function that takes object with value on the same key as name of reducer, applies
 * reducer and returns pair with name of reducer and result of reducer
 * @param {[string, Function]} namedReducer - reducer
 */
export const nameReducer = ([name, reducer]) => R.unapply(R.pipe(
  R.of,
  R.ap([
    R.pipe(R.nth(0), getLocalState(name)),
    R.pipe(R.nth(1), R.identity),
  ]),
  R.apply(reducer),
  R.append(R.__, [name]),
));

/**
 * Builds big reducer that will pass to smaller reducers his part of state and pass action to
 * all states, and then accamulate results into new state object
 * @param {Object} reducersMap - where key is a name for state store and value is a reducer
 */
const combineReducers = R.pipe(
  R.toPairs,
  R.map(R.pipe(nameReducer, R.apply)),
  R.ap,
  R.curryN(3)(R.pipe)(R.of, R.__, R.fromPairs),
  R.unapply,
);

export default combineReducers;
