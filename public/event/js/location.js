
$(document).ready(function() {

    let lookupByNameInput = $("#lookupLocationName")
    let lookupByNameConfirm = $("#location-information__content .lookup-confirm");
    let lookupByLocationInput = $("#lookupLocationCityState");
    let lookupByLocationList = $(".list--lookup.locations");
    let savedLocationsList = $(".location-information__locations-list");
    let lookupByLocationConfirm = $(".location-column button");
    let addNewLocationBtn = $("#addLocationBtn");
    let cancelAddNewLocationBtn = $("#cancelAddLocationBtn");
    let confirmAddNewFacility = $("#confirmNewFacility");
    let addNewLocationForm = $(".event-location-details");
    let addNewPoolForm = $(".list-venue-form");
    let addNewConfigurationForm = $(".list-configuration-form");

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
        // resetLocationInputs();
    });

    $(addNewLocationBtn).click(function(e) {
        e.preventDefault();
        // $(addNewLocationBtn).hide();
        $(".location-header").hide();
        $(addNewLocationForm).show();
        hideLookupLocationList();
        $("input[type='checkbox']").prop('checked', false);
    });

    $(cancelAddNewLocationBtn).click(function(e) {
        e.preventDefault();
        $(addNewLocationForm).hide();
        $(addNewLocationBtn).show();
        $(cancelAddNewLocationBtn).hide();
    });

    $(confirmAddNewFacility).click(function(e) {
        e.preventDefault();
        // resetLocationInputs();
        $(addNewLocationForm).hide();
        $(addNewConfigurationForm).hide();
        $(cancelAddNewLocationBtn).hide()
        // hideLocationLookup();
        // hideAddNewLocationContainer();
        showSavedLocationList();
        $(".list-item-new").show();
        $(".venue__list").hide();
        $(".configuration__list").hide();
        $(".location-add-configuration").hide();
        // $("#saveLocation").prop('disabled', false);
        // scrollTopSection();
        $(addNewPoolForm).show();
        $('.location-name .list__controls').hide();
    });

    $(".venue-edit-button").click( function() {
        $(addNewPoolForm).show();
    });

    $("#saveVenue").click( function() {
        $(addNewPoolForm).hide();
        $(addNewConfigurationForm).show();
        $(".venue__list").show();
    });

    $("#saveConfiguration").click( function() {
        // $(addNewPoolForm).hide();
        hideLocationLookup();
        $(addNewConfigurationForm).hide();
        $(".venue__list").show();
        $(".configuration__list").show();
        $("#saveLocation").prop('disabled', false);
        $('.location-name .list__controls').show();
    });

    $("#cancelSaveConfiguration").click( function() {
        resetAddNewLocation();
        showLookupLocationList();
        hideSavedLocationList();
    });

    $('#cancelSaveVenue').click( function() {
        resetAddNewLocation();
        showLookupLocationList();
    });

    $("input[type='checkbox']").click( function() {
        resetAddNewLocation();
    });

    $('#listSearchSubmit').click(function(e) {
        e.preventDefault();
        filterByRange();
        filterByCourse();
        $(addNewLocationForm).hide();
        $(lookupByLocationList).show();
    });

    $("#search-filter__range").on('change', function() {
        filterByRange();
        filterByCourse();
    });

    $(".check-list-item input").click( function() {
        filterByRange();
        filterByCourse();
    });

    var modalChosePoolConfigurationSelby = new bootstrap.Modal(document.getElementById('modalChosePoolConfigurationSelby'));

    $("#confirmLocationSelby").click( function() {
        modalChosePoolConfigurationSelby.show();
    });

    var modalChosePoolConfigurationHealthfit = new bootstrap.Modal(document.getElementById('modalChosePoolConfigurationHealthfit'));

    $("#confirmLocationHealthfit").click( function() {
        modalChosePoolConfigurationHealthfit.show();
    });

    var modalChosePoolConfigurationJensen = new bootstrap.Modal(document.getElementById('modalChosePoolConfigurationJensen'));

    $("#confirmLocationJensen").click( function() {
        modalChosePoolConfigurationJensen.show();
    });

    $("#confirmConfigurationSelby").click( function() {
        confirmConfiguration();
        $(".list-item-existing").show();
        scrollTopSection();
        $(this).prop('disabled', true);
        
    });

    $("#confirmConfigurationHealthfit").click( function() {
        confirmConfiguration();
        $(".list-item-duplicate").show();
        scrollTopSection();
        $(this).prop('disabled', true);
    });

    $("#confirmConfigurationJensen").click( function() {
        confirmConfiguration();
        $(".list-item-new").show();
        scrollTopSection();
        $(this).prop('disabled', true);
    });

    function confirmConfiguration() {
        hideLocationLookup();
        hideAddNewLocationContainer();
        // .list__controls').hide();
        $(lookupByLocationList).hide();
        // $(".list-item-existing").show();
        showSavedLocationList();
        $("#saveLocation").prop('disabled', false);
        $(".venue__list--item:first-of-type .configuration-title:last-of-type").addClass('selected');
    }

    $(".location-name .list-item__edit").click( function() { 
        $(".list.locations").addClass("edit-list");
        $(".location-name .list-item__edit").hide();
        $(".location-name .list-item__save").show();
        $(".location-name .list-item__delete").show();
        showListControlChildren();
        $(".venue__list--item:first-of-type .configuration-title:last-of-type").removeClass('selected');
    });

    $(".location-name .list-item__delete").click( function() {
        $(".list.locations").removeClass("edit-list");
        $(".location-name .list-item__edit").show();
        $(".location-name .list-item__save").hide();
        $(".location-name .list-item__delete").hide();
        hideSavedLocationList();
        hideListControlChildren();
        $(lookupByLocationList).hide();
        $(".list-item-existing").hide();
        $(".list-item-duplicate").hide();
        $(".list-item-new").hide();
        showLocationLookup();
        showLookupLocationList();
        resetAddNewLocation();
        $("#saveLocation").prop('disabled', true);
    });

    $(".google-places-input").click( function() {
        hideSavedLocationList();
        showLookupLocationList();
        resetAddNewLocation();
    });

    var modalDuplicateAddress = new bootstrap.Modal(document.getElementById('modalDuplicateAddress'));

    $("#locationAddressStreet").click( function() {
        modalDuplicateAddress.show();
    });

    $("#closeDuplicateAddress").click( function() {
        hideSavedLocationList();
        showLookupLocationList();
        resetAddNewLocation();
        scrollTopSection();
        $(".location-column .list-item:not(.ui-lookup-filter-length-other").hide();
    });

    $("input[name='configuration-selby']").click( function() {
        $("#confirmConfigurationSelby").prop('disabled', false);
        // $("#confirmConfigurationHealthfit").prop('disabled', false);
        // $("#confirmConfigurationJensen").prop('disabled', false);
        $(".modal input[type=radio]").prop('selected', false);
    });

    $("input[name='configuration-healthfit']").click( function() {
        // $("#confirmConfigurationSelby").prop('disabled', false);
        $("#confirmConfigurationHealthfit").prop('disabled', false);
        // $("#confirmConfigurationJensen").prop('disabled', false);
        $(".modal input[type=radio]").prop('selected', false);
    });

    $("input[name='configuration-jensen']").click( function() {
        // $("#confirmConfigurationSelby").prop('disabled', false);
        // $("#confirmConfigurationHealthfit").prop('disabled', false);
        $("#confirmConfigurationJensen").prop('disabled', false);
        $(".modal input[type=radio]").prop('selected', false);
    });

    $("#cancelSaveVenue").click( function() {
        hideSavedLocationList();
        showLocationLookup();
        showLookupLocationList();
        resetAddNewLocation();
    });

    $("#saveListEventLocationExisting").click( function() {
        // confirmConfigurationSelby();
        confirmConfiguration();
        $(".list-item-existing").show();
        scrollTopSection();
        hideListControlChildren();
        $(".list.locations").removeClass("edit-list");
        $(".location-name .list-item__edit").show();
        $(".location-name .list-item__save").hide();
        $(".location-name .list-item__delete").hide();
    }); 

    $("#saveListEventLocationNew").click( function() {
        // confirmConfigurationSelby();
        confirmConfiguration();
        $(".list-item-new").show();
        scrollTopSection();
        hideListControlChildren();
        $(".list.locations").removeClass("edit-list");
        $(".location-name .list-item__edit").show();
        $(".location-name .list-item__save").hide();
        $(".location-name .list-item__delete").hide();
    });

    $("#saveListEventLocationDuplicate").click( function() {
        // confirmConfigurationSelby();
        confirmConfiguration();
        $(".list-item-duplicate").show();
        scrollTopSection();
        hideListControlChildren();
        $(".list.locations").removeClass("edit-list");
        $(".location-name .list-item__edit").show();
        $(".location-name .list-item__save").hide();
        $(".location-name .list-item__delete").hide();
    });

    function showListControlChildren() {
        $(".venue__list--item .list__controls").show();
        $(".pool__list--item .list__controls").show();
        $('.club-edit .list-item .location-add-venue').show();
        $('.club-edit .list-item .location-add-configuration').show();
    }

    function hideListControlChildren() {
        $(".venue__list--item .list__controls").hide();
        $(".pool__list--item .list__controls").hide();
        $('.club-edit .list-item .location-add-venue').hide();
        $('.club-edit .list-item .location-add-configuration').hide();
    }

    function scrollTopSection() {
        console.log("scrolling ...");
        var element = $("#location-information");
        var elementTop = element.offset().top;
        var windowScrollTop = $(window).scrollTop();
        if (elementTop < windowScrollTop) {
            $(document.documentElement).animate({
                scrollTop: $("#location-information").offset().top
            }, 500);
        }
    }

    function showSavedLocationList() {
        $(".list.list--result.locations").show();
    }

    function hideSavedLocationList() {
        $(".list.list--result.locations").hide();
    }

    function showLookupLocationList() {
        $(".list.list--lookup.locations").show();
    }

    function hideLookupLocationList() {
        $(".list.list--lookup.locations").hide();
    }

    function filterByRange() {
        $(".location-column .list-item").hide();
        if ($($("#search-filter__range")).val() === '1') {
            $(".location-column .list-item.ui-lookup-filter-1mile").show();
        }
        if ($($("#search-filter__range")).val() === '5') {
            $(".location-column .list-item.ui-lookup-filter-1mile").show();
            $(".location-column .list-item.ui-lookup-filter-5mile").show();
        }
        if ($($("#search-filter__range")).val() === '10') {
            $(".location-column .list-item.ui-lookup-filter-1mile").show();
            $(".location-column .list-item.ui-lookup-filter-5mile").show();
            $(".location-column .list-item.ui-lookup-filter-10mile").show();
        }
        if ($($("#search-filter__range")).val() === '25') {
            $(".location-column .list-item.ui-lookup-filter-1mile").show();
            $(".location-column .list-item.ui-lookup-filter-5mile").show();
            $(".location-column .list-item.ui-lookup-filter-10mile").show();
            $(".location-column .list-item.ui-lookup-filter-25mile").show();
        }
        if ($($("#search-filter__range")).val() === '50') {
            $(".location-column .list-item.ui-lookup-filter-1mile").show();
            $(".location-column .list-item.ui-lookup-filter-5mile").show();
            $(".location-column .list-item.ui-lookup-filter-10mile").show();
            $(".location-column .list-item.ui-lookup-filter-25mile").show();
            $(".location-column .list-item.ui-lookup-filter-50mile").show();
        }
        // resetAddNewLocation();
        $(lookupByLocationList).show();
    }

    function filterByCourse() {
        // If none are checked **********************
        if ( !$("#length25Yards input").is(':checked') && !$("#length25Meters input").is(':checked') && !$("#length50Meters input").is(':checked') &&  !$("#lengthOther input").is(':checked') ) {
        // SCY **************************************
        } else if ( $("#length25Yards input").is(':checked') && !$("#length25Meters input").is(':checked') && !$("#length50Meters input").is(':checked') &&  !$("#lengthOther input").is(':checked') ) {
            $(".location-column .list-item:not(.ui-lookup-filter-length-scy").hide();
        } else if ( $("#length25Yards input").is(':checked') && $("#length25Meters input").is(':checked') && !$("#length50Meters input").is(':checked') &&  !$("#lengthOther input").is(':checked') ) {
            $(".location-column .list-item:not(.ui-lookup-filter-length-scy):not(.ui-lookup-filter-length-scm)").hide();
        } else if ( $("#length25Yards input").is(':checked') && !$("#length25Meters input").is(':checked') && $("#length50Meters input").is(':checked') && !$("#lengthOther input").is(':checked') ) {
            $(".location-column .list-item:not(.ui-lookup-filter-length-scy):not(.ui-lookup-filter-length-lcm)").hide();
        } else if ( $("#length25Yards input").is(':checked') && !$("#length25Meters input").is(':checked') && !$("#length50Meters input").is(':checked')  &&  $("#lengthOther input").is(':checked') ) {
            $(".location-column .list-item:not(.ui-lookup-filter-length-scy):not(.ui-lookup-filter-length-other)").hide();
        // SCM **************************************
        } else if ( !$("#length25Yards input").is(':checked') && $("#length25Meters input").is(':checked') && !$("#length50Meters input").is(':checked') &&  !$("#lengthOther input").is(':checked') ) {
            $(".location-column .list-item:not(.ui-lookup-filter-length-scm)").hide();
        } else if ( $("#length25Yards input").is(':checked') && $("#length25Meters input").is(':checked') && !$("#length50Meters input").is(':checked') &&  !$("#lengthOther input").is(':checked') ) {
            $(".location-column .list-item:not(.ui-lookup-filter-length-scm):not(.ui-lookup-filter-length-scy)").hide();
        } else if ( !$("#length25Yards input").is(':checked') && $("#length25Meters input").is(':checked') && $("#length50Meters input").is(':checked') && !$("#lengthOther input").is(':checked') ) {
            $(".location-column .list-item:not(.ui-lookup-filter-length-scm):not(.ui-lookup-filter-length-lcm)").hide();
        } else if ( !$("#length25Yards input").is(':checked') && $("#length25Meters input").is(':checked') && !$("#length50Meters input").is(':checked') && $("#lengthOther input").is(':checked') ) {
            $(".location-column .list-item:not(.ui-lookup-filter-length-scm):not(.ui-lookup-filter-length-other").hide();
        // LCM **************************************
        } else if ( !$("#length25Yards input").is(':checked') && !$("#length25Meters input").is(':checked') && $("#length50Meters input").is(':checked') &&  !$("#lengthOther input").is(':checked') ) {
            $(".location-column .list-item:not(.ui-lookup-filter-length-lcm").hide();
        } else if ( !$("#length25Yards input").is(':checked') && $("#length25Meters input").is(':checked') && $("#length50Meters input").is(':checked') &&  !$("#lengthOther input").is(':checked') ) {
            $(".location-column .list-item:not(.ui-lookup-filter-length-lcm):not(.ui-lookup-filter-length-scm)").hide();
        } else if ( $("#length25Yards input").is(':checked') && !$("#length25Meters input").is(':checked') && $("#length50Meters input").is(':checked') && !$("#lengthOther input").is(':checked') ) {
            $(".location-column .list-item:not(.ui-lookup-filter-length-lcm):not(.ui-lookup-filter-length-scy)").hide();
        } else if ( !$("#length25Yards input").is(':checked') && !$("#length25Meters input").is(':checked') && $("#length50Meters input").is(':checked') && $("#lengthOther input").is(':checked') ) {
            $(".location-column .list-item:not(.ui-lookup-filter-length-lcm):not(.ui-lookup-filter-length-other)").hide();
        // Other **************************************
        } else if ( !$("#length25Yards input").is(':checked') && !$("#length25Meters input").is(':checked') && !$("#length50Meters input").is(':checked') &&  $("#lengthOther input").is(':checked') ) {
            $(".location-column .list-item:not(.ui-lookup-filter-length-other").hide();
        } else if ( $("#length25Yards input").is(':checked') && !$("#length25Meters input").is(':checked') && !$("#length50Meters input").is(':checked') &&  $("#lengthOther input").is(':checked') ) {
            $(".location-column .list-item:not(.ui-lookup-filter-length-other):not(.ui-lookup-filter-length-scy)").hide();
        } else if ( !$("#length25Yards input").is(':checked') && $("#length25Meters input").is(':checked') && !$("#length50Meters input").is(':checked') && $("#lengthOther input").is(':checked') ) {
            $(".location-column .list-item:not(.ui-lookup-filter-length-other):not(.ui-lookup-filter-length-scm)").hide();
        } else if ( !$("#length25Yards input").is(':checked') && !$("#length25Meters input").is(':checked') && $("#length50Meters input").is(':checked')  &&  $("#lengthOther input").is(':checked') ) {
            $(".location-column .list-item:not(.ui-lookup-filter-length-other):not(.ui-lookup-filter-length-lcm)").hide();
        // If all are checked *************************
        } else if ( $("#length25Yards input").is(':checked') && $("#length25Meters input").is(':checked') && $("#length50Meters input").is(':checked')  &&  $("#lengthOther input").is(':checked') ) {
            $(".location-column .list-item:not(.ui-lookup-filter-length-scy):not(.ui-lookup-filter-length-scm):not(.ui-lookup-filter-length-lcm):not(.ui-lookup-filter-length-other)").hide();
        } 
        // else if ( $("#length25Yards input").is(':checked') && !$("#length25Meters input").is(':checked') && $("#length50Meters input").is(':checked') &&  $("#lengthOther input").is(':checked') ) {
        //     alert("Yo!");
        //     $(".location-column .list-item:not(.ui-lookup-filter-length-scm)").hide();
        // }
    }

    function showLocationLookup() {
        $("#location-information__content .list-control").show();
    }

    function hideLocationLookup() {
        $("#location-information__content .list-control").hide();
    }

    function resetLocationInputs() {
        hideLocationLookup();
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
        $(addNewPoolForm).hide();
        $(addNewConfigurationForm).hide();
        $(cancelAddNewLocationBtn).hide();
        showAddNewLocationContainer();
        $(".location-header").show();
        $(addNewLocationBtn).show();
    }

    function showAddNewLocationContainer() {
        $(".location-info__add-new-location--container").show();
    }

    function hideAddNewLocationContainer() {
        $(".location-info__add-new-location--container").hide();
    }

    filterByRange();
    filterByCourse();

});





