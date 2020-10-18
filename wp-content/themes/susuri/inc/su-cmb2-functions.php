<?php
/**
 * Include and setup custom metaboxes and fields. (make sure you copy this file to outside the CMB2 directory)
 *
 * Be sure to replace all instances of 'yourprefix_' with your project's prefix.
 * http://nacin.com/2010/05/11/in-wordpress-prefix-everything/
 *
 * @category susuri theme
 * @package  susuri
 * @license  http://www.opensource.org/licenses/gpl-license.php GPL v2.0 (or later)
 * @link     https://github.com/CMB2/CMB2
 */


/** SU CMB2 Functions Inventory
 *  
 * su_stores_metabox()					 | Metabox attached to dashboard page with repeatable stores custom fields
 * su_news_metabox()					 | Metabox attached to dashboard page with news custom fields 
 * su_contact_metabox()					 | Metabox attached to dashboard page with contact custom fields 
 * su_season_metabox()					 | Metabox attached to Season post type with season selection field
 * su_image_metabox()					 | Metabox attached to Season post type with image fields
 * su_showcase_metabox()				 | Metabox attached to Season post type with image fields for showcase
 * su_movie_metabox()					 | Metabox attached to Movie page with oembed field
 *  
 */



/* STORES METABOX
*
* [group]
* [text medium] name
* [text medium] address
* [text medium] phone
* [text medium] url
*
*/

add_action( 'cmb2_admin_init', 'su_stores_metabox' );

function su_stores_metabox() {

	$perfix = 'su_stores_';

	// METABOX
	$stores = new_cmb2_box( array(
		'id'            => $perfix . 'metabox',
		'title'         => __( 'Stockist', su_get_theme_text_domain() ),
		'object_types'  => array( 'page', ), // Post type
		'show_on'       => array( 'key' => 'id', 'value' => array( su_get_ID_by_slug( 'dashboard' ) ) ),
		'context'       => 'normal',
		'priority'      => 'low',
		'show_names'    => true, // Show field names on the left
		'closed'        => true, // true to have the groups closed by default		
	) );
	
	// GROUP FIELD
	$stores_group = $stores->add_field( array(
		'id'          => $perfix . 'group',
		'type'        => 'group',
		// 'repeatable'  => false, // use false if you want non-repeatable group
		'options'     => array(
			'group_title'       => __( 'Store {#}', su_get_theme_text_domain() ), // since version 1.1.4, {#} gets replaced by row number
			'add_button'        => __( 'Add Store', su_get_theme_text_domain() ),
			'remove_button'     => __( 'Remove Store', su_get_theme_text_domain() ),
			'sortable'          => true,
			// 'closed'            => true, // true to have the groups closed by default
			'remove_confirm'	=> esc_html__( 'Are you sure you want to remove?', su_get_theme_text_domain() ), // Performs confirmation before removing group.
		),
	) );	
	
	// NAME FIELD
	$stores->add_group_field( $stores_group, array(
		'name'    => __( 'Name', su_get_theme_text_domain() ),
		'id'      => $perfix . 'name',
		'type'    => 'text_medium'
	) );
	
	// ADDRESS
	$stores->add_group_field( $stores_group, array(
		'name'    => __( 'Address', su_get_theme_text_domain() ),
		'id'      => $perfix . 'address',
		'type'    => 'text_medium'
	) );
	
	// PHONE
	$stores->add_group_field( $stores_group, array(
		'name'    => __( 'Telephone', su_get_theme_text_domain() ),
		'id'      => $perfix . 'tel',
		'type'    => 'text_medium'
	) );
	
	$stores->add_group_field( $stores_group, array(
		'name' => __( 'URL', su_get_theme_text_domain() ),
		'id'   => $perfix . 'url',
		'type' => 'text_url',
		'protocols' => array( 'http', 'https' ), // Array of allowed protocols
	) );	
}




/* NEWS METABOX
*
* [wysiwyg] news
*
*/

add_action( 'cmb2_admin_init', 'su_news_metabox' );

function su_news_metabox() {

	$perfix = 'su_news_';

	// METABOX
	$news = new_cmb2_box( array(
		'id'            => $perfix . 'metabox',
		'title'         => __( 'News', su_get_theme_text_domain() ),
		'object_types'  => array( 'page', ), // Post type
		'show_on'       => array( 'key' => 'id', 'value' => array( su_get_ID_by_slug( 'dashboard' ) ) ),
		'context'       => 'normal',
		'priority'      => 'high',
		'show_names'    => true, // Show field names on the left
		'closed'        => true, // true to have the groups closed by default
	) );
	
	// NEWS FIELD
	$news->add_field( array(
		'name'    => __( 'News Text', su_get_theme_text_domain() ),
		'id'      => $perfix . 'text',
		'type'    => 'wysiwyg',
		'options' => array(),
	) );	
}




/* CONTACT METABOX
*
* [text medium] contact
* [url] instagram
*
*/

add_action( 'cmb2_admin_init', 'su_contact_metabox' );

function su_contact_metabox() {

	$perfix = 'su_contact_';

	// METABOX
	$news = new_cmb2_box( array(
		'id'            => $perfix . 'metabox',
		'title'         => __( 'Contact', su_get_theme_text_domain() ),
		'object_types'  => array( 'page', ), // Post type
		'show_on'       => array( 'key' => 'id', 'value' => array( su_get_ID_by_slug( 'dashboard' ) ) ),
		'context'       => 'normal',
		'priority'      => 'high',
		'show_names'    => true, // Show field names on the left
		'closed'        => true, // true to have the groups closed by default
	) );
	
	// CONTACT
	$news->add_field( array(
		'name'    => __( 'Contact', su_get_theme_text_domain() ),
		'id'      => $perfix . 'contact',
		'type'    => 'text_medium'
	) );
	
	// INSTAGRAM
	$news->add_field( array(
		'name' => __( 'Instagram', su_get_theme_text_domain() ),
		'desc' => __( 'e.g. www.instagram.com/my-account', su_get_theme_text_domain() ),
		'id'   => $perfix . 'instagram',
		'type' => 'text_url',
		'protocols' => array( 'http', 'https' ), // Array of allowed protocols
	) );
}




/* SHOWCASE METABOX
*
* [select] season 
*
*/

add_action( 'cmb2_admin_init', 'su_season_metabox' );

function su_season_metabox() {
	
	$perfix = 'su_season_';

	// METABOX
	$season = new_cmb2_box( array(
		'id'            => $perfix . 'metabox',
		'title'         => __( 'Season', su_get_theme_text_domain() ),
		'object_types'  => array( 'season' ), // Post type
	) );
	
	// SELECT SEASON
	$season->add_field( array(
		'name'             => __( 'Season', su_get_theme_text_domain() ),
		'desc'             => __( 'select season', su_get_theme_text_domain() ),
		'id'               => $perfix . 'term',
		'type'             => 'select',
		'show_option_none' => false,
		'default'          => 'ss',
		'options'          => array(
			'ss' => __( 'SS', su_get_theme_text_domain() ),
			'aw' => __( 'AW', su_get_theme_text_domain() ),
		),
	) );	
}



/* SHOWCASE METABOX
*
* [file list] showcase images
*
*/

add_action( 'cmb2_admin_init', 'su_showcase_metabox' );

function su_showcase_metabox() {
	
	$perfix = 'su_showcase_';

	// METABOX
	$image = new_cmb2_box( array(
		'id'            => $perfix . 'metabox',
		'title'         => __( 'Showcase Image', su_get_theme_text_domain() ),
		'object_types'  => array( 'season' ), // Post type
	) );
	
	// IMAGE FIELD
	$image->add_field( array(
		'name' => __( 'Image', su_get_theme_text_domain() ),
		'id'   => $perfix . 'image',
		'type' => 'file_list',
		'preview_size' => array( 100, 100 ), // Default: array( 50, 50 )
		// 'query_args' => array( 'type' => 'image' ), // Only images attachment
		// Optional, override default text strings
		'text' => array(
			'add_upload_files_text' => __( 'Add Image', su_get_theme_text_domain() ), // default: "Add or Upload Files"
			'remove_image_text' => __( 'Remove Image', su_get_theme_text_domain() ), // default: "Remove Image"
			'file_text' => __( 'File:', su_get_theme_text_domain() ), // default: "File:"
			'file_download_text' => __( 'Download:', su_get_theme_text_domain() ), // default: "Download"
			'remove_text' => __( 'Remove', su_get_theme_text_domain() ), // default: "Remove"
		),
	) );	
}




/* IMAGE METABOX
*
* [file list] season images
*
*/

add_action( 'cmb2_admin_init', 'su_image_metabox' );

function su_image_metabox() {
	
	$perfix = 'su_image_';

	// METABOX
	$image = new_cmb2_box( array(
		'id'            => $perfix . 'metabox',
		'title'         => __( 'Season Image', su_get_theme_text_domain() ),
		'object_types'  => array( 'season' ), // Post type
	) );
	
	// IMAGE FIELD
	$image->add_field( array(
		'name' => __( 'Image', su_get_theme_text_domain() ),
		'id'   => $perfix . 'image',
		'type' => 'file_list',
		'preview_size' => array( 100, 100 ), // Default: array( 50, 50 )
		// 'query_args' => array( 'type' => 'image' ), // Only images attachment
		// Optional, override default text strings
		'text' => array(
			'add_upload_files_text' => __( 'Add Image', su_get_theme_text_domain() ), // default: "Add or Upload Files"
			'remove_image_text' => __( 'Remove Image', su_get_theme_text_domain() ), // default: "Remove Image"
			'file_text' => __( 'File:', su_get_theme_text_domain() ), // default: "File:"
			'file_download_text' => __( 'Download:', su_get_theme_text_domain() ), // default: "Download"
			'remove_text' => __( 'Remove', su_get_theme_text_domain() ), // default: "Remove"
		),
	) );	
}	 




/* MOVIE METABOX
*
* [oembed] movie
*
*/

add_action( 'cmb2_admin_init', 'su_movie_metabox' );

function su_movie_metabox() {
	
	$perfix = 'su_movie_';

	// METABOX
	$image = new_cmb2_box( array(
		'id'            => $perfix . 'metabox',
		'title'         => __( 'Movie', su_get_theme_text_domain() ),
		'object_types'  => array( 'page' ), // Post type
		'show_on'       => array( 'key' => 'id', 'value' => array( su_get_ID_by_slug( 'dashboard' ) ) ),		
	) );
	
	// MOVIE FIELD
	$image->add_field( array(
		'name' => __( 'Movie', su_get_theme_text_domain() ),
		'desc' => __( 'Enter the url', su_get_theme_text_domain() ),
		'id'   => $perfix . 'oembed',
		'type' => 'oembed',
	) );	
}		 