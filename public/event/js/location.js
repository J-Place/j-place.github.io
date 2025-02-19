
$(document).ready(function() {

    let lookupByNameInput = $("#lookupLocationName")
    let lookupByNameConfirm = $("#location-information__content .lookup-confirm");
    let lookupByLocationInput = $("#lookupLocationCityState");
    let lookupByLocationList = $(".list--lookup.locations");
    let savedLocationsList = $(".location-information__locations-list");
    let lookupByLocationConfirm = $(".location-column button");
    let addLocationBtn = $("#addLocationBtn");
    let cancelAddLocationBtn = $("#cancelAddLocationBtn");
    let confirmNewFacility = $("#confirmNewFacility");
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

    $(addLocationBtn).click(function(e) {
        e.preventDefault();
        $(".location-header").hide();
        $(addNewLocationForm).show();
        hideLookupLocationList();
        $("input[type='checkbox']").prop('checked', false);
    });

    $(cancelAddLocationBtn).click(function(e) {
        e.preventDefault();
        $(addNewLocationForm).hide();
        $(addLocationBtn).show();
        $(cancelAddLocationBtn).hide();
    });

    $(confirmNewFacility).click(function(e) {
        e.preventDefault();
        $(addNewLocationForm).hide();
        $(addNewConfigurationForm).hide();
        $(cancelAddLocationBtn).hide();
        showAddNewLocationContainer();
        showSavedLocationList();
        $(".list-item-new").show();
        $(".venue__list").hide();
        $(".configuration__list").hide();
        $(".location-add-configuration").hide();
        $(addNewPoolForm).show();
        $('.location-name .list__controls').hide();
    });

    $(".venue-edit-button").click( function() {
        $(addNewPoolForm).show();
    });

    $("#saveFormPool").click( function() {
        $(addNewPoolForm).hide();
        $(addNewConfigurationForm).show();
        $(".venue__list").show();
        $(".venue__list--item-added").show();
        $(".venue__list--item:first-of-type").show();
    });

    $("#saveFormConfiguration").click( function() {
        hideLocationLookup();
        hideAddNewLocationContainer();
        $(addNewConfigurationForm).hide();
        $(".venue__list").show();
        $(".configuration__list").show();
        $("#saveLocation").prop('disabled', false);
        if ($('.list-item-existing').css('display') === 'block') {
            $(".configuration__list--item").hide();
            $(".configuration__list--item.selected").show();
            $(".configuration__list--item.selected .configuration-title").show();   
            $('.location-name .list__controls').show(); 
        } else if ($('.list-item-new').css('display') === 'block') {
            $(".configuration__list--item").hide();
            $(".configuration__list--item.added").show();
            $(".configuration__list--item.added .configuration-title").show();
            $('.location-name .list__controls').show();
        } else if ($('.list-item-duplicate').css('display') === 'block') {
            alert("3");
            $(".configuration__list--item").show();
            $(".configuration__list--item.added").hide();
            $(".configuration__list--item.added .configuration-title").hide();
            $(".configuration__list--item.selected").hide();
            $(".configuration__list--item.selected .configuration-title").hide();
            // $(".configuration__list--item.duplicate").show();
            // $(".configuration__list--item.duplicate .configuration-title").show();    
        } else {
            alert("none");
            $('.location-name .list__controls').show();
        }
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

    $("#confirmLocationSelby").click( function() {
        $("#modalChosePoolConfigurationSelby").modal('show');
    });

    var modalChosePoolConfigurationHealthfit = new bootstrap.Modal(document.getElementById('modalChosePoolConfigurationHealthfit'));

    $("#confirmLocationHealthfit").click( function() {
        modalChosePoolConfigurationHealthfit.modal('show');
    });

    var modalChosePoolConfigurationJensen = new bootstrap.Modal(document.getElementById('modalChosePoolConfigurationJensen'));

    $("#confirmLocationJensen").click( function() {
        modalChosePoolConfigurationJensen.modal('show');
    });

    $("#modalConfirmSelby").click( function() {
        confirmConfiguration();
        $(".list-item-existing").show();
        $(".venue__list").show();
        $(".configuration__list").show();
        $(".configuration__list--item.selected").show();
        scrollTopSection();
        $(this).prop('disabled', true);
        $('input[name="configuration-selby').prop("checked", false);
    });

    $("#modalConfirmHealthfit").click( function() {
        confirmConfiguration();
        $(".list-item-duplicate").show();
        scrollTopSection();
        $(this).prop('disabled', true);
        $('input[name="configuration-healthfit').prop("checked", false);
    });

    $("#modalConfirmJensen").click( function() {
        confirmConfiguration();
        $(".list-item-new").show();
        scrollTopSection();
        $(this).prop('disabled', true);
        $('input[name="configuration-jensen').prop("checked", false);
    });

    function confirmConfiguration() {
        hideLocationLookup();
        hideAddNewLocationContainer();
        $(lookupByLocationList).hide();
        showSavedLocationList();
        $("#saveLocation").prop('disabled', false);
        $(".venue__list--item").hide();
        $(".venue__list--item:first-of-type").show();
        $(".venue__list--item:first-of-type .configuration-title").hide();
        $(".venue__list--item:first-of-type .configuration-title:last-of-type").show();
    }

    $("#addConfigurationBtnSelby").click( function() {
        $("#modalChosePoolConfigurationSelby").modal('hide');
        addNewConfigurationSelby();
    });

    function addNewConfigurationSelby() {
        hideLocationLookup();
        $(lookupByLocationList).hide();
        $("#saveLocation").prop('disabled', false);
        $(".list-item.list-item-existing .list__controls").hide();
        $(".venue__list--item:first-of-type .configuration-title").hide();
        $(".venue__list--item").hide();
        $(".list-item-existing").show();
        $(".configuration__list--item.added").show();
        showSavedLocationList();
        $(".location-header").hide();
        $(addNewPoolForm).show();
    }

    $(".location-name .list-item__edit").click( function() {
        $(".list.locations").addClass("edit-list");
        $(".venue__list--item").show();
        $(".venue__list--item:first-of-type .configuration-title").show();
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
        $("#modalConfirmSelby").prop('disabled', false);
        $(".modal input[type=radio]").prop('selected', false);
    });

    $("input[name='configuration-healthfit']").click( function() {
        $("#modalConfirmHealthfit").prop('disabled', false);
        $(".modal input[type=radio]").prop('selected', false);
    });

    $("input[name='configuration-jensen']").click( function() {
        $("#modalConfirmJensen").prop('disabled', false);
        $(".modal input[type=radio]").prop('selected', false);
    });

    $("#cancelSaveVenue").click( function() {
        hideSavedLocationList();
        showLocationLookup();
        showLookupLocationList();
        resetAddNewLocation();
    });

    $("#saveListEventLocationExisting").click( function() {
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
        var element = $("#location-information");
        var elementTop = element.offset().top;
        var windowScrollTop = $(window).scrollTop();
        if (elementTop < windowScrollTop) {
            $(document.documentElement).animate({
                scrollTop: $("#location-information").offset().top - 400
            }, 500);
        }
    }

    function showSavedLocationList() {
        $("#location-information .row.locations").show();
    }

    function hideSavedLocationList() {
        $("#location-information .row.locations").hide();
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
        $(cancelAddLocationBtn).hide();
        showAddNewLocationContainer();
        $(".location-header").show();
        $(addLocationBtn).show();
    }

    function showAddNewLocationContainer() {
        $(".location-info__add-new-location--container").show();
    }

    function hideAddNewLocationContainer() {
        $(".location-info__add-new-location--container").hide();
    }

    filterByRange();
    filterByCourse();




    function saveSection() {
        var sectionId = $(this).closest('.section').attr('id');
    }


});










