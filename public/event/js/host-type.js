
$(document).ready(function() {

    // Hide the bootstrap columns that contain the list elements. 
    // This will be handled with React, where the list items 
    // will be rendered conditionally.
    $(".list-item").parent().hide();

    $('#selectHostType').on('change', function() {
        disableHeadRefBtn();
        $(".contact-information__event-host--list .list-item").parent().hide();
        $(".contact-info-host-type__other-organization--container").hide();
        $("#contactTypeEventDirectorCurrent").prop('checked', false);
        $("#contactTypeEventDirectorOther").prop('checked', false);
        $("#contactTypeEventDirectorCurrent").prop('disabled', true);
        $("#contactTypeEventDirectorOther").prop('disabled', true);
        
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
        $(".contact-info__host-type-lmsc--container").hide();
        $("#selectHostType").prop('selectedIndex',0);
        $("#selectHostTypeLmsc").prop('selectedIndex',0);
        $("#contactTypeEventDirectorCurrent").prop('disabled', false);
        $("#contactTypeEventDirectorOther").prop('disabled', false);
        enableHeadRefBtn();
        $(".contact-list__event-host--header").show();
        // $(".list-item--lmsc").show();
        $(".contact-info__host-type--container").hide();
        $(".contact-information__event-host--list .list-item").parent().hide();
        $(".contact-information__event-host--list .list-item--lmsc").parent().show();
    });
    
    $("#editHostList").click(function(e) {
        e.preventDefault();
        $(".contact-info__host-type--container").show();
        $(".contact-list__event-host--header").hide();
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
        enableHeadRefBtn();
        $("#selectHostType").prop('selectedIndex',0);
        $("#selectHostTypeLmsc").prop('selectedIndex',0);
        $(".contact-list__event-host--header").show();
        
        $(".contact-information__event-host--list").show();

        $(".contact-information__event-host--list .list-item").parent().hide();
        $(".contact-information__event-host--list .list-item--club").parent().show();

        
    });
    
    $("#confirmCurrentHost").click(function(e) {
        e.preventDefault();
        $(this).hide();
        enableHeadRefBtn();
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
        enableHeadRefBtn();
        $(".input-group.lookup-confirm").css("height","0");
        $(".input-group.lookup-confirm").css("opacity","0");
        $(".contact-info-host-type__other-organization--container").show();
        $("#lookupHostTypeOtherOrganization").attr("placeholder", "");
        $("#addHostTypeOtherOrganizationLookup").hide();
    });

    $("#addHostTypeOtherBtn").click(function(e) {
        e.preventDefault();
        $(this).hide();
        enableHeadRefBtn();
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
        enableHeadRefBtn();
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

});

function disableHostTypeSelect() {
    $("#selectHostType").prop("disabled", true);
}

function enableHostTypeSelect() {
    $("#selectHostType").prop("disabled", false);
}