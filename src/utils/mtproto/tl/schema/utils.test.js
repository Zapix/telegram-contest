import {
  intToUint,
  getParseSchemaById,
  isFromSchemaFactory,
  getSchemaForMethod,
  getSchemaForConstructor,
} from './utils';

import oldSchema from './layer5.json';
import { hexToArrayBuffer } from '../../utils';

describe('utils', () => {
  describe('intToUint', () => {
    test('571849917', () => {
      expect(intToUint(571849917)).toEqual(0x2215bcbd);
    });

    test('-486486981', () => {
      expect(intToUint(-486486981)).toEqual(0xe300cc3b);
    });

    test('1988976461', () => {
      expect(intToUint(1988976461)).toEqual(0x768d5f4d);
    });
  });

  describe('getParseSchemaByid', () => {
    describe('old schema parser', () => {
      test('find for constructor', () => {
        expect(getParseSchemaById(oldSchema, 0x2215bcbd)).toEqual({
          id: 0x2215bcbd,
          predicate: 'auth.sentCode',
          params: [
            {
              name: 'phone_registered',
              type: 'Bool',
            },
            {
              name: 'phone_code_hash',
              type: 'string',
            },
          ],
          type: 'auth.SentCode',
        });
      });

      test('find for constructor with uint', () => {
        expect(getParseSchemaById(oldSchema, 0xe300cc3b)).toEqual({
          id: 0xe300cc3b,
          predicate: 'auth.checkedPhone',
          params: [
            {
              name: 'phone_registered',
              type: 'Bool',
            },
            {
              name: 'phone_invited',
              type: 'Bool',
            },
          ],
          type: 'auth.CheckedPhone',
        });
      });

      test('find for method', () => {
        expect(getParseSchemaById(oldSchema, 0x768d5f4d)).toEqual({
          id: 0x768d5f4d,
          method: 'auth.sendCode',
          params: [
            {
              name: 'phone_number',
              type: 'string',
            },
            {
              name: 'sms_type',
              type: 'int',
            },
            {
              name: 'api_id',
              type: 'int',
            },
            {
              name: 'api_hash',
              type: 'string',
            },
            {
              name: 'lang_code',
              type: 'string',
            },
          ],
          type: 'auth.SentCode',
        });
      });

      test('not found', () => {
        expect(getParseSchemaById(oldSchema, 0x00110000)).toBeUndefined();
      });
    });
  });

  describe('isFromSchemaFactory', () => {
    describe('layer5 schema', () => {
      const isLoadableBySchema = isFromSchemaFactory(oldSchema);
      test('found constructor', () => {
        const buffer = hexToArrayBuffer('3bcc00e3');
        expect(isLoadableBySchema(buffer)).toEqual(true);
      });

      test('found method', () => {
        const buffer = hexToArrayBuffer('4d5f8d76');
        expect(isLoadableBySchema(buffer)).toEqual(true);
      });
    });
  });

  describe('getSchemaForMethod', () => {
    it('layer5 schema', () => {
      expect(getSchemaForMethod(oldSchema, 'auth.sendCode')).toEqual({
        id: 1988976461,
        method: 'auth.sendCode',
        params: [
          {
            name: 'phone_number',
            type: 'string',
          },
          {
            name: 'sms_type',
            type: 'int',
          },
          {
            name: 'api_id',
            type: 'int',
          },
          {
            name: 'api_hash',
            type: 'string',
          },
          {
            name: 'lang_code',
            type: 'string',
          },
        ],
        type: 'auth.SentCode',
      });
    });
  });

  describe('getSchemaForConstructor', () => {
    describe('layer5 schema', () => {
      expect(getSchemaForConstructor(oldSchema, 'photos.photosSlice')).toEqual({
        id: 352657236,
        predicate: 'photos.photosSlice',
        params: [
          {
            name: 'count',
            type: 'int',
          },
          {
            name: 'photos',
            type: 'Vector<Photo>',
          },
          {
            name: 'users',
            type: 'Vector<User>',
          },
        ],
        type: 'photos.Photos',
      });
    });
  });
});
