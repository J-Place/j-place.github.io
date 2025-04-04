// $(".section-event-info h3").click();
$('input[name="EventType"][value="open-water"]').prop('checked', true);
$('input[name="EventType"]').prop('disabled', true);
$("#isVirtualNo").prop('checked', true);
$("#isClinicNo").prop('checked', true);
$("#agreeTerms").prop('checked', true);

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

    ///////////////////////////////////////////////////// Checkboxes
    // $("#lessThan1").prop("checked", true);
    $("#1-3Miles").prop("checked", true);
    $("#3-6Miles").prop("checked", true);

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
        "Lucky's Lake Swim", 
        "Founded in 1989, Lucky's Lake Swim is a daily 1 kilometer open water swim hosted started by Lucky Meisenheimer at his home in Orlando, Florida.",
        '07/04/25',
        '07/11/25',
        '08/03/25',
        'https://www.worldaquatics.com/competitions/4725/world-aquatics-championships-singapore-2025',
        'https://www.worldaquatics.com/competitions/4725/world-aquatics-championships-singapore-2025/signup',
        '150',
        '150'
    ];
    setInputValues(inputs, inputValues);

    ///////////////////////////////////////////////////// Dropdowns
    const selects = [
        '#selectEventCourse',
        '#selectEventClass'
    ];
    const selectValues = [
        'SCM',
        'sanctioned',
    ];
    setSelectValues(selects, selectValues);

    ///////////////////////////////////////////////////// Click/Select Elements
    $("#contactTypeEventDirectorCurrent").click();
    $("#confirmCurrentEventDirector").click();
    $("#eventDirectorPrivacyName").prop('checked', true);
    $("#timingAutomatic").prop('checked', true);
    $("#eventListOnCalendarYes").prop('checked', true);
    $("#eventClassificationSanctioned").prop('checked', true);
    $("#agree").prop('checked', true);

    $("#location-information__content .list-control").hide();
    $(".location-info__add-new-location--container").hide();
    $(".list--lookup.locations").hide();
    $(".contact-info__host-type--container").hide();
    $(".venue__list--item").hide();
    $(".venue__list--item:first-of-type .configuration-title").hide();

    $("#location-information .row.locations").show();
    $(".list-item-existing").show();    
    $(".contact-information__event-host--list").show();
    $(".contact-list__event-host--header").show();
    
    $(".list--event-host .list-item__delete").show();
    
    $(".list-item--organization-new").parent().show();
    $(".list-item--organization-new").show();
    $(".venue__list--item:first-of-type").show();
    $(".venue__list--item:first-of-type .configuration-title:last-of-type").show();


});

$(".upload-summary").show();