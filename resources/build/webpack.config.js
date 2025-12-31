/**
 * External dependencies.
 */
const webpackConfig = require( '@wordpress/scripts/config/webpack.config' );
const SvgSpriteLoaderPlugin = require( 'svg-sprite-loader/plugin' );
const { merge: webpackMerge } = require( 'webpack-merge' );

/**
 * Internal dependencies.
 */
const {
	rootPath,
	resourcesPath,
	getWebpackEntryPoints,
	detectEnv,
	hasExperimentalModulesFlag,
} = require( './utils' );

const env = detectEnv();

const baseConfig = {
	name: 'wpemerge',

	output: {
		path: rootPath( 'dist' ),
	},

	resolve: {
		alias: {
			'@root': rootPath(),
			'@scripts': resourcesPath( 'scripts' ),
			'@styles': resourcesPath( 'styles' ),
			'@images': resourcesPath( 'images' ),
		},
		extensions: [ '.css', '.scss' ],
	},
};

const wpemergeConfig = {
	...baseConfig,

	entry: getWebpackEntryPoints( 'scripts' ),

	module: {
		rules: [
			/**
			 * SVG Sprite.
			 */
			{
				test: /\.svg$/,
				include: resourcesPath( 'images/sprite-svg' ),
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

	devServer: env.isProduction
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
};

if ( hasExperimentalModulesFlag ) {
	const [ __scriptConfig, __modulesConfig ] = webpackConfig;
	const scriptConfig = webpackMerge(
		__scriptConfig,
		wpemergeConfig,
	);
	const modulesConfig = webpackMerge(
		__modulesConfig,
		{
			...baseConfig,
			entry: getWebpackEntryPoints( 'module' ),
		},
	);

	module.exports = [ scriptConfig, modulesConfig ];
} else {
	module.exports = webpackMerge( webpackConfig, wpemergeConfig );
}
