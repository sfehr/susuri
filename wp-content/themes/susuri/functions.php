<?php
/**
 * susuri functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package susuri
 * 
 *  
 * 
 *  
 * su_get_theme_text_domain()			 | Textdomain stored in a variable
 * 										 | Load CMB2 functions 
 * su_get_ID_by_slug()					 | Retrive the id of a specifyed page/post
 * su_modify_wp_query()				 	 | Modifying the initial WP query with pre_get_posts hook
 * su_choose_template() 				 | Chose a custom template 
 * su_custom_head() 					 | Add meta tags to the head  
 * su_get_stores() 						 | Get custom field values: stores
 * su_get_images() 						 | Get custom field values: file list images  
 * su_get_player_markup() 				 | Returns the markup of the player 
 * sf_loadmore_ajax_handler() 			 | Ajax handler for loading more posts via ajax call
 *
 * 
 * 
 *  
 */

if ( ! defined( '_S_VERSION' ) ) {
	// Replace the version number of the theme on each release.
	define( '_S_VERSION', '1.0.0' );
}

if ( ! function_exists( 'susuri_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function susuri_setup() {
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on susuri, use a find and replace
		 * to change 'susuri' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( 'susuri', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		// This theme uses wp_nav_menu() in one location.
		register_nav_menus(
			array(
				'menu-1' => esc_html__( 'Primary', 'susuri' ),
			)
		);

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support(
			'html5',
			array(
				'search-form',
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
				'style',
				'script',
			)
		);

		// Set up the WordPress core custom background feature.
		add_theme_support(
			'custom-background',
			apply_filters(
				'susuri_custom_background_args',
				array(
					'default-color' => 'ffffff',
					'default-image' => '',
				)
			)
		);

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		/**
		 * Add support for core custom logo.
		 *
		 * @link https://codex.wordpress.org/Theme_Logo
		 */
		add_theme_support(
			'custom-logo',
			array(
				'height'      => 250,
				'width'       => 250,
				'flex-width'  => true,
				'flex-height' => true,
			)
		);
	}
endif;
add_action( 'after_setup_theme', 'susuri_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function susuri_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'susuri_content_width', 640 );
}
add_action( 'after_setup_theme', 'susuri_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function susuri_widgets_init() {
	register_sidebar(
		array(
			'name'          => esc_html__( 'Sidebar', 'susuri' ),
			'id'            => 'sidebar-1',
			'description'   => esc_html__( 'Add widgets here.', 'susuri' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);
}
add_action( 'widgets_init', 'susuri_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function susuri_scripts() {
	wp_enqueue_style( 'susuri-style', get_stylesheet_uri(), array(), _S_VERSION );
	wp_style_add_data( 'susuri-style', 'rtl', 'replace' );

	wp_enqueue_script( 'susuri-navigation', get_template_directory_uri() . '/js/navigation.js', array(), _S_VERSION, true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
	
	// vimeo player api
	wp_enqueue_script( 'player-js', 'https://player.vimeo.com/api/player.js', array(), _S_VERSION, true );
	
	// scroll magic bundle
/*	
	wp_enqueue_script( 'scroll-magic-js', get_template_directory_uri() . '/js/ScrollMagic.min.js', array(), _S_VERSION, true );
	wp_enqueue_script( 'tween-max-js', get_template_directory_uri() . '/js/TweenMax.min.js', array(), _S_VERSION, true );
	wp_enqueue_script( 'animation-gsap-js', get_template_directory_uri() . '/js/animation.gsap.js', array(), _S_VERSION, true );
	wp_enqueue_script( 'scroll-magic-indicators-js', 'https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.3/plugins/debug.addIndicators.js', array(), _S_VERSION, true ); // for debugging only	
*/	
	
	// Parameters for JS
	$su_params = array(
		'movie_url' => get_post_meta( su_get_ID_by_slug( 'dashboard' ), 'su_movie_oembed', true )
	);	
	wp_enqueue_script( 'su-scripts', get_template_directory_uri() . '/js/su-scripts.js', array( 'jquery' ), _S_VERSION, true );
	wp_localize_script( 'su-scripts', 'su_params', $su_params );
	
	
	// SF Loadmore
	global $wp_query; 
	// Parameters for JS
	$sf_loadmore_params = array(
			'ajax_url'	   => admin_url( 'admin-ajax.php' ), 
			'posts'		   => json_encode( $wp_query->query_vars ), // everything about your loop is here
			'current_page' => get_query_var( 'paged' ) ? get_query_var( 'paged' ) : 1,
			'max_page'     => $wp_query->max_num_pages,
			'container'    => '#showcase'
	);			
	wp_enqueue_script( 'sf-loadmore-js', get_template_directory_uri() . '/js/sf-loadmore.js', array( 'jquery' ), true );
	wp_localize_script( 'sf-loadmore-js', 'sf_loadmore_params', $sf_loadmore_params );
	
}
add_action( 'wp_enqueue_scripts', 'susuri_scripts' );

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require get_template_directory() . '/inc/jetpack.php';
}



/** SF:
 * Retrieve the text domain of the theme.
 *
 * @since     1.0.0
 * @return    string    The text domain of the plugin.
 */
function su_get_theme_text_domain() {
	$textdomain = 'susuri';
	return $textdomain;
}



/** SF:
 * Load CMB2 functions
 */
require_once( get_template_directory() . '/inc/su-cmb2-functions.php');



/* GET ID BY SLUG
* Retrive the id of a specifyed page/post
* 
* @param 	string
* @return	integer
*
*/
function su_get_ID_by_slug( $page ) {

	$page_obj = get_page_by_path( $page );
	$page_id = $page_obj->ID;
	
	return $page_id;	
}



/** SF:
 * Modifying the initial WP query with pre_get_posts hook
 */
function su_modify_wp_query( $query ) {

	if( $query->is_main_query() && $query->is_home() ){	
		
		// VARS
		$post_types = array( 'season', 'diary' );
		$meta_query = ( is_array( $query->get( 'meta_query' ) ) ) ? $query->get( 'meta_query' ) : []; //Get original meta query before adding additional arguments
		
		// QUERY SET
		$query->set( 'meta_query', $meta_query ); //Add our meta query to the original meta queries
		$query->set( 'post_type', $post_types );
		$query->set( 'posts_per_page', -1 );
		$query->set( 'orderby', 'date' );
		$query->set( 'order', 'desc' );
		
	}
	
	return $query;
}
add_action( 'pre_get_posts', 'su_modify_wp_query' );



/** SF:
 * Chose a custom template
 */
function su_choose_template( $template ) {
	
	if ( is_admin() ) {
		return $template;
	}
	
	// HOME
	if ( is_home() && is_main_query() ) {
		$new_template = locate_template( array( 'tmpl_startpage.php' ) );
		if ( !empty( $new_template ) ) {
			return $new_template;
		}
	}

	return $template;
}
add_filter( 'template_include', 'su_choose_template', 99 );



/** SF:
 *  Add meta tags to the head
 */
function su_custom_head() {

	// GOOGLE TAG MANAGER
/*	echo "
		<!-- Google Tag Manager -->
		<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
		})(window,document,'script','dataLayer','GTM-NXWKC79');</script>
		<!-- End Google Tag Manager -->		
	";
*/	
	// TYPEFACE (EN)
//	echo '<link rel="stylesheet" href="https://use.typekit.net/wlv6frg.css">';
	
	// TYPEFACE (JP)
	echo "
		<script>
		  (function(d) {
			var config = {
			  kitId: 'ept0bzo',
			  scriptTimeout: 3000,
			  async: true
			},
			h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,\"\")+\" wf-inactive\";},config.scriptTimeout),tk=d.createElement(\"script\"),f=false,s=d.getElementsByTagName(\"script\")[0],a;h.className+=\" wf-loading\";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!=\"complete\"&&a!=\"loaded\")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
		  })(document);
		</script>
	";
	
}
add_action( 'wp_head', 'su_custom_head' );



/** SF:
 * Get custom field values: stores
 */
function su_get_stores( $post_id ) {
	
	// get values
	$entries = get_post_meta( $post_id, 'su_stores_group', true );
	
	// loop though values
	foreach ( (array) $entries as $key => $entry ) {
		
		$name = isset( $entry[ 'su_stores_name' ] ) ? esc_html( $entry[ 'su_stores_name' ] ) : '';
		$address = isset( $entry[ 'su_stores_address' ] ) ? esc_html( $entry[ 'su_stores_address' ] ) : '';
		$phone = isset( $entry[ 'su_stores_tel' ] ) ? esc_html( $entry[ 'su_stores_tel' ] ) : '';
		$url = isset( $entry[ 'su_stores_url' ] ) ? esc_url( $entry[ 'su_stores_url' ] ) : '';
		$link_open = ! empty( $entry[ 'su_stores_url' ] ) ? '<a href="' . $entry[ 'su_stores_url' ] . '" target="_blank">' : '';
		$link_close = ! empty( $entry[ 'su_stores_url' ] ) ? '</a>' : '';
		
		$inner_markup[ $key ] = 
			$link_open . '
				<li>
					<span class="itm itm-name">' . $name . '</span>
					<span class="itm itm-address">' . $address . '</span>
					<span class="itm itm-phone">' . $phone . '</span>
				</li>
			' . $link_close;
	}
	
	return '
		<ul>
			' . implode( '', $inner_markup ) . '
		</ul>';	
}



/** SF:
 * Get custom field values: file list images  
 */
function su_get_images( $meta_key, $class = '', $img_size = '' ){
	
	// VARS
	$data = '';
	$images = array();
	$class = !empty( $class ) ? ' ' . $class : '' ;
	
	// GET FIELD
	$files = get_post_meta( get_the_ID(), $meta_key, 1 );

	// LOOP
	
	if( !empty( $files ) ){	
		foreach ( (array) $files as $attachment_id => $attachment_url ) {
			$img = wp_get_attachment_image( $attachment_id, $img_size );
			$img_src = wp_get_attachment_image_src( $attachment_id );
			$orientation = ( $img_src[ 1 ] <= $img_src[ 2 ] ) ? 'portrait' : 'landscape'; // 1->width, 2->height
			$images[] = '<div class="entry-media itm-img ' . $orientation . $class . '">' . $img . '</div>';
		}	

		$data = implode( '', $images );
	}	
	
	return $data;
}



/** SF:
 * Returns the markup of the player
 */
function su_get_player_markup() {
	
	$player_markup = '
					<div class="ui-panel">
						<div class="ui-player sound-on">
							<svg version="1.2" baseProfile="tiny" id="sound-on" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
								 x="0px" y="0px" width="19px" height="26px" viewBox="0 0 19 26" overflow="visible" xml:space="preserve">
							<g>
								<polygon fill="none" stroke="#000000" stroke-miterlimit="10" points="16.4,13 16.4,23.7 14.7,23.7 8.1,17.5 2.6,17.5 2.6,13 
									2.6,8.4 8.1,8.4 14.7,2.3 16.4,2.3 	"/>
							</g>
							</svg>
						</div>
						<div class="ui-player sound-off">
							<svg version="1.1" id="sound-off" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
								 width="21.3px" height="26px" viewBox="0 0 21.3 26" style="enable-background:new 0 0 21.3 26;" xml:space="preserve">
							<style type="text/css">
								.st0{fill:none;stroke:#000000;stroke-miterlimit:10;}
								.st1{fill:#FFFFFF;stroke:#000000;stroke-miterlimit:10;}
							</style>
							<g>
								<polygon class="st0" points="17.6,13 17.6,23.7 15.9,23.7 9.3,17.5 3.8,17.5 3.8,13 3.8,8.4 9.3,8.4 15.9,2.3 17.6,2.3 	"/>
							</g>
							<line class="st1" x1="20.2" y1="5.1" x2="1.2" y2="20.9"/>
							</svg>
						</div>
						<div class="ui-player play">
							<svg version="1.1" id="play" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
								 width="19px" height="26px" viewBox="0 0 19 26" style="enable-background:new 0 0 19 26;" xml:space="preserve">
							<style type="text/css">
								.st0{fill:none;stroke:#1D1D1B;stroke-miterlimit:10;}
							</style>
							<polygon class="st0" points="1.2,2.9 17.8,13 1.2,23.1 "/>
							</svg>
						</div>
						<div class="ui-player pause">
							<svg version="1.1" id="pause" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
								 width="19px" height="26px" viewBox="0 0 19 26" style="enable-background:new 0 0 19 26;" xml:space="preserve">
							<style type="text/css">
								.st0{fill:none;stroke:#1D1D1B;stroke-miterlimit:10;}
							</style>
							<g>
								<rect x="0.3" y="2.8" class="st0" width="7.2" height="20.4"/>
								<rect x="11.6" y="2.8" class="st0" width="7.2" height="20.4"/>
							</g>
							</svg>
						</div>
						<div class="ui-player progress-bar">
							<div class="bar"></div>
							<div class="progress"></div>
						</div>
					</div>	
	';
	
	return $player_markup;
}



/** SF:
 * Ajax handler for loading more posts via ajax call
 */
function sf_loadmore_ajax_handler() {
	
	// prepare our arguments for the query
//	$args = json_decode( stripslashes( $_POST[ 'query' ] ), true );
	$args[ 'paged' ] = ( isset( $_POST[ 'page' ] ) ) ? $_POST[ 'page' ] + 1 : ''; // we need next page to be loaded
	$args[ 'posts_per_page' ] = 1;
	$args[ 'post_status' ] = 'publish';
	$args[ 'post_type' ] = array ( 'season' );

	$custom_query = new WP_Query( $args );

		if( $custom_query->have_posts() ) :

			// run the loop
			while( $custom_query->have_posts() ) : 
	
				$custom_query->the_post();
				get_template_part( 'template-parts/content', get_post_type() );

			endwhile;
			wp_reset_postdata();
	
		endif;
	
		if ( wp_doing_ajax() ) :
			die; // exit script
		endif;
	
}
add_action( 'wp_ajax_loadmore', 'sf_loadmore_ajax_handler' ); // priv
add_action( 'wp_ajax_nopriv_loadmore', 'sf_loadmore_ajax_handler' ); // no priv






/* for debuging */
function debug_to_console( $data ) {
    $output = $data;
    if (is_array($output))
        $output = implode(',', $output);

    echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
}

