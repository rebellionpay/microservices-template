module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/naming-convention': ['error', {
      "selector": "variable",
      "format": ["camelCase", "UPPER_CASE"]
    }, {
      "selector": "variable",
      "types": ["boolean"],
      "format": ["PascalCase"],
      "prefix": ["is", "should", "has", "can", "did", "will"]
    }, {
      "selector": "class",
      "format": ["PascalCase"]
    }, {
      "selector": "property",
      "format": ["camelCase", "UPPER_CASE"],
      "leadingUnderscore": "allow"
    }],
    'semi': 'off',
    '@typescript-eslint/semi': ['error']
  },
};
