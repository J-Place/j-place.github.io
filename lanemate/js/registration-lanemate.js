$(".membership-length--option").on( "click", function() {
    $(".membership-length--option").removeClass("selected");
    $(this).addClass("selected");
    $(".video-stroke-analysis input").attr( "disabled", false);
});

$(".membership-length--lanemate-monthly").on( "click", function() {
    $(".membership-length--total").text("$9.99");
    $(".payment-info__line-item--lanemate .payment-info__line-item--price").text("$9.99");
    $(".price-string__video-stroke-analysis").text(" for $120.00");
    var strokeFocus = $('#strokeFocus').val();
    if (strokeFocus !== 'blank' && $("#videoStrokeAnalysisYesInput").prop( "checked", true )) {
        $(".video-stroke-analysis--total").text("$120.00");
        $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$120.00");
    }
});

$(".membership-length--lanemate-yearly").on( "click", function() {
    $(".membership-length--total").text("$83.88");
    $(".payment-info__line-item--lanemate .payment-info__line-item--price").text("$83.88");
    $(".price-string__video-stroke-analysis").text(" for $99.00");
    var strokeFocus = $('#strokeFocus').val();
    if (strokeFocus !== 'blank' && $("#videoStrokeAnalysisYesInput").prop( "checked", true )) {
        $(".video-stroke-analysis--total").text("$99.00");
        $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$99.00");
    }
});

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