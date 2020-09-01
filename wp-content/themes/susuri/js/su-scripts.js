/**
 * File su-scripts.js
 * 
 *
 * 
 * ON READY 							 | Callback on initial load
 * ON AJAX SUCCESS						 | Callback on ajax success
 * ON RESIZE							 | Resize Event Handler
 * sf_display_dashboard() 				 | Displays the dashboard
 * sf_horizontal_image_slide() 			 | Calculates the iamge with base on the image-ratio
 * sf_showcase_scroll() 			 	 | Handles the scroll event for the showcase section 
 * sf_viwport_handler() 			 	 | adds/removes css classes to the body depending which page section is in viewport 
 * isInViewport()						 | Determines weather a element is in viewport or not
 * sf_video_player()					 | Functions for the video player
 * sf_intl_numbers()					 | Converts numbers into a specifyed international format
 * sf_horizontal_scroll()				 | Handles the vertical scroll momentum and translate it into a horizontal scroll
 *
 *
 *
 *  
 * 
 *
 * 
 *   
 */



// Todo:
// replace with and height attribute with data-ratio setting in php.




/* ON READY
 *
 * Fires on initial page load
 *
 */ 
jQuery( document ).ready( 
	sf_display_dashboard(),
	sf_horizontal_image_slide(),
	sf_display_diary_image(),
	sf_showcase_scroll(),
//	sf_viwport_handler(),
	sf_video_player(),
	sf_mobile_menu(),
	sf_intl_numbers( 'zh-Hans-CN-u-nu-hanidec' ),
	sf_horizontal_scroll()
	
//	sf_horizontal_image_scroll()
);



/* ON AJAX SUCCESS
 *
 * Fires after ajax success
 *
 */
jQuery( document ).ajaxSuccess( function() {
	console.log( 'ajax success' );
	sf_horizontal_image_slide();
	sf_horizontal_scroll();
});




/* RESIZE EVENTS
 *
 * Fires after window resize with a delay of 100ms
 *
 */
// resize timeout
var resizing;
window.onresize = function() {
	
	clearTimeout( resizing );
		
	resizing = setTimeout( function() {
		sf_horizontal_image_slide();
		sf_horizontal_scroll();
		sf_mobile_menu();
	}, 100);
};



/* DASHBOARD
 *
 * Displays the dashboard
 *
 */ 
function sf_display_dashboard(){
	
	jQuery( 'body' ).on( 'click', '.ui-link-logo, .ui-link-season', function( e ){
		
		e.preventDefault();
		jQuery( 'body' ).toggleClass( 'view-dashboard' );
		
		// exit fullscreen video
		jQuery( 'body' ).removeClass( 'view-fullscreen' );
		jQuery( '.itm-mov, .ui-panel' ).removeClass( 'expanded' );
	});
}



/* HORIZONTAL SLIDE
 *
 * Calculates the iamge with base on the image-ratio
 *
 */ 
function sf_horizontal_image_slide(){
	
	var container_img = jQuery( 'body' ).find( '#showcase .season-entry .entry-media' );
	var container_h = container_img.height(); 
	
	container_img.each( function(){
		
		var image_w = jQuery( this ).children( 'img' ).attr( 'width' );
		var image_h = jQuery( this ).children( 'img' ).attr( 'height' );
		var ratio_h = Number( image_w / image_h ).toFixed( 3 );
		var width = Math.round( container_h * ratio_h )
		
		jQuery( this ).width( width );

	});
	
}



/* DIARY IMAGE
 *
 * Displays the image of the first diary-entry and handles image exchange on hover
 *
 */ 
function sf_display_diary_image(){
	
	// VARS
	var container = jQuery( '.diary .box-image' );
	var latest_img = jQuery( '.diary .entry-diary' ).first().find( '.entry-image img' ).clone();
	
	// initial load
	jQuery( container ).append( latest_img );
	
	// get current image
	jQuery( 'body' ).on( 'mouseenter', '.entry-diary', function() { 
		jQuery( container ).empty();
		// clone current image and append to container
		jQuery( this ).find( '.entry-image img' ).clone().appendTo( container );
	});
	
	// remove the image
	jQuery( 'body' ).on( 'mouseleave', '.entry-diary', function() {
		jQuery( container ).empty();
		jQuery( container ).append( latest_img );
	});
	
}



/* SHOWCASE SCROLL
 *
 * Handles the scroll event for the showcase section
 *
 */ 
function sf_showcase_scroll(){
	
	var container = jQuery( '.container-circle' );
	var container_w = container.innerWidth();
	var container_h = container.innerHeight();
	var circle =  jQuery( '<div>', { 
		class: 'circle'
	});
	var cycle = Number( container.width() * 2 );
	var cycle_position = 0;
	var media = {};	
	var is_coarse = matchMedia( '(pointer:coarse)' ).matches;
	
	// Object Constructor
	function EntryMedia( img_src, type, orientation ) {
		
		this.img_src = img_src;
		this.type = type;
		this.orientation = orientation;

	}	
	
	// Indexing media
	container.parent().find( '.itm-showcase' ).each( function( index ){
		
		var img_src = jQuery( this ).children( 'img' ).attr( 'src' );
		var type;
		var orientation;
		
		// get orientation class
		orientation = ( jQuery( this ).hasClass( 'landscape' ) ) ? 'landscape' : 'portrait';
		
		// adding circle element to circle container
		for (var i = 0; i < 2; i++) {
			jQuery( circle ).clone().prependTo( container );
		}
		
		// get entry type
		type = ( jQuery( this ).hasClass( 'itm-img' ) ) ? 'image' : 'movie';
		
		// creating the objects
		media[ index ] = new EntryMedia( img_src, type, orientation );
		
		// set image and orientation for initial load
		container.css( 'background-image', 'url(' + media[ cycle_position ].img_src + ')' );
		container.addClass( media[ cycle_position ].orientation );
	});

	
	// Scroll Event
	jQuery( document ).on( 'scroll', function(){
		
		// update units (in case of resize window)
		var circle_w = ( jQuery( '.circle' ).innerWidth() + 2 ); // +2 correction value (border thicknes ?)
		cycle = Number( circle_w * 2 );
		var new_position = Number( Math.floor( jQuery( this ).scrollTop() / cycle ) );
		
		// check if the end of the container/scene has been reached		
		var scroll_pos = ( jQuery( '.circle' ).length * circle_w ) - jQuery( this ).scrollTop() - jQuery( window ).height() ;		
		if( scroll_pos <= 0 ){
			return; // early escape
		}
		
		// when cycle/section is changed
		if( cycle_position != new_position ){
			
			// update position
			cycle_position = new_position;
			
			// exchange the background image for image items
			container.css( 'background-image', 'url(' + media[ cycle_position ].img_src + ')' );
			
			// add class when a movie item is displayed
			if( media[ cycle_position ].type == 'movie' ){
				container.parent( '#showcase' ).addClass( 'view-mov' );
			}
			else{
				container.parent( '#showcase' ).removeClass( 'view-mov' );
			}
			
			// check the orientation of the background image
			if( media[ cycle_position ].orientation == 'portrait' ){
				container.addClass( 'portrait' );
			}
			else{
				container.removeClass( 'portrait' );
			}
		}	
		
	});
}



/* VIEWPORT HANDLER
 *
 * adds/removes css classes to the body depending which page section is in viewport 
 *
 */
/*
function sf_viwport_handler(){
	
	// set initial class
	jQuery( 'body' ).addClass( 'view-showcase' );
	
	var box = document.querySelector( '#showcase' );
	
	document.addEventListener( 'scroll', function() {
		
		if( isInViewport( box ) ){
			jQuery( 'body' ).addClass( 'view-showcase' );
		}
		else{
			jQuery( 'body' ).removeClass( 'view-showcase' );
		}

	}, {
		passive: true
	});
}
*/


/* IS IN VIEWPORT
 *
 * Determines weather a element is in viewport or not
 *
 */
/*
function isInViewport( el ) {
	
	var offset_y = 0;
	// check for touch device
	var is_coarse = matchMedia( '(pointer:coarse)' ).matches;
	
	if( is_coarse ){
		// a little offset for mobile devices
		offset_y = 40;
	}
	
    const rect = el.getBoundingClientRect();

    return (
		rect.top >= ( 0 - offset_y ) &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)

    );
}
*/



/* VIMEO PLAYER
 *
 * Functions for the video player
 *
 */
function sf_video_player() {
	
	var video_url = su_params.movie_url; // get from wp localize_scripts
	var options = {
		url: video_url,
		byline: false,
		portrait: false,
		title: false,
		controls: false,
	};	 
	var player = new Vimeo.Player( 'mov-1', options );
	var movementTimer = null;
	var ui_bar = jQuery( '.progress-bar .bar' );
	var ui_progress = jQuery( '.progress-bar .progress' );
	var mov_duration;
	

	// GET PLAYER DATA
	// get duration
	player.getDuration().then( function( duration ) {
		// duration = the duration of the video in seconds
		mov_duration = duration;
	}).catch( function( error ) {
		// an error occurred
	});	
	

	// PLAYER EVENTS
	// Play
	player.on( 'play', function(){
		jQuery( 'body' ).addClass( 'player-playing' );
	});

	// Pause
	player.on( 'pause', function(){
		jQuery( 'body' ).removeClass( 'player-playing' );
	});
 
	// Timeupdate
	player.on( 'timeupdate', function( data ){
		
		var pos_x = ( data.percent * 100 ); // in percentage (%)
		
		// check if progress is being dragged
		if( ui_progress.hasClass( 'dragging' ) ){
			return; // abort
		}
		
		// update progress position
		ui_progress.css( 'left', pos_x + '%' );
	});


	// PLAYER INTERACTION
	// Play
	jQuery( 'body' ).on( 'click', '.movie .ui-panel .play', function( e ){
		e.preventDefault(); // prevent selection start (browser action)
		player.play();
	});
	
	// Pause
	jQuery( 'body' ).on( 'click', '.movie .ui-panel .pause, .ui-link-logo, .ui-link-season', function( e ){
		e.preventDefault(); // prevent selection start (browser action)
		player.pause();
	});
	
	// Mousemove
	jQuery( 'body' ).on( 'mousemove click', '.movie .ui-panel', function(){
		
		// show controls
		jQuery( '.ui-panel' ).addClass( 'show' );
		
		clearTimeout( movementTimer );
		movementTimer = setTimeout( function(){
			// hide controls
			jQuery( '.ui-panel' ).removeClass( 'show' );
		}, 3000 );
	});	 

	// Fullscreen
	jQuery( 'body' ).on( 'dblclick', '.movie .ui-panel', function( e ){
		e.preventDefault(); // prevent selection start (browser action)
		jQuery( '.itm-mov, .ui-panel' ).toggleClass( 'expanded' );
		jQuery( 'body' ).toggleClass( 'view-fullscreen' );
	});
		
	// Escape Fullscreen
	jQuery( 'body' ).on( 'keyup', function( e ){
		if( e.key === 'Escape' ){
			jQuery( '.itm-mov, .ui-panel' ).removeClass( 'expanded' );
			jQuery( 'body' ).removeClass( 'view-fullscreen' );			
		}
	});
	
	// Progress Bar Seeking
	let slider = document.body.querySelector( '.progress-bar .bar' );
	let thumb = document.body.querySelector( '.progress-bar .progress' );

    thumb.onmousedown = function( event ) {
		event.preventDefault(); // prevent selection start (browser action)

		let shiftX = event.clientX - thumb.getBoundingClientRect().left;
		// shiftY not needed, the ui_progress moves only horizontally		

		document.addEventListener( 'mousemove', onMouseMove );
		document.addEventListener( 'mouseup', onMouseUp );

		function onMouseMove( event ) {
			let newLeft = event.clientX - shiftX - slider.getBoundingClientRect().left;

			// the pointer is out of slider => lock the thumb within the bounaries
			if ( newLeft < 0 ) {
				newLeft = 0;
			}
			let rightEdge = slider.offsetWidth - thumb.offsetWidth;
			if ( newLeft > rightEdge ) {
				newLeft = rightEdge;
			}
		
//			thumb.style.left = newLeft + 'px';
			let pos_precentage = ( ( 100 * newLeft ) / slider.offsetWidth ).toFixed( 2 ); // in percentage
			thumb.style.left = pos_precentage + '%';
			thumb.classList.add( 'dragging' );
			
			// update video position
			var new_seconds = ( ( mov_duration * pos_precentage ) / 100 ).toFixed( 2 ); // in seconds
			player.setCurrentTime( new_seconds ); // set time according to the new progress position 
		}

		function onMouseUp() {
			document.removeEventListener( 'mouseup', onMouseUp );
			document.removeEventListener( 'mousemove', onMouseMove );
			thumb.classList.remove( 'dragging' );
		}

	};

	ui_progress.ondragstart = function() {
		return false;
	};	 
}



/* MOBILE MENU
 *
 * Handles the mobile menu
 *
 */
function sf_mobile_menu() {
	
	var dash = jQuery( '#dashboard .dash' );

	if( jQuery( window ).width() <= 850 ){
		
		// add class to body
//		jQuery( 'body' ).addClass( 'view-mobile' );
		// add 'dash-expanded' for menu handling on viewport size 850px
		dash.on( 'click', function(){
			dash.removeClass( 'dash-expanded' );
//			dash.not( jQuery( this ) ).removeClass( 'dash-expanded' );
			jQuery( this ).toggleClass( 'dash-expanded' );			
		});	
	}
	else{
		// remove 'dash-expanded' class in case window size increases
		dash.removeClass( 'dash-expanded' );
//		jQuery( 'body' ).removeClass( 'view-mobile' );
	}
	
}



/* INTL NUMBERS
 * @param	string	locale
 * Converts numbers into a specifyed international format
 *
 */
function sf_intl_numbers( $locale ) {
	
	var numbers = jQuery( '.entry-date' ).each( function( ind, el ){
		
		var date = jQuery( el ).text();
		var dateNumbers = date.match( /\d+/gi );
		
		dateNumbers.forEach( function( number, index ){
			
			var numberTranslation = new Intl.NumberFormat( $locale, {
				// Options
				useGrouping: false,
			}).format( number );
			
			date = date.replace( number, numberTranslation );
		});
		
		jQuery( this ).text( date );
	});
}



/* HORIZONTAL SCROLL
 *
 * Handles the vertical scroll momentum and translate it into a horizontal scroll
 *
 */ 
function sf_horizontal_scroll(){
	
	// UNITS
	var vw = window.innerWidth;
	var vh = window.innerHeight;
	var containerAll = jQuery( '#showcase .season-entry' );
	
	containerAll.each( function( index, container ){
		
		var target = jQuery( container ).find( '.season-container' );
		var wrapper = jQuery( container ).find( '.season-body' );
		var containerHeight = wrapper.width();

		// adjust height of the sticky container to have enough scroll space
		jQuery( container ).height( containerHeight );

		// define the verticl dimension of the container and allow scrolling only inside its range
		var offsetTop = jQuery( container ).offset().top;
		var offsetbottom = ( offsetTop + containerHeight );

		jQuery( document ).on( 'scroll', function(){

			var scrollTop = jQuery( this ).scrollTop();
			var rangeTop = scrollTop - offsetTop;
			var rangeBottom = scrollTop - offsetbottom;

			if( ( rangeTop >= 0 ) && ( rangeBottom <= 0 ) ){
				// scroll left
				target.scrollLeft( rangeTop );
			}
			else{
				target.scrollLeft( 0 ); // reset the scroll position back properly
			}
		});		
		
	});
}


/* HORIZONTAL SCROLL WITH TWEEN AND SCROLL MAGIC
 *
 * Calculates the iamge with base on the image-ratio
 *
 */
/*
function sf_horizontal_image_scroll(){
	
	// VARS
	var container = jQuery( '#showcase .container-circle .season-container' );
	var target = jQuery( '.season-container' );
	var wrapper = jQuery( '.season-body' );
	
	// UNITS
	const vw = window.innerWidth;
	const vh = window.innerHeight;
	const distance = wrapper.width() - target.width();
	const containerHeight = wrapper.width() - vw + vh;
	
	console.log( vw );
	console.log( vh );
	console.log( distance );
	console.log( containerHeight );
	console.log( 'top offset: ' );
	console.log( jQuery( '#showcase .season-entry' ).offset().top );
	
	container.css( 'border', '5px solid blue' );
	target.css( 'border', '5px solid red' );
	wrapper.css( 'border', '5px solid green' );
	
	// PREPARATIONS
	container.height( containerHeight );
	
	// CONTROLER
	var controller = new ScrollMagic.Controller();

	// TWEEN
	var tween = new TweenMax.to( wrapper, 1.5, { // duration 1.5 will be overwritten by the scene duration
    	css: {
			x: ( distance * -1 )
		}, 
		ease: Linear.easeNone
	});
	
	// SCENE
	var scene = new ScrollMagic.Scene( {
		triggerElement: '#showcase .container-circle .season-container',
//		triggerElement: '#showcase .container-circle',
		duration: distance, 
		offset: ( vh / 2 ), 
//		offset: jQuery(container).offset().top
	})
	.setPin( '#showcase .container-circle .season-container' )
	.setTween( tween )
	.addIndicators() // for debugging only
	.addTo( controller );
}
*/
