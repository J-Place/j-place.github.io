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
        $(".payment-info__form-summary + .payment-info__form-summary .payment-info__line-item--total").before('<p class="payment-info__line-item payment-info__line-item--trial">7-Day Trial Subscription: <span class="payment-info__line-item--price"></span></p>');
    }
});



$(".membership-length--lanemate-monthly").on( "click", function() {
    if ($(".membership-length--option").hasClass('selected')) {
        alert("This one");
        $(".payment-info__line-item--subscription .payment-info__line-item--price").text("LaneMate Monthly");
        $(".payment-info__line-item--plan-rate .payment-info__line-item--price").text("$9.99/mo.");
        $(".payment-info__line-item--bill-date .payment-info__line-item--price").text("04/08/2024");
        $(".payment-info__line-item--trial .payment-info__line-item--price").text("$0.00");
    } else {
        $(".payment-info__form-summary + .payment-info__form-summary .payment-info__line-item--total").text("asdcasdc");
    }
    // $(".payment-info__form-summary + .payment-info__form-summary .payment-info__line-item--total").before('<p class="payment-info__line-item payment-info__line-item--trial">7-Day Trial Subscription: <span class="payment-info__line-item--price"></span></p>');
    $(".membership-length--total.card__total--amount").text("$9.99");
    $(".payment-info__line-item--lanemate .payment-info__line-item--price").text("$9.99");
    $(".price-string__video-stroke-analysis").text(" for $120.00");

    var strokeFocus = $('#strokeFocus').val();
    if (strokeFocus !== 'blank' && $("#videoStrokeAnalysisYesInput").prop( "checked", true )) {
        $(".video-stroke-analysis--total").text("$120.00");
        $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$120.00");
    }
});

$(".membership-length--lanemate-yearly").on( "click", function() {
    if ($(".membership-length--option")) {
        alert("No, this one");
        $(".payment-info__line-item--subscription .payment-info__line-item--price").text("LaneMate Yearly");
        $(".payment-info__line-item--plan-rate .payment-info__line-item--price").text("$83.88/yr.");
        $(".payment-info__line-item--bill-date .payment-info__line-item--price").text("04/08/2024");
        $(".payment-info__line-item--trial .payment-info__line-item--price").text("$0.00");
        // $(".payment-info__form-summary + .payment-info__form-summary .payment-info__line-item--total").before('<p class="payment-info__line-item payment-info__line-item--trial">7-Day Trial Subscription: <span class="payment-info__line-item--price">$0.00</span></p>');

    } else {
        // $(".payment-info__form-summary + .payment-info__form-summary .payment-info__line-item--total").before('<p class="payment-info__line-item payment-info__line-item--trial">7-Day Trial Subscription: <span class="payment-info__line-item--price">$0.00</span></p>');
    }
    $(".membership-length--total.card__total--amount").text("$83.88");
    $(".payment-info__line-item--lanemate .payment-info__line-item--price").text("$83.88");
    $(".price-string__video-stroke-analysis").text(" for $99.00");

    var strokeFocus = $('#strokeFocus').val();
    if (strokeFocus !== 'blank' && $("#videoStrokeAnalysisYesInput").prop( "checked", true )) {
        $(".video-stroke-analysis--total").text("$99.00");
        $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$99.00");
    }
});



// .membership-length--total.card__total--amount