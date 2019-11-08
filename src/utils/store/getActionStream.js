import * as R from 'ramda';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

import { STORE_UPDATE_EVENT } from './constants';

const getActionStream = R.once(
  () => fromEvent(document, STORE_UPDATE_EVENT).pipe(map(R.prop('detail'))),
);

export default getActionStream;
