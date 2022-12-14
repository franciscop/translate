/* eslint-disable import/no-commonjs */
module.exports = {
  env: {
    node: true,
    "jest/globals": true
  },
  extends: [
    "esnext"
  ],
  plugins: [
    "@typescript-eslint",
    "jest",
  ],
  parser: "@typescript-eslint/parser",
  rules: {
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    '@typescript-eslint/semi': [
      "error",
      "never"
    ],
    'no-console': [
      "error",
      {
        allow: [
          "warn",
          "error",
          "info"
        ]
      }
    ],
    'no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    '@typescript-eslint/no-unused-vars': 'off',
    "@typescript-eslint/no-floating-promises": ["warn"]
  },
  parserOptions: {
    project: ['./tsconfig.json'], // Specify it only for TypeScript files
  }
}
