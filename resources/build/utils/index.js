const {
	fromResourcesRoot,
	fromProjectRoot,
	fromResoucesImagesRoot,
	getResourcesPath,
} = require( './file' );

const { getWebpackEntryPoints } = require( './config' );

module.exports = {
	fromProjectRoot,
	fromResourcesRoot,
	fromResoucesImagesRoot,
	getResourcesPath,

	getWebpackEntryPoints,
};
