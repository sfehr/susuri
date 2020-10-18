<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package susuri
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">

	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div id="page" class="site">
	<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', 'susuri' ); ?></a>

	<header id="masthead" class="site-header">
		
		<div class="site-logo">
			<a href="#" class="ui-link-logo">
				<svg version="1.1" id="susuri" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
					 viewBox="0 0 370.6 64.3" style="enable-background:new 0 0 370.6 64.3;" xml:space="preserve">
				<g>
					<path d="M31.7,12.8c6.1,0,11.4,3.1,15.1,7.4l6.1-5.1c-4.2-6.2-11.8-10-21.2-10C18.8,5.2,11,12,11,20.6c0,18,32.8,12.2,32.8,23.5
						c0,4.3-3.4,7.4-10.3,7.4c-7.1,0-12.1-2.1-18.8-7.7L9,50.1c6.9,5.6,13.8,9,22.7,9c12.4,0,20.9-6.5,20.9-15.7
						c0-17.3-32.9-13.5-32.9-23.6C19.7,15.5,24.7,12.8,31.7,12.8z"/>
					<path d="M112.4,40.1c0,7.3-3.7,11.3-12.6,11.3c-8.7,0-13-4-13-11.3V6.8h-8.8v33.3c0,11.2,7.4,18.9,21.5,18.9
						c14.4,0,21.7-8,21.7-18.9V6.8h-8.8V40.1z"/>
					<rect x="352.9" y="6.8" width="8.7" height="50.6"/>
					<path d="M326.1,21.7v-1.7c0-7.7-5.2-13.2-17.9-13.2H286v50.6h8.7V36.3h13.9l10.9,21.1h9.1l-11.5-22
						C324.3,32.8,326.1,26.6,326.1,21.7z M308.9,29.9h-14.2V14.2h14.2c6.2,0,8.3,3,8.3,6.2c0,3.3,0,2.5,0,2.5
						C317.2,27.1,314.5,29.9,308.9,29.9z"/>
					<path d="M169,12.8c6.1,0,11.4,3.1,15.1,7.4l6.1-5.1C186,9,178.4,5.2,169,5.2c-12.8,0-20.7,6.8-20.7,15.4c0,18,32.8,12.2,32.8,23.5
						c0,4.3-3.4,7.4-10.3,7.4c-7.1,0-12.1-2.1-18.8-7.7l-5.6,6.3c6.9,5.6,13.8,9,22.7,9c12.4,0,20.9-6.5,20.9-15.7
						C190,26,157,29.9,157,19.8C157,15.5,162,12.8,169,12.8z"/>
					<path d="M249.4,40.1c0,7.3-3.7,11.3-12.6,11.3c-8.7,0-13-4-13-11.3V6.8H215v33.3c0,11.2,7.4,18.9,21.5,18.9
						c14.4,0,21.7-8,21.7-18.9V6.8h-8.8V40.1z"/>
				</g>
				</svg>		
			</a>
		</div><!-- .site-logo -->
		
		<div class="season-title">
			<div><a href="#" class="ui-link-season">...</a></div>
		</div><!-- .season-title -->
		
	</header><!-- #masthead -->
