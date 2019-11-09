import * as R from 'ramda';


/**
 * Builds function that takes action object and return true if action has got same type
 * @param {string} type
 */
export const isActionOf = R.propEq('type');


/**
 * Takes function that checks action object and use them for second passed argument
 * @param {Function}
 * @returns {Function} - wrapped function
 */
export const wrapActionTypeChecker = R.curryN(2)(R.pipe)(R.nth(1), R.__);

/**
 * Takes tuple of function where first function is argument and second function is
 * @type {null}
 */
export const toReducerCondition = R.pipe(
  R.of,
  R.ap([
    R.pipe(R.nth(0), wrapActionTypeChecker),
    R.nth(1),
  ]),
);

/**
 * Builds reducer function that sets initialState as default state
 * @param {*} initialState
 * @param {[Function, Function][]} reducerHandlers - array of tuples where first argument is
 * an action type checker and second argument is a reducerHandler
 */
export function buildReducer(initialState, reducerHandlers) {
  return R.unapply(
    R.pipe(
      R.of,
      R.ap([
        R.pipe(R.nth(0), R.defaultTo(initialState)),
        R.pipe(R.nth(1)),
      ]),
      R.cond([
        ...R.map(toReducerCondition, reducerHandlers),
        [R.T, R.nth(0)],
      ]),
    ),
  );
}
