// Add Default Component Line Item to Payment on Page Load
$( document ).ready(function() {
    $(".payment-info__form-summary").prepend('<p class="payment-info__line-item payment-info__line-item--usms">USMS Membership: <span class="payment-info__line-item--price">$__.__</span></p>');
});

$(".membership-length--option").on( "click", function() {
    $(".membership-length--option").removeClass("selected");
    $(".card.payment-info.un-selected").removeClass("un-selected");
    $(this).addClass("selected");

    // Add-On cost is dependent upon plan selection; enable inputs after a selection is made.
    $(".video-stroke-analysis input").attr( "disabled", false);
    $(".agree-coach-alts-certification input").attr( "disabled", false);
});

$(".membership-length--usmsPlus").on( "click", function() {
    $(".membership-length--total.card__total--amount").text("$179.00");
    $(".payment-info__line-item--usms .payment-info__line-item--price").text("$179.00");
    $(".price-string__video-stroke-analysis").text(" for FREE!");
    var strokeFocus = $('#strokeFocus').val();
    if (strokeFocus !== 'blank' && $("#videoStrokeAnalysisYesInput").prop( "checked", true )) {
        $(".video-stroke-analysis--total").text("$120.00");
        $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$__.__");
    }
});
$(".membership-length--currentYear").on( "click", function() {
    $(".membership-length--total.card__total--amount").text("$70.00");
    $(".payment-info__line-item--usms .payment-info__line-item--price").text("$70.00");
    $(".price-string__video-stroke-analysis").text(" for $99.00");
    var strokeFocus = $('#strokeFocus').val();
    if (strokeFocus !== 'blank' && $("#videoStrokeAnalysisYesInput").prop( "checked", true )) {
        $(".video-stroke-analysis--total").text("$99.00");
        $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$99.00");
    }
});


// .video-stroke-analysis--total.card__total--amount