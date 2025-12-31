const { rootPath, resourcesPath } = require( './file' );

const { getWebpackEntryPoints } = require( './config' );

const { detectEnv, hasExperimentalModulesFlag } = require( './env' );

module.exports = {
	rootPath,
	resourcesPath,
	getWebpackEntryPoints,
	detectEnv,
	hasExperimentalModulesFlag,
};
