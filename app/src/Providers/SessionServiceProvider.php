<?php

namespace MyApp\Providers;

use League\Container\ServiceProvider\AbstractServiceProvider;
use League\Container\ServiceProvider\BootableServiceProviderInterface;

/**
 * Register a session for Flash and OldInput to work with.
 */
class SessionServiceProvider extends AbstractServiceProvider implements BootableServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 */
	public function provides( string $id ): bool {
		return $id === WPEMERGE_SESSION_KEY;
	}

	/**
	 * {@inheritDoc}
	 */
	public function boot(): void {
		add_action( 'init', [$this, 'startSession'] );
	}

	/**
	 * {@inheritDoc}
	 */
	public function register(): void {
		$this->getContainer()->addShared( WPEMERGE_SESSION_KEY, function () {
			if ( session_status() === PHP_SESSION_NONE ) {
				return null;
			}

			return $_SESSION ?? null;
		} );
	}

	/**
	 * Start a new session.
	 *
	 * @return void
	 */
	public function startSession() {
		if ( session_status() === PHP_SESSION_NONE ) {
			session_start();
		}
	}
}
