import { RuleTester } from 'eslint';

import { ValidationMode, rule } from '../src/ts-expect-error-validator';

const ruleTester = new RuleTester();

ruleTester.run('no-empty-expect-error', rule, {
  valid: [
    {
      code: '// This is a valid comment',
    },
    {
      code: '// @ts-ignore - Ts ignore should be skipped',
    },
    {
      code: '// @ts-expect-error [TS123] - This is a valid error',
    },
    {
      code: `// @ts-expect-error [TS123] - This is a valid error
      // @ts-expect-error [TS456] - This is another valid error`,
    },
    {
      code: `// @ts-expect-error [TS123, TS124] - This are valid errors`,
    },
    {
      code: '// @ts-expect-error [TS123 - This is a valid error]',
      options: [{ validationMode: ValidationMode.STRICT }],
    },
    {
      code: 'var myNum = 1; //@ts-expect-error [TS123 - This is a valid error]',
      options: [{ validationMode: ValidationMode.STRICT }],
    },
    {
      code: '// @ts-expect-error [TS123 - This is a valid error, TS124 - This is a second valid error]',
      options: [{ validationMode: ValidationMode.STRICT }],
    },
  ],
  invalid: [
    {
      code: '// @ts-expect-error',
      errors: [
        {
          messageId: 'missingTsDeclaration',
        },
      ],
    },
    {
      code: '// @ts-expect-error [INVALID]',
      errors: [
        {
          messageId: 'invalidTSErrorCode',
          data: {
            position: '0',
          },
        },
      ],
    },
    {
      code: '// @ts-expect-error [INVALID-This is an invalid error]',
      errors: [
        {
          messageId: 'invalidTSErrorCode',
          data: {
            position: '0',
          },
        },
      ],
    },
    {
      code: '// @ts-expect-error [TS123 -]',
      options: [{ validationMode: ValidationMode.STRICT }],
      errors: [
        {
          messageId: 'invalidTSErrorDescription',
          data: {
            tsCode: 'TS123',
          },
        },
      ],
    },
    {
      code: `// @ts-expect-error [TS123] - This is a valid error
      // @ts-expect-error [INVALID-This is an invalid error]`,
      errors: [
        {
          messageId: 'invalidTSErrorCode',
          data: {
            position: '0',
          },
        },
      ],
    },
    {
      code: '// @ts-expect-error [TS123 - ] - Code is valid but message is empty',
      options: [{ validationMode: ValidationMode.STRICT }],
      errors: [
        {
          messageId: 'invalidTSErrorDescription',
          data: {
            tsCode: 'TS123',
          },
        },
      ],
    },
  ],
});
