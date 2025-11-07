// eslint.config.js (root)
import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  // Default: client-side React files
  {
    files: ["client/**/*.{js,jsx}", "src/**/*.{js,jsx}"],
    ignores: ["**/dist/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.browser }
    },
    plugins: { react: reactPlugin, "react-refresh": reactRefresh },
    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      // You can keep this on or off; see note below
      "react-refresh/only-export-components": "off"
    },
    settings: { react: { version: "detect" } }
  },

  // Node: everything under server/ uses Node globals (process, __dirname, etc.)
  {
    files: ["server/**/*.js"],
    ignores: ["server/storage/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.node }
    },
    rules: {
      ...js.configs.recommended.rules
    }
  }
];
