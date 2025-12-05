/**
 * External dependencies
 */
const path = require( 'path' );

const fromProjectRoot = ( basePath = '', ...paths ) =>
  path.resolve( path.dirname( __dirname ), '../../', basePath, ...paths );

const fromResourcesRoot = ( ...paths ) =>
  path.resolve( path.dirname( __dirname ), '../', ...paths );

const fromResoucesScriptRoot = ( ...paths ) =>
  fromResourcesRoot( 'scripts', ...paths );

const fromResoucesStylesRoot = ( ...paths ) =>
  fromResourcesRoot( 'styles', ...paths );

const fromResoucesFontsRoot = ( ...paths ) =>
  fromResourcesRoot( 'fonts', ...paths );

const fromResoucesImagesRoot = ( ...paths ) =>
  fromResourcesRoot( 'images', ...paths );

const getResourcesPath = ( ...paths ) =>
  path.join( 'resources', ...paths );

module.exports = {
  fromProjectRoot,
  fromResourcesRoot,
  fromResoucesScriptRoot,
  fromResoucesStylesRoot,
  fromResoucesFontsRoot,
  fromResoucesImagesRoot,
  getResourcesPath,
};
