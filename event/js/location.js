
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

    $("#confirmNewFacility").click(function(e) {
        e.preventDefault();
        $(addNewLocationForm).hide();
        $(addNewConfigurationForm).hide();
        $(cancelAddLocationBtn).hide();
        showAddNewLocationContainer();
        showSavedLocationList();

        // showControlsNew();
        // $(".list-item-new").show();

        // $(".venue__list").hide();
        // $(".configuration__list").hide();
        // $(".location-add-configuration").hide();

        $(addNewPoolForm).show();

        $('.location-name .list__controls').hide();
        
        // alert($("#locationType").val());

        if ($("#locationType").val() === 'Open Water') {
            // alert("A");
            $(".list-item-open-water").show();
            $(".input-group--add-new-course").hide();
        } else {
            // alert("B");
            $(".list-item-new").show();
        }
    });

    $(".venue-edit-button").click( function() {
        $(addNewPoolForm).show();
    });

    $("#saveFormPool").click( function(e) {
        e.preventDefault();
        // $(".list-item").hide();
        showControlsNew();
        setPageName();

        $(".location-info__add-new-location--container").hide();

        $(".venue__list").show();
        $(".list-item-open-water .venue__list--item").show();
        $('.location-name .list__controls').show();
        hideLocationLookup();

        $(".list-venue-form").hide();
        hideLookupLocationList();

        // if ($("#locationType").val() === 'Open Water') {
        //     $(".venue__list").show();
        //     $(".list-item-open-water .venue__list--item").show();
        //     $('.location-name .list__controls').show();
        //     hideLocationLookup();
        //     $(".list-venue-form").hide();
        //     $("#saveLocation").prop('disabled', false);
        // } else {
        //     $(addNewPoolForm).hide();
        //     $(".venue__list").show();
        //     $(".venue__list--item-added").show();
        //     $(".venue__list--item:first-of-type").show();
        //     $('.location-name .list__controls').show();
        // }
        $(".form-group.form-group-hidden").removeClass("show");
        $("#locationType").prop('selectedIndex',0);
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
            $(".configuration__list--item").show();
            $(".configuration__list--item.added").hide();
            $(".configuration__list--item.added .configuration-title").hide();
            $(".configuration__list--item.selected").hide();
            $(".configuration__list--item.selected .configuration-title").hide();
            // $(".configuration__list--item.duplicate").show();
            // $(".configuration__list--item.duplicate .configuration-title").show();    
        } else {
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

    $("#confirmWaterFrontPark").click( function() {
        confirmConfiguration();
        $(".list-item-open-water").show();
        $(".venue__list").show();
        $(".venue__list--item.selected").show();
        $(".venue__list--item.selected .venue-name").show();
        $(".venue__list--item.selected .venue-type").show();
        scrollTopSection();
        hideListControlChildren();
        showControlsNew();
    });

    // $("#confirmLocationHealthfit").click( function() {
    //     $("#modalChosePoolConfigurationHealthfit").modal('show');
    // });

    // $("#confirmLocationJensen").click( function() {
    //     $("#modalChosePoolConfigurationJensen").modal('show');
    // });

    $("#modalConfirmSelby").click( function() {
        confirmConfiguration();
        // handleListControls();
        showControlsExisting();
        $(".list-item-existing.list-item-pool").show();
        scrollTopSection();
        $(this).prop('disabled', true);
        $('input[name="configuration-selby').prop("checked", false);
        $(".list-item-existing.list-item-pool .venue__list").show();
        $(".list-item-existing.list-item-pool .venue__list--item.selected").show();
        $(".list-item-existing.list-item-pool .configuration__list").show();
        $(".list-item-existing.list-item-pool .configuration__list--item.selected").show();
        $(".list-item-existing.list-item-pool .configuration__list--item.selected .configuration-title").show();
    });

    $("#modalConfirmHealthfit").click( function() {
        confirmConfiguration();
        // handleListControls();
        showControlsExisting();
        $(".list-item-duplicate.list-item-pool").show();
        scrollTopSection();
        $(this).prop('disabled', true);
        $('input[name="configuration-healthfit').prop("checked", false);
        $(".list-item-duplicate.list-item-pool .venue__list").show();
        $(".list-item-duplicate.list-item-pool .venue__list--item.selected").show();
        $(".list-item-duplicate.list-item-pool .configuration__list").show();
        $(".list-item-duplicate.list-item-pool .configuration__list--item.selected").show();
        $(".list-item-duplicate.list-item-pool .configuration__list--item.selected .configuration-title").show();
    });

    $("#modalConfirmJensen").click( function() {
        confirmConfiguration();
        // handleListControls();
        showControlsExisting();
        $(".list-item-new.list-item-pool").show();
        scrollTopSection();
        $(this).prop('disabled', true);
        $('input[name="configuration-jensen').prop("checked", false);
        $(".list-item-new.list-item-pool .venue__list").show();
        $(".list-item-new.list-item-pool .venue__list--item.selected").show();
        $(".list-item-new.list-item-pool .configuration__list").show();
        $(".list-item-new.list-item-pool .configuration__list--item.selected").show();
        $(".list-item-new.list-item-pool .configuration__list--item.selected .configuration-title").show();
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

        // $(".venue__list--item.selected").show();
        // $(".list-item-existing .venue__list").show();
        
        $(".list-item-pool.list-item-existing").show();
        $(".configuration__list--item.added").show();
        showSavedLocationList();
        $(".location-header").hide();
        $(addNewPoolForm).show();
    }

    $(".location-name .list-item__edit").click( function() {
        $(".list.locations").addClass("edit-list");
        $(".venue__list--item.selected").show();
        $(".venue__list--item.selected .configuration-title").show();
        // showControlsExisting();
        $(".location-name .list-item__edit").hide();
        $(".location-name .list-item__save").show();
        $(".location-name .list-item__delete").show();
        showListControlChildren();
    });

    $(".location-name .list-item__delete").click( function() {
        $("#modalDeleteLocation").modal('show');
    });

    $(".location-name .list-item__save").click( function() {
        // $(".location-name .list-item__delete").hide();
        $(".list.locations").removeClass("edit-list");
        $(".location-name .list-item__edit").show();
        $(".location-name .list-item__save").hide();
        $(".location-name .list-item__delete").hide();
    });

    // $("#confirmDeleteLocation").click( function() {
        // alert("primary fx");
    //     hideControls();
    //     // filterByRange();
    //     hideSavedLocationList();
    //     hideListControlChildren();
    //     $(lookupByLocationList).hide();
    //     $(".list-item-existing").hide();
    //     $(".list-item-duplicate").hide();
    //     $(".list-item-new").hide();
    //     showLocationLookup();
    //     showLookupLocationList();
    //     resetAddNewLocation();
    // });

    $(".google-places-input").click( function() {
        hideSavedLocationList();
        showLookupLocationList();
        resetAddNewLocation();
    });

    $("#locationAddressStreet").click( function() {
        $("#modalDuplicateAddress").modal('show');
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
        // handleListControls();
        showControlsExisting();
    });

    $("#saveListEventLocationNew").click( function() {
        confirmConfiguration();
        $(".list-item-new").show();
        scrollTopSection();
        hideListControlChildren();
        // handleListControls();
        showControlsNew();
    });

    $("#saveListEventLocationDuplicate").click( function() {
        confirmConfiguration();
        $(".list-item-duplicate").show();
        scrollTopSection();
        hideListControlChildren();
        // handleListControls();
    });

    $("#saveListEventLocationOpenWater").click( function() {
        confirmConfiguration();
        $(".list-item-open-water").show();
        scrollTopSection();
        hideListControlChildren();
        // handleListControls();
    });

    $("#locationType").change(function() {
        if ($(this).val() === 'Other') {
          $(".form-group.form-group-hidden").addClass("show");
        } else {
            $(".form-group.form-group-hidden").removeClass("show");
        }
        if ($(this).val() === 'Open Water') {
            $(".input-group--poolType").addClass("fade");
            $(".input-group--openWaterType").removeClass("fade");
            $(".input-group.input-group--bulkhead").hide();
        } else {
            $(".input-group.input-group--bulkhead").show();
        }
    });

    $("#openWaterType").change(function() {
        if ($(this).val() === 'Other') {
          $(".form-group.form-group-hidden").addClass("show");
        } else {
            $(".form-group.form-group-hidden").removeClass("show");
        }
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

    function handleListControls() {
        console.log("fx handle list controls");
        $(".location-name > .list__controls").show();
        $(".list.locations").removeClass("edit-list");

        if ($(".list-item-existing").css('display') === 'block') {
            showControlsExisting();
        }

        if ($(".list-item-new").css('display') === 'block') {
            // $(".location-name .list-item__edit").show();
            // $(".location-name .list-item__save").show();
            // $(".list__controls--settings").css('display', 'inline');
            showControlsNew();
        }

        // else if ($(".list-item-new").css('display') === 'none') {
        //     $(".location-name .list-item__edit").hide();
        //     $(".location-name .list-item__save").hide();
        //     $(".location-name .list-item__delete").show();
        // } 
    }

    function showControlsNew() {
        console.log("fx show controls new");
        $(".location-name > .list__controls").show();
        $(".list.locations").removeClass("edit-list");
        $(".location-name .list-item__edit").show();
        $(".location-name .list-item__save").hide();
        $(".list__controls--settings").css('display', 'inline-flex');
    }

    function showControlsExisting() {
        console.log("fx show controls existing");
        $(".location-name > .list__controls").show();
        $(".list.locations").removeClass("edit-list");
        $(".location-name .list-item__edit").hide();
        $(".location-name .list-item__save").hide();
        $(".location-name .list-item__delete").show();
    }

    function hideControls() {
        $(".list.locations").removeClass("edit-list");
        $(".location-name .list-item__edit").show();
        $(".location-name .list-item__save").hide();
        $(".location-name .list-item__delete").hide();
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
        //     $(".location-column .list-item:not(.ui-lookup-filter-length-scm)").hide();
        // }
    }

    function filterByOpenWater() {
        $(".list--lookup.locations").show();
        $(".list--lookup.locations .list-item").hide();
        $(".list--lookup.locations .list-item.list-item--open-water").show();
    }

    // Get page name to filter location lookup results
    $(document).on("settingPageName", function(event, data) {
        const currentPageName = data.data;
        if (currentPageName === "Open Water") {
            filterByOpenWater();
            $("#closeDuplicateAddress").click( function() {
                showSavedLocationList();
                showLookupLocationList();
                resetAddNewLocation();
                scrollTopSection();
                $(".list-item:not(.list-item--open-water.list-item--duplicate").hide();
            });
            $("#confirmDeleteLocation").click( function() {
                hideControls();
                hideSavedLocationList();
                hideListControlChildren();
                $(lookupByLocationList).hide();
                $(".list-item-existing").hide();
                $(".list-item-duplicate").hide();
                $(".list-item-new").hide();
                showLocationLookup();
                showLookupLocationList();
                resetAddNewLocation();
                filterByOpenWater();
            });
        } else if (currentPageName === "Pool") {
            filterByRange();
            filterByCourse();
            $("#confirmLocationSelby").click( function() {
                $("#modalChosePoolConfigurationSelby").modal('show');
            });
            $("#confirmLocationHealthfit").click( function() {
                $("#modalChosePoolConfigurationHealthfit").modal('show');
            });
            $("#confirmLocationJensen").click( function() {
                $("#modalChosePoolConfigurationJensen").modal('show');
            });
            $("#confirmDeleteLocation").click( function() {
                hideControls();
                hideSavedLocationList();
                hideListControlChildren();
                $(lookupByLocationList).hide();
                $(".list-item-existing").hide();
                $(".list-item-duplicate").hide();
                $(".list-item-new").hide();
                showLocationLookup();
                showLookupLocationList();
                resetAddNewLocation();
                filterByRange();
            });
        } else if (currentPageName === "Calendar") {
            filterByRange();
            filterByCourse();
            $("#confirmLocationSelby").click( function() {
                confirmConfiguration();
                showControlsExisting();
                $(".list-item-pool.list-item-existing").show();
                $(".list-item-existing .configuration__list").show();
                $(".list-item-existing .configuration__list--item.selected").show();
                $(".list-item-existing .configuration__list--item.selected .configuration-title").show();
            });
            $("#confirmLocationHealthfit").click( function() {
                confirmConfiguration();
                showControlsExisting();
                $(".list-item-duplicate").show();
                $(".list-item-duplicate .configuration__list").show();
                $(".list-item-duplicate .configuration__list--item.selected").show();
                $(".list-item-duplicate .configuration__list--item.selected .configuration-title").show();
            });
            $("#confirmLocationJensen").click( function() {
                confirmConfiguration();
                showControlsNew();
                $(".list-item-new").show();
                $(".list-item-new .configuration__list").show();
                $(".list-item-new .configuration__list--item.selected").show();
                $(".list-item-new .configuration__list--item.selected .configuration-title").show();
            });
            $("#confirmDeleteLocation").click( function() {
                hideControls();
                hideSavedLocationList();
                hideListControlChildren();
                $(lookupByLocationList).hide();
                $(".list-item-existing").hide();
                $(".list-item-duplicate").hide();
                $(".list-item-new").hide();
                showLocationLookup();
                showLookupLocationList();
                resetAddNewLocation();
                filterByRange();
            });
        } else if (currentPageName === "Other Open Water") {
            filterByOpenWater();
            $("#closeDuplicateAddress").click( function() {
                showSavedLocationList();
                showLookupLocationList();
                resetAddNewLocation();
                scrollTopSection();
                $(".list-item:not(.list-item--open-water.list-item--duplicate").hide();
            });
            $("#confirmDeleteLocation").click( function() {
                hideControls();
                hideSavedLocationList();
                hideListControlChildren();
                $(lookupByLocationList).hide();
                $(".list-item-existing").hide();
                $(".list-item-duplicate").hide();
                $(".list-item-new").hide();
                showLocationLookup();
                showLookupLocationList();
                resetAddNewLocation();
                filterByOpenWater();
            });
        } else if (currentPageName === "Other Pool") {
            filterByRange();
            filterByCourse();
            $("#confirmLocationSelby").click( function() {
                confirmConfiguration();
                showControlsExisting();
                $(".list-item-pool.list-item-existing").show();
                $(".list-item-existing .configuration__list").show();
                $(".list-item-existing .configuration__list--item.selected").show();
                $(".list-item-existing .configuration__list--item.selected .configuration-title").show();
            });
            $("#confirmLocationHealthfit").click( function() {
                confirmConfiguration();
                showControlsExisting();
                $(".list-item-duplicate").show();
                $(".list-item-duplicate .configuration__list").show();
                $(".list-item-duplicate .configuration__list--item.selected").show();
                $(".list-item-duplicate .configuration__list--item.selected .configuration-title").show();
            });
            $("#confirmLocationJensen").click( function() {
                confirmConfiguration();
                showControlsNew();
                $(".list-item-new").show();
                $(".list-item-new .configuration__list").show();
                $(".list-item-new .configuration__list--item.selected").show();
                $(".list-item-new .configuration__list--item.selected .configuration-title").show();
            });                
            $("#closeDuplicateAddress").click( function() {
                showSavedLocationList();
                showLookupLocationList();
                resetAddNewLocation();
                scrollTopSection();
                $(".list-item:not(.list-item--pool.list-item--duplicate").hide();
            });
            $("#confirmDeleteLocation").click( function() {
                hideControls();
                hideSavedLocationList();
                hideListControlChildren();
                $(lookupByLocationList).hide();
                $(".list-item-existing").hide();
                $(".list-item-duplicate").hide();
                $(".list-item-new").hide();
                showLocationLookup();
                showLookupLocationList();
                resetAddNewLocation();
                filterByRange();
            });
        }
        console.log("This is " + currentPageName);
    });
    setPageName();
    $('#submitEdit').click( function() {
        $(".help-block").toggleClass("has-error");
        $(".form-control").toggleClass("has-error");
        // $('. help-block--SelectHostType').toggleClass("has-error");
        $('#lookupHostTypeOtherOrganization').toggleClass("has-error");    
    })
});