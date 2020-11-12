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



// VARS
var canBeLoaded = true, // this param allows to initiate the AJAX call only if necessary
	bottomOffset = ( window.innerHeight * 2 ), // the distance (in px) from the page bottom when you want to load more posts
	container = ( 'undefined' != sf_loadmore_params.container ) ? sf_loadmore_params.container : '#main',
	scrollContainer = jQuery( '#showcase .container-circle' );




/* ON READY
 *
 * Fires on initial page load
 *
 */ 
jQuery( document ).ready( 
//	sf_loadmore()
);




/* LOAD MORE
 *
 * Ajax call to load more posts on scroll
 *
 */ 
function sf_loadmore(){
	
	// EVENT
	scrollContainer.on( 'scroll', function(){		
		
		var scrollTop = scrollContainer.scrollTop(),
			scrollContainer_h = scrollContainer.prop( 'scrollHeight' ); // need to make use of scrollheight instead of scrolltop as the container has a height property of 100% and overflow scroll (fixing safari jitter on animation)
		
		// CHECK SCROLL POSITION
		if( scrollTop >= ( scrollContainer_h - bottomOffset ) && canBeLoaded == true ){

			// make ajax call	
			sf_loadmore_ajaxcall();	
		}
	});	
}


function sf_loadmore_ajaxcall( post_id ){
	
	// VARS
	var selected_post = ( undefined !== post_id ) ? post_id.replace( '#post-', '' ) : 0;
	var next_post = ( su_menuItems.length >= sf_loadmore_params.current_page ) ? su_menuItems[ sf_loadmore_params.current_page ].id : 0;
	
	// CHECK REQUEST
//	if( sf_loadmore_params.current_page > jQuery( su_menuItems ).length ){
	if( ( jQuery( '#showcase .container-circle #' + next_post ).length ) && ( 0 !== next_post ) ){
		sf_loadmore_params.current_page++; // skip if element is loaded already
	}
	
	// DATA
	var data = {
		'action'  : 'loadmore',
		'query'   : sf_loadmore_params.posts,
		'page'    : sf_loadmore_params.current_page,
		'p'	      : selected_post
	};
			
	// AJAX CALL
	var ajaxLoaderRequest = jQuery.ajax({			
		url        : sf_loadmore_params.ajax_url,
		data       : data,
		type       : 'POST',
		beforeSend : function( xhr ) {
			// LOADER: insert a loading status
			canBeLoaded = false; // prevents additional ajax call while ajax calling 
//			var loader_msg = '<div class="loader-state">Loading ...</div>';
			// append loader
		},			
	})
	// on success
	.done( function( response ) { // response from the PHP action

		// LOADER: Remove loading status
//		jQuery( '.loader-state' ).remove();
		if( response ) {
			jQuery( container ).find( 'article:last-of-type' ).after( response ); // append to last post in container
			canBeLoaded = true; // the ajax is completed, now we can run it again
			
			if( ! post_id ){
				sf_loadmore_params.current_page++; // update coutner (post is loaded by scroll)
			}
			else{
				// scroll to anchor (post loaded selectively)
				jQuery( post_id )[ 0 ].scrollIntoView( 
					{ // options currently only supported at firefox
						behavior: 'smooth',
						block:    'start',
					}				
				);				
			}
		}				

	})

	// something went wrong  
	.fail( function() {
//		jQuery( content_container ).html( '<h2>Something went wrong.</h2><br>' );
	})

	// after all this time?
	.always( function() {
//		event.target.reset();
	});		
}