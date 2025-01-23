
$(document).ready(function() {

// Select I'm the Event Director
    $("#contactTypeEventDirectorCurrent").click(function(e) {
        // e.preventDefault();
        $("#selectHostType").prop("disabled", true);
        $("#saveContactInfoSection").prop("disabled", true);
        disableHeadRef();
        $(".contact-information__event-director--list").show();
        $(".contact-information__event-director--list .list-item--current").parent().show();
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
        enableHeadRef();
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
        disableHeadRef();
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
        $(this).attr("placeholder", "Kyle Deery");
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
        $(".list__header.contact-list__event-director--header").show();
        $(".contact-information__event-director--list").show();
        $(".contact-information__event-director--list .list-item").parent().hide();
        $(".contact-information__event-director--list .list-item--lookup").parent().show();
        $("#contactTypeEventDirectorCurrent").prop('checked', false);
        $("#contactTypeEventDirectorOther").prop('checked', false);
        enableHeadRef();
        $("#lookupEventDirectorName").attr("placeholder", "");
        $("#lookupHostTypeOtherOrganization").attr("placeholder", "");
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
        enableHeadRef();
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
        $("#addNewEventDirector").show();
        $("#contact__recentlyadded").show();
        $(".contact-list__event-director-add-new--awaiting-message").show();
    });

    $("#cancelAddNewEventDirectorBtn").click(function(e) {
        e.preventDefault();
        $(".contact-info__event-director-type-form").show();
        $(".contact-info__event-director-other--container").show();
        $(".contact-info__event-director-other--add-new").hide();
        $(".contact-info__event-director--add-new-container").hide();
        $("#addNewEventDirector").show();
        $(".contact-list__event-director--message").show();
    });
    
});

