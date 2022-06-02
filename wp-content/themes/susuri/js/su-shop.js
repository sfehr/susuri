/**
 * File su-shop.js
 * Author: Sebastian Fehr
 */

const body = document.querySelector( 'body' )
const filterButton = document.querySelector( '#su-filter' )
const filterOptions = document.querySelector( '#dropzone-options' )
const storefront = document.querySelector( '#shopwp-storefront' )


/* show or hides the filter options */
const showStorefrontOptions = () => {

    let toggleState = false
    const handleClick = ( e ) => {
        handleToggleState()
        filterOptions.style.display = toggleState ? 'block' : 'none'
        body.dataset.showOptions = toggleState ? true : false
    }
    const handleToggleState = () => {
        toggleState = !toggleState
    }

    filterButton.addEventListener( 'click', handleClick)    
}


/* scroll to storefront when filter is selected */
const filterOptionsInteraction = () => {

    const filterInputList = document.querySelectorAll( '.wps-input-label' )

    const handleChange = () => {
        storefront.scrollIntoView(
            {
                behavior: "smooth", 
                block: "start", 
                inline: "nearest"
            }
        )        
    }

    filterInputList.forEach( ( input ) => {
        input.removeEventListener( 'change', handleChange )
        input.addEventListener( 'change', handleChange )
    })

}



/* initialize */
showStorefrontOptions()


/* fires until wpshop is initialized */
wp.hooks.addAction('on.beforePayloadUpdate', 'shopwp', function ( itemsState ) {
    //console.log('on.beforePayloadUpdate', itemsState)

    filterOptionsInteraction()
})


/* exclude options from collections */
wp.hooks.addFilter(
    'storefront.availableCollections',
    'shopwp',
    function ( collections ) {
        return collections.filter( collection => 
            collection.label !== 'Top' && collection.label !== 'Featured'
        )
    }
)