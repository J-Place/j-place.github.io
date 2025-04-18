$(document).ready(function() {

// Disable Save & Continue Button
    // $("#saveContactInfoSection").prop("disabled", true);

// Select I'm the Event Director
    $("#contactTypeEventDirectorCurrent").click(function(e) {
        e.preventDefault();
        if ($(".contact-group--head-ref").length) { disableHeadRefBtn(); }
        if ($(".contact-group--safety-coordinator").length) { disableSafetyCoordinatorBtn(); }
        if ($(".contact-group--host-type").length) { disableHostTypeSelect(); }
        disableListControlEditing();

        // Show selected Event Director in list
        $(".contact-information__event-director--list").show();
        $(".contact-information__event-director--list .list-item").parent().hide();
        $(".contact-information__event-director--list .list-item--current").parent().show();

        hideLookupConfirmtBtn();

        $(".contact-list__event-director--message").hide();
        $(".contact-info__event-director-other--container").hide();
        $(".contact-info__event-director-other--add-new").hide();    
        $(".contact-info__event-director--add-new-container.add-new-inputs").hide();

        $("#confirmCurrentEventDirector").show();
        $("#lookupEventDirectorName").attr("placeholder", "");
        $("#addNewEventDirector").show();
    });

// Confirm I'm the Event Director
    $("#confirmCurrentEventDirector").click(function(e) {
        e.preventDefault();        
        $(".contact-info__event-director-type-form").hide();  // Hide the Event Dorector inputs
        $(this).hide();
        $(".list__header.contact-list__event-director--header").show();
        $(".event-director-privacy").show();
        uncheckEventDirectorRadios();
        if ($(".contact-group--head-ref").length) { enableHeadRefBtn(); }
        if ($(".contact-group--safety-coordinator").length) { enableSafetyCoordinatorBtn(); }
        enableListControlEditing();
        $("#selectHostType").prop("disabled", false);
        $(".contact-info__event-director-privacy--container").show();
        $(".list--event-director .list-item__delete").show();
    });

// Someone Else is the Event Director
    $("#contactTypeEventDirectorOther").click(function(e) {
        e.preventDefault();
        $("#selectHostType").prop("disabled", true);
        if ($(".contact-group--head-ref").length) { disableHeadRefBtn(); }
        if ($(".contact-group--safety-coordinator").length) { disableSafetyCoordinatorBtn(); }
        disableListControlEditing();
        $(".contact-info__event-director-other--container").show();
        $(".contact-info__event-director-other--add-new").show();
        $(".contact-information__event-director--list").hide();
        $("#confirmCurrentEventDirector").hide();
        $("#lookupEventDirectorName").attr("placeholder", "");
        $(".contact-list__event-director--message").show();
    });

// Search Existing Event Directors
    $("#lookupEventDirectorName").click(function(e) {
        e.preventDefault();
        showLookupConfirmtBtn();
        $(".contact-info__event-director--add-new-container.add-new-inputs").hide();
        $("#addAsEventDirector").show();
        $("#addNewEventDirector").show();
        $(this).attr("placeholder", "Kyle Deery, Sarasota, FL");
    });

// Save Existing Event Director Search Result
    $("#addAsEventDirector").click(function(e) {
        e.preventDefault();
        disableEventDirectorRadios();
        if ($(".contact-group--head-ref").length) { enableHeadRefBtn(); }
        if ($(".contact-group--safety-coordinator").length) { enableSafetyCoordinatorBtn(); }
        if ($(".contact-group--host-type").length) { enableHostTypeSelect(); }
        enableListControlEditing();
        hideLookupConfirmtBtn();
        uncheckEventDirectorRadios();
        $(".contact-info__event-director-type-form").hide();  // Hide the Event Dorector inputs
        $(".contact-info__event-director-other--container").hide();
        $(".contact-info__event-director-other--add-new").hide();
        $(".contact-list__event-director--message").hide();
        $(".contact-info__event-director--add-new-container.add-new-inputs").hide();
        $("#confirmCurrentEventDirector").hide();
        $(".list__header.contact-list__event-director--header").show();
        $(".contact-information__event-director--list").show();
        $(".contact-information__event-director--list .list-item").parent().hide();
        $(".contact-information__event-director--list .list-item--lookup").parent().show();
        $("#lookupEventDirectorName").attr("placeholder", "");
        $(".contact-info__event-director-privacy--container").show();
        $(".list--event-director .list-item__delete").show();
    });

// Open Form to Add New Event Director
    $("#addNewEventDirector").click(function(e) {
        e.preventDefault();
        $(this).hide();
        hideLookupConfirmtBtn();
        $("#addAsEventDirector").hide();
        $(".contact-info__event-director--add-new-container.add-new-inputs").show();
        $("#lookupEventDirectorName").attr("placeholder", "");
        $(".list--event-director .list-item__delete").show();
    });

// Save New Event Director from Form
    $(".contact-info__event-director--add-new-container .confirm-form-add-new-person").click( function() {
        hideLookupConfirmtBtn();
        enableEventDirectorRadios();
        uncheckEventDirectorRadios();
        enableListControlEditing();
        $("#selectHostType").prop("disabled", false);
        if ($(".contact-group--head-ref").length) { enableHeadRefBtn(); }
        if ($(".contact-group--safety-coordinator").length) { enableSafetyCoordinatorBtn(); }
        $(".section__header--summary.contact-list__event-director--message").hide();
        $(".contact-info__event-director-type-form").hide();  // Hide the Event Director inputs
        $(".contact-info__event-director-other--container").hide();
        $(".contact-info__event-director-other--add-new").hide();
        $(".contact-list__event-director--message").hide();
        $(".contact-info__event-director--add-new-container.add-new-inputs").hide();
        $("#confirmCurrentEventDirector").hide();
        $(".list__header.contact-list__event-director--header").show();
        $(".contact-information__event-director--list").show();
        $(".contact-information__event-director--list .list-item").parent().hide();
        $(".contact-information__event-director--list .list-item--new").parent().show();
        $("#addNewEventDirector").show();
        $("#contact__recentlyadded").show();
        $(".contact-list__event-director-add-new--awaiting-message").show();
        $(".contact-info__event-director-privacy--container").show();
    });

    $("#cancelAddNewEventDirectorBtn").click(function(e) {
        e.preventDefault();
        $(".contact-info__event-director-type-form").show();
        $(".contact-info__event-director-other--container").show();
        $(".contact-info__event-director-other--add-new").show();
        $(".contact-info__event-director--add-new-container").hide();
        $("#addNewEventDirector").show();
        $(".contact-list__event-director--message").show();
        $(".contact-info__event-director-privacy--container").hide();
    });











    
    $(".list--event-director #saveContactList").click(function() {
        var numModified = $('.list__container--modified').length;
        if (numModified > 0) {
            $(".list").removeClass("edit-list");
            $(".list-item").removeClass('list-item--fade-out');
            resetEventDirector();
        } else {
            $(".list").removeClass("edit-list");
            $(".list-item").removeClass('list-item--fade-out');
            $(".contact-info__event-director-privacy--container").show();
        }
        $('.list__container').removeClass('list__container--modified');
    });
    
    $(".list--event-director #cancelContactList").click(function() {
        $(".contact-info__event-director-privacy--container").show();
        var numModified = $('.list__container--modified').length;
        if (numModified > 0) {
            return
        } else {
            $(".contact-info__event-director-privacy--container").show();
            $(".contact-list__event-director-add-new--awaiting-message").show();
        }
    });

    // $(".list--event-director .list-item__delete").click(function(e) {
    //     e.preventDefault();
    //     $(this).parent().addClass('list-item--fade-out');
    //     resetEventDirector();
    //     // $(this).closest('.list__container').addClass('list__container--modified');
    //     // $(".contact-info__event-director-privacy--container").hide();
    //     // $(".contact-list__event-director-add-new--awaiting-message").hide();
    // });


    $("#deleteEventDirectorListItem").click(function(e) {
        e.preventDefault();
        hideLookupConfirmtBtn();
        // resetHostSelects();
        resetEventDirector();
        $(".contact-info__host-type--container").show();
        $(".contact-list__event-host--header").hide();
        $(".contact-information__event-host--list .list-item").parent().hide();
        $(".contact-list__event-director-add-new--awaiting-message").hide();
    });

});


// Functions //////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////


function resetEventDirector() {
    $(".contact-info__event-director-type-form").show();
    $(".list__header.contact-list__event-director--header").hide();
    $(".contact-information__event-director--list").hide();
    $(".contact-information__event-director--list .list-item").parent().hide();
    $("#confirmCurrentEventDirector").show();
    $(".contact-list__event-director-add-new--awaiting-message").hide();
    $(".contact-info__event-director-privacy--container").hide();
    $(".list").removeClass("edit-list");
    if ($(".contact-group--head-ref").length) { enableHeadRefBtn(); }
    if ($(".contact-group--safety-coordinator").length) { enableSafetyCoordinatorBtn(); }
    if ($(".contact-group--host-type").length) { enableHostTypeSelect(); }
    enableEventDirectorRadios();
}

function disableEventDirectorRadios() {
    $("#contactTypeEventDirectorCurrent").prop('disabled', true);
    $("#contactTypeEventDirectorOther").prop('disabled', true);
}

function enableEventDirectorRadios() {
    $("#contactTypeEventDirectorCurrent").prop('disabled', false);
    $("#contactTypeEventDirectorOther").prop('disabled', false);
}

function uncheckEventDirectorRadios() {
    $("#contactTypeEventDirectorCurrent").prop('checked', false);
    $("#contactTypeEventDirectorOther").prop('checked', false);
}

function hideLookupConfirmtBtn() {
    $(".input-group.lookup-confirm").hide();
    $(".input-group.lookup-confirm").css("height","0");
    $(".input-group.lookup-confirm").css("opacity","0");
}

function showLookupConfirmtBtn() {
    $(".input-group.lookup-confirm").show();
    $(".input-group.lookup-confirm").css("height","70px");
    $(".input-group.lookup-confirm").css("opacity","1");
}