// Choose to Add Head Ref - Open Inputs
$("#addHeadRef").click(function(e) {
    e.preventDefault();
    disableEventDirectorRadios();
    disableHostTypeSelect();
    disableSafetyCoordinatorBtn();
    openHeadRefSection();
    disableListControlEditing();
    closeLookupRef();
    $("#addHeadRef").hide();
    $("#addExistingRefBtn").hide();
    $("#addNewHeadRef").show();
    $("#cancelAddHeadRef").show();
    $("#lookupRefName").attr("placeholder", "");
    $(".contact-info__head-ref-new--add-new").show();
});

$("#cancelAddHeadRef").click(function(e) {
    e.preventDefault();
    closeHeadRefSection();
    $("#addHeadRef").show();
    $("#cancelAddHeadRef").hide();
    hideLookupConfirmtBtn()
    enableSafetyCoordinatorBtn();
    enableListControlEditing();
});

// Lookup Head Ref in Search
$("#lookupRefName").click(function(e) {
    e.preventDefault();
    openLookupRef();
    closeAddRefForm();
    $(this).attr("placeholder", "Mark Usher, Sarasota, FL");
    $("#addNewHeadRef").show();
});

// Save Head Ref from Search
$("#addExistingRefBtn").click(function(e) {
    e.preventDefault();
    closeHeadRefSection();
    showRefList();
    enableListControlEditing();
    enableSafetyCoordinatorBtn();
    $("#lookupRefName").attr("placeholder", "");
    $("#addHeadRef").show();
    $("#cancelAddHeadRef").hide();
    $(".contact-list__head-ref--header").show();
    $(".contact-info__head-ref-list .list-item--lookup").parent().show();
});

// Select Add New Ref -> Open Form
$("#addNewHeadRef").click(function(e) {
    e.preventDefault();
    $("#addNewHeadRef").hide();
    closeLookupRef();
    openAddRefForm();
    $("#lookupRefName").attr("placeholder", "");
});

// Edit Ref List -> Clears the list for demo purposes
$(".section-group--head-ref .list-item__delete").click(function() {
    // resetHeadRefSection();
    // hideRefList();
    // hideRefListItems();
});

function listItemRemoved() {
    let allHidden = true;
    $('.contact-column').each(function() {
        if ($(this).css('display') !== 'none') {
            allHidden = false;
            return false; // Exit the loop early if one is not hidden
        }
    });
    return allHidden;
}

$(".section-group--head-ref #cancelContactList").click(function(allHidden) {
    
    if (allHidden) {
        console.log('All head ref list items are removed.');
    } else {
        console.log('Not all head ref list items are removed.');
        $(".list-item.removed").parent().hide();
        $(".list-item").removeClass('removed')
    }
});

$("#confirmNewHeadRefBtn").click(function(e) {
    e.preventDefault();
    closeHeadRefSection();
    showRefList();
    enableListControlEditing();
    enableSafetyCoordinatorBtn();
    $("#addHeadRef").hide();
    $("#cancelAddHeadRef").show();
    $(".contact-list__head-ref--header").show();
    $(".contact-info__head-ref-list .list-item--new").parent().show();
});

$("#cancelNewHeadRefBtn").click(function(e) {
    e.preventDefault();
    closeAddRefForm();
    $("#addHeadRef").show();
    // $("#cancelAddHeadRef").hide();
    // $("#addNewHeadRef").show();
});

// Confirm Add New Person Form for Head Referee
$(".contact-info__head-ref--add-new-container .confirm-form-add-new-person").click( function() {
    alert("Add new head ref");
    closeHeadRefSection();
    showRefList();
    enableListControlEditing();
    enableSafetyCoordinatorBtn();
    $("#addHeadRef").hide();
    $("#cancelAddHeadRef").show();
    $(".contact-list__head-ref--header").show();
    $(".contact-info__head-ref-list .list-item--new").parent().show();
});




// Functions //////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////


function resetHeadRefSection() {
    $(".form-group.contact-info__head-ref--container").show();
    hideRefList();
    hideRefListItems();
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

    $(".input-group.lookup-confirm").hide();
    $(".input-group.lookup-confirm").css("height","0");
    $(".input-group.lookup-confirm").css("opacity","0");
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
    console.log("Hide ref list");
    $("#addHeadRef").show();
    $("#cancelAddHeadRef").hide();
    // $(".list").removeClass("edit-list");
}

function hideRefListItems() {
    $(".contact-info__head-ref-list .list-item").parent().hide();
}