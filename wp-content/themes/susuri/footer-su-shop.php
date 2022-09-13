<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package susuri
 */

/* 
$privacy_page_id = su_get_ID_by_slug( 'privacy-policy' );
$privacy_content = get_the_content( '', '', $privacy_page_id );
<div class="shop-privacy-policy-container">
<?php echo $privacy_content ?>
</div>
*/
?>

	<footer id="colophon" class="site-footer">

		<?php
			wp_nav_menu( array( 
				'theme_location' => 'su-shop-footer-menu', 
				'container_class' => 'shop-footer-navi' ) ); 
		?>		

		<div class="site-info">
			<a href="<?php echo esc_url( __( 'https://wordpress.org/', 'susuri' ) ); ?>">
				<?php
				/* translators: %s: CMS name, i.e. WordPress. */
				printf( esc_html__( 'Proudly powered by %s', 'susuri' ), 'WordPress' );
				?>
			</a>
			<span class="sep"> | </span>
				<?php
				/* translators: 1: Theme name, 2: Theme author. */
				printf( esc_html__( 'Theme: %1$s by %2$s.', 'susuri' ), 'susuri', '<a href="http://www.sebastianfehr.com">Sebastian Fehr</a>' );
				?>
		</div><!-- .site-info -->
	</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
