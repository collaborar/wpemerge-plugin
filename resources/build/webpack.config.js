/**
 * External dependencies
 */
const webpack = require( 'webpack' );
const { merge: mergeWebpackConfig } = require( 'webpack-merge' );
const { getAsBooleanFromENV } = require( '@wordpress/scripts/utils' );
const webpackConfig = require( '@wordpress/scripts/config/webpack.config' );
const SvgSpriteLoaderPlugin = require( 'svg-sprite-loader/plugin' );

/**
 * Internal dependencies
 */
const {
	getWebpackEntryPoints,
	fromProjectRoot,
	fromResourcesRoot,
	fromResoucesImagesRoot,
} = require( './utils' );

const hasExperimentalModulesFlag = getAsBooleanFromENV(
	'WP_EXPERIMENTAL_MODULES'
);
const isProduction = process.env.NODE_ENV === 'production';

/** @type {webpack.Configuration} */
const baseConfig = {
	name: 'wpemerge',

	output: {
		path: fromProjectRoot( 'dist' ),
	},

	resolve: {
		alias: {
			'@scripts': fromResourcesRoot( 'scripts' ),
			'@styles': fromResourcesRoot( 'styles' ),
			'@images': fromResourcesRoot( 'images' ),
			'@fonts': fromResourcesRoot( 'fonts' ),
		},
		extensions: [ '.css', '.scss' ],
	},
};

/** @type {webpack.Configuration} */
const config = {
	...baseConfig,

	entry: getWebpackEntryPoints( 'script' ),

	module: {
		rules: [
			{
				test: /\.svg$/,
				include: fromResoucesImagesRoot( 'sprite-svg' ),
				use: [
					{
						loader: 'svg-sprite-loader',
						options: {
							extract: true,
							spriteFileName: 'sprite.svg',
						},
					},
				],
			},
		],
	},

	devServer: isProduction
		? undefined
		: {
				devMiddleware: {
					writeToDisk: true,
				},
				allowedHosts: 'auto',
				host: 'localhost',
				port: 8887,
				proxy: {
					'/dist': {
						pathRewrite: {
							'^/dist': '',
						},
					},
				},
		  },

	plugins: [
		new SvgSpriteLoaderPlugin( {
			plainSprite: true,
			spriteAttrs: {
				'aria-hidden': 'true',
				style: 'display: none; visibility: hidden',
				id: '__WPEMERGE_SVG_SPRITE__',
			},
		} ),
	],
};

if ( hasExperimentalModulesFlag ) {
	const [ wpScriptConfig, wpModuleConfig ] = webpackConfig;
	const scriptConfig = mergeWebpackConfig( wpScriptConfig, config );
	const moduleConfig = mergeWebpackConfig( wpModuleConfig, {
		...baseConfig,

		entry: getWebpackEntryPoints( 'module' ),
	} );

	module.exports = [ scriptConfig, moduleConfig ];
} else {
	module.exports = mergeWebpackConfig( webpackConfig, config );
}
