// Choose to Add Head Ref - Open Inputs
$("#addHeadRef").click(function(e) {
    e.preventDefault();
    disableEventDirectorRadios();
    disableHostTypeSelect();
    openHeadRefSection();
    disableListControlEditing();
    $("#lookupHostTypeOtherOrganization").attr("placeholder", "");
    $(".contact-info__head-ref-new--add-new").show();
});

// Lookup Head Ref in Search
$("#lookupRefName").click(function(e) {
    e.preventDefault();
    openLookupRef();
    closeAddRefForm();
    $(this).attr("placeholder", "Mark Usher");
});

// Save Head Ref from Search
$("#addExistingRefBtn").click(function(e) {
    e.preventDefault();
    closeHeadRefSection(); // Close the head ref inputs
    showRefList(); // Show the list container
    enableListControlEditing(); // Enable list editing
    $(".contact-list__head-ref--header").show(); // Show the list header    
    $(".contact-info__head-ref-list .list-item--lookup").parent().show(); // Show this list item
    // .attr("placeholder", "");
});

// Select Add New Ref -> Open Form
$("#addNewHeadRef").click(function(e) {
    e.preventDefault();
    $("#addNewHeadRef").hide();
    closeLookupRef();
    openAddRefForm();
    $("#lookupHostTypeOtherOrganization").attr("placeholder", "");
});

// Edit Ref List -> Clears the list for demo purposes
$("#editRefList").click(function(e) {
    e.preventDefault();
    hideRefList();
    hideRefListItems();
    resetHeadRef();
});

$("#confirmNewHeadRefBtn").click(function(e) {
    e.preventDefault();
    closeHeadRefSection(); // Close the head ref inputs
    showRefList(); // Show the list container
    enableListControlEditing(); // Enable list editing
    $(".contact-list__head-ref--header").show(); // Show the list header    
    $(".contact-info__head-ref-list .list-item--new").parent().show(); // Show this list item
});

$("#cancelNewHeadRefBtn").click(function(e) {
    e.preventDefault();
    closeAddRefForm();
    $("#addNewHeadRef").show();
});


// Functions //////////////////////////////////////////////////////////////////////////////////////////////

function resetHeadRef() {
    $(".form-group.contact-info__head-ref--container").show();
}

function openHeadRefSection() {
    $(".contact-info__head-ref-lookup--container").show();
    $(".contact-info__head-ref-new--add-new").show();
}

function closeHeadRefSection() {
    $(".contact-info__head-ref-lookup--container").hide();
    $(".contact-info__head-ref-new--add-new").hide();
    closeAddRefForm();
    enableEventDirectorRadios();
    enableHostTypeSelect();
}

function disableHeadRefBtn() {
    $("#addHeadRef").prop('disabled', true);
}

function enableHeadRefBtn() {
    $("#addHeadRef").prop('disabled', false);
}

function openLookupRef() {
    $(".input-group.lookup-confirm").show();
    $(".input-group.lookup-confirm").css("height","70px");
    $(".input-group.lookup-confirm").css("opacity","1");
    $("#addExistingRefBtn").show();
}

function closeLookupRef() {
    hideLookupConfirmtBtn();
    $("#addExistingRefBtn").hide();
    $("#lookupRefName").attr("placeholder", "");
}

function openAddRefForm() {
    closeLookupRef();
    $(".contact-info__head-ref--add-new-container").show();
}

function closeAddRefForm() {
    $(".contact-info__head-ref--add-new-container").hide();
}

function showRefList() {
    $(".contact-info__head-ref-list").show();
    $(".contact-info__head-ref--container").hide();
}

function hideRefList() {
    $(".contact-info__head-ref-list").hide();
    // $(".contact-info__head-ref--container").show();
}

function hideRefListItems() {
    $(".contact-info__head-ref-list .list-item").parent().hide();
}