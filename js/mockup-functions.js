function handleShowFilters() {
    // var toggle = document.querySelector('button.toggle-filters');
    var toggleContainer = document.querySelector('div.list-control-filter');

    if (toggleContainer.classList.contains('show-filters')) {
        console.log("Open");
        toggleContainer.classList.remove('show-filters');
    } else {
        console.log("Closed");
        toggleContainer.classList.add('show-filters');
    }
}



function handleMobileToggle() {
    var mobileToggleSearch = document.querySelector('.list-control-search-mobile__toggle');
    var mobileSearch = document.querySelector('.list-control-search__content');
    var mobileFilterToggle = document.querySelector('div.list-control-filter');
    if(mobileToggleSearch.classList.contains('show-search')) {
        mobileSearch.classList.remove('is-flex');
        mobileToggleSearch.classList.remove('show-search');
        mobileFilterToggle.classList.remove('is-flex');
        // mobileSearch.setAttribute('display', 'none');
    }
    else {
        mobileSearch.classList.add('is-flex');
        mobileToggleSearch.classList.add('show-search');
        mobileFilterToggle.classList.add('is-flex');
        // mobileSearch.setAttribute('display', 'flex');
    }
}