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

    // $(".section-event-info h3").click();
    $('input[name="EventType"][value="open-water"]').prop('checked', true);
    $('input[name="EventType"]').prop('disabled', true);

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
        '#entryInfoAttendanceExpected',
        '#estimatedTempMin',
        '#estimatedTempMax'
    ];
    const inputValues = [
        '2025 USMS Open Water National Championships', 
        'The 2025 USMS Sprint-Distance and Long-Distance Open Water National Championships will be April 4 and April 5, respectively, at Nathan Benderson Park in Sarasota, Florida. These events will run alongside USA Swimming’s Open Water National and Junior Championships.',
        '04/02/25',
        '04/04/24',
        '04/05/24',
        'https://www.usms.org/events/events/2025-usms-open-water-national-championships',
        'https://www.usms.org/events/events/2025-usms-open-water-national-championships',
        '217',
        '250',
        '72',
        '77'
    ];
    setInputValues(inputs, inputValues);


    ///////////////////////////////////////////////////// Checkboxes
    // $("#lessThan1").prop("checked", true);
    $("#1-3Miles").prop("checked", true);
    $("#3-6Miles").prop("checked", true);

    ///////////////////////////////////////////////////// Show Contacts
    $("#addExistingRefBtn").click();
    // $("addExistingSafetyCoordinatorBtn").click();
    $(".contact-info__safety-coordinator--add-new-container .confirm-form-add-new-person").click();

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
    // $(".list--lookup.locations").parent().parent().hide();
    $(".list--lookup.locations").hide();
    // $(".list-item__delete").show();
    $("#location-information .row.locations").show();
    


    $(".list-item-open-water.list-item-existing").show();
    $(".location-name > .list__controls").show();
    $(".list__controls--settings").css('display', 'inline-flex');
    $(".club-edit .list-item__edit").show();
    $(".club-edit .list-item__delete").hide();




    

    $(".venue__list").show();
    $(".venue__list--item").show();
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

    $(".list--event-host .list-item__delete").show();    

});

$(".upload-summary").show();