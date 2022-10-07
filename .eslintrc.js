module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/all",
    "plugin:react/jsx-runtime",
    "eslint-config-prettier",
  ],
  globals: {
    chrome: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "react", "simple-import-sort"],
  rules: {
    "@typescript-eslint/no-var-requires": "off",
    "linebreak-style": ["error", "unix"],
    "react/jsx-filename-extension": ["error", { extensions: [".tsx", ".js"] }],
    "react/jsx-max-depth": "off",
    "react/jsx-no-literals": "off",
    semi: ["error", "never"],
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": "error",
    "sort-keys": ["error"],
  },
}
