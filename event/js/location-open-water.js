
$(document).ready(function() {

    // function showOpenWaterLocations() {
    //     console.log("run Open Water Locaitons function")
    //     $(".list-item-open-water").show();
    //     scrollTopSection();
    //     hideListControlChildren();
    //     $(".list.locations").removeClass("edit-list");
    //     $(".location-name .list-item__edit").show();
    //     $(".location-name .list-item__save").hide();
    //     $(".location-name .list-item__delete").hide();
    // }
    // showOpenWaterLocations();

    // $(".list-venue-form .input-group.input-group--bulkhead").addClass("test");

    $('#locationType').val('Open Water').prop('disabled', true);
    $('#locationType').val('Open Water');

    $(".input-group--poolType").addClass("fade");
    $(".input-group--openWaterType").removeClass("fade");
    $(".input-group.input-group--bulkhead").hide();


});