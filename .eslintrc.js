module.exports = {
	'env': {
		'es6': true,
		'node': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:prettier/recommended'
	],
	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly'
	},
	'parserOptions': {
		'ecmaVersion': 2017,
		'sourceType': 'module',
		'ecmaFeatures': {
      'modules': true
		}
	},
	'plugins': [
		'prettier'
	],
	'rules': {
		'indent': [
			'off'
		],
		'linebreak-style': [
			'error',
			'windows'
		],
		'semi': [
			'error',
			'always'
		],
		'curly': [
			'error',
			'multi'
		],
		'require-await': [
			'error'
		],
		'sort-imports': [
			'error',
			{
				'memberSyntaxSortOrder': ['none', 'single', 'all', 'multiple'],
				'ignoreDeclarationSort': true
			}
		],
		'no-trailing-spaces': [
			'error'
		],
		'prettier/prettier': [
			'error',
			{
				'singleQuote': true,
				'tabWidth': 2,
				'printWidth': 150,
				'useTabs': true,
				'trailingComma': 'none',
				'bracketSpacing': true,
				'arrowParens': 'always',
				'parser': 'typescript',
				'endOfLine': 'crlf'
			}
		]
	}
};