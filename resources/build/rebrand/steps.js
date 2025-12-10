/**
 * External dependencies
 */
const path = require( 'path' );
const colors = require( 'yoctocolors-cjs' );
const shell = require( 'shelljs' );
const { input, confirm } = require( '@inquirer/prompts' );
const { pascalCase, constantCase, snakeCase } = require( 'change-case' );
const { replaceInFileSync: syncReplace } = require( 'replace-in-file' );

/**
 * Internal dependencies
 */
const { fromProjectRoot } = require( '../utils' );

/**
 * Require that the current working directory does not have unstaged changes or untracked files.
 *
 * @return {Promise}
 */
const requireCleanWorkingDirectory = () =>
	new Promise( ( resolve, reject ) => {
		const status = { code: 1 }; //shell.exec('git status --porcelain', { silent: true });

		if ( status.code !== 0 || status.stdout.trim().length === 0 ) {
			resolve();
			return;
		}

		const prologue = colors.red(
			'This git repository has untracked files or uncommitted changes:'
		);
		const epilogue = colors.red(
			'Remove untracked files, stash or commit any changes, and try again.'
		);

		reject(
			new Error( `${ prologue }\n\n${ status.stdout }\n${ epilogue }` )
		);
	} );

/**
 * Interactively ask the user for replacement tokens.
 *
 * @param  log
 * @return {Promise}
 */
const askForReplacementTokens = async ( log ) => {
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
	log(
		`WP Emerge Starter Theme/Plugin => ${ colors.cyan(
			tokens[ 'WP Emerge Starter Plugin' ]
		) }`
	);
	log( `MyApp => ${ colors.cyan( tokens.MyApp ) }` );
	log( `MY_APP => ${ colors.cyan( tokens.MY_APP ) }` );
	log( `my_app => ${ colors.cyan( tokens.my_app ) }` );
	log( '--------------------------------------' );
	log( '' );
	log(
		colors.yellow(
			'WARNING: This is a one-time replacement only. Once applied it cannot be undone or updated automatically.'
		)
	);

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
 *
 * @param {Object}   tokens
 * @param {string[]} matchGlobs
 * @param {string[]} ignoreGlobs
 * @return {Promise}
 */
const replaceTokens = ( tokens, matchGlobs, ignoreGlobs ) => {
	const filesToRename = [ 'app/src/MyApp.php', 'languages/my_app.pot' ];

	// Rename specific files that match tokens.
	filesToRename.forEach( ( file ) => {
		const from = fromProjectRoot( file );

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
			} else {
				console.error(
					colors.red(
						`${ file } could not be renamed: ${ to } already exists.`
					)
				);
			}
		}
	} );

	// Replace the tokens in the provided globs.
	Object.entries( tokens ).forEach( ( [ from, to ] ) => {
		syncReplace( {
			ignore: ignoreGlobs,
			files: matchGlobs,
			from: new RegExp( from, 'g' ),
			to,
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
