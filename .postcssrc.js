/**
 * External dependencies
 */
const { hasCssnanoConfig } = require( '@wordpress/scripts/utils' )
const postcssPlugins = require( '@wordpress/postcss-plugins-preset' );

/**
 * Internal dependencies.
 */
const env = require( './resources/build/utils' );

const plugins = [
	/* @preset-begin(Tailwind CSS)
	require( '@tailwindcss/postcss' )( {} ),
	@preset-end(Tailwind CSS) */
	...postcssPlugins,
];

if ( env.isProduction ) {
	plugins.push(
		require( 'cssnano' )( {
			// Provide a fallback configuration if there's not
			// one explicitly available in the project.
			...( ! hasCssnanoConfig() && {
				preset: [
					'default',
					{
						discardComments: {
							removeAll: true,
						},
					},
				],
			} ),
		} ),
	)
}

module.exports = { plugins };
