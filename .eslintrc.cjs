/* eslint-disable no-undef */
module.exports = {
	extends: ['eslint:recommended', 'next', 'plugin:@next/next/recommended', 'plugin:react/recommended', 'plugin:react/jsx-runtime', 'plugin:jsx-a11y/recommended', 'plugin:import/typescript', 'plugin:@typescript-eslint/recommended', 'prettier'],
	root: true,
	settings: {
		react: {
			version: 'detect'
		}
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: ['./tsconfig.json'],
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	plugins: ['react', 'import', 'jsx-a11y', 'react-hooks', '@typescript-eslint', 'prettier'],
	rules: {
		'prettier/prettier': 'error',
		'arrow-body-style': 'warn',
		'prefer-arrow-callback': 'warn',
		'no-console': ['warn', { allow: ['warn', 'info', 'error'] }],
		'@typescript-eslint/comma-spacing': ['error', { before: false, after: true }],
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: ['function'],
				format: ['camelCase', 'PascalCase'],
				leadingUnderscore: 'allow',
				trailingUnderscore: 'allow'
			},
			{
				selector: ['variable'],
				format: ['camelCase', 'PascalCase'],
				types: ['function'],
				leadingUnderscore: 'allow',
				trailingUnderscore: 'allow'
			},
			{
				selector: ['variable', 'method'],
				format: ['camelCase', 'UPPER_CASE', 'snake_case'],
				leadingUnderscore: 'allow',
				trailingUnderscore: 'allow'
			},
			{
				selector: 'variable',
				modifiers: ['exported'],
				types: ['function'],
				format: ['camelCase', 'PascalCase']
			},
			{
				selector: ['typeLike', 'class'],
				format: ['PascalCase'],
				trailingUnderscore: 'allow'
			}
		],
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-unused-vars': [
			'off',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_'
			}
		],
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'error'
	}
};
