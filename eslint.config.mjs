import globals from 'globals'
import js from '@eslint/js'
import ts from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import pluginPrettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    plugins: { js, '@typescript-eslint': ts },
    // Include the recommended configuration directly, no need for 'extends'
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      semi: 'off', // Disable ESLint's semi rule
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    plugins: { prettier: pluginPrettier },
    rules: {
      ...configPrettier.rules, // Disable conflicting ESLint rules
      'prettier/prettier': 'error', // Treat Prettier formatting issues as ESLint errors
    },
  },
]
