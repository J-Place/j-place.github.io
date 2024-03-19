// Add Default Component Line Item to Payment on Page Load
// $( document ).ready(function() {
    // $(".payment-info__form-summary").prepend('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis">Video Stroke Analysis: <span class="payment-info__line-item--price">$__.__</span></p>');
    // $(".payment-info__line-item--usms").after('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis">Video Stroke Analysis: <span class="payment-info__line-item--price">$__.__</span></p>');
// });

// Render Card and Line Item Prices
$(document.body).on('change','#strokeFocus',function(){
    var strokeFocus = $('#strokeFocus').val();
    if (strokeFocus === 'blank') {
        $(".video-stroke-analysis--total.card__total--amount").text("$__.__");
        $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$__.__");
    } if ($(".payment-info__line-item--video-stroke-analysis").length) {
        return;
    } else if ($(".membership-length--option.membership-length--currentYear.selected")[0]) {
        $(".video-stroke-analysis--total.card__total--amount").text("$99.00");
        $(".payment-info__line-item--usms").after('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis">Video Stroke Analysis: <span class="payment-info__line-item--price">$99.00</span></p>');
    } else if ($(".membership-length--option.membership-length--usmsPlus.selected")[0]) {
        $(".video-stroke-analysis--total.card__total--amount").text("$0.00");
        $(".payment-info__line-item--usms").after('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis">Video Stroke Analysis: <span class="payment-info__line-item--price">$0.00</span></p>');
    }
    $(".un-selected").removeClass();
});

// Handle Radio Inputs
$("#videoStrokeAnalysisNo").on( "click", function () {    
    if ($(".membership-length--option.selected")[0]) {
        $(".select-stroke-focus").hide();
        $("#videoStrokeAnalysisYesInput").prop( "checked", false );
        $("#videoStrokeAnalysisNoInput").prop( "checked", true );
        $(".video-stroke-analysis--total.card__total--amount").text("$__.__");
        $(".payment-info__line-item--video-stroke-analysis").remove();
        $('#strokeFocus').val('blank');
    } else return;
});

$("#videoStrokeAnalysisYes").on( "click", function () {    
    if ($(".membership-length--option.selected")[0]) {
        $(".select-stroke-focus").show();
        $("#videoStrokeAnalysisYesInput").prop( "checked", true );
        $("#videoStrokeAnalysisNoInput").prop( "checked", false );
    } else return;
});