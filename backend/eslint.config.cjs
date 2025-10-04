// Flat ESLint config for backend (ESLint v9)
// CommonJS flat config for ESLint v9 (avoid ESM import issues on Node without type:module)
// Docs: https://eslint.org/docs/latest/use/configure/configuration-files-new
const js = require("@eslint/js");
const globals = require("globals");

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];
