
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
    let addNewLocationForm = $(".location-details");
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
        $(addNewLocationForm).removeClass('show');
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
        $('.list.locations .list-item').hide();
        $(addNewLocationForm).addClass('show');
        $(addNewLocationForm).show();
        hideLookupLocationList();
        $("input[type='checkbox']").prop('checked', false);
    });

    $(cancelAddLocationBtn).click(function(e) {
        e.preventDefault();
        $(addNewLocationForm).removeClass('show');
        $(addNewLocationForm).hide();
        $(addLocationBtn).show();
        $(cancelAddLocationBtn).hide();
    });

    $("#confirmNewFacility").click(function(e) {
        e.preventDefault();
        $(addNewLocationForm).removeClass('show');
        $(addNewLocationForm).hide();
        $(addNewConfigurationForm).hide();
        $(cancelAddLocationBtn).hide();
        showAddNewLocationContainer();
        showSavedLocationList();
        $(".venue__list").hide();
        $(".configuration__list").hide();
        $(addNewPoolForm).show();
        $('.location-name .list__controls').hide();
        if ($("#locationType").val() === 'Open Water') {
            $(".list-item-new.list-item-open-water").show();
            $(".input-group--add-new-course").hide();
        } else {
            $(".list-item-new.list-item-pool").show();
        }
    });

    $(".venue-edit-button").click( function() {
        $(addNewPoolForm).show();
    });

    $("#saveFormPool").click( function(e) {
        e.preventDefault();
        showControlsNew();
        $(".location-info__add-new-location--container").hide();
        $(".venue__list").show();
        $(".list-item-open-water .venue__list--item").show();
        $('.location-name .list__controls').show();
        hideLocationLookup();
        hideLookupLocationList();
        $(".list-venue-form").hide();
        $(".form-group.form-group-hidden").removeClass("show");
        $("#locationType").prop('selectedIndex',0);
        $('.location-header__edit').show();
        $(".venue__list").show();
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
        $(addNewLocationForm).removeClass('show');
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
        $('.list.locations .list-item').hide();
        $(".list.locations .list-item-open-water.list-item-existing").show();
        $(".venue__list").show();
        $(".venue__list--item.selected").show();
        $(".venue__list--item.selected .venue-name").show();
        $(".venue__list--item.selected .venue-type").show();
        // scrollTopSection();
        hideListControlChildren();
        showControlsNew();
    });

    $("#modalConfirmSelby").click( function() {
        confirmConfiguration();
        showControlsExisting();        
        // scrollTopSection();
        $(this).prop('disabled', true);
        $('input[name="configuration-selby').prop("checked", false);
        $(".list-item-existing.list-item-pool").show();
        $(".list-item-existing.list-item-pool .venue__list").show();
        $(".list-item-existing.list-item-pool .venue__list--item.selected").show();
        $(".list-item-existing.list-item-pool .configuration__list").show();
        $(".list-item-existing.list-item-pool .configuration__list--item.selected").show();
        $(".list-item-existing.list-item-pool .configuration__list--item.selected .configuration-title").show();
    });

    $("#modalConfirmHealthfit").click( function() {
        confirmConfiguration();
        showControlsExisting();
        $(".list-item-duplicate.list-item-pool").show();
        // scrollTopSection();
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
        showControlsExisting();
        $(".list-item-new.list-item-pool").show();
        // scrollTopSection();
        $(this).prop('disabled', true);
        $('input[name="configuration-jensen').prop("checked", false);
        $(".list-item-new.list-item-pool .venue__list").show();
        $(".list-item-new.list-item-pool .venue__list--item.selected").show();
        $(".list-item-new.list-item-pool .configuration__list").show();
        $(".list-item-new.list-item-pool .configuration__list--item.selected").show();
        $(".list-item-new.list-item-pool .configuration__list--item.selected .configuration-title").show();
    });

    $("#addConfigurationBtnSelby").click( function() {
        $("#modalChosePoolConfigurationSelby").modal('hide');
        addNewConfigurationSelby();
    });

    $('#doneEditLocationBtn').click( function(e) {
        e.preventDefault();
        $('#editLocationBtn').show();
        $('#doneEditLocationBtn').hide();
        $('.list.locations').removeClass('edit-list');
        $(".locations .list-item__edit").hide();
        $(".locations .list-item__delete").hide();
        $('.list__controls').hide();
    });

    $(".locations .list-item__delete").click( function() {
        $("#modalDeleteLocation").modal('show');
    });

    $(".locations .list-item__save").click( function() {
        // $(".locations .list-item__delete").hide();
        $(".list.locations").removeClass("edit-list");
        $(".locations .list-item__edit").show();
        $(".locations .list-item__save").hide();
        $(".locations .list-item__delete").hide();
    });

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
        // scrollTopSection();
        hideListControlChildren();
        showControlsExisting();
    });

    $("#saveListEventLocationNew").click( function() {
        confirmConfiguration();
        $(".list-item-new").show();
        // scrollTopSection();
        hideListControlChildren();
        // handleListControls();
        showControlsNew();
    });

    $("#saveListEventLocationDuplicate").click( function() {
        confirmConfiguration();
        $(".list-item-duplicate").show();
        // scrollTopSection();
        hideListControlChildren();
        // handleListControls();
    });

    $("#saveListEventLocationOpenWater").click( function() {
        confirmConfiguration();
        $(".list-item-open-water").show();
        // scrollTopSection();
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

    $("#confirmLocationSelby").click( function() {
        if (viewName === "Club Registration") {
            $("#modalChosePoolConfigurationSelby").modal('show');
        } else if (viewName === "Pool") {
            $("#modalChosePoolConfigurationSelby").modal('show');
        } else if (viewName === "Calendar") {
            confirmConfiguration();
            showControlsExisting();
            $(".list-item-existing.list-item-pool").show();
            $(".venue__list").show();
            $(".configuration-title").hide();
        } else if (viewName === "Other Pool") {
            confirmConfiguration();
            showControlsExisting();
            $(".list-item-pool.list-item-existing").show();
            $(".venue__list").show();
            $(".list-item-pool.list-item-existing .venue__list--item").show();
            $(".configuration-title").hide();
        }
    });

    $("#confirmDeleteLocation").click( function() {
        if (viewName === "Open Water") {
            hideEditListControls();
            hideSavedLocationList();
            hideListControlChildren();
            showLocationLookup();
            showLookupLocationList();
            resetAddNewLocation();
            filterByOpenWater();
        } else if (viewName === "Pool") {
            hideEditListControls();
            hideSavedLocationList();
            hideListControlChildren();
            $(lookupByLocationList).hide();
            $(".locations .list-item").hide();
            showLocationLookup();
            showLookupLocationList();
            resetAddNewLocation();
            filterByRange();
        } else if (viewName === "Calendar") {
            hideEditListControls();
            hideSavedLocationList();
            hideListControlChildren();
            $(lookupByLocationList).hide();
            $(".locations .list-item").hide();
            showLocationLookup();
            showLookupLocationList();
            resetAddNewLocation();
            filterByRange();
        } else if (viewName === "Other Open Water") {
            showLocationLookup();
            showLookupLocationList();
            resetAddNewLocation();
            filterByOpenWater();
        } else if (viewName === "Other Pool") {
            hideEditListControls();
            hideSavedLocationList();
            hideListControlChildren();
            $(lookupByLocationList).hide();
            $(".locations .list-item").hide();
            showLocationLookup();
            showLookupLocationList();
            resetAddNewLocation();
            filterByRange();
        } else if (viewName === "Club Registration") {
            hideEditListControls();
            hideSavedLocationList();
            hideListControlChildren();
            $(lookupByLocationList).hide();
            $(".locations .list-item").hide();
            showLocationLookup();
            showLookupLocationList();
            resetAddNewLocation();
            filterByRange();
        }
    });
    
    $("#closeDuplicateAddress").click( function() {
        if (viewName === "Open Water") {
            showSavedLocationList();
            showLocationLookup();
            showLookupLocationList();
            resetAddNewLocation();
            $(".list.locations .list-item--open-water.list-item--duplicate").show();
        } else if (viewName === "Other Open Water") {
            showSavedLocationList();
            showLocationLookup();
            showLookupLocationList();
            resetAddNewLocation();
            $(".list.locations .list-item--open-water.list-item--duplicate").show();
        } else if (viewName === "Other Pool") {
            showSavedLocationList();
            showLocationLookup();
            showLookupLocationList();
            resetAddNewLocation();
            showLocationLookup();
            showLookupLocationList();
            $(".list.locations .list-item--pool.list-item--duplicate").show();
        }
    });

    $("#confirmLocationHealthfit").click( function() {
        if (viewName === "Pool") {
            $("#modalChosePoolConfigurationHealthfit").modal('show');
        } else if (viewName === "Calendar") {
            confirmConfiguration();
            showControlsExisting();
            $(".list-item-duplicate").show();
            $(".venue__list").show();
            $(".configuration-title").hide();
        } else if (viewName === "Other Pool") {
            confirmConfiguration();
            showControlsExisting();
            $(".list-item-pool.list-item-duplicate").show();
            $(".venue__list").show();
            $(".configuration-title").hide();
        }
    });

    $("#confirmLocationJensen").click( function() {
        if (viewName === "Pool") {
            $("#modalChosePoolConfigurationJensen").modal('show');
        } else if (viewName === "Calendar") {
            confirmConfiguration();
            showControlsNew();
            $(".list-item-new.list-item-pool").show();
            $(".list-item-new .configuration__list").show();
            $(".list-item-new .configuration__list--item.selected").show();
            $(".list-item-new .configuration__list--item.selected .configuration-title").show();
        } else if (viewName === "Open Water") {
            confirmConfiguration();
            showControlsNew();
            $(".list-item-new.list-item-pool").show();
            $(".list-item-new .configuration__list").show();
            $(".list-item-new .configuration__list--item.selected").show();
            $(".list-item-new .configuration__list--item.selected .configuration-title").show();
        }
    });

    $('#editLocationBtn').click( function(e) {
        e.preventDefault();
        var currentLocation = $('.locations .list-item:visible').first();
        if (currentLocation.hasClass('list-item-duplicate')) {
            showEditListControlsReadOnly();
        }
        else if (currentLocation.hasClass('list-item-existing')) {
            showEditListControlsReadOnly();
        } else {
            showEditListControlsEditable();
        }            
    });

    $("#submit-button").click( function() {
        if (window.viewName === "Club Registration") {
            alert("This is Club Reg");
        } else {
            alert("This is not Club Reg");
        }
    });

    $('#submitEdit').click( function() {
        $('.help-block').each(function() {
            var $inputGroup = $(this).closest('.input-group').find('.form-control');
            var $formGroup = $(this).closest('.form-group').find('.form-control');
            if ($(this).hasClass('has-error')) {
                $(this).removeClass('has-error');
                $inputGroup.removeClass('has-error');
                $formGroup.removeClass('has-error');
            } else {
                $(this).addClass('has-error');
                $inputGroup.addClass('has-error');
                $formGroup.addClass('has-error');
            }
        });
        $("#entryInfoComments").removeClass('has-error');
        $('.help-block--addHeadRef.has-error').removeClass('has-error');
        $('.help-block--addSafetyCoordinator.has-error').removeClass('has-error');
        $('.help-block--chosePoolConfiguration.has-error').removeClass('has-error');
        $('.list-item .help-block.has-error').removeClass('has-error');
        $('.help-block.file-type.has-error').removeClass('has-error');
        $('.help-block.help-block--paper-entry.no-data.has-error').removeClass('has-error');
        $('.form-control.lookup__input.lookup-primary__input.has-error').removeClass('has-error');
        $('.help-block.help-block--LookupEventDirectorName.has-error').removeClass('has-error');
    });

    $('#submit-button').click( function() {
        $('.help-block').each(function() {
            var $inputGroup = $(this).closest('.input-group').find('.form-control');
            var $formGroup = $(this).closest('.form-group').find('.form-control');
            if ($(this).hasClass('has-error')) {
                $(this).removeClass('has-error');
                $inputGroup.removeClass('has-error');
                $formGroup.removeClass('has-error');
            } else {
                $(this).addClass('has-error');
                $inputGroup.addClass('has-error');
                $formGroup.addClass('has-error');
            }
        });
        $("#entryInfoComments").removeClass('has-error');
        $('.help-block--addHeadRef.has-error').removeClass('has-error');
        $('.help-block--addSafetyCoordinator.has-error').removeClass('has-error');
        $('.help-block--chosePoolConfiguration.has-error').removeClass('has-error');
        $('.list-item .help-block.has-error').removeClass('has-error');
        $('.help-block.file-type.has-error').removeClass('has-error');
        $('.help-block.help-block--paper-entry.no-data.has-error').removeClass('has-error');
        $('.form-control.lookup__input.lookup-primary__input.has-error').removeClass('has-error');
        $('.help-block.help-block--LookupEventDirectorName.has-error').removeClass('has-error');
    });






    // Filter location lookup results list
    if (viewName === "Open Water") {
        filterByOpenWater();
    } else if (viewName === "Pool") {
        filterByRange();
        filterByCourse();
    } else if (viewName === "Calendar") {
        filterByRange();
        filterByCourse();
    } else if (viewName === "Other Open Water") {
        filterByOpenWater();
    } else if (viewName === "Other Pool") {
        filterByRange();
        filterByCourse();
    } else if (viewName === "Club Registration") {
        filterByRange();
    }

    // // Get page name to filter location lookup results
    // $(document).on("settingPageName", function(event, data) {
    //     const currentPageName = data.data;
    //     if (currentPageName === "Open Water") {
    //         filterByOpenWater();
    //     } else if (currentPageName === "Pool") {
    //         filterByRange();
    //         filterByCourse();
    //     } else if (currentPageName === "Calendar") {
    //         filterByRange();
    //         filterByCourse();
    //     } else if (currentPageName === "Other Open Water") {
    //         filterByOpenWater();
    //     } else if (currentPageName === "Other Pool") {
    //         filterByRange();
    //         filterByCourse();
    //     } else if (currentPageName === "Club Registration") {
    //         filterByRange();
    //     }
    //     console.log("This is " + currentPageName);
    // });
    // setPageName();






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

    function addNewConfigurationSelby() {
        hideLocationLookup();
        $(lookupByLocationList).hide();
        $("#saveLocation").prop('disabled', false);
        $(".list-item.list-item-existing .list__controls").hide();
        $(".venue__list--item:first-of-type .configuration-title").hide();
        $(".venue__list--item").hide();       
        $(".list-item-pool.list-item-existing").show();
        $(".configuration__list--item.added").show();
        showSavedLocationList();
        $(".location-header").hide();
        $(addNewPoolForm).show();
    }

    function showEditListControlsReadOnly() {
        $('#editLocationBtn').hide();
        $('#doneEditLocationBtn').show();
        $('.list.locations').addClass('edit-list');
        $('.locations .list-item > .list__controls').show();
        $(".locations .list-item__edit").hide();
        $(".locations .list-item__delete").show();
        $('.row.locations').show();
        $('.location-header__edit').show();
    }
    
    function showEditListControlsEditable() {
        $('#editLocationBtn').hide();
        $('#doneEditLocationBtn').show();
        $('.list.locations').addClass('edit-list');
        $('.locations .list-item > .list__controls').show();
        $(".locations .list-item__edit").show();
        $(".locations .list-item__delete").show();
        $('.row.locations').show();
        $('.location-header__edit').show();
        $('.venue__list .list__controls').show();
        $('.configuration__list .list__controls').show();
    }

    function hideEditListControls() {
        $('#editLocationBtn').show();
        $('#doneEditLocationBtn').hide();
        $('.list.locations').removeClass('edit-list');
        $(".locations .list-item__edit").hide();
        $(".locations .list-item__delete").hide();
        $('.list__controls').hide();
        $('.row.locations').hide();
        $('.location-header__edit').hide();
    }

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
        $(".list.list--lookup.locations").parent().parent().show();
        $('.row.locations').hide();
        $('.location-header__edit').hide();
    }

    function hideLookupLocationList() {        
        $(".list.list--lookup.locations").hide();
        $(".list.list--lookup.locations").parent().parent().hide();
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
        $(addNewLocationForm).removeClass('show');
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
        $(".location-name > .list__controls").show();
        $(".list.locations").removeClass("edit-list");
        if ($(".list-item-existing").css('display') === 'block') {
            showControlsExisting();
        }
        if ($(".list-item-new").css('display') === 'block') {
            showControlsNew();
        }
    }

    function showControlsNew() {
        $(".location-name > .list__controls").show();
        $(".list.locations").removeClass("edit-list");
        $(".locations .list-item__edit").show();
        $(".locations .list-item__save").hide();
        $(".list__controls--settings").css('display', 'inline-flex');
    }

    function showControlsExisting() {
        $(".location-name > .list__controls").show();
        $(".list.locations").removeClass("edit-list");
        $(".locations .list-item__edit").hide();
        $(".locations .list-item__save").hide();
        $(".location-header__edit").show();
    }

    function hideControls() {
        $(".list.locations").removeClass("edit-list");
        $(".locations .list-item__edit").show();
        $(".locations .list-item__save").hide();
        $(".locations .list-item__delete").hide();
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
    }

    function filterByOpenWater() {
        // (".list--lookup.locations").parent().parent().show();
        $(".list--lookup.locations").show();
        $(".list--lookup.locations .list-item").hide();
        $(".list--lookup.locations .list-item.list-item--open-water").show();
    }

});