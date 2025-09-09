// Add Default Component Line Item to Payment on Page Load
// $( document ).ready(function() {
//     $(".payment-info__form-summary").prepend('<p class="payment-info__line-item payment-info__line-item--lanemate">7-Day Trial Subscription: <span class="payment-info__line-item--price">$__.__</span></p>');
// });

$(".membership-length--option").on( "click", function() {
    var optionSelected = $(".membership-length--option").hasClass('selected');
    $(".membership-length--option").removeClass("selected");
    $(this).addClass("selected");
    $(".video-stroke-analysis input").attr( "disabled", false);
    if (!optionSelected) {
        $(".payment-info__form-summary + .payment-info__form-summary .payment-info__line-item--total").before('<p class="payment-info__line-item payment-info__line-item--trial">LaneMate Subscription: <span class="payment-info__line-item--price"></span></p>');
    }
});

$(".membership-length--lanemate-monthly").on( "click", function() {
    $(".membership-length--total.card__total--amount").text("$9.99");
    $(".payment-info__line-item--lanemate .payment-info__line-item--price").text("$9.99");
    $(".price-string__video-stroke-analysis").text(" for $120.00");
    if ($(".membership-length--option").hasClass('selected')) {
        $(".payment-info__line-item--subscription .payment-info__line-item--price").text("LaneMate Monthly");
        $(".payment-info__line-item--plan-rate .payment-info__line-item--price").text("$9.99/mo.");
        $(".payment-info__line-item--bill-date .payment-info__line-item--price").text("04/08/2024");
        $(".payment-info__line-item--trial .payment-info__line-item--price").text("$0.00");
    }
    var strokeFocus = $('#strokeFocus').val();
    if (strokeFocus !== 'blank' && $("#videoStrokeAnalysisYesInput").prop( "checked", true )) {
        $(".video-stroke-analysis--total").text("$120.00");
        $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$120.00");
    }
});

$(".membership-length--lanemate-yearly").on( "click", function() {
    $(".membership-length--total.card__total--amount").text("$83.88");
    $(".payment-info__line-item--lanemate .payment-info__line-item--price").text("$83.88");
    $(".price-string__video-stroke-analysis").text(" for 110.00");
    if ($(".membership-length--option")) {
        $(".payment-info__line-item--subscription .payment-info__line-item--price").text("LaneMate Yearly");
        $(".payment-info__line-item--plan-rate .payment-info__line-item--price").text("$83.88/yr.");
        $(".payment-info__line-item--bill-date .payment-info__line-item--price").text("04/08/2024");
        $(".payment-info__line-item--trial .payment-info__line-item--price").text("$0.00");
    }
    var strokeFocus = $('#strokeFocus').val();
    if (strokeFocus !== 'blank' && $("#videoStrokeAnalysisYesInput").prop( "checked", true )) {
        $(".video-stroke-analysis--total").text("$99.00");
        $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$99.00");
    }
});