/**
 * External dependencies.
 */
const path = require( 'path' );
const shell = require( 'shelljs' );
const { red, cyan, yellow } = require( 'yoctocolors-cjs' );
const { input, confirm } = require( '@inquirer/prompts' );
const { pascalCase, constantCase, snakeCase } = require( 'change-case' );
const { replaceInFileSync: syncReplace } = require( 'replace-in-file' );

/**
 * Internal dependencies.
 */
const { rootPath } = require('../utils');

const { log, error: logError } = console;

/**
 * Require that the current working directory does not have
 * unstaged changes or untracked files.
 */
const requireCleanWorkingDirectory = () =>
	new Promise( ( resolve, reject ) => {
		const status = shell.exec( 'git status --porcelain', { silent: true } );

		if ( status.code !== 0 || status.stdout.trim().length === 0 ) {
			resolve();
			return;
		}

		const prologue = red(
			'This git repository has untracked files or uncommitted changes:'
		);
		const epilogue = red(
			'Remove untracked files, stash or commit any changes, and try againl.'
		);

		reject(
			new Error( `${ prologue }\n\n${ status.stdout }\n${ epilogue }` )
		);
	} );

/**
 * Ask user for replacement tokens interactively.
 */
const askForReplacementTokens = async () => {
	const name = await input( {
		message: 'User-friendly project name (e.g. "My Awesome Project")',
		validate: ( value ) =>
			value.trim().length > 0 || 'Please enter a name.',
		default: '',
	} ).then( ( val ) => val.trim() );

	const namespace = await input( {
		message: 'Namespace (e.g. "MyAwesomeProject")',
		validate: ( value ) =>
			value.trim().length > 0 || 'Please enter a namespace.',
		default: '',
	} ).then( ( val ) => pascalCase( val.trim() ) );

	const tokens = {
		'WP Emerge Starter Theme': name,
		'WP Emerge Starter Plugin': name,
		MyApp: pascalCase( namespace ),
		MY_APP: constantCase( namespace ),
		my_app: snakeCase( namespace ),
	};

	log( '' );
	log( 'The following changes will be applied:' );
	log( '--------------------------------------' );
	log( `WP Emerge Starter Theme/Plugin => ${ cyan( tokens[ 'WP Emerge Starter Plugin' ] ) }` );
	log( `MyApp => ${ cyan( tokens.MyApp ) }` );
	log( `MY_APP => ${ cyan( tokens.MY_APP ) }` );
	log( `my_app => ${ cyan( tokens.my_app ) }` );
	log( '--------------------------------------' );
	log( '' );
	log( yellow( 'WARNING: This is a one-time replacement only. Once applied it cannot be undone or updated automatically.' ) );

	const proceed = await confirm( {
		message: 'Are you sure you wish to proceed?',
		default: false,
	} );

	if ( ! proceed ) {
		throw new Error( 'Action cancelled.' );
	}

	return tokens;
};

/**
 * Replace tokens in the given file globs.
 */
const replaceTokens = ( tokens, matchGlobs, ignoreGlobs ) => {
	const filesToRename = [
		'app/src/MyApp.php',
		'languages/my_app.pot'
	];

	filesToRename.forEach(( file ) => {
		const from = rootPath( file );

		if ( ! shell.test( '-e', from ) ) {
			return;
		}

		const directory = path.dirname( from );
		const extension = path.extname( from );
		const name = path.basename( from, extension );
		const to = path.join( directory, `${ tokens[ name ] }${ extension }` );

		if ( tokens[ name ] !== undefined && from !== to ) {
			if ( ! shell.test( '-e', to ) ) {
				shell.mv( from, to );
				return;
			}

			logError( red( `${ file } could not be renamed: ${ to } already exists.` ) );
		}
	});

	Object.entries( tokens ).forEach( ( [ from, to ] ) => {
		syncReplace( {
			from: new RegExp( from, 'g' ),
			to,
			files: matchGlobs,
			ignore: ignoreGlobs,
		} );
	} );

	// Dump the composer autoloader so it picks up the new namespace.
	shell.exec( 'composer dump-autoload' );
};

module.exports = {
	requireCleanWorkingDirectory,
	askForReplacementTokens,
	replaceTokens,
};
