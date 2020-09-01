<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package susuri
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'entry-diary' ); ?>>
	
	<div class="entry-date">
		<?php the_Date( 'j日n月y年' ); ?>
	</div>
	<div class="entry-content">
		<?php the_content(); ?>
	</div>
	<div class="entry-image">
		<?php susuri_post_thumbnail(); ?>
	</div>
	
	<footer class="entry-footer">
		<?php susuri_entry_footer(); ?>
	</footer><!-- .entry-footer -->
</article><!-- #post-<?php the_ID(); ?> -->
