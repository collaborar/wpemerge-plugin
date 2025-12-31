/**
 * External dependencies.
 */
const {
	hasArgInCLI,
	getAsBooleanFromENV,
} = require( '@wordpress/scripts/utils' );

/**
 * Detect node environment.
 */
const detectEnv = () => {
	const nodeEnv = process.env.NODE_ENV || 'development';
	const isHot = hasArgInCLI( '--hot' );
	const isDevelopment = nodeEnv === 'development';
	const isProduction = nodeEnv === 'production';

	return {
		isHot,
		isDevelopment,
		isProduction
	};
};

/**
 * Determine if has experimental modules flag on environment.
 */
const hasExperimentalModulesFlag = getAsBooleanFromENV(
	'WP_EXPERIMENTAL_MODULES'
);

module.exports = {
	detectEnv,
	hasExperimentalModulesFlag,
};

