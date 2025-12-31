/**
 * External dependencies.
 */
const path = require( 'path' );

/**
 * Retrieve absolute path from project root.
 *
 * @param  {...string} paths
 */
const rootPath = ( ...paths ) =>
	path.resolve( path.dirname( __dirname ), '../..', ...paths );

/**
 * Retrieve absolute path from resources folder.
 *
 * @param  {...string} paths
 */
const resourcesPath = ( ...paths ) =>
	path.resolve( path.dirname( __dirname ), '../', ...paths );

module.exports = {
	rootPath,
	resourcesPath,
};
