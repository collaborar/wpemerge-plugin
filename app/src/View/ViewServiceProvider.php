<?php

namespace MyApp\View;

use League\Container\ServiceProvider\AbstractServiceProvider;
use League\Container\ServiceProvider\BootableServiceProviderInterface;

/**
 * Register view composers and globals.
 * This is an example class so feel free to modify or remove it.
 */
class ViewServiceProvider extends AbstractServiceProvider implements BootableServiceProviderInterface {
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
		$this->registerGlobals();
		$this->registerComposers();
	}

	/**
	 * {@inheritDoc}
	 */
	public function register(): void {
		// Nothing to register.
	}

	/**
	 * Register view globals.
	 *
	 * @return void
	 */
	protected function registerGlobals() {
		/**
		 * Globals
		 *
		 * @link https://docs.wpemerge.com/#/framework/views/overview
		 */
		// phpcs:ignore
		// \MyApp::views()->addGlobal( 'foo', 'bar' );
	}

	/**
	 * Register view composers.
	 *
	 * @return void
	 */
	protected function registerComposers() {
		/**
		 * View composers
		 *
		 * @link https://docs.wpemerge.com/#/framework/views/view-composers
		 */
		// phpcs:ignore
		// \MyApp::views()->addComposer( 'partials/foo', 'FooPartialViewComposer' );
	}
}
