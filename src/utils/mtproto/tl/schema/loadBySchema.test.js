import * as R from 'ramda';
import { hexToArrayBuffer } from '../../utils';

import layer5 from './layer5.json';
import loadBySchema from './loadBySchema';
import { CONSTRUCTOR_KEY, TYPE_KEY } from '../../constants';

describe('loadBySchema', () => {
  describe('user api layer 5', () => {
    const load = R.partial(loadBySchema, [layer5]);
    describe('auth.sentCode', () => {
      const hexStr = 'bdbc1522b57572991231653833383137316536633537323932353000';
      const arrayBuffer = hexToArrayBuffer(hexStr);

      it('load without offset', () => {
        expect(load(arrayBuffer)).toMatchObject({
          [CONSTRUCTOR_KEY]: 'auth.sentCode',
          [TYPE_KEY]: 'auth.SentCode',
          phone_registered: true,
          phone_code_hash: '1e838171e6c5729250',
        });
      });

      it('load with offset', () => {
        expect(load(arrayBuffer, true)).toEqual({
          value: {
            [CONSTRUCTOR_KEY]: 'auth.sentCode',
            [TYPE_KEY]: 'auth.SentCode',
            phone_registered: true,
            phone_code_hash: '1e838171e6c5729250',
          },
          offset: 28,
        });
      });
    });
  });
});
