
$(document).ready(function() {

// Select I'm the Event Director
    $("#contactTypeEventDirectorCurrent").click(function(e) {
        // e.preventDefault();
        $("#selectHostType").prop("disabled", true);
        $("#saveContactInfoSection").prop("disabled", true);
        $(".contact-information__event-director--list").show();
        $(".contact-information__event-director--list .list-item--current").parent().show();
        // Hide the other inputs in case they're open
        $(".input-group.lookup-confirm").hide();
        $(".input-group.lookup-confirm").css("height","0");
        $(".input-group.lookup-confirm").css("opacity","0");
        $(".contact-list__event-director--message").hide();
        $(".contact-info__event-director-other--container").hide();
        $(".contact-info__event-director-other--add-new").hide();    
        $(".contact-info__event-director--add-new-container.add-new-inputs").hide();
        $("#confirmCurrentEventDirector").show();
        $("#lookupEventDirectorName").attr("placeholder", "");
        $("#lookupHostTypeOtherOrganization").attr("placeholder", "");
        $("#addNewEventDirector").show();
    });

// Confirm I'm the Event Director
    $("#confirmCurrentEventDirector").click(function(e) {
        e.preventDefault();
        $(".contact-info__event-director-type-form").hide();
        $(this).hide();
        $(".list__header.contact-list__event-director--header").show();
        $("#contactTypeEventDirectorCurrent").prop('checked', false);
        $("#contactTypeEventDirectorOther").prop('checked', false);
        $("#selectHostType").prop("disabled", false);
    });
    
// Edit Event Director List
    $(".contact-list__event-director--header #editContactList").click(function(e) {
        // e.preventDefault();
        $(".contact-info__event-director-type-form").show();
        $(".list__header.contact-list__event-director--header").hide();
        $(".contact-information__event-director--list").hide();
        $(".contact-information__event-director--list .list-item").parent().hide();
        $("#confirmCurrentEventDirector").show();
        $(".contact-list__event-director-add-new--awaiting-message").hide();
    });




// Someone Else is the Event Director
    $("#contactTypeEventDirectorOther").click(function(e) {
        // e.preventDefault();
        $("#selectHostType").prop("disabled", true);
        $(".contact-info__event-director-other--container").show();
        $(".contact-info__event-director-other--add-new").show();
        $(".contact-information__event-director--list").hide();
        $("#confirmCurrentEventDirector").hide();
        $("#lookupEventDirectorName").attr("placeholder", "");
        $("#lookupHostTypeOtherOrganization").attr("placeholder", "");
        $(".contact-list__event-director--message").show();
    });

    // Search Event Directors
        $("#lookupEventDirectorName").click(function(e) {
            e.preventDefault();
            $(".input-group.lookup-confirm").show();
            $(".input-group.lookup-confirm").css("height","70px");
            $(".input-group.lookup-confirm").css("opacity","1");
            $(".contact-info__event-director--add-new-container.add-new-inputs").hide();
            $("#addAsEventDirector").show();
            $("#addNewEventDirector").show();
            // $("#lookupEventDirectorName").show();
            $(this).attr("placeholder", "Kyle Deery");
            // $(".contact-list__event-director-add-new--awaiting-message").hide();
            // $(".contact-list__event-director--message").hide();
        });

        // Confirm Event Director
        $("#addAsEventDirector").click(function(e) {
            e.preventDefault();
            $(".input-group.lookup-confirm").hide();
            $(".input-group.lookup-confirm").css("height","0");
            $(".input-group.lookup-confirm").css("opacity","0");
            $("#selectHostType").prop("disabled", false);
            $(".contact-info__event-director-type-form").hide();
            $(".contact-info__event-director-other--container").hide();
            $(".contact-info__event-director-other--add-new").hide();
            $(".contact-list__event-director--message").hide();
            $("#contactTypeEventDirectorCurrent").prop('disabled', false);
            $("#contactTypeEventDirectorOther").prop('disabled', false);
            $(".contact-info__event-director--add-new-container.add-new-inputs").hide();
            $("#confirmCurrentEventDirector").hide();
            // Show Saved Event Director
            $(".list__header.contact-list__event-director--header").show();
            $(".contact-information__event-director--list").show();
            $(".contact-information__event-director--list .list-item").parent().hide();
            $(".contact-information__event-director--list .list-item--lookup").parent().show();
            // $(".contact-information__event-director--list .list-item--lookup").show();
            $("#contactTypeEventDirectorCurrent").prop('checked', false);
            $("#contactTypeEventDirectorOther").prop('checked', false);
            $("#lookupEventDirectorName").attr("placeholder", "");
            $("#lookupHostTypeOtherOrganization").attr("placeholder", "");
            // $(".contact-list__event-director-add-new--awaiting-message").hide();
        });

    // Add New Event Director
        $("#addNewEventDirector").click(function(e) {
            e.preventDefault();
            $(this).hide();
            $("#addAsEventDirector").hide();
            $(".contact-info__event-director--add-new-container.add-new-inputs").show();
            $(".input-group.lookup-confirm").hide();
            $(".input-group.lookup-confirm").css("height","0");
            $(".input-group.lookup-confirm").css("opacity","0");
            $("#lookupEventDirectorName").attr("placeholder", "");
            $("#lookupHostTypeOtherOrganization").attr("placeholder", "");
            // $(".contact-list__event-director--message").hide();
        });

        // Confirm Event Director
        $("#addNewEventDirectorBtn").click(function(e) {
            e.preventDefault();
            $(".input-group.lookup-confirm").hide();
            $(".input-group.lookup-confirm").css("height","0");
            $(".input-group.lookup-confirm").css("opacity","0");
            $("#contactTypeEventDirectorCurrent").prop('disabled', false);
            $("#contactTypeEventDirectorOther").prop('disabled', false);
            $("#contactTypeEventDirectorCurrent").prop('checked', false);
            $("#contactTypeEventDirectorOther").prop('checked', false);
            $("#selectHostType").prop("disabled", false);
            $(".section__header--summary.contact-list__event-director--message").hide();
            $(".contact-info__event-director-type-form").hide();
            $(".contact-info__event-director-other--container").hide();
            $(".contact-info__event-director-other--add-new").hide();
            $(".contact-list__event-director--message").hide();
            $(".contact-info__event-director--add-new-container.add-new-inputs").hide();
            $("#confirmCurrentEventDirector").hide();
            $(".list__header.contact-list__event-director--header").show();
            $(".contact-information__event-director--list").show();
            $(".contact-information__event-director--list .list-item").parent().hide();
            $(".contact-information__event-director--list .list-item--new").parent().show();
            // $(".contact-info-event-director__current-message").show();
            // $(".contact-info-event-director__new-message").show();
            $("#addNewEventDirector").show();
            $("#contact__recentlyadded").show();
            $(".contact-list__event-director-add-new--awaiting-message").show();
        });

        $("#cancelAddNewEventDirectorBtn").click(function(e) {
            e.preventDefault();
            // $(".contact-info-host-type__other-organization--container.add-new-inputs").hide();
            // $(".contact-info__event-director--add-new-container.add-new-inputs").hide();
            $(".contact-info__event-director-type-form").show();
            $(".contact-info__event-director-other--container").show();
            // $('.contact-info__event-director-other--container').hide();
            $(".contact-info__event-director-other--add-new").hide();
            $(".contact-info__event-director--add-new-container").hide();
            $("#addNewEventDirector").show();
            $(".contact-list__event-director--message").show();
        });




    // Hide the bootstrap columns that contain the list elements. 
    // This will be handled with React, where the list items 
    // will be rendered conditionally.
    $(".list-item").parent().hide();

    $('#selectHostType').on('change', function() {
        $(".contact-information__event-host--list .list-item").parent().hide();
        $(".contact-info-host-type__other-organization--container").hide();
        $("#contactTypeEventDirectorCurrent").prop('checked', false);
        $("#contactTypeEventDirectorOther").prop('checked', false);

        $("#contactTypeEventDirectorCurrent").prop('disabled', true);
        $("#contactTypeEventDirectorOther").prop('disabled', true);

        // $("#addNewOrganization").show();
        
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
            $(".contact-info__host-type-club--container").show();
            $(".lookup-host-type-usms-club").show();
        }
        if ($(this).val() === 'Other Organization') {
            $(".contact-info__host-type-lmsc--container").hide();
            $(".contact-info__host-type-club--container").hide();
            $(".contact-info-host-type__other--container").show();
            $(".contact-info-safety-coordinator__add-new").show();
            $(".contact-info-organization__add-new").show();
            $("#addNewOrganization").show();
            $(".contact-information__event-host--list .list-item").parent().hide();
            $(".contact-information__event-host--list .list-item--organization").parent().show();
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
        }
    });

    $("#selectHostTypeLmsc").on('change', function() {
        if ($(this).val() === 'Florida LMSC' || $(this).val() === 'Georgia LMSC') {
            $(".input-group.lookup-confirm").hide();
            $(".input-group.lookup-confirm").css("height","0");
            $(".input-group.lookup-confirm").css("opacity","0");
        }
        $("#confirmLmscSelect").show();
    });



    $("#confirmLmscSelect").click(function(e) {
        e.preventDefault();
        $(this).hide();
        $(".contact-info__host-type--container").hide();
        $(".contact-info__host-type-lmsc--container").hide();
        $(".contact-list__event-host--header").show();
        $(".list-item--lmsc").show();
        $("#selectHostType").prop('selectedIndex',0);
        $("#selectHostTypeLmsc").prop('selectedIndex',0);
        $("#contactTypeEventDirectorCurrent").prop('disabled', false);
        $("#contactTypeEventDirectorOther").prop('disabled', false);
        $(".contact-information__event-host--list .list-item").parent().hide();
        $(".contact-information__event-host--list .list-item--lmsc").parent().show();
    });
    
    $("#editEventHostList").click(function(e) {
        e.preventDefault();
        $(".contact-info__host-type--container").show();
        $(".contact-list__event-host--header").hide();
        // $(".contact-information__event-host--list .list-item--current").parent().hide();
        $(".contact-information__event-host--list .list-item").parent().hide();
        $(".input-group.lookup-confirm").css("height","0");
        $(".input-group.lookup-confirm").css("opacity","0");
        $("#selectHostType").prop('selectedIndex',0);
        $("#selectHostTypeLmsc").prop('selectedIndex',0);
        $("#lookupHostTypeOtherOrganization").attr("placeholder", "");
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
        $(this).attr("placeholder", "Rainbow River Swim Club");
        // $("#lookupHostTypeOtherOrganization").attr("placeholder", "");
    });
    
    $("#lookupHostTypeUsmsClub").click(function(e) {
        e.preventDefault();
        $("#confirmClubLookup").show();
    });
    
    $("#confirmClubLookup").click(function(e) {
        e.preventDefault();
        $(this).hide();
        $(".contact-info__host-type--container").hide();
        $("#lookupHostTypeUsmsClub").hide();
        $("label[for='lookupHostTypeUsmsClub']").hide();
        $(".input-group.lookup-confirm").css("height","0");
        $(".input-group.lookup-confirm").css("opacity","0");
        $("#contactTypeEventDirectorCurrent").prop('disabled', false);
        $("#contactTypeEventDirectorOther").prop('disabled', false);
        $("#selectHostType").prop('selectedIndex',0);
        $("#selectHostTypeLmsc").prop('selectedIndex',0);
        // $(".list-item").parent().hide();
        // $(".list-item").hide();
        $(".contact-list__event-host--header").show();
        $(".contact-information__event-host--list .list-item").parent().hide();
        $(".contact-information__event-host--list .list-item--club").parent().show();
        // $(".contact-information__event-host--list .list-item--club").show();
    });
    
    $("#confirmCurrentHost").click(function(e) {
        e.preventDefault();
        $(this).hide();
        $("#selectHostType").prop('selectedIndex',0);
        $("#selectHostTypeLmsc").prop('selectedIndex',0);
        $("#contactTypeEventDirectorCurrent").prop('disabled', false);
        $("#contactTypeEventDirectorOther").prop('disabled', false);
        $(".contact-info__host-type--container").hide();
        $(".contact-list__event-host--header").show();
    });
    
     
    $("#addNewOrganization").click(function(e) {
        e.preventDefault();
        $(this).hide();
        $(".input-group.lookup-confirm").css("height","0");
        $(".input-group.lookup-confirm").css("opacity","0");
        $(".contact-info-host-type__other-organization--container").show();
        $("#lookupHostTypeOtherOrganization").attr("placeholder", "");
        $("#addHostTypeOtherOrganizationLookup").hide();
    });

    $("#addHostTypeOtherBtn").click(function(e) {
        e.preventDefault();
        $(this).hide();
        $(".input-group.lookup-confirm").css("height","0");
        $(".input-group.lookup-confirm").css("opacity","0");
        $("#contactTypeEventDirectorCurrent").prop('disabled', false);
        $("#contactTypeEventDirectorOther").prop('disabled', false);
        $("#selectHostType").prop('selectedIndex',0);
        $("#selectHostTypeLmsc").prop('selectedIndex',0);
        $("#lookupHostTypeOtherOrganization").attr("placeholder", "");
        $(".contact-info-host-type__other-organization--container.add-new-inputs").hide();
        $(".contact-info__host-type--container").hide();
        $(".contact-info-host-type__other--container").hide();
        $(".contact-info-organization__add-new").hide();
        $("#addHostTypeOtherOrganizationLookup").hide();
        $(".contact-list__event-host--header").show();
        $(".contact-information__event-host--list .list-item").parent().hide();
        $(".contact-information__event-host--list .list-item--organization-new").parent().show();
    });

    $("#addHostTypeOtherOrganizationLookup").click(function(e) {
        e.preventDefault();
        $(this).hide();
        $(".input-group.lookup-confirm").css("height","0");
        $(".input-group.lookup-confirm").css("opacity","0");
        $("#selectHostType").prop('selectedIndex',0);
        $("#selectHostTypeLmsc").prop('selectedIndex',0);
        $("#contactTypeEventDirectorCurrent").prop('disabled', false);
        $("#contactTypeEventDirectorOther").prop('disabled', false);
        $("#lookupHostTypeOtherOrganization").attr("placeholder", "");
        $(".contact-info-organization__add-new").hide();
        $(".contact-info-host-type__other--container").hide();
        $(".contact-info__host-type--container").hide();        
        $(".contact-list__event-host--header").show();
        $(".list-item--organization-lookup").parent().show();        
    });
    
    $("#cancelAddHostTypeOtherBtn").click(function(e) {
        e.preventDefault();
        $(".contact-info-host-type__other-organization--container.add-new-inputs").hide();
        $("#addNewOrganization").show();
    });


let resetHost = function() {
    alert("test");
}


});












// function disableAllInputsExceptCurrentGroup() {

//     // Get all input elements on the page
//     const inputs = document.querySelectorAll("input");
  
//     // Loop through each input
//     inputs.forEach((input) => {
//       // Check if the input is inside the current form group
//     //   if (!input.closest(".current-group")) {
//     if (thisEl) {
//         input.disabled = true; // Disable inputs outside the current form group
//       } else {
//         input.disabled = false; // Ensure inputs in the current form group remain enabled
//       }
//     });
//   }
  
// Run the function
// document.addEventListener("click", disableAllInputsExceptCurrentGroup);
    // disableAllInputsExceptCurrentGroup();
//   });




// function disableAllInputsExceptCurrentGroup() {
//     $("input").each(function() {
//       // Check if the input is inside the current form group
//       if (!$(this).closest(".current-group").length) {
//         $(this).prop("disabled", true); // Disable inputs outside the current form group
//       } else {
//         $(this).prop("disabled", false); // Enable inputs in the current form group
//       }
//     });
//   }
  
  // Add click event listener to the button
//   $("#disable-button").on("click", disableAllInputsExceptCurrentGroup);
// document.addEventListener("click", disableAllInputsExceptCurrentGroup);





// function disableAllInputsExceptTarget(targetSelector) {
//     // Select all input elements on the page
//     $("input").each(function() {
//       // Disable inputs that do not match the target selector
//       if (!$(this).is(targetSelector)) {
//         $(this).prop("disabled", true);
//       } else {
//         $(this).prop("disabled", false); // Ensure the target input remains enabled
//       }
//     });
//   }
  
//   // Add click event listener to the button
//   document.addEventListener("click", function() {
//     disableAllInputsExceptTarget($this); // Pass the target input selector
//   });



