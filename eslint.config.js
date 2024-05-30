import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: ['build/**/*', 'dist/**/*'],
    languageOptions: { globals: globals.browser },
    rules: {
      'prefer-const': 'error',
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
]
