module.exports = [
  {
    files: ["JS/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        alert: "readonly",
        document: "readonly",
        localStorage: "readonly",
        module: "readonly",
        window: "readonly",
      },
    },
    rules: {
      semi: ["error", "always"],
      "no-unused-vars": "warn",
    },
  },
];
