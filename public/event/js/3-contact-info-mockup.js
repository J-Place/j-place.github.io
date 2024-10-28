// Edit with Existing Contact
$("#editContactList").click(function(e) {
    e.preventDefault();
    $(".contact-info__event-director-type-form").show();
    // $(".contact-info__event-director-other--container").show();
    // $(".contact-info__event-director-other--add-new").show();
    $(".contact-information__event-director--list").hide();
    $(".list__header.contact-list__event-director--header").hide();
    $("#confirmCurrentEventDirector").show();
});



// I'm the Event Director
    $("#contactTypeEventDirectorCurrent").click(function(e) {
        e.preventDefault();
        $(this). prop("checked", true);
        // $("#contactTypeEventDirectorCurrent").prop("checked",true);
        $(".contact-information__event-director--list").show();
        $(".contact-information__event-director--list .list-item").hide();
        $(".contact-information__event-director--list .list-item--current").show();

        // Hide the other inputs in case they're open
        $(".input-group.lookup-confirm").hide();
        $(".input-group.lookup-confirm").css("height","0");
        $(".input-group.lookup-confirm").css("opacity","0");

        // $(".contact-info__event-director-type-form").hide();
        $(".contact-info__event-director-other--container").hide();
        $(".contact-info__event-director-other--add-new").hide();    
        $(".contact-info__event-director--add-new-container.add-new-inputs").hide();
        $("#confirmCurrentEventDirector").show();

    });
    // Confirm I'm the Event Director
        $("#confirmCurrentEventDirector").click(function(e) {
            e.preventDefault();
            $(".contact-info__event-director-type-form").hide();
            $(this).hide();
            $(".list__header.contact-list__event-director--header").show();
            // $("#contactTypeEventDirectorCurrent").prop("checked",true);
        });




// Someone Else is the Event Director
    $("#contactTypeEventDirectorOther").click(function(e) {
        e.preventDefault();
        $(".contact-info__event-director-other--container").show();
        $(".contact-info__event-director-other--add-new").show();
        $(".contact-information__event-director--list").hide();
        $("#confirmCurrentEventDirector").hide();
    });

    // Search Event Directors
        $("#lookupEventDirectorName").click(function(e) {
            e.preventDefault();
            $(".input-group.lookup-confirm").show();
            $(".input-group.lookup-confirm").css("height","70px");
            $(".input-group.lookup-confirm").css("opacity","1");
        });

        // Confirm Event Director
        $("#addAsEventDirector").click(function(e) {
            e.preventDefault();
            $(".input-group.lookup-confirm").hide();
            $(".input-group.lookup-confirm").css("height","0");
            $(".input-group.lookup-confirm").css("opacity","0");

            $(".contact-info__event-director-type-form").hide();
            $(".contact-info__event-director-other--container").hide();
            $(".contact-info__event-director-other--add-new").hide();    
            $(".contact-info__event-director--add-new-container.add-new-inputs").hide();
            $("#confirmCurrentEventDirector").hide();
            // Show Saved Event Director
            $(".list__header.contact-list__event-director--header").show();
            $(".contact-information__event-director--list").show();
            $(".contact-information__event-director--list .list-item").hide();
            $(".contact-information__event-director--list .list-item--lookup").show();
        });

    // Add New Event Director
        $("#addNewEventDirector").click(function(e) {
            e.preventDefault();
            $(".contact-info__event-director--add-new-container.add-new-inputs").show();
        });

        // Confirm Event Director
        $("#addEventDirectorBtn").click(function(e) {
            e.preventDefault();
            $(".contact-info__event-director-type-form").hide();
            $(".contact-info__event-director-other--container").hide();
            $(".contact-info__event-director-other--add-new").hide();    
            $(".contact-info__event-director--add-new-container.add-new-inputs").hide();
            $("#confirmCurrentEventDirector").hide();
            // Show Saved Event Director
            $(".list__header.contact-list__event-director--header").show();
            $(".contact-information__event-director--list").show();
            $(".contact-information__event-director--list .list-item").hide();
            $(".contact-information__event-director--list .list-item--new").show();
        });



    // Select Host Type

$(document).ready(function() {
    $('#selectHostType').on('change', function() {
        if ($(this).val() === 'LMSC') {
            // $(this).prop('disabled', false);
            // $(this).css("color", "#000");
            $(".contact-info__host-type-lmsc--container").show();
        }
    });
    $("#selectHostTypeLmsc").on('change', function() {
        if ($(this).val() === 'Florida LMSC') {
            $(".contact-info__host-type-club--container").show();
        }
    });
});

// $("#selectHostType").onChange(function(e) {
        //     e.preventDefault();
        //     alert("Yes");
        //     $(".contact-info__host-type-lmsc--container").show();
        // });
        // $("#selectHostType").onChange(function(e) {
        //     e.preventDefault();
        //     $(".contact-info__host-type-club--container").show();
        // });