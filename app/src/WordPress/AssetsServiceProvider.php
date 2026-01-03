<?php

namespace MyApp\WordPress;

use WPEmerge\ServiceProviders\ServiceProviderInterface;

/**
 * Register and enqueues assets.
 */
class AssetsServiceProvider implements ServiceProviderInterface {
	/**
	 * Filesystem.
	 *
	 * @var \WP_Filesystem_Base
	 */
	protected $filesystem = null;

	/**
	 * App dist path.
	 *
	 * @var string
	 */
	protected $dist_path = '';

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
		$this->filesystem = $container[ WPEMERGE_APPLICATION_FILESYSTEM_KEY ];
		$this->dist_path = join_paths(
			$container[ WPEMERGE_CONFIG_KEY ]['app_core']['path'],
			'dist'
		);

		add_action( 'wp_enqueue_scripts', [$this, 'enqueueFrontendAssets'] );
		add_action( 'admin_enqueue_scripts', [$this, 'enqueueAdminAssets'] );
		add_action( 'wp_footer', [$this, 'loadSvgSprite'] );
		add_action( 'init', [$this, 'registerBlocks'] );
	}

	/**
	 * Enqueue frontend assets.
	 *
	 * @return void
	 */
	public function enqueueFrontendAssets() {
		// Enqueue the built-in comment-reply script for singular pages.
		if ( is_singular() ) {
			wp_enqueue_script( 'comment-reply' );
		}

		// Enqueue scripts.
		\MyApp::core()->assets()->enqueueScript(
			handle: 'my-app-js-bundle',
			src: \MyApp::core()->assets()->getBundleUrl( 'frontend.js' ),
			args: [ 'in_footer' => true ]
		);

		// Enqueue styles.
		$style = \MyApp::core()->assets()->getBundleUrl( 'frontend.css' );

		if ( $style ) {
			\MyApp::core()->assets()->enqueueStyle(
				'my-app-css-bundle',
				$style
			);
		}
	}

	/**
	 * Enqueue admin assets.
	 *
	 * @return void
	 */
	public function enqueueAdminAssets() {
		// Enqueue scripts.
		\MyApp::core()->assets()->enqueueScript(
			handle: 'my-app-admin-js-bundle',
			src: \MyApp::core()->assets()->getBundleUrl( 'admin.js' ),
			args: [ 'in_footer' => true ]
		);

		// Enqueue styles.
		$style = \MyApp::core()->assets()->getBundleUrl( 'admin.css' );

		if ( $style ) {
			\MyApp::core()->assets()->enqueueStyle(
				'my-app-admin-css-bundle',
				$style
			);
		}
	}

	/**
	 * Load SVG sprite.
	 *
	 * @return void
	 */
	public function loadSvgSprite() {
		$file_path = join_paths( $this->dist_path, 'images', 'sprite.svg' );

		if ( ! $this->filesystem->exists( $file_path ) ) {
			return;
		}

		echo $this->filesystem->get_contents( $file_path );
	}

	/**
	 * Register blocks.
	 *
	 * @return void
	 */
	public function registerBlocks() {
		$blocks_path = join_paths( $this->dist_path, 'blocks' );
		$blocks_manifest = join_paths( $this->dist_path, 'blocks-manifest.php' );

		// Early avoid if no blocks exist.
		if ( ! $this->filesystem->exists( $blocks_manifest ) ) {
			return;
		}

		if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
			wp_register_block_types_from_metadata_collection( $blocks_path, $blocks_manifest );
			return;
		}

		if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
			wp_register_block_metadata_collection( $blocks_path, $blocks_manifest );
			return;
		}

		foreach ( array_keys( require $blocks_manifest ) as $block_type ) {
			$block_type = join_paths( $this->path, 'dist', $block_type );
			register_block_type( $block_type );
		}
	}
}
