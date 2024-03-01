$(document.body).on('change','#strokeFocus',function(){
    var strokeFocus = $('#strokeFocus').val();
    if (strokeFocus === 'blank') {
        $(".video-stroke-analysis--total").text("$__.__");
        $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$__.__");
    } else if ($(".membership-length--lanemate-monthly.selected")[0]) {
        $(".video-stroke-analysis--total").text("$120.00");
        $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$120.00");
    } else if ($(".membership-length--lanemate-yearly.selected")[0]) {
        $(".video-stroke-analysis--total").text("$99.00");
        $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$99.00");
    }
});

$("#videoStrokeAnalysisNo").on( "click", function () {    
    if ($(".membership-length--option.selected")[0]) {
        $(".select-stroke-focus").hide();
        $("#videoStrokeAnalysisYesInput").prop( "checked", false );
        $("#videoStrokeAnalysisNoInput").prop( "checked", true );
        $(".video-stroke-analysis--total").text("$__.__");
        $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$__.__");
    } else return;
});

$("#videoStrokeAnalysisYes").on( "click", function () {    
    if ($(".membership-length--option.selected")[0]) {
        $(".select-stroke-focus").show();
        $("#videoStrokeAnalysisYesInput").prop( "checked", true );
        $("#videoStrokeAnalysisNoInput").prop( "checked", false );
    } else return;
});