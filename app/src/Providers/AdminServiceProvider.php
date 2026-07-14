<?php

namespace MyApp\Providers;

use League\Container\ServiceProvider\AbstractServiceProvider;
use League\Container\ServiceProvider\BootableServiceProviderInterface;

/**
 * Register admin-related entities, like admin menu pages.
 */
class AdminServiceProvider extends AbstractServiceProvider implements BootableServiceProviderInterface {
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
		add_action( 'admin_menu', [$this, 'registerAdminPages'] );
	}

	/**
	 * {@inheritDoc}
	 */
	public function register(): void {
		// Nothing to register.
	}

	/**
	 * Register admin pages.
	 *
	 * @return void
	 */
	public function registerAdminPages() {
		// phpcs:ignore
		// add_theme_page( string $page_title, string $menu_title, string $capability, string $menu_slug, callable $function = '', int $position = null );
	}
}
