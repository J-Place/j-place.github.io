
$(document).ready(function() {

    let lookupByNameInput = $("#lookupLocationName")
    let lookupByNameConfirm = $("#location-information__content .lookup-confirm");
    let lookupByLocationInput = $("#lookupLocationCityState");
    let lookupByLocationList = $(".list--lookup.locations");
    // location-information__locations-list
    let savedLocationsList = $(".location-information__locations-list");
    let lookupByLocationConfirm = $(".location-column button");
    let addNewLocationBtn = $("#addLocationBtn");
    let cancelAddNewLocationBtn = $("#cancelAddLocationBtn");
    let addNewLocationForm = $(".event-location-details");
    // let confirmAddNewLocation = $("#addLocation");
    let confirmAddNewLocation = $("#confirmNewLocation");

    $(lookupByNameInput).click(function(e) {
        e.preventDefault();
        resetLocationInputs();
        showLocationNameBtn();
        resetAddNewLocation();
    });

    $(lookupByNameConfirm).click(function(e) {
        e.preventDefault();
        resetLocationInputs();
    });

    $(lookupByLocationInput).click(function(e) {
        e.preventDefault();
        resetLocationInputs();
        $(lookupByLocationList).show();
        $(addNewLocationForm).hide();
        $(".ui-lookup-filter-zip").hide();
    });

    $(lookupByLocationConfirm).click(function(e) {
        e.preventDefault();
        resetLocationInputs();
    });

    $(addNewLocationBtn).click(function(e) {
        e.preventDefault();
        resetLocationInputs();
        $(addNewLocationBtn).hide();
        $(addNewLocationForm).show();
        // $(cancelAddNewLocationBtn).show();
    });

    $(cancelAddNewLocationBtn).click(function(e) {
        e.preventDefault();
        $(addNewLocationForm).hide();
        $(addNewLocationBtn).show();
        $(cancelAddNewLocationBtn).hide();
    });

    $(confirmAddNewLocation).click(function(e) {
        e.preventDefault();
        resetLocationInputs();
        hideAddNewLocationSection();
        $(savedLocationsList).show();
    });
   
    $("#location-filter__range").on('change', function() {
        if ($(this).val() === '10') {
            // alert("10");
            hideLocationInputs();
            showAddNewLocationSection();
        }
        $(".ui-lookup-filter-zip").show();
    });

    function hideLocationInputs() {
        $('.location-info__lookup-location-name--container').hide();
        $(".location-info__lookup-location-city-state--container").hide();
    }
    function resetLocationInputs() {
        hideLocationInputs();
        hideLocationNameBtn();
        $(lookupByLocationList).hide();
        resetAddNewLocation();
    }
    function showLocationNameBtn() {
        $(lookupByNameConfirm).css("height","70px");
        $(lookupByNameConfirm).css("opacity","1");
    }
    function hideLocationNameBtn() {
        $(lookupByNameConfirm).css("height","0");
        $(lookupByNameConfirm).css("opacity","0");
    }
    function resetAddNewLocation() {
        $(addNewLocationForm).hide();
        $(addNewLocationBtn).show();
        $(cancelAddNewLocationBtn).hide();
    }
    function showAddNewLocationSection() {
        $(".location-info__add-new-location--container").show();
    }
    function hideAddNewLocationSection() {
        $(".location-info__add-new-location--container").hide();
    }

});