import * as R from 'ramda';

import { loadString } from '../string';
import { loadInt } from '../int';
import { loadBigInt } from '../bigInt';
import { loadBool } from '../bool';
import { loadVector } from '../vector';

import { getParseSchemaById } from './utils';
import { getConstructor } from '../utils';
import { buildLoadFunc, withConstantOffset } from '../../utils';
import { CONSTRUCTOR_KEY, METHOD_KEY, TYPE_KEY } from '../../constants';

const getSchemaFromBufferArray = R.unapply(R.pipe(
  R.of,
  R.ap([R.nth(0), R.pipe(R.nth(1), getConstructor)]),
  R.apply(getParseSchemaById),
));

const bareTypeLoaders = {
  bool: loadBool,
  Bool: loadBool,
  int: loadInt,
  long: loadBigInt,
  string: loadString,
};

const isBareType = R.has(R.__, bareTypeLoaders);
const getBareTypeLoader = R.prop(R.__, bareTypeLoaders);

const matchVector = R.match(/Vector<(\w+)>/);

const isVector = R.pipe(
  matchVector,
  R.length,
  R.lt(0),
);

const getVectorType = R.pipe(
  matchVector,
  R.nth(1),
);

const getTypePair = R.pipe(
  R.of,
  R.ap([
    R.always(TYPE_KEY),
    R.pipe(
      R.prop('type'),
      R.always,
      R.partialRight(withConstantOffset, [4]),
    ),
  ]),
);

const getObjectConstructorPair = R.cond([
  [
    R.has('predicate'),
    R.pipe(
      R.of,
      R.ap([
        R.always(CONSTRUCTOR_KEY),
        R.pipe(
          R.prop('predicate'),
          R.always,
          R.partialRight(withConstantOffset, [0]),
        ),
      ]),
    ),
  ],
  [
    R.T,
    R.pipe(
      R.of,
      R.ap([
        R.always(METHOD_KEY),
        R.pipe(
          R.prop('method'),
          R.always,
          R.partialRight(withConstantOffset, [0]),
        ),
      ]),
    ),
  ],
]);


/**
 * Loads object from buffer array by schema. First of all tries to find how to parse array buffer by
 * first 4 bytes (int 32). Searches way to load it in both constructors and methods ten
 * load param by param. if param has got bare type (int, string, bool) then load them.
 * if param is complex type then load with recursive, same for vector types
 * @param {{constucors: *, methods: *}} schema
 * @param {ArrayBuffer} buffer
 * @param {boolean} withOffset
 */
function loadBySchema(schema, buffer, withOffset) {
  function getLoaderForType(type) {
    return R.cond([
      [isBareType, getBareTypeLoader],
      [isVector, R.pipe(getVectorType, getLoaderForType, R.of, R.partial(loadVector))],
      [R.T, R.always(R.partial(loadBySchema, [schema]))],
    ])(type);
  }

  /**
   * Takes schema to build load function, returns list of pairs with name of attribute and function
   * to load it
   * @param {*} schema - how load object
   * @returns {Array<[string, Function]>}
   */
  const getLoadPairs = R.pipe(
    R.prop('params'),
    R.map(
      R.pipe(
        R.of,
        R.ap([
          R.prop('name'),
          R.pipe(
            R.prop('type'),
            getLoaderForType,
          ),
        ]),
      ),
    ),
  );

  const getLoadFuncs = R.pipe(
    R.partial(getSchemaFromBufferArray, [schema]),
    R.of,
    R.ap([getTypePair, getObjectConstructorPair, getLoadPairs]),
    (x) => [x[0], x[1], ...x[2]],
    buildLoadFunc,
  );

  return getLoadFuncs(buffer)(buffer, withOffset);
}

export default loadBySchema;
