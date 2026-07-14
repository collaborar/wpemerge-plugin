<?php

namespace MyApp\Providers;

use League\Container\ServiceProvider\AbstractServiceProvider;
use League\Container\ServiceProvider\BootableServiceProviderInterface;

/**
 * Register plugin options.
 */
class PluginServiceProvider extends AbstractServiceProvider implements BootableServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 */
	public function provides( string $id ): bool {
		return false;
	}

	/**
	 * {@inheritDoc}
	 */
	public function boot(): void {
		register_activation_hook( MY_APP_PLUGIN_FILE, [$this, 'activate'] );
		register_deactivation_hook( MY_APP_PLUGIN_FILE, [$this, 'deactivate'] );

		add_action( 'plugins_loaded', [$this, 'loadTextdomain'] );
	}

	/**
	 * {@inheritDoc}
	 */
	public function register(): void {
		// Nothing to register.
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
		$path = basename( dirname( MY_APP_PLUGIN_FILE ) ) . DIRECTORY_SEPARATOR . trim( $domain_path );

		load_plugin_textdomain( trim( $domain ), false, $path );
	}
}
