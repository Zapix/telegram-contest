/* eslint-disable */
import { dumps, loads } from './tl';

export { default as MTProto } from './MTProto';
export { constructorFromSchema, methodFromSchema } from './tl';

export const tlDumps = dumps;
export const tlLoads = loads;

