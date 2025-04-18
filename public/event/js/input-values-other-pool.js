// $(".section-event-info h3").click();
$('input[name="EventType"][value="pool"]').prop('checked', true);
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
        'World Aquatics Championships - Singapore 2025', 
        'The 22nd edition of the World Aquatics Championships will take place from 11 July – 3 August 2025 in Singapore. Over 2,500 athletes are expected to participate at these World Aquatics Championships, representing World Aquatics’ 210 national member federations across the six aquatic sports: Swimming, Water Polo, Diving, Artistic Swimming, Open Water Swimming and High Diving',
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

    $("#location-information__content .list-control").hide();
    $(".location-info__add-new-location--container").hide();
    $(".contact-info__event-director-type-form").hide();  // Hide the Event Director inputs
    // $(".list--lookup.locations").parent().parent().hide();
    $(".list--lookup.locations").hide();
    $("#location-information .row.locations").show();
    $("#eventListOnCalendarYes").prop('checked', true);
    $("#agree").prop('checked', true);
    $(".contact-info__host-type--container").hide();
    $(".contact-information__event-host--list").show();

    // $(".list--event-host .list-item__delete").show();
    // $(".club-edit .list-item__delete").show();
    $(".contact-list__event-host--header").show();

    // Show only the selected pool configuration
    $(".venue__list--item").hide();
    $(".venue__list--item:first-of-type").show();
    $(".venue__list--item:first-of-type .configuration-title").hide();
    $(".venue__list--item:first-of-type .configuration-title:last-of-type").show();

    $(".list-item-pool.list-item-existing").show();
    $(".location-name > .list__controls").show();
    // $(".club-edit .btn.list-item__delete").show();



    $(".list-item-existing .venue__list").show();
    $(".venue__list--item.selected").show();
    $(".venue__list--item.selected .configuration__list").show();
    $(".configuration__list--item").hide();
    $(".configuration__list--item.selected").show();
    $(".configuration__list--item.selected .configuration-title").show();   
    $('.location-name .list__controls').show();

});

$(".upload-summary").show();