import { LexModel } from '../../lex/lex.model'

const tsConfiguration: LexModel = {
  $keywords: [
    'abstract',
    'any',
    'as',
    'asserts',
    'bigint',
    'boolean',
    'break',
    'case',
    'catch',
    'class',
    'continue',
    'const',
    'constructor',
    'debugger',
    'declare',
    'default',
    'delete',
    'do',
    'else',
    'enum',
    'export',
    'extends',
    'false',
    'finally',
    'for',
    'from',
    'function',
    'get',
    'if',
    'implements',
    'import',
    'in',
    'infer',
    'instanceof',
    'interface',
    'is',
    'keyof',
    'let',
    'module',
    'namespace',
    'never',
    'new',
    'null',
    'number',
    'object',
    'out',
    'package',
    'private',
    'protected',
    'public',
    'override',
    'readonly',
    'require',
    'global',
    'return',
    'satisfies',
    'set',
    'static',
    'string',
    'super',
    'switch',
    'symbol',
    'this',
    'throw',
    'true',
    'try',
    'type',
    'typeof',
    'undefined',
    'unique',
    'unknown',
    'var',
    'void',
    'while',
    'with',
    'yield',
    'async',
    'await',
    'of',
  ],
  $operators: [
    '<=',
    '>=',
    '==',
    '!=',
    '===',
    '!==',
    '=>',
    '+',
    '-',
    '**',
    '*',
    '/',
    '%',
    '++',
    '--',
    '<<',
    '</',
    '>>',
    '>>>',
    '&',
    '|',
    '^',
    '!',
    '~',
    '&&',
    '||',
    '??',
    '?',
    ':',
    '=',
    '+=',
    '-=',
    '*=',
    '**=',
    '/=',
    '%=',
    '<<=',
    '>>=',
    '>>>=',
    '&=',
    '|=',
    '^=',
    '@',
  ],
  tokenizer: [
    [/#?[a-z_$][\w$]*/g, '$keywords', 'variables'],
    [/'.*'/g, 'string'],
    [/\/\/.*$/g, 'comments'],
  ],
}

export default tsConfiguration
