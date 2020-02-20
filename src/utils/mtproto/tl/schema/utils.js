import * as R from 'ramda';
import { getConstructor } from '../utils';
import { CONSTRUCTOR_KEY, METHOD_KEY } from '../../constants';


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

/**
 * Takes schema and returns function that will tell can schema parse array buffer or not
 * @type {(function(...[*]=))|*}
 */
export const isFromSchemaFactory = R.pipe(
  buildSchemaIdMap,
  (x) => R.pipe(getConstructor, R.has(R.__, x)),
);


export const isMethodObject = R.has(METHOD_KEY);


export const isConstuctorObject = R.has(CONSTRUCTOR_KEY);


/**
 * Takes schema and return map for methods
 * @param {{constructors: *, methods: *}} schema - layer to build method schema
 * @return {{[string]: *}}
 */
export const buildMethodsSchemaMap = R.pipe(
  R.prop('methods'),
  R.map(R.pipe(R.of, R.ap([R.prop('method'), updateSchemaWithUintId]))),
  R.fromPairs,
);

/**
 * Takes schema and return map for constructors
 * @param {{constructors: *, methods: *}} schema - layer to build constructors schema
 * @return {{[string]: *}}
 */
export const buildConstructorsSchemaMap = R.pipe(
  R.prop('constructors'),
  R.map(R.pipe(R.of, R.ap([R.prop('predicate'), updateSchemaWithUintId]))),
  R.fromPairs,
);

/**
 * Returns all constructors/methods that could be loaded/dumped
 * @type {(function(...[*]=))|*}
 */
export const getAvailableTypes = R.pipe(
  R.of,
  R.ap([
    R.pipe(buildMethodsSchemaMap, R.values, R.map(R.prop('type'))),
    R.pipe(buildConstructorsSchemaMap, R.values, R.map(R.prop('type'))),
  ]),
  R.flatten,
  (x) => new Set(x),
);

export const isDumpingTypeFactory = R.pipe(
  getAvailableTypes,
  (x) => (type) => x.has(type),
);


/**
 * @param {{constructors: *, methods: *}} schema - layer to build method schema
 * @param {string} methodName - method name
 * @returns {*} - schema for current name
 */
export const getSchemaForMethod = R.unapply(R.pipe(
  R.of,
  R.ap([
    R.nth(1),
    R.pipe(R.nth(0), buildMethodsSchemaMap),
  ]),
  R.apply(R.prop),
));

/**
 * @param {{constructors: *, methods: *}} schema - layer to build method schema
 * @param {string} methodName - method name
 * @returns {*} - schema for current name
 */
export const getSchemaForConstructor = R.unapply(R.pipe(
  R.of,
  R.ap([
    R.nth(1),
    R.pipe(R.nth(0), buildConstructorsSchemaMap),
  ]),
  R.apply(R.prop),
));

const matchVector = R.match(/Vector<(\w+)>/);

export const isVector = R.pipe(
  matchVector,
  R.length,
  R.lt(0),
);

export const getVectorType = R.pipe(
  matchVector,
  R.nth(1),
);
