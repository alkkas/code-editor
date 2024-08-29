// const eslintConfigPrettier= require("eslint-config-prettier");

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:storybook/recommended"
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "react", "fsd-import"],
  rules: {
    "no-console": "warn",
    "fsd-import/fsd-relative-path": "error",
    "fsd-import/public-api-imports": "error",
    "fsd-import/layer-imports": ["error", { alias: "@" }],
    "@typescript-eslint/no-unused-vars": "warn",
  },
}
