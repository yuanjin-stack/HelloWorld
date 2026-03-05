import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'

const tsRecommendedRules = Object.assign(
  {},
  ...tseslint.configs.recommended.map((c) => c.rules ?? {}),
)

const vueRecommended = pluginVue.configs['flat/recommended']
const vueFileConfig = vueRecommended.find((c) => Array.isArray(c.files) && c.files.includes('**/*.vue'))
const vueRules = Object.assign({}, ...vueRecommended.map((c) => c.rules ?? {}))

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: tsRecommendedRules,
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueFileConfig?.languageOptions?.parser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { vue: pluginVue, '@typescript-eslint': tseslint.plugin },
    processor: vueFileConfig?.processor,
    rules: {
      ...vueRules,
      ...tsRecommendedRules,
      'vue/multi-word-component-names': 'off',
    },
  },
  eslintConfigPrettier,
]
