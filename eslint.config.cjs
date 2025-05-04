module.exports = [
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 2021,  // or whichever version you prefer
			sourceType: 'module', // for ES6+ imports/exports
		},
		rules: {
			'semi': ['error', 'always'],
			'quotes': ['error', 'single'],
			// Add more rules as needed
		},
	},
];