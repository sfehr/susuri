<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package susuri
 */

if( in_the_loop() ) :
	// remove the id attribute in the initial loop
	?>
	<article <?php post_class( 'season-entry' ); ?>>
	<?php
else :
	?>
	<article id="post-<?php the_ID(); ?>" <?php post_class( 'season-entry' ); ?>>
	<?php		
endif;	
		
	// to check if its initial/main query or custom query
	if( in_the_loop() ) :
	?>
		<a class="ui-link-season" href="#post-<?php the_ID(); ?>">
			<span class="itm itm-date">
				<?php the_Date( 'Y' ); ?>
			</span>
			<span class="itm itm-season">
				<?php 
				$season_term = get_post_meta( get_the_ID(), 'su_season_term', true );
				echo esc_html( $season_term );
				?>
			</span>
			<span class="itm itm-title">
				<?php 
				the_title();
				?>
			</span>
		</a>		
	<?php 
	else :
		?>
		<div class="season-container">
			<div class="season-header"></div>
			<div class="season-body">
				<?php echo su_get_images( 'su_image_image' ); // meta key, img size ?>
			</div>
		</div>
		<?php		
	endif;
	?>
	
	

	
	<footer class="entry-footer">
		<?php susuri_entry_footer(); ?>
	</footer><!-- .entry-footer -->
</article><!-- #post-<?php the_ID(); ?> -->
