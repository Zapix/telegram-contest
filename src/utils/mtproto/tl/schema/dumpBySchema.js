import * as R from 'ramda';

import {
  isMethodObject,
  isConstuctorObject,
  getSchemaForMethod,
  getSchemaForConstructor, isVector, getVectorType, isDumpingTypeFactory,
} from './utils';
import { getEmptyArrayBuffer, buildDumpFunc } from '../../utils';
import { CONSTRUCTOR_KEY, METHOD_KEY } from '../../constants';
import { dumpInt } from '../int';
import { dumpBool } from '../bool';
import { dumpBigInt } from '../bigInt';
import { dumpString } from '../string';
import { dumpVector } from '../vector';

/**
 * Dumps message object into array buffer
 * @param {{constructors: *, methods: *}} schema - schema that should be used for dumping objects
 * @param message
 * @returns {ArrayBuffer}
 */
export default function dumpBySchema(schema, message) {
  /**
   * @param {string} type
   */
  function getDumpFunction(type) {
    return R.cond([
      [R.equals('bool'), R.always(dumpBool)],
      [R.equals('Bool'), R.always(dumpBool)],
      [R.equals('int'), R.always(dumpInt)],
      [R.equals('long'), R.always(dumpBigInt)],
      [R.equals('string'), R.always(dumpString)],
      [
        isVector,
        R.pipe(
          getVectorType,
          getDumpFunction,
          R.of,
          R.partial(dumpVector),
        ),
      ],
      [isDumpingTypeFactory(schema), R.always(R.partial(dumpBySchema, [schema]))],
      [R.T, R.always(getEmptyArrayBuffer)],
    ])(type);
  }

  /**
   * Builds function to dump param
   * @param {{name: string, type: string}} param - param of message that should be dumped
   * @returns {Function}
   */
  const buildDumpAttrFunc = R.pipe(
    R.of,
    R.ap([
      R.pipe(R.prop('name'), R.prop),
      R.pipe(R.prop('type'), getDumpFunction),
    ]),
    R.apply(R.binary(R.pipe)),
  );

  /**
   * Builds function by schema
   * @param {*} objSchema
   * @returns {Function} function to dump object
   */
  function buildDumpBySchemaFunc(objSchema) {
    return R.pipe(
      R.of,
      R.ap([
        R.pipe(R.prop('id'), dumpInt, R.always),
        R.pipe(
          R.prop('params'),
          R.map(buildDumpAttrFunc),
        ),
      ]),
      R.flatten,
      buildDumpFunc,
    )(objSchema);
  }

  return R.unapply(
    R.pipe(
      R.cond([
        [
          R.pipe(R.nth(1), isMethodObject),
          R.pipe(
            R.of,
            R.ap([
              R.pipe(
                R.of,
                R.ap([R.nth(0), R.pipe(R.nth(1), R.prop(METHOD_KEY))]),
                R.apply(getSchemaForMethod),
                buildDumpBySchemaFunc,
              ),
              R.nth(1),
            ]),
            R.apply(R.call),
          ),
        ],
        [
          R.pipe(R.nth(1), isConstuctorObject),
          R.pipe(
            R.of,
            R.ap([
              R.pipe(
                R.of,
                R.ap([R.nth(0), R.pipe(R.nth(1), R.prop(CONSTRUCTOR_KEY))]),
                R.apply(getSchemaForConstructor),
                buildDumpBySchemaFunc,
              ),
              R.nth(1),
            ]),
            R.apply(R.call),
          ),
        ],
      ]),
    ),
  )(schema, message);
}
