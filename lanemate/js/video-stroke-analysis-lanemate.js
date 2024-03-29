// Add Default Component Line Item to Payment on Page Load
// $(document).ready(function() {
    // $(".payment-info__form-summary").prepend('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis">Video Stroke Analysis: <span class="payment-info__line-item--price">$__.__</span></p>');
    // $(".payment-info__line-item--lanemate").after('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis">Video Stroke Analysis: <span class="payment-info__line-item--price">$__.__</span></p>');
// });

// Render Card and Line Item Prices
$(document.body).on('change','#strokeFocus',function(){
    var strokeFocusVal = $('#strokeFocus').val();
    var strokeSelected = strokeFocusVal != 'blank';

    if (strokeSelected === false) {
        $(".video-stroke-analysis--total.card__total--amount").text("$__.__");
        $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$__.__");
    } if ($(".payment-info__line-item--video-stroke-analysis").length) {
        return;
    } else if ($(".membership-length--lanemate-monthly.selected")[0]) {
        $(".video-stroke-analysis--total.card__total--amount").text("$120.00");
        // $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$120.00");
        $(".payment-info__line-item--trial").after('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis">Video Stroke Analysis: <span class="payment-info__line-item--price">$120.00</span></p>');
    } else if ($(".membership-length--lanemate-yearly.selected")[0]) {
        $(".video-stroke-analysis--total.card__total--amount").text("$99.00");
        // $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$99.00");
        $(".payment-info__line-item--trial").after('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis">Video Stroke Analysis: <span class="payment-info__line-item--price">$99.00</span></p>');
    }
});

// Handle Inputs
$("#videoStrokeAnalysisNo").on( "click", function () {    
    if ($(".membership-length--option.selected")[0]) {
        $(".select-stroke-focus").hide();
        $("#videoStrokeAnalysisYesInput").prop( "checked", false );
        $("#videoStrokeAnalysisNoInput").prop( "checked", true );
        $(".video-stroke-analysis--total.card__total--amount").text("$__.__");
        $('#strokeFocus').val('blank');
        // $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").remove();
        $(".payment-info__line-item--video-stroke-analysis").remove();
    } else return;
});

$("#videoStrokeAnalysisYes").on( "click", function () {    
    if ($(".membership-length--option.selected")[0]) {
        $(".select-stroke-focus").show();
        $("#videoStrokeAnalysisYesInput").prop( "checked", true );
        $("#videoStrokeAnalysisNoInput").prop( "checked", false );
    } else return;
});



// video-stroke-analysis--total.card__total--amount