/**
 * File sf-loadmore.js
 * 
 *
 * 
 * ON READY 							 | Callback on initial load
 * sf_loadmore() 						 | Ajax call to load more posts on scroll
 *
 * 
 *
 * 
 *   
 */




/* ON READY
 *
 * Fires on initial page load
 *
 */ 
jQuery( document ).ready( 
	sf_loadmore()
);




/* LOAD MORE
 *
 * Ajax call to load more posts on scroll
 *
 */ 
function sf_loadmore(){
	
	var canBeLoaded = true, // this param allows to initiate the AJAX call only if necessary
		bottomOffset = ( window.innerHeight / 1 ), // the distance (in px) from the page bottom when you want to load more posts
		container = ( 'undefined' != sf_loadmore_params.container ) ? sf_loadmore_params.container : '#main';
	
	jQuery( window ).scroll( function(){		
		
		var scrollTop = jQuery( document ).scrollTop(),
			documentHeight = jQuery( document ).height();
		
		// CHECK SCROLL POSITION
		if( jQuery( document ).scrollTop() >= ( documentHeight - bottomOffset ) && canBeLoaded == true ){
			
			console.log( 'ajax' );
			
			// DATA
			var data = {
				'action' : 'loadmore',
				'query'  : sf_loadmore_params.posts,
				'page'   : sf_loadmore_params.current_page
			};			
			
			// AJAX CALL
			var ajaxLoaderRequest = jQuery.ajax({			
				url        : sf_loadmore_params.ajax_url,
				data       : data,
				type       : 'POST',
				beforeSend : function( xhr ) {
					// LOADER: insert a loading status
					canBeLoaded = false; // prevents additional ajax call while ajax calling 
//					var loader_msg = '<div class="loader-state">Loading ...</div>';
					// append loader
				},			
			})
			// on success
			.done( function( response ) { // response from the PHP action

				// LOADER: Remove loading status
//				jQuery( '.loader-state' ).remove();

				if( response ) {
					jQuery( container ).find( 'article:last-of-type' ).after( response ); // append to last post in container
					canBeLoaded = true; // the ajax is completed, now we can run it again
					sf_loadmore_params.current_page++; // update coutner
				}				

			})

			// something went wrong  
			.fail( function() {
//				jQuery( content_container ).html( '<h2>Something went wrong.</h2><br>' );
			})

			// after all this time?
			.always( function() {
//				event.target.reset();
			});	
			
		} // end if			
	});	
}