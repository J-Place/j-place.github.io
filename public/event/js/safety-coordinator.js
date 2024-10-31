// Choose to Add Safety Coordinator - Open Inputs
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
    $(this).attr("placeholder", "Jay Place");
});

// Save Safety Coordinator from Search
$("#addExistingSafetyCoordinatorBtn").click(function(e) {
    e.preventDefault();
    closeSafetyCoordinatorSection();
    showSafetyCoordinatorList();
    enableListControlEditing();
    enableHeadRefBtn();
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

// Edit Safety List -> Clears the list for demo purposes
$("#editSafetyCoordinatorList").click(function(e) {
    e.preventDefault();
    hideSafetyCoordinatorList();
    hideSafetyCoordinatorListItems();
    resetSafetyCoordinator();
});

$("#confirmNewSafetyCoordinatorBtn").click(function(e) {
    e.preventDefault();
    closeSafetyCoordinatorSection();
    showSafetyCoordinatorList();
    enableListControlEditing();
    enableHeadRefBtn();
    $(".contact-list__safety-coordinator--header").show();
    $(".contact-info__safety-coordinator-list .list-item--new").parent().show();
});

$("#cancelNewSafetyCoordinatorBtn").click(function(e) {
    e.preventDefault();
    closeAddSafetyCoordinatorForm();
    $("#addNewSafetyCoordinator").show();
});




// Functions //////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////


function resetSafetyCoordinator() {
    $(".form-group.contact-info__safety-coordinator--container").show();
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
    $("#addSafetyCoordinator").prop('disabled', true);
}

function enableSafetyCoordinatorBtn() {
    $("#addSafetyCoordinator").prop('disabled', false);
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