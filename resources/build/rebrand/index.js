/**
 * External dependencies.
 */
const { red } = require( 'yoctocolors-cjs' );

/**
 * Internal dependencies.
 */
const { rootPath } = require( '../utils' );

// Ignore these patterns when rebranding.
const ignores = [
	rootPath( 'dist/**/*' ),
	rootPath( 'tests/**/*' ),
	rootPath( 'node_modules/**/*' ),
	rootPath( 'vendor/**/*' ),
];

const matches = [
	rootPath( 'style.css' ),
	rootPath( '**/*.php' ),
	rootPath( '**/*.md' ),
	rootPath( '**/*.txt' ),
	rootPath( '**/*.json' ),
	rootPath( '**/*.xml' ),
	rootPath( 'languages/*.pot' ),
];

const { log, error: logError } = console;

steps
	.requireCleanWorkingDirectory()
	.then( () => steps.askForReplacementTokens() )
	.then(
		( tokens ) =>
			log( 'Rebranding - this may take a while...' ) ||
			steps.replaceTokens( tokens, matches, ignores )
	)
	.then( () => log( 'Rebranding done.' ) )
	.catch( ( e ) => logError( red( e.message ) ) );
