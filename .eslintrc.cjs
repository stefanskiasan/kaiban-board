module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react/jsx-runtime', 'plugin:react-hooks/recommended', 'plugin:storybook/recommended'],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: 'detect' } },
  plugins: ['react-refresh'],
  globals: {
    process: true,
    import: true
  },
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // Permit import React although not used directly
    'no-unused-vars': ['error', { 
      'varsIgnorePattern': 'React' 
    }],
    // Change prop-types to warning instead of error
    'react/prop-types': 'warn',
    // Allow lexical declarations in case blocks
    'no-case-declarations': 'off'
  },
}
