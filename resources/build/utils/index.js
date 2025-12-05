const { fromResourcesRoot, fromProjectRoot, fromResoucesImagesRoot } = require( './file' );

const { getWebpackEntryPoints } = require( './config' );

module.exports = {
  fromProjectRoot,
  fromResourcesRoot,
  fromResoucesImagesRoot,

  getWebpackEntryPoints,
};
