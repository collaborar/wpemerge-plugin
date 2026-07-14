<?php

namespace MyApp\Routing;

use League\Container\ServiceProvider\AbstractServiceProvider;
use WPEmerge\Application\Configuration;

/**
 * Provide custom route conditions.
 * This is an example class so feel free to modify or remove it.
 */
class RouteConditionsServiceProvider extends AbstractServiceProvider {
	/**
	 * {@inheritDoc}
	 */
	public function provides( string $id ): bool {
		return false;
	}

	/**
	 * {@inheritDoc}
	 */
	public function register(): void {
		// Example route condition registration.
		// $this->registerRouteCondition( 'my_condition', MyCondition::class );
	}

	/**
	 * Register a class as a route condition.
	 *
	 * @param  string $name
	 * @param  string $class_name
	 * @return void
	 */
	protected function registerRouteCondition( string $name, string $class_name ): void {
		$config = $this->getContainer()->get( Configuration::class );
		$types = $config->get( 'condition_types', [] );
		$types[ $name ] = $class_name;
		$config->set( 'condition_types', $types );
	}
}
