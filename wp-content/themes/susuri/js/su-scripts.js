/**
 * File su-scripts.js
 * Author: Sebastian Fehr
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
 * sf_intersection_observer() 			 | Handles page sections which are in the viewport
 * sf_video_player()					 | Functions for the video player
 * sf_intl_numbers()					 | Converts numbers into a specifyed international format
 * sf_horizontal_scroll()				 | Handles the vertical scroll momentum and translate it into a horizontal scroll
 * sf_season_navigation()				 | Handles the events for the season navigation
 * sf_intersection_observer()			 | Handles page sections which are in the viewport
 * sf_sort_seasons()					 | Sorts the season articles according to the menu order
 * sf_get_scroll_direction()   			 | Adds evelnt listener to an element to check on scroll direction
 *  
 * 
 *
 * 
 *   
 */



// OBJECTS
var su_menuItems = {};

// VARS
var su_sectionIndex = {
	'index'     : 0,
	'direction' : '',
};



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
	sf_intersection_observer(),
	sf_video_player(),
	sf_mobile_menu(),
	sf_intl_numbers( 'zh-Hans-CN-u-nu-hanidec' ),
	sf_horizontal_scroll(),
	sf_season_navigation(),
	sf_sort_seasons(),
	sf_get_scroll_direction( '#showcase .container-circle' )
);



/* ON AJAX SUCCESS
 *
 * Fires after ajax success
 *
 */
jQuery( document ).ajaxSuccess( function() {
	sf_horizontal_image_slide();
	sf_horizontal_scroll();
	sf_intersection_observer();
	sf_sort_seasons();
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
	}, 100 );
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
	var circle = jQuery( '<div>', { 
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
	
	});
	
	// update cycle position in case the scroll position of the initial load is not at the top, max value media.length
	var mediaLengh = ( Object.keys( media ).length - 1 );
	var currentCycle = Number( Math.floor( container.scrollTop() / cycle ) );
	cycle_position = currentCycle < mediaLengh ? currentCycle : mediaLengh;
	
	// set image and orientation for initial load
	container.css( 'background-image', 'url(' + media[ cycle_position ].img_src + ')' );
	container.addClass( media[ cycle_position ].orientation );
	
	// Scroll Event
	container.on( 'scroll', function(){ // depending on the position property value the event should listen to document
		
		// update units (in case of resize window)
		var circle_w = ( jQuery( '.circle' ).innerWidth() + 2 ); // +2 correction value (border thicknes ?)
		cycle = Number( circle_w * 2 );
		var new_position = Number( Math.floor( jQuery( this ).scrollTop() / cycle ) );
		
		// check if the end of the container/scene has been reached and avoid negative scrollTop (safari bounce)
//		var scroll_pos = ( jQuery( '.circle' ).length * circle_w ) - jQuery( this ).scrollTop() - jQuery( window ).height();
		var scroll_pos = ( jQuery( '.circle' ).length * circle_w ) - jQuery( this ).scrollTop();
		if( ( scroll_pos <= 0 ) || ( jQuery( this ).scrollTop() < 0 ) ){
			console.log( 'out' );
			jQuery( container ).css( 'background-image', 'none' ); // hide background: safai and mobile overscroll fix. avoid image on image
			return; // early escape
		}
		else{
			container.css( 'background-image', 'url(' + media[ cycle_position ].img_src + ')' ); // add background image again when scroll up to showcase section
		}
		
		// when cycle/section is changed
		if( cycle_position !== new_position ){
			
			// update position
			cycle_position = new_position;
			
			// exchange the background image for image items
			container.css( 'background-image', 'url(' + media[ cycle_position ].img_src + ')' );
			
			// add class when a movie item is displayed
			if( media[ cycle_position ].type === 'movie' ){
				container.parent( '#showcase' ).addClass( 'view-mov' );
			}
			else{
				container.parent( '#showcase' ).removeClass( 'view-mov' );
			}
			
			// check the orientation of the background image
			if( media[ cycle_position ].orientation === 'portrait' ){
				container.addClass( 'portrait' );
			}
			else{
				container.removeClass( 'portrait' );
			}
		}		
	});
}



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
		// add 'dash-expanded' for menu handling on viewport size 850px
		dash.on( 'click', function(){
			dash.removeClass( 'dash-expanded' );
			jQuery( this ).toggleClass( 'dash-expanded' );			
		});	
	}
	else{
		// remove 'dash-expanded' class in case window size increases
		dash.removeClass( 'dash-expanded' );
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
	var scrollThreshhold = 0.75;
	
	containerAll.each( function( index, container ){
		
		var target = jQuery( container ).find( '.season-container' );
		var wrapper = jQuery( container ).find( '.season-body' );
		var containerHeight = ( wrapper.width() - vw + vh );
//		var containerHeight = ( wrapper.width() >= vw ) ? ( wrapper.width() - vw + vh ) : vw;

		// adjust height of the sticky container to have enough scroll space
		jQuery( container ).height( containerHeight );

		jQuery( '#showcase .container-circle' ).on( 'scroll', function(){ // depending on the position property the event should listen to document
			
			// define the verticl dimension of the container and allow scrolling only inside its range
			var offsetTop = jQuery( container ).offset().top;

			if( ( offsetTop <= 0 ) ){
				
				// convert to positive number
				offsetTop = Math.abs( offsetTop ); 
				// scroll left
				target.scrollLeft( offsetTop );
				// scroll progress
				var scrollProgress = ( offsetTop / ( containerHeight - ( vh / 1 ) ) ).toFixed( 2 ); // value in %
				var tweenProgress = 0;
				
				// TWEEN (inside)
				if( ( scrollProgress >= 1 ) && ( offsetTop <= containerHeight ) ){
					
					su_sectionIndex.tween = 'on';
					tweenProgress = ( ( 1 * ( offsetTop - containerHeight + vh ) ) / ( vh ) ).toFixed( 2 );
					
					// prev
					jQuery( '.season-title .ui-link-season' ).eq( index ).css({
						'display'  : 'grid',
						'opacity'  : ( 1 - tweenProgress ),
						'top'      : ( ( ( -20 ) * tweenProgress ) / 1 ) + 'px'
					})
					
					// next
					jQuery( '.season-title .ui-link-season' ).eq( index + 1 ).css({
						'display'  : 'grid',
						'opacity'  : tweenProgress,
						'top'      : ( ( ( 20 ) * ( 1 - tweenProgress ) ) / 1 ) + 'px'
					})
				}
				
				// TWEEN (outside)
				else{
					// hide inactive links
					jQuery( '.season-title .ui-link-season' ).css({
						'display'  : 'none',
						'opacity'  : 0,
						'top'      : 0,
					});
					
					// show current link outside of the tween
					jQuery( '.season-title .ui-link-season' ).eq( su_sectionIndex.index ).css({
						'display'  : 'grid',
						'opacity'  : 1,
						'top'      : 0,
					});
				}
			}
			else{
				// reset the scroll position back properly
				target.scrollLeft( 0 ); 
			}
		});
	});
}



/* SEASON NAVIGATION
 *
 * Handles the events for the season navigation
 *
 */ 
function sf_season_navigation(){
	
	// INITIAL LOAD
	
	// initialize season title
	var seasonTitle = jQuery( '.season-title' ); // initial site title
	var seasonLinks = jQuery( '#dashboard .seasons article .ui-link-season' ).clone();
	
	seasonLinks.each( function( ind, ele ){
		jQuery( ele ).attr( 'href', '#' );
		jQuery( ele ).attr( 'data-order', ind );
	});
	
	// hide all links except first one
	seasonLinks.css( 'position', 'absolute' );
	seasonLinks.not( ':eq( 0 )' ).css( 'opacity', 0 );
	seasonLinks.not( ':eq( 0 )' ).hide();
	
	// add seasnon links into season title
	seasonTitle.html( seasonLinks );
	
	// Object Constructor
	function MenuItem( id, order ,link ) {
		
		this.id = id;
		this.order = order;
		this.link = link;

	}	
	
	// indexing the objects
	jQuery( '#dashboard .seasons .box-content article' ).each( function( ind, el ){
		
		// get values
		var menu_link = jQuery( el ).find( 'a' );
		var menu_id = menu_link.attr( 'href' ).replace( '#', '' );
		var menu_order = ind;
		
		// create object
		su_menuItems[ ind ] = new MenuItem( menu_id, menu_order, menu_link );
	});
	
	// CLICK EVENTS
	jQuery( '.seasons .ui-link-season' ).on( 'click', function( e ) { 
		
		e.preventDefault(); 
		// get the destination
		var dest = jQuery( this ).attr( 'href' );
		
		// check if element is loaded already		
		if( jQuery( dest ).length ){
			
			// scroll to anchor		
			jQuery( dest )[ 0 ].scrollIntoView( 
				{ // options currently only supported at firefox
					behavior: 'smooth',
					block:    'start',
				}
			);	
		}
		else{
			// ajax call, only if there are posts left to call
			sf_loadmore_ajaxcall( dest );
		}
	});
	
}



/* INTERSECTION OBSERVER
 *
 * Handles page sections which are in the viewport
 *
 */ 
function sf_intersection_observer(){
		
	let sections = document.querySelectorAll( '#showcase article' );
	let vh = window.innerHeight;
	let sectionIndexOld = 0;
	let sectionIndexNew = 0;
	
	// Intersection Handler
	function handleIntersection( entries, observer ) {

		entries.map( ( entry ) => {
			
			// INTERSECTING CHECK 
			if ( entry.isIntersecting && ( entry.intersectionRect.height >= ( vh / 2 ) ) ){ // make sure that half of the viewport height is passed
				
				// get active element
				sectionIndexNew = Number( jQuery( entry.target ).attr( 'data-order' ) );
				
				// call the function only on a new section index
				if( sectionIndexNew !== sectionIndexOld ){
					su_sectionIndex.index = sectionIndexNew;
				}
			}
			
			sectionIndexOld = sectionIndexNew; // update sectionIndexOld
		});
	}
	
	// STEPS ARRAY
	function buildThresholdList() { // Building the array of threshold ratios
		
		let thresholds = [];
		let numSteps = 100;

		for( let i = 1.0; i <= numSteps; i++ ) {
			let ratio = i / numSteps;
			thresholds.push( ratio );
		}

		thresholds.push( 0 );
		return thresholds;
	}	
	
	// OPTIONS
	let options = {
		root: document.querySelector( '#showcase .container-circle' ),
//		rootMargin: '-5% 0% -5% 0%',
		threshold: buildThresholdList()
	};		

	// INIT
	const observer = new IntersectionObserver( handleIntersection, options );
	sections.forEach( section => observer.observe( section ) );
}



/* SORT SEASONS
 *
 * Sorts the season articles according to the menu order
 *
 */ 
function sf_sort_seasons(){
	
	var articles = jQuery( '#showcase .season-entry' );
	
	// get data-order
	articles.each( function( ind, ele ){
		var id = jQuery( this ).attr( 'id' );
		var order = jQuery( '#dashboard .seasons .' + id ).index();
		jQuery( ele ).attr( 'data-order', order );
	});
	
	// sort according data-order
	articles.sort( function( a, b ) {
		return a.dataset.order > b.dataset.order ? 1 : ( a.dataset.order < b.dataset.order ? -1 : 0 );
	}).appendTo( '#showcase .container-circle' );	
	
}



/* GET SCROLL DIRECTION
 *
 * Adds evelnt listener to an element to check on scroll direction
 *
 */ 
function sf_get_scroll_direction( element ){

	var lastScrollTop = jQuery( element ).scrollTop();
	
	jQuery( element ).scroll( function( event ){
		
		var st = jQuery( this ).scrollTop();
		if( st > lastScrollTop ){
			su_sectionIndex.direction = 'down';
		} 
		else{
			su_sectionIndex.direction = 'up';
		}
		
		lastScrollTop = st;
	});	
}


