
$("#videoStrokeAnalysisYes").on( "click", function() {
    $(".select-stroke-focus").show();
 });

const planSelected = document.querySelector(".membership-length--option.selected");

if (planSelected) {
    $("#videoStrokeAnalysisYesInput").prop( "disabled", false );
    $("#videoStrokeAnalysisNoInput").prop( "disabled", false );
}

$("#videoStrokeAnalysisNo").on( "click", function() {
    $(".select-stroke-focus").hide();
    $(".video-stroke-analysis--total").text("$__.__");
});

$(document.body).on('change','#strokeFocus',function(){
    var strokeFocus = $('#strokeFocus').val();
    console.log(strokeFocus);
    if (strokeFocus === 'blank') {
        $(".video-stroke-analysis--total").text("$__.__");
    } else {
        $(".video-stroke-analysis--total").text("$9.99");
    }
});

$("#videoStrokeAnalysisNo").on( "click", function () {
    $("#videoStrokeAnalysisYesInput").prop( "checked", false );
    $("#videoStrokeAnalysisNoInput").prop( "checked", true );
});

$("#videoStrokeAnalysisYes").on( "click", function () {
    $("#videoStrokeAnalysisYesInput").prop( "checked", true );
    $("#videoStrokeAnalysisNoInput").prop( "checked", false );
});

$(".membership-length--option").on( "click", function() {
    $(".membership-length--option").removeClass("selected");
    $(this).addClass("selected");
});

$(".membership-length--lanemate-monthly").on( "click", function() {
    $(".video-stroke-analysis--total").text("$9.99");
});

$(".membership-length--lanemate-yearly").on( "click", function() {
    $(".video-stroke-analysis--total").text("$83.88");
});