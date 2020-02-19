/* eslint-disable */
import { dumps, loads } from './tl';

export { default as createAuthorizationKey } from './createAuthorizationKey';
export { default as sendAuthCode } from './sendAuthCode';
export { default as ping } from './ping';
export { default as httpWait } from './httpWait';
export { default as seqNoGenerator } from './seqNoGenerator';
export { default as getNearestDc } from './getNearestDc';

export const tl = { dumps, loads };
export const tlDumps = dumps;
export const tlLoads = loads;

