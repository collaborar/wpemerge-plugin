/**
 * External dependencies.
 */
const path = require( 'path' );
const { sync: glob } = require( 'fast-glob' );
const {
	hasProjectFile,
	getProjectSourcePath,
	getWebpackEntryPoints: getEntryPoints
} = require( '@wordpress/scripts/utils' );

/**
 * Internal dependencies.
 */
const { resourcesPath } = require('./file');

function getWebpackEntryPoints( buildType ) {
	return () => {
		// Detect block-json entry points from source path.
		const entryPoints = ! hasProjectFile( getProjectSourcePath() )
			? {}
			: getEntryPoints( buildType )();

		if ( hasProjectFile( 'resources/scripts' ) ) {
			// Handle each folder inside `resources/scripts` as an
			// entry for webpack.
			//
			// If you have a `shared` folder, it will be ignored.
			const entries = glob( '**/index.[jt]s?(x)', {
				absolute: true,
				ignore: [ 'shared/**' ],
				cwd: resourcesPath( 'scripts' )
			} );

			for ( const entry of entries ) {
				entryPoints[
					path.basename( path.dirname( entry ) )
				] = entry;
			}
		}

		return entryPoints;
	};
}

module.exports = { getWebpackEntryPoints };
