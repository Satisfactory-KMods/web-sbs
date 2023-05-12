/* eslint-disable no-undef */
module.exports = {
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:react/jsx-runtime",
		"plugin:jsx-a11y/recommended",
		"plugin:import/typescript",
		"plugin:@typescript-eslint/recommended"
	],
	root: true,
	settings: {
		react: {
			version: "detect"
		}
	},
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: "latest",
		sourceType: "module"
	},
	plugins: [
		"react",
		"import",
		"jsx-a11y",
		"react-hooks",
		"@typescript-eslint"
	],
	rules: {
		"brace-style": "off",
		"@typescript-eslint/brace-style": [ "warn", "1tbs", {
			"allowSingleLine": false
		} ],

		"func-call-spacing": "off",
		"@typescript-eslint/func-call-spacing": "warn",

		"object-curly-spacing": "off",
		"@typescript-eslint/object-curly-spacing": [ "warn", "always" ],

		"semi": "off",
		"@typescript-eslint/semi": "error",

		"keyword-spacing": "off",
		"@typescript-eslint/keyword-spacing": [ "error", { "overrides": {
			"if": { "after": false },
			"for": { "after": false },
			"while": { "after": false },
			"static": { "after": false },
			"as": { "after": false },
			"catch": { "after": false }
		} } ],

		"space-before-blocks": "off",
		"@typescript-eslint/space-before-blocks": "warn",

		"space-before-function-paren": "off",
		"@typescript-eslint/space-before-function-paren": [ "warn", "never" ],

		"@typescript-eslint/type-annotation-spacing": "warn",
		"@typescript-eslint/no-import-type-side-effects": "warn",
		"@typescript-eslint/indent": [ "warn", "tab" ],
		"no-cond-assign": [ "error", "always" ],
		"no-empty": 0,
		"no-trailing-spaces": "warn",
		"template-curly-spacing": [ "error", "always" ],
		"space-in-parens": [ "warn", "always" ],
		"indent": "off",
		"no-tabs": 0,
		"no-restricted-imports":"warn",
		"react/jsx-closing-bracket-location": [ "warn", "after-props" ],
		"array-bracket-spacing": [ "warn", "always" ],
		"computed-property-spacing": [ "warn", "always" ],
		"@typescript-eslint/consistent-type-imports": "error",
		"semi-style": [
			"error",
			"last"
		],
		"array-element-newline": "off",
		"no-mixed-spaces-and-tabs": 0,
		"prefer-const": "warn",
		"no-control-regex": "off",
		"no-var": "off",
		"@typescript-eslint/no-var-requires": "off",
		"@typescript-eslint/no-non-null-asserted-optional-chain": "off",
		"@typescript-eslint/ban-ts-comment": "off",
		"@typescript-eslint/no-empty-function": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-unused-vars": [
			"off",
			{
				"argsIgnorePattern": "^_",
				"varsIgnorePattern": "^_",
				"caughtErrorsIgnorePattern": "^_"
			}
		],
		"react/jsx-curly-brace-presence": [
			"error",
			{ "props": "never", "children": "never" }
		],
		"react/jsx-curly-spacing": [ "warn", {
			"when": "always",
			"children": {
				"when": "always"
			}
		} ],
		"react/jsx-props-no-multi-spaces": [ "warn" ],
		"react/jsx-tag-spacing": [ "warn" ],
		"jsx-a11y/no-static-element-interactions": "off",
		"jsx-a11y/click-events-have-key-events": "off",
		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "warn",
		"react/jsx-first-prop-new-line": [ "error", "never" ],
		"react/jsx-curly-newline": [ "error", {
			"multiline": "consistent",
			"singleline": "consistent"
		} ]
	}
};
