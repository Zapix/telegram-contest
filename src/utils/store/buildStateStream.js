import { scan } from 'rxjs/operators';
import getActionStream from './getActionStream';
/**
 * Builds stream that will produce new state after each action
 * @param {Function} reducer
 */
function buildStateStream(reducer) {
  const action$ = getActionStream();
  return action$.pipe(scan(reducer, null));
}

export default buildStateStream;
