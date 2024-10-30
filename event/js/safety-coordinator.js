// Choose to Add Safety Coordinator - Open Inputs
$("#addSafetyCoordinator").click(function(e) {
    e.preventDefault();
    disableEventDirectorRadios();
    disableHostTypeSelect();
    disableHeadRefBtn();
    openSafetyCoordinatorSection();
    disableListControlEditing();
    $("#lookupHostTypeOtherOrganization").attr("placeholder", "");
    $(".contact-info__safety-coordinator-new--add-new").show();
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
    closeSafetyCoordinatorSection(); // Close the safety coordinator inputs
    showSafetyCoordinatorList(); // Show the list container
    enableListControlEditing(); // Enable list editing
    enableHeadRefBtn();  // Show Head Ref button
    $(".contact-list__safety-coordinator--header").show(); // Show the list header    
    $(".contact-info__safety-coordinator-list .list-item--lookup").parent().show(); // Show this list item
    // .attr("placeholder", "");
});

// Select Add New Safety -> Open Form
$("#addNewSafetyCoordinator").click(function(e) {
    e.preventDefault();
    $("#addNewSafetyCoordinator").hide();
    closeLookupSafetyCoordinator();
    openAddSafetyCoordinatorForm();
    $("#lookupHostTypeOtherOrganization").attr("placeholder", "");
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
    closeSafetyCoordinatorSection(); // Close the safety coordinator inputs
    showSafetyCoordinatorList(); // Show the list container
    enableListControlEditing(); // Enable list editing
    enableHeadRefBtn(); // Show Head Ref button
    $(".contact-list__safety-coordinator--header").show(); // Show the list header    
    $(".contact-info__safety-coordinator-list .list-item--new").parent().show(); // Show this list item
});

$("#cancelNewSafetyCoordinatorBtn").click(function(e) {
    e.preventDefault();
    closeAddSafetyCoordinatorForm();
    $("#addNewSafetyCoordinator").show();
});


// Functions //////////////////////////////////////////////////////////////////////////////////////////////

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
    // $(".contact-info__safety-coordinator--container").show();
}

function hideSafetyCoordinatorListItems() {
    $(".contact-info__safety-coordinator-list .list-item").parent().hide();
}