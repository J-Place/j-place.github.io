// $(".section-event-info h3").click();
$('input[name="EventType"][value="pool"]').prop('checked', true);
$('input[name="EventType"]').prop('disabled', true);

function setInputValues(elements, values) {
    if (elements.length !== values.length) {
      console.error('The number of elements does not match the number of values.');
      return;
    }  
    elements.forEach(function(element, index) {
        $(element).val(values[index]);
    });
}
 
function setSelectValues(selects, values) {
    if (selects.length !== values.length) {
      console.error('The number of selects does not match the number of values.');
      return;
    }  
    selects.forEach(function(select, index) {
      $(select).val(values[index]);
    });
}

$(document).ready(function() {

    ///////////////////////////////////////////////////// Text Inputs
    const inputs = [
        '#eventInfoName', 
        '#eventInfoDetails',
        '#dateEntriesClose',
        '#dateStart',
        '#dateEnd',
        '#entryInfoWebsiteUrl',
        '#entryInfoOnlineEntriesUrl',
        '#entryInfoAttendancePrevious',
        '#entryInfoAttendanceExpected'
    ];
    const inputValues = [
        '2024 Bumpy Jones Classic Long Course Meet', 
        'Join us at the site of the 2023 USMS Summer Nationals for this annual Long Course meet! The beautiful Selby Aquatic Center features a new shade structure and a perfect water temperature. In addition to the individual events, we offer ALL relays (200s, 400s, and the 800 Free relay).',
        '06/06/24',
        '06/08/24',
        '06/10/24',
        'www.sarasotasharks.com',
        'www.sarasotasharks.com/signup',
        '217',
        '250'
    ];
    setInputValues(inputs, inputValues);

    ///////////////////////////////////////////////////// Dropdowns
    const selects = [
        '#selectEventCourse',
        '#selectEventClass',
        '#selectEventLmsc'
    ];
    const selectValues = [
        'LCM',
        'sanctioned',
        'FL'
    ];
    setSelectValues(selects, selectValues);

    ///////////////////////////////////////////////////// Click/Select Elements
    $("#contactTypeEventDirectorCurrent").click();
    $("#confirmCurrentEventDirector").click();
    $("#eventDirectorPrivacyName").prop('checked', true);
    $("#location-information__content .list-control").hide();
    $(".location-info__add-new-location--container").hide();
    $(".list--lookup.locations").hide();
    $("#location-information .row.locations").show();
    $(".list-item-existing").show();
    $("#timingAutomatic").prop('checked', true);
    $("#eventListOnCalendarYes").prop('checked', true);
    $("#eventClassificationSanctioned").prop('checked', true);
    $("#agree").prop('checked', true);
    $(".contact-info__host-type--container").hide();
    $(".contact-information__event-host--list").show();
    $(".contact-list__event-host--header").show();
    $(".list-item--organization-new").parent().show();
    $(".list-item--organization-new").show();

    // Show only the selected pool configuration
    $(".venue__list--item").hide();
    $(".venue__list--item:first-of-type").show();
    $(".venue__list--item:first-of-type .configuration-title").hide();
    $(".venue__list--item:first-of-type .configuration-title:last-of-type").show();

    // $(".section-event-info").addClass('isEdit');
    // $(".section-contact-info").addClass('isEdit');
    // $(".section-entry-information").addClass('isEdit');
    // $(".section-meet-announcement").addClass('isEdit');

    // $("#submitSanction").prop('disabled', true);

    $("#agreeTerms").prop('checked', true);

});

$(".upload-summary").show();