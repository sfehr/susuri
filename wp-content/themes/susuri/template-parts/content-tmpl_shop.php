<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package susuri
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<nav id="su-shop-navi">
		<div id="su-cart">
			<?php echo do_shortcode( '[wps_cart_icon]' ); ?>
		</div>
		<div id="su-filter">
			<span>Filter</span>
		</div>
	</nav>

	<div class="entry-content">
		<?php
		the_content(
			sprintf(
				wp_kses(
					/* translators: %s: Name of current post. Only visible to screen readers */
					__( 'Continue reading<span class="screen-reader-text"> "%s"</span>', 'susuri' ),
					array(
						'span' => array(
							'class' => array(),
						),
					)
				),
				wp_kses_post( get_the_title() )
			)
		);

		wp_link_pages(
			array(
				'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'susuri' ),
				'after'  => '</div>',
			)
		);
		?>

		<div id="dropzone-options"></div>
		<div id="dropzone-payload"></div>

	</div><!-- .entry-content -->

	<footer class="entry-footer">
		<?php susuri_entry_footer(); ?>
	</footer><!-- .entry-footer -->
</article><!-- #post-<?php the_ID(); ?> -->
