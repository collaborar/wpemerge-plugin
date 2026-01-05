/**
 * External dependencies
 */
const eslintConfig = require( '@wordpress/scripts/config/.eslintrc.js' );

/**
 * Internal dependencies
 */
const { resourcesPath } = require( './resources/build/utils' );

module.exports = {
	...eslintConfig,
	rules: {
		'react/react-in-jsx-scope': 'off',
	},
	settings: {
		'import/resolver': {
			alias: {
				map: [
					[ '@scripts', resourcesPath( 'scripts' ) ],
					[ '@styles', resourcesPath( 'styles' ) ],
					[ '@images', resourcesPath( 'images' ) ],
					[ '@fonts', resourcesPath( 'fonts' ) ],
				],
				extensions: [ '.js', '.jsx', '.ts', '.tsx', '.scss' ],
			},
		},
	},
};
