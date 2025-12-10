/**
 * External dependencies
 */
const colors = require( 'yoctocolors-cjs' );

/**
 * Internal dependencies
 */
const { fromProjectRoot } = require( '../utils' );
const steps = require( '../steps' );

const ignore = [
	fromProjectRoot( 'dist/**/*' ),
	fromProjectRoot( 'node_modules/**/*' ),
	fromProjectRoot( 'tests/**/*' ),
	fromProjectRoot( 'vendor/**/*' ),
];

const match = [
	fromProjectRoot( 'style.css' ),
	fromProjectRoot( '**/*.php' ),
	fromProjectRoot( '**/*.md' ),
	fromProjectRoot( '**/*.txt' ),
	fromProjectRoot( '**/*.json' ),
	fromProjectRoot( '**/*.xml' ),
	fromProjectRoot( 'languages/*.pot' ),
];

const { log, error: logError } = console;

steps
	.requireCleanWorkingDirectory()
	.then( () => steps.askForReplacementTokens( log ) )
	.then(
		( tokens ) =>
			log( 'Rebranding - this may take a while ...' ) ||
			steps.replaceTokens( tokens, match, ignore )
	)
	.then( () => log( 'Done.' ) )
	.catch( ( e ) => logError( colors.red( e.message ) ) );
