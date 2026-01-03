<?php

namespace MyApp\WordPress;

use WPEmerge\ServiceProviders\ServiceProviderInterface;

/**
 * Register plugin options.
 */
class PluginServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		// Nothing to register.
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
		register_activation_hook( MY_APP_PLUGIN_FILE, [$this, 'activate'] );
		register_deactivation_hook( MY_APP_PLUGIN_FILE, [$this, 'deactivate'] );

		add_action( 'plugins_loaded', [$this, 'loadTextdomain'] );
	}

	/**
	 * Plugin activation.
	 *
	 * @return void
	 */
	public function activate() {
		// Nothing to do right now.
	}

	/**
	 * Plugin deactivation.
	 *
	 * @return void
	 */
	public function deactivate() {
		// Nothing to do right now.
	}

	/**
	 * Load textdomain.
	 *
	 * @return void
	 */
	public function loadTextdomain() {
		[ $domain, $domain_path ] = get_file_data( MY_APP_PLUGIN_FILE, [ 'Text Domain', 'Domain Path' ] );
		$path = join_paths(
			basename( dirname( MY_APP_PLUGIN_FILE ) ),
			trim( $domain_path )
		);

		load_plugin_textdomain( trim( $domain ), false, $path );
	}
}
