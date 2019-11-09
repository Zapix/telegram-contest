const path = require('path');

module.exports = {
  env: {
    browser: true,
    es6: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-underscore-dangle': ['error', { 'allow': ['_node', '_component', '__vnode', '__']}]
  },
  plugins: [
    'jest',
  ],
  'settings': {
    'import/resolver': 'webpack',
  },
};
