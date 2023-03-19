module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  extends: ['plugin:vue/strongly-recommended', 'eslint:recommended', '@vue/typescript/recommended', 'prettier'],
  plugins: ['@typescript-eslint', 'functional', 'prettier'],
  rules: {
    '@typescript-eslint/await-thenable': 'error',
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'functional/no-let': 'error',
    'no-var': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'no-console': ['error'],
    eqeqeq: ['error', 'always'],
    'vue/eqeqeq': ['error', 'always'],
    'vue/no-required-prop-with-default': ['error'],
  },
};
