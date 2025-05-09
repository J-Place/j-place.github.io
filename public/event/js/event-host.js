$(document).ready(function() {

    $('#selectHostType').on('change', function() {
        
        // Disable the other inputs until a host is saved
        if ($(".contact-group--event-director").length) { disableEventDirectorRadios(); }
        if ($(".contact-group--head-ref").length) { disableHeadRefBtn(); }
        if ($(".contact-group--safety-coordinator").length) { disableSafetyCoordinatorBtn(); }
        disableListControlEditing();
        hideLookupConfirmtBtn();

        $("#lookupHostTypeOtherOrganization").attr("placeholder", "");
        
        // $("#selectHostTypeLmsc").prop('selectedIndex', 0);

        $(".contact-information__event-host--list .list-item").parent().hide();
        $(".contact-info-host-type__other-organization--container").hide();
        
        $("#contactTypeEventDirectorCurrent").prop('checked', false);
        $("#contactTypeEventDirectorOther").prop('checked', false);
    
        if ($(this).val() != 'LMSC') {
            $("#confirmLmscSelect").hide();
        }
        if ($(this).val() != 'Event Director/Single Person') {
            $("#confirmCurrentHost").hide();
        }
        if ($(this).val() != 'Other Organization') {
            $(".contact-info-host-type__other--container").hide();
            $(".contact-info-organization__add-new").hide();
        }
        if ($(this).val() === 'LMSC') {
            $(".contact-info-host-type__other--container").hide();
            $(".contact-info-safety-coordinator__add-new").hide();
            $(".contact-info__host-type-club--container").hide();
            $(".contact-info__host-type-lmsc--container").show();
        }
        if ($(this).val() === 'USMS Club') {
            $(".contact-info__host-type-lmsc--container").hide();
            $(".contact-info__host-type-club--container").hide();
            $(".contact-info-host-type__other--container").hide();
            $(".contact-info-safety-coordinator__add-new").hide();
            $("#confirmClubLookup").hide();
            $(".contact-info__host-type-club--container").show();
            $(".lookup-host-type-usms-club").show();
        }
        if ($(this).val() === 'Other Organization') {
            $("#addHostTypeOtherOrganizationLookup").hide();
            $(".contact-info__host-type-lmsc--container").hide();
            $(".contact-info__host-type-club--container").hide();
            $(".contact-info-host-type__other--container").show();
            $(".contact-info-safety-coordinator__add-new").show();
            $(".contact-info-organization__add-new").show();
            $("#addNewOrganization").show();
            $(".contact-information__event-host--list .list-item").parent().hide();
            $(".contact-information__event-host--list .list-item--organization").parent().show();
            $(".contact-information__event-host--list").show();
            $(".list--event-host .list-item__delete").show();
        }
        if ($(this).val() === 'Event Director/Single Person') {
            $(".contact-info__host-type-lmsc--container").hide();
            $(".contact-info__host-type-club--container").hide();
            $(".contact-info-host-type__other--container").hide();
            $(".contact-info-safety-coordinator__add-new").hide();
            $(".contact-info__host-type-event-director--container").show();
            $("#confirmCurrentHost").show();
            $(".contact-information__event-host--list .list-item").parent().hide();
            $(".contact-information__event-host--list .list-item--current").parent().show();
            $(".contact-information__event-host--list").show();
            $(".list--event-host .list-item__delete").show();
        }
    });

    $("#selectHostTypeLmsc").on('change', function() {
        if ($(this).val() === 'Florida LMSC' || $(this).val() === 'Georgia LMSC') {
            hideLookupConfirmtBtn();
        }
        $("#confirmLmscSelect").show();
    });

    $("#confirmLmscSelect").click(function(e) {
        e.preventDefault();
        $(this).hide();
        $(".contact-info__host-type-lmsc--container").hide();
        resetHostSelects();
        enableHostTypeSelect();
        enableListControlEditing();
        if ($(".contact-group--event-director").length) { enableEventDirectorRadios(); }
        if ($(".contact-group--head-ref").length) { enableHeadRefBtn(); }
        if ($(".contact-group--safety-coordinator").length) { enableSafetyCoordinatorBtn(); }
        $(".contact-info__host-type--container").hide();
        $(".contact-list__event-host--header").show();
        $(".contact-information__event-host--list").show();
        $(".contact-information__event-host--list .list-item").parent().hide();
        $(".contact-information__event-host--list .list-item--lmsc").parent().show();
        $(".list--event-host .list-item__delete").show();
    });
    
    // $("#editHostList").click(function(e) {
    $(".contact-group--host-type .contact-remove-button").click(function(e) {
        e.preventDefault();
        hideLookupConfirmtBtn();
        resetHostSelects();
        $(".contact-info__host-type--container").show();
        $(".contact-list__event-host--header").hide();
        $(".contact-information__event-host--list .list-item").parent().hide();
        $(".contact-list__event-director-add-new--awaiting-message").hide();
    });
    
    $("#lookupHostTypeOtherOrganization").click(function(e) {
        e.preventDefault();
        $("#addHostTypeOtherOrganizationLookup").show();
        $(".lookup-confirm").show();
        $(".input-group.lookup-confirm").css("height","70px");
        $(".input-group.lookup-confirm").css("opacity","1");
        $(".contact-info-host-type__other-organization--container.add-new-inputs").hide();
        $("#addNewOrganization").show();
        $("#lookupHostTypeOtherOrganization").attr("placeholder", "Rainbow River Swim Club, Dunnedin, FL");
    });
    
    $("#lookupHostTypeUsmsClub").click(function(e) {
        e.preventDefault();
        $("#confirmClubLookup").show();
    });
    
    $("#confirmClubLookup").click(function(e) {
        e.preventDefault();
        $(this).hide();
        if ($(".contact-group--event-director").length) { enableEventDirectorRadios(); }
        if ($(".contact-group--head-ref").length) { enableHeadRefBtn(); }
        if ($(".contact-group--safety-coordinator").length) { enableSafetyCoordinatorBtn(); }
        resetHostSelects();
        enableListControlEditing();
        hideLookupConfirmtBtn();
        $(".contact-info__host-type-club--container").hide();
        $(".contact-info__host-type--container").hide();
        $("#lookupHostTypeUsmsClub").hide();
        $("label[for='lookupHostTypeUsmsClub']").hide();
        $(".contact-list__event-host--header").show();        
        $(".contact-information__event-host--list").show();
        $(".contact-information__event-host--list .list-item").parent().hide();
        $(".contact-information__event-host--list .list-item--club").parent().show();
        $(".list--event-host .list-item__delete").show();
    });
    
    $("#confirmCurrentHost").click(function(e) {
        e.preventDefault();
        $(this).hide();
        if ($(".contact-group--event-director").length) { enableEventDirectorRadios(); }
        if ($(".contact-group--head-ref").length) { enableHeadRefBtn(); }
        if ($(".contact-group--safety-coordinator").length) { enableSafetyCoordinatorBtn(); }
        resetHostSelects();
        enableListControlEditing();
        $(".contact-info__host-type--container").hide();
        $(".contact-list__event-host--header").show();
        $(".list--event-host .list-item__delete").show();
    });
    
    $("#addNewOrganization").click(function(e) {
        e.preventDefault();
        $(this).hide();
        hideLookupConfirmtBtn();
        $("#lookupHostTypeOtherOrganization").attr("placeholder", "");
        $("#addHostTypeOtherOrganizationLookup").hide();
        $(".contact-info-host-type__other-organization--container").show();
        $("#addHostTypeOtherOrganizationLookup").hide();
        $("#addNewHeadRef").hide();
        $(".list--event-host .list-item__delete").show();
    });

    $("#addHostTypeOtherBtn").click(function(e) {
        e.preventDefault();
        if ($(".contact-group--event-director").length) { enableEventDirectorRadios(); }
        if ($(".contact-group--head-ref").length) { enableHeadRefBtn(); }
        if ($(".contact-group--safety-coordinator").length) { enableSafetyCoordinatorBtn(); }
        resetHostSelects();
        enableListControlEditing();
        hideLookupConfirmtBtn();
        // contact-information__event-host--list
        $(".contact-info-host-type__other-organization--container.add-new-inputs").hide();
        $(".contact-info__host-type--container").hide();
        $(".contact-info-host-type__other--container").hide();
        $(".contact-info-organization__add-new").hide();
        $("#addHostTypeOtherOrganizationLookup").hide();
        $(".contact-list__event-host--header").show();        
        $(".contact-information__event-host--list").show();
        $(".contact-information__event-host--list .list-item").parent().hide(); // Hide any existing list items
        $(".contact-information__event-host--list .list-item--organization-new").parent().show(); // Show this list item
        $(".list--event-host .list-item__delete").show();
    });

    $("#addHostTypeOtherOrganizationLookup").click(function(e) {
        e.preventDefault();
        $(this).hide();
        if ($(".contact-group--event-director").length) { enableEventDirectorRadios(); }
        if ($(".contact-group--head-ref").length) { enableHeadRefBtn(); }
        if ($(".contact-group--safety-coordinator").length) { enableSafetyCoordinatorBtn(); }
        enableListControlEditing();
        resetHostSelects();
        hideLookupConfirmtBtn();
        $("#lookupHostTypeOtherOrganization").attr("placeholder", "");
        $(".contact-info-organization__add-new").hide();
        $(".contact-info-host-type__other--container").hide();
        $(".contact-info__host-type--container").hide();        
        $(".contact-list__event-host--header").show();
        $(".list-item--organization-lookup").parent().show();
        $(".contact-information__event-host--list").show();
        $(".list--event-host .list-item__delete").show();
    });
    
    $("#cancelAddHostTypeOtherBtn").click(function(e) {
        e.preventDefault();
        $(".contact-info-host-type__other-organization--container.add-new-inputs").hide();
        $("#addNewOrganization").show();
    });

    $(".list--event-host #saveContactList").click(function() {
        var numModified = $('.list__container--modified').length;
        if (numModified > 0) {
            $(".list").removeClass("edit-list");
            $(".list-item").removeClass('list-item--fade-out');
            resetEventHost();
        } else {
            $(".list").removeClass("edit-list");
            $(".list-item").removeClass('list-item--fade-out');
        }
        $('.list__container').removeClass('list__container--modified');
    });

    $("#deleteHostListItem").click(function(e) {
        e.preventDefault();
        hideLookupConfirmtBtn();
        resetHostSelects();
        $(".contact-info__host-type--container").show();
        $(".contact-list__event-host--header").hide();
        $(".contact-information__event-host--list .list-item").parent().hide();
        $(".contact-list__event-director-add-new--awaiting-message").hide();
    });


    $("#hostTypeOtherStreetAddress").click( function() {
        $("#modalDuplicateOrganization").modal('show');
    });





});


function resetEventHost() {
    $(".contact-information__event-host--list").hide();
    $(".contact-info__host-type--container").show();
    $(".contact-list__event-host--header").show();
    resetHostSelects();
}

function disableHostTypeSelect() {
    $("#selectHostType").prop("disabled", true);
}

function enableHostTypeSelect() {
    $("#selectHostType").prop("disabled", false);
}

function disableListControlEditing() {
    $(".contact-list__controls .list__controls--settings").prop('disabled', true);
    $(".contact-list__controls .btn-link").prop('disabled', true);
}

function enableListControlEditing() {
    $(".contact-list__controls .list__controls--settings").prop('disabled', false);
    $(".contact-list__controls .btn-link").prop('disabled', false);
}

function resetHostSelects() {
    $("#selectHostType").prop('selectedIndex',0);
    $("#selectHostTypeLmsc").prop('selectedIndex',0);
}

function disableEventDirectorRadios() {
    $(".contact-info__event-director-type-form .radio-container input").prop('disabled', true);
}

$("#closeDuplicateOrganization").click( function() {
    $("#addNewOrganization").show();
    $(".contact-info-host-type__other-organization--container.add-new-inputs").hide();
});