module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'global-require': 'off',
    'max-classes-per-file': 'off',
    'max-len': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    'no-case-declarations': 'off',
  },
};
