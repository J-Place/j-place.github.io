$(document).ready(function() {

    // Open Add Safety Coordinator Form
    $("#addSafetyCoordinator").click(function(e) {
        e.preventDefault();
        disableEventDirectorRadios();
        disableHostTypeSelect();
        disableHeadRefBtn();
        openSafetyCoordinatorSection();
        disableListControlEditing();
        hideLookupConfirmtBtn()
        $("#addSafetyCoordinator").hide();
        $("#cancelAddSafetyCoordinator").show();
        $("#lookupSafetyCoordinatorName").attr("placeholder", "");
        $(".contact-info__safety-coordinator-new--add-new").show();
    });

    $("#cancelAddSafetyCoordinator").click(function(e) {
        e.preventDefault();
        closeSafetyCoordinatorSection();
        $("#addSafetyCoordinator").show();
        $("#cancelAddSafetyCoordinator").hide();
        enableListControlEditing();
        enableHeadRefBtn();
    });

    // Lookup Safety Coordinator in Search
    $("#lookupSafetyCoordinatorName").click(function(e) {
        e.preventDefault();
        openLookupSafetyCoordinator();
        closeAddSafetyCoordinatorForm();
        $(this).attr("placeholder", "Jay Place, Sarasota, FL");
        $("#addNewSafetyCoordinator").show();
    });

    // Save Safety Coordinator from Search
    $("#addExistingSafetyCoordinatorBtn").click(function(e) {
        e.preventDefault();
        closeSafetyCoordinatorSection();
        showSafetyCoordinatorList();
        enableListControlEditing();
        enableHeadRefBtn();
        $("#cancelAddSafetyCoordinator").hide();
        $("#addSafetyCoordinator").show();
        $("#lookupSafetyCoordinatorName").attr("placeholder", "");
        $(".contact-list__safety-coordinator--header").show();
        $(".contact-info__safety-coordinator-list .list-item--lookup").parent().show();
    });

    // Select Add New Safety -> Open Form
    $("#addNewSafetyCoordinator").click(function(e) {
        e.preventDefault();
        $("#addNewSafetyCoordinator").hide();
        closeLookupSafetyCoordinator();
        openAddSafetyCoordinatorForm();
        $("#lookupSafetyCoordinatorName").attr("placeholder", "");
    });

    $(".contact-info__safety-coordinator--add-new-container .confirm-form-add-new-person").click( function(e) {
        e.preventDefault();
        closeSafetyCoordinatorSection();
        showSafetyCoordinatorList();
        enableListControlEditing();
        enableHeadRefBtn();
        $("#cancelAddSafetyCoordinator").hide();
        $("#addSafetyCoordinator").show();
        $(".contact-list__safety-coordinator--header").show();
        $(".contact-info__safety-coordinator-list .list-item--new").parent().show();
    });

    $("#cancelNewSafetyCoordinatorBtn").click(function(e) {
        e.preventDefault();
        closeAddSafetyCoordinatorForm();
        $("#addNewSafetyCoordinator").show();
    });


    $(".list--safety-coordinator #saveContactList").click(function() {
        var numModified = $('.list__container--modified').length;
        if (numModified > 0) {
            $(".list").removeClass("edit-list");
            $(".list-item").removeClass('list-item--fade-out');
            resetSafetyCoordinator();
        } else {
            $(".list").removeClass("edit-list");
            $(".list-item").removeClass('list-item--fade-out');
        }
        $('.list__container').removeClass('list__container--modified');
    });


    $(".contact-group--safety-coordinator .list-item__delete").click(function() {
        $(this).parent().addClass('list-item--fade-out');
        $(this).closest('.list__container').addClass('list__container--modified');
    });

    $("#deleteSafetyCoordinatorListItem").click(function(e) {
        e.preventDefault();
        // hideLookupConfirmtBtn();
        // resetHostSelects();
        resetSafetyCoordinator();
        $(".contact-info__safety-coordinator--container").show();
        $(".contact-list__safety-coordinator--header").hide();
        $(".contact-information__safety-coordinator--list .list-item").parent().hide();
        // $(".contact-list__event-director-add-new--awaiting-message").hide();
    });

});


/////////////////////////////////////////////////////////////// Functions ///////////////////////////////////////////////////////////////


function resetSafetyCoordinator() {
    $(".form-group.contact-info__safety-coordinator--container").show();
    hideSafetyCoordinatorList();
    hideSafetyCoordinatorListItems();
}

function openSafetyCoordinatorSection() {
    $(".contact-info__safety-coordinator-lookup--container").show();
    $(".contact-info__safety-coordinator-new--add-new").show();
}

function closeSafetyCoordinatorSection() {
    $(".contact-info__safety-coordinator-lookup--container").hide();
    $(".contact-info__safety-coordinator-new--add-new").hide();
    closeAddSafetyCoordinatorForm();
    enableEventDirectorRadios();
    enableHostTypeSelect();
}

function disableSafetyCoordinatorBtn() {
    if ($("#addSafetyCoordinator").length) {
        $("#addSafetyCoordinator").prop('disabled', true);
    }
}

function enableSafetyCoordinatorBtn() {
    if ($("#addSafetyCoordinator").length) {
        $("#addSafetyCoordinator").prop('disabled', false);
    }
}

function openLookupSafetyCoordinator() {
    $(".input-group.lookup-confirm").show();
    $(".input-group.lookup-confirm").css("height","70px");
    $(".input-group.lookup-confirm").css("opacity","1");
    $("#addExistingSafetyCoordinatorBtn").show();
}

function closeLookupSafetyCoordinator() {
    hideLookupConfirmtBtn();
    $("#addExistingSafetyCoordinatorBtn").hide();
    $("#lookupSafetyCoordinatorName").attr("placeholder", "");
}

function openAddSafetyCoordinatorForm() {
    closeLookupSafetyCoordinator();
    $(".contact-info__safety-coordinator--add-new-container").show();
}

function closeAddSafetyCoordinatorForm() {
    $(".contact-info__safety-coordinator--add-new-container").hide();
}

function showSafetyCoordinatorList() {
    $(".contact-info__safety-coordinator-list").show();
    $(".contact-info__safety-coordinator--container").hide();
}

function hideSafetyCoordinatorList() {
    $(".contact-info__safety-coordinator-list").hide();
}

function hideSafetyCoordinatorListItems() {
    $(".contact-info__safety-coordinator-list .list-item").parent().hide();
}