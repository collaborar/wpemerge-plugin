/**
 * External dependencies
 */
const { basename, dirname } = require('path');
const { sync: glob } = require( 'fast-glob' );
const {
  hasProjectFile,
  getProjectSourcePath,
  getWebpackEntryPoints: getEntryPoints
} = require('@wordpress/scripts/utils');

/**
 * Internal dependencies
 */
const { fromResoucesScriptRoot, getResourcesPath } = require( './file' );

/**
 * Detects the list of entry points to use with webpack.
 *
 * @param {'script' | 'module'} buildType
 */
function getWebpackEntryPoints( buildType ) {
  /**
	 * @return {Object<string,string>} The list of entry points.
	 */
  return () => {
    // 1. Use the `getWebpackEntryPoints` from wp-scripts to detect entry points.
    const entryPoints = hasProjectFile( getProjectSourcePath() )
      ? getEntryPoints( buildType )()
      : {};

    if ( hasProjectFile( getResourcesPath( 'scripts' ) ) ) {
      // Detect any `{bundle}/index.*` file inside scripts folder.
      const scripts = glob( '**/index.[jt]s?(x)', {
        absolute: true,
        cwd: fromResoucesScriptRoot(),
        ignore: [ 'shared/**' ]
      } );

      if ( scripts.length > 0 ) {
        for ( const filepath of scripts ) {
          const entryName = basename( dirname( filepath ) );

          entryPoints[ entryName ] = filepath;
        }
      }
    }

    return entryPoints;
  };
}

module.exports = {
  getWebpackEntryPoints,
};
