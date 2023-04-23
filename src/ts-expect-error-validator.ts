import { Rule } from 'eslint';
import * as ESTree from 'estree';

export enum ValidationMode {
  STRICT = 'strict',
  DEFAULT = 'default',
}

export const TS_EXPECT_ERROR = '@ts-expect-error';

function isTsCode(code: string): boolean {
  return code.startsWith('TS');
}

export const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforces the `@ts-expect-error` comment format',
      category: 'Possible Errors',
      recommended: true,
    },
    messages: {
      invalidTSErrorDescription: `Invalid TS error description for the {{ tsCode }} TS code. An example {{ tsCode }} - Object is possibly 'undefined'`,
      invalidTSErrorCode: `Invalid TS code at {{ position }} position in array. An example TS2532`,
      missingTsDeclaration: `Each ${TS_EXPECT_ERROR} should have TS code{{ description }}. An example {{ example }}`,
    },
    schema: [
      {
        type: 'object',
        properties: {
          validationMode: {
            enum: Object.values(ValidationMode),
            default: ValidationMode.DEFAULT,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create: (context: Rule.RuleContext): Rule.RuleListener => {
    const { validationMode } = context.options[0] || {
      validationMode: ValidationMode.DEFAULT,
    };
    const sourceCode = context.getSourceCode();

    return {
      Program(): void {
        const comments: readonly ESTree.Comment[] = sourceCode.getAllComments();

        comments.forEach((comment: ESTree.Comment): void => {
          const tsExpectErrorIndex = comment.value.indexOf(TS_EXPECT_ERROR);

          if (tsExpectErrorIndex === -1) {
            return;
          }

          if (comment.loc === undefined || comment.loc === null) {
            throw new Error('Cannot find a comment location');
          }

          const commentText = comment.value.trim();
          const tsExpectedErrorsInfo = commentText
            .substring(tsExpectErrorIndex)
            .split('[')[1]
            ?.split(']')[0]
            ?.trim();

          if (tsExpectedErrorsInfo === undefined) {
            context.report({
              loc: comment.loc,
              messageId: 'missingTsDeclaration',
              data:
                validationMode === ValidationMode.DEFAULT
                  ? { description: '', example: `${TS_EXPECT_ERROR} [TS123]` }
                  : {
                      description: ' and error description',
                      example: `${TS_EXPECT_ERROR} [TS2532 - Object is possibly 'undefined']`,
                    },
            });

            return;
          }

          let position = 0;

          for (const tsExpectedErrorInfo of tsExpectedErrorsInfo
            .replaceAll(' ', '')
            .split(',')) {
            const [tsCode, message] = tsExpectedErrorInfo.split('-');

            if (tsCode === undefined || isTsCode(tsCode) === false) {
              context.report({
                loc: comment.loc,
                messageId: 'invalidTSErrorCode',
                data: {
                  position: position.toString(),
                },
              });

              return;
            }

            if (
              ValidationMode.STRICT === validationMode &&
              (message === undefined || message.trim().length === 0)
            ) {
              context.report({
                loc: comment.loc,
                messageId: 'invalidTSErrorDescription',
                data: {
                  tsCode,
                },
              });
            }

            position++;
          }
        });
      },
    };
  },
};

module.exports.rules = {
  'no-empty-expect-error': rule,
};
