# eslint-plugin-ts-expect-error-validator

A rule that enforces proper usage and validation of TypeScript's "@ts-expect-error" comments for easier error management

## Installation

```bash
yarn add -D eslint-plugin-ts-expect-error-validator
```

## Usage

Add it to your ESLint configuration:

```json
{
  "plugins": [
    "ts-expect-error-validator"
  ],
  "rules": {
    "ts-expect-error-validator/no-empty-expect-error": "error"
  }
}
```

Configure the rule to use strict or default validation mode:

```json
{
  "plugins": [
    "ts-expect-error-validator"
  ],
  "rules": {
    "ts-expect-error-validator/no-empty-expect-error": [
      "error",
      {
        "validationMode": "strict"
      }
    ]
  }
}

```

#### Options:

| Option           | Description                                                                                                                                                                                                                        |
|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `validationMode` | Specifies the validation mode to use. Can be either `default` or `strict`. In default `mode`, only the expected error codes are validated. In `strict` mode, the error code and error message are validated. Default is `default`. |

## Rule Details

This rule enforces the following rules for `@ts-expect-error` comments:

- Each `@ts-expect-error` comment should contain at least one TypeScript error code, enclosed in square brackets (
  e.g. `[TS123]`).
- If using the `strict` validation mode, each error code should be followed by an error description, separated by a
  hyphen (e.g. `[TS2532 - Object is possibly 'undefined']`).
- The TypeScript error code should start with `TS`.

## Example Usage:

```typescript
// @ts-expect-error [TS6133] - ignore the 'myNumber' is declared but its value is never read message
let myNumber: string | undefined;

// You can also ignore more then one error for a line: 
// @ts-expect-error [TS2322, TS6133]
const object: { a: number } = { b: 5 };
```

## Hits

* There is a [package](https://github.com/pashak09/ts-expect-error-validator) for validation specified signatures.

## License

This library is released under the MIT License.