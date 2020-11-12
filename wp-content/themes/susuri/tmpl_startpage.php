<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package susuri
 */

get_header( 'su' );
?>

	<main id="primary" class="site-main">

		<?php
		
		// VARS
		$post_data = array(); // array to store the post data and use it in a flexible way
		$dashboard_id = su_get_ID_by_slug( 'dashboard' );
		$news_text = get_post_meta( $dashboard_id, 'su_news_text', true );
		$about_content = get_the_content( '', '', $dashboard_id );
		$contact = get_post_meta( $dashboard_id, 'su_contact_contact', true );
		$contact_instagram = get_post_meta( $dashboard_id, 'su_contact_instagram', true );
		$stores = su_get_stores( $dashboard_id );
		$initial = true;
		
		// LOOP
		while ( have_posts() ) :
			the_post();

			// store the post data in the variable
			ob_start();
			get_template_part( 'template-parts/content', get_post_type() );
			$post_data[ get_post_type() ][] = ob_get_contents();
			ob_end_clean();
			
			// get showcase and season images of the first season post only
			if( ( get_post_type() == 'season' ) && $initial ){
				$initial = false;
				$post_data[ 'showcase' ] = su_get_images( 'su_showcase_image', 'itm-showcase', '', true ); // meta key, class, img size, skip lazy
				$post_data[ 'season_img' ] = su_get_images( 'su_image_image', '', '', false ); 
			}

		endwhile; // End of the loop.
		?>
		
		<div id="dashboard">
			
			<div class="dash seasons">
				<div class="box-title">
					<?php echo esc_html__( 'Seasons', su_get_theme_text_domain() ); ?>
				</div>				
				<div class="box-content">
					<?php echo implode( '', $post_data[ 'season' ] ); ?>
				</div>
			</div><!-- .dash seasons -->
			
			<div class="dash movie">
				<div class="box-title">
					<?php echo esc_html__( 'Movie', su_get_theme_text_domain() ); ?>
				</div>
				<div class="box-content">
					<?php echo su_get_player_markup(); ?>
					<div class="entry-media itm-mov">
						<div id="mov-1" class="mov"></div>
					</div>
				</div>
			</div><!-- .dash movie -->
			
			<div class="dash news">
				<div class="box-title">
					<?php echo esc_html__( 'News', su_get_theme_text_domain() ); ?>
				</div>
				<div class="box-content ja">
					<?php echo wpautop( $news_text ); ?>
				</div>
			</div><!-- .dash news -->
			
			<div class="dash about">
				<div class="box-title">
					<?php echo esc_html__( 'About', su_get_theme_text_domain() ); ?>
				</div>
				<div class="box-content ja">
					<?php echo $about_content ?>
				</div>
			</div><!-- .dash about -->
			
			<div class="dash contact">
				<div class="box-title">
					<?php echo esc_html__( 'Contact', su_get_theme_text_domain() ); ?>
				</div>
				<div class="box-content">
						<?php echo esc_html( $contact ) ?>
						<a href="<?php echo esc_url( $contact_instagram ) ?>" target="_blank"><?php echo esc_html__( 'Instagram', su_get_theme_text_domain() ); ?></a>					
				</div>
			</div><!-- .dash contact -->
			
			<div class="dash stores">
				<div class="box-title">
					<?php echo esc_html__( 'Stockist', su_get_theme_text_domain() ); ?>
				</div>
				<div class="box-content ja">
					<?php echo $stores ?>
				</div>	
			</div><!-- .dash stores -->			
			
			<div class="dash diary">
				<div class="box-title">
					<?php echo esc_html__( 'Diary', su_get_theme_text_domain() ); ?>
				</div>				
				<div class="box-content ja">
					<?php echo implode( '', $post_data[ 'diary' ] ); ?>
				</div>
				<div class="box-image">
				</div>	
			</div><!-- .dash seasons -->			
			
		</div><!-- #dashboard -->
		
		<div id="showcase">
			
			<div class="container-circle">
				<?php  
				echo $post_data[ 'showcase' ];
				sf_loadmore_ajax_handler();	// start custom query
				?>			
			</div>
			
		</div><!-- #showcase -->	

	</main><!-- #main -->

<?php
get_sidebar();
get_footer();
