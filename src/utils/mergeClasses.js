import * as R from 'ramda';

const getClass = R.cond([
  [
    R.allPass([
      R.is(Object),
      R.has('class'),
    ]),
    R.prop('class'),
  ],
  [R.T, R.identity],
]);

const mergeClasses = R.unapply(
  R.pipe(
    R.map(getClass),
    R.flatten,
    R.filter(R.is(String)),
    R.join(' '),
  ),
);

export default mergeClasses;
