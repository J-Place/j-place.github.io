// Add Default Component Line Item to Payment on Page Load
// $( document ).ready(function() {
    // $(".payment-info__form-summary").prepend('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis">Video Stroke Analysis: <span class="payment-info__line-item--price">$__.__</span></p>');
    // $(".payment-info__line-item--usms").after('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis">Video Stroke Analysis: <span class="payment-info__line-item--price">$__.__</span></p>');
// });

// Render Card and Line Item Prices
$(document.body).on('change','#strokeFocus',function(){
    var strokeFocusVal = $('#strokeFocus').val();
    // var paymentLineItemRendered = $(".payment-info__line-item--video-stroke-analysis").length;
    // var membershipSelected = $('$(".membership-length--option.selected');
    // var strokeSelected = $('');
    var strokeSelected = strokeFocusVal != 'blank';

    // if (paymentLineItemRendered) {
    //     return;
    // }

    // if (strokeFocusVal === 'blank' && !paymentLineItemRendered) {
    // if (strokeFocusVal === 'blank' && !paymentLineItemRendered && membershipSelected) {
    // if (strokeFocusVal === 'blank') {
    if (strokeSelected === false) {
        $(".video-stroke-analysis--total.card__total--amount").text("$__.__");
        $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$__.__");
        console.log("If condition 1");
        console.log(strokeSelected);
    } else if ($(".membership-length--option.membership-length--currentYear.selected")[0]) {
        $(".video-stroke-analysis--total.card__total--amount").text("$99.00");
        // Render line item markup in payment section
        $(".payment-info__line-item--usms").after('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis">Video Stroke Analysis: <span class="payment-info__line-item--price">$99.00</span></p>');
        console.log("Else if condition 2");
        console.log(strokeSelected);
    } else if ($(".membership-length--option.membership-length--usmsPlus.selected")[0]) {
        $(".video-stroke-analysis--total.card__total--amount").text("$0.00");
        // Render line item markup in payment section
        $(".payment-info__line-item--usms").after('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis">Video Stroke Analysis: <span class="payment-info__line-item--price">$0.00</span></p>');
        console.log("Else if condition 3");
        console.log(strokeSelected);
    }
    // $(".un-selected").removeClass();
    $('.form-group.card-name').removeClass('un-selected');
    $('.form-group.card-number').removeClass('un-selected');
    $('.form-group.card-zip').removeClass('un-selected');
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

        $('.form-group.card-name').addClass('un-selected');
        $('.form-group.card-number').addClass('un-selected');
        $('.form-group.card-zip').addClass('un-selected');

        // alert("No");

    } else return;
});

$("#videoStrokeAnalysisYes").on( "click", function () {    
    if ($(".membership-length--option.selected")[0]) {
        $(".select-stroke-focus").show();
        $("#videoStrokeAnalysisYesInput").prop( "checked", true );
        $("#videoStrokeAnalysisNoInput").prop( "checked", false );
    } else return;
});