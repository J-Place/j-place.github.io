function handleShowFilters() {

    var toggle = document.querySelector('button.toggle-filters');
    var toggleContainer = document.querySelector('div.list-control-filter');

    if (toggleContainer.classList.contains('show-filters')) {
        console.log("Open");
        toggleContainer.classList.remove('show-filters');
    } else {
        console.log("Closed");
        toggleContainer.classList.add('show-filters');
    }

    // console.log(toggle.id);
    // console.log(toggleContainer);
    // console.log(toggleClass);
    // if (toggle.classList.contains('show-filters')) {
    //     console.log("Hide Filters");
    //     toggleContainer.classList.remove('show-filters');
    // } else {
    //     console.log("Show Filters");
    //     toggleContainer.classList.add('show-filters');
    // }

}