// @ts-nocheck

import eslint from '@eslint/js';
import nuxt from '@nuxtjs/eslint-config-typescript';
import unusedImports from 'eslint-plugin-unused-imports';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...tseslint.configs.stylisticTypeChecked,
	...pluginVue.configs['flat/essential'],
	{
		languageOptions: {
			parser: vueParser,
			parserOptions: {
				parser: '@typescript-eslint/parser',
				project: true,
				ecmaVersion: 'latest',
				sourceType: 'module',
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: ['.vue']
			}
		}
	},
	{
		plugins: {
			'unused-imports': unusedImports
		}
	},
	{
		rules: {
			...nuxt.rules,
			'no-empty': 'warn',
			'@typescript-eslint/indent': 'off',
			'@typescript-eslint/non-nullable-type-assertion-style': 'off',
			'@typescript-eslint/prefer-optional-chain': 'off',
			'@typescript-eslint/no-inferrable-types': 'off',
			'@typescript-eslint/consistent-type-definitions': 'off',
			'no-console': ['warn'],
			'prefer-template': ['warn'],
			'vue/no-v-html': 'off',
			'vue/no-deprecated-slot-attribute': 'off',
			'prefer-arrow-callback': 'warn',
			'arrow-body-style': ['warn', 'always'],
			'@typescript-eslint/prefer-nullish-coalescing': 'error',
			'@typescript-eslint/comma-spacing': ['error', { before: false, after: true }],
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/consistent-type-imports': 'error',
			'spaced-comment': 'off',
			'import/order': 'off',
			//'unused-imports/no-unused-imports': 'error',
			//'unused-imports/no-unused-vars': [
			//	'warn',
			//	{
			//		vars: 'all',
			//		varsIgnorePattern: '^_',
			//		args: 'after-used',
			//		argsIgnorePattern: '^_'
			//	}
			//],
			'prettier/prettier': 'off',
			'vue/multi-word-component-names': 'off'
		},
		settings: {
			'import/parsers': {
				'@typescript-eslint/parser': ['.ts', '.vue', '.tsx']
			},
			'import/resolver': {
				typescript: {}
			}
		}
	},
	{
		ignores: ['node_modules', '.nuxt', '.output', 'dist', 'tailwind.config.js', 'presets']
	}
);
