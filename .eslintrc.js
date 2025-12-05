/**
 * External dependencies
 */
const eslintConfig = require( '@wordpress/scripts/config/.eslintrc.js' );

/**
 * Internal dependencies
 */
const { fromResourcesRoot } = require( './resources/build/utils' );

module.exports = {
	...eslintConfig,
	rules: {
		'react/react-in-jsx-scope': 'off',
	},
	settings: {
		'import/resolver': {
			alias: {
				map: [
					[ '@scripts', fromResourcesRoot( 'scripts' ) ],
					[ '@styles', fromResourcesRoot( 'styles' ) ],
					[ '@images', fromResourcesRoot( 'images' ) ],
					[ '@fonts', fromResourcesRoot( 'fonts' ) ],
				],
				extensions: [ '.js', '.jsx', '.ts', '.tsx', '.scss' ],
			},
		},
	},
};
