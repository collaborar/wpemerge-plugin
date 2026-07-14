<?php

namespace MyApp\Providers;

use League\Container\ServiceProvider\AbstractServiceProvider;
use League\Container\ServiceProvider\BootableServiceProviderInterface;

/**
 * Register shortcodes.
 */
class ShortcodesServiceProvider extends AbstractServiceProvider implements BootableServiceProviderInterface {
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
		// phpcs:ignore
		// add_shortcode( 'example', [$this, 'shortcodeExample'] );
	}

	/**
	 * {@inheritDoc}
	 */
	public function register(): void {
		// Nothing to register.
	}

	/**
	 * Example shortcode.
	 *
	 * @param  array  $atts
	 * @param  string $content
	 * @return string
	 */
	public function shortcodeExample( $atts, $content ) {
		$atts = shortcode_atts(
			array(
				'example_attribute' => 'example_value',
			),
			$atts,
			'example'
		);

		ob_start();
		?>
		<div class="shortcode-example">
			<!-- Your shortcode content goes here ... -->
		</div>
		<?php
		$html = ob_get_clean();

		// Alternatively, you can use a WP Emerge View instead of a buffer:
		// $html = \MyApp::view( 'some-view' )->with( $atts )->with( 'content', $content )->toString();

		return $html;
	}
}
