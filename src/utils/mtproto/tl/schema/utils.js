import * as R from 'ramda';

/**
 * Converts int 32 value to unsigned int 32 value without changing bytes
 * @param {Number} number
 * @returns {Number} unsigned value
 */
export function intToUint(number) {
  const buffer = new ArrayBuffer(4);
  const intView = new Int32Array(buffer);
  intView[0] = number;
  return (new Uint32Array(buffer))[0];
}


const parseId = R.pipe(
  R.partialRight(parseInt, [10]),
  intToUint,
);

/**
 * Use unsigned int value as ids instead of signed int in schema
 */
const updateSchemaWithUintId = R.over(R.lensProp('id'), parseId);

/**
 * builds schema map
 * @param {Array<{id: Number, [method]}>}
 */
const buildMap = R.pipe(
  R.map(
    R.pipe(
      R.of,
      R.ap([R.pipe(R.prop('id'), parseId), updateSchemaWithUintId]),
    ),
  ),
  R.fromPairs,
);

/**
 * Takes schema and builds map that allows search constructors by id
 * @param {{constructors: *, method: *}} schema - schema for parsing
 */
const buildConstructorsMap = R.pipe(
  R.prop('constructors'),
  buildMap,
);

/**
 * Takes schema and builds map that allows search methods by id
 * @param {{constructors: *, method: *}} schema - schema for parsing
 */
const buildMethodsMap = R.pipe(
  R.prop('methods'),
  buildMap,
);

/**
 * Takes global schema and builds map that allows search item by id
 * @param {{constructors: *, method: *}} schema - schema for parsing
 */
const buildSchemaIdMap = R.pipe(
  R.of,
  R.ap([buildMethodsMap, buildConstructorsMap]),
  R.mergeAll,
);


/**
 * Tries to find schema to load object by id(unsigned int)
 * @param {{constructors: *, method: *}} schema - schema for parsing
 * @param {number} id - number of type to parse schema
 *
 * @returns {[{constructor: boolean, method: boolean, schema: *}]}
 */
export const getParseSchemaById = R.unapply(
  R.pipe(
    R.of,
    R.ap([R.nth(1), R.pipe(R.nth(0), buildSchemaIdMap)]),
    R.apply(R.prop),
  ),
);
