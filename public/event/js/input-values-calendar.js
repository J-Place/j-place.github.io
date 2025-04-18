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
        '#selectTimingSystem'
    ];
    const inputValues = [
        '2024 Bumpy Jones Classic Long Course Meet', 
        'Join us at the site of the 2023 USMS Summer Nationals for this annual Long Course meet! The beautiful Selby Aquatic Center features a new shade structure and a perfect water temperature. In addition to the individual events, we offer ALL relays (200s, 400s, and the 800 Free relay).',
        '06/06/24',
        '06/08/24',
        '06/10/24',
        'automatic'
    ];
    setInputValues(inputs, inputValues);


    ///////////////////////////////////////////////////// Dropdowns
    const selects = [
        '#selectEventCourse' 
    ];
    const selectValues = [
        'LCM'
    ];
    setSelectValues(selects, selectValues);

    ///////////////////////////////////////////////////// Click Elements
    $("#contactTypeEventDirectorCurrent").click();
    $("#confirmCurrentEventDirector").click();
    $("#eventDirectorPrivacyName").prop('checked', true);
    $("#location-information__content .list-control").hide();
    $(".location-info__add-new-location--container").hide();
    // $(".list--lookup.locations").parent().parent().hide();
    $(".list--lookup.locations").hide();
    $("#location-information .row.locations").show();

    $(".list-item-pool.list-item-existing").show();
    $(".location-name > .list__controls").show();
    // $(".club-edit .list-item__delete").show();

    $(".venue__list--item").hide();
    $(".venue__list--item:first-of-type").show();
    $(".venue__list--item:first-of-type .configuration-title").hide();
    $(".venue__list--item:first-of-type .configuration-title:last-of-type").show(); 

    $(".venue__list--item.selected").show();
    $(".list-item-existing .venue__list").show();

});