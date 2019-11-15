import * as R from 'ramda';

const defaultRequestOpts = {
  method: 'POST',
  mode: 'cors',
};

const sendRequest = R.pipe(
  R.set(R.lensProp('body'), R.__, defaultRequestOpts),
  R.curryN(2)(fetch)('http://149.154.167.40/apiw'),
);

export default sendRequest;