module.exports = {
  env: {
    browser: false,
    commonjs: true,
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 13,
  },
  root: true,
  rules: {
    'no-unreachable': 1,
    'no-empty': 1,
    'no-undef': 1,
    'import/no-dynamic-require': 0,
    'global-require': 0,
    'import/prefer-default-export': 0,
    'no-underscore-dangle': 0,
    'no-await-in-loop': 0,
    'no-restricted-syntax': 0,
    'no-return-await': 0,
    'no-console': 0,
    'no-unused-vars': 0,
    'prettier/prettier': [
      'off',
      {
        trailingComma: 'es5',
        singleQuote: true,
        printWidth: 80,
        tabWidth: 2,
        endOfLine: 'lf',
        arrowParens: 'always',
      },
    ],
  },
}
