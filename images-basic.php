<?php
/**
 * Plugin Name:       Images Basic
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       images-basic
 *
 * @package           itmar
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function itmar_images_basic_block_init() {
	$dir = dirname( __FILE__ );
 
  $script_asset_path = "$dir/build/index.asset.php";
  if ( ! file_exists( $script_asset_path ) ) {
    throw new Error(
      'You need to run `npm start` or `npm run build`.'
    );
  }
	$index_js     = 'build/index.js';
  $script_asset = require( $script_asset_path );
  wp_register_script(
    'itmar-images-basic-block-editor',
    plugins_url( $index_js, __FILE__ ),
    $script_asset['dependencies'],
    $script_asset['version']
  );

	//wp_set_script_translations( 'itmar-images-basic', 'my-images' );
 
  $editor_css = 'build/index.css';
  wp_register_style(
    'itmar-images-basic-block-editor',
    plugins_url( $editor_css, __FILE__ ),
    array(),
    filemtime( "$dir/$editor_css" )
  );

	$style_css = 'build/style-index.css';
  wp_register_style(
    'itmar-images-basic-block',
    plugins_url( $style_css, __FILE__ ),
    array(),
    filemtime( "$dir/$style_css" )
  );

	register_block_type( 'itmar/images-basic', array(
    'editor_script' => 'itmar-images-basic-block-editor',
    'editor_style'  => 'itmar-images-basic-block-editor',
    'style'         => 'itmar-images-basic-block',
  ) );
}
add_action( 'init', 'itmar_images_basic_block_init' );
