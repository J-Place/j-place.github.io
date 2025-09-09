// Add Default Component Line Item to Payment on Page Load
// $( document ).ready(function() {
//     $(".payment-info__form-summary").prepend('<p class="payment-info__line-item payment-info__line-item--usms">USMS Membership: <span class="payment-info__line-item--price">$__.__</span></p>');
// });
// const paymentFormHeader = document.getElementsByClassName('payment-info___form-header');
// if (paymentFormHeader) {
//     $(".usms-membership-container").prepend('<p class="payment-info__line-item payment-info__line-item--usms">USMS Membership: <span class="payment-info__line-item--price">$__.__</span></p>');
// }

$(".membership-length--option").on( "click", function() {
    $(".membership-length--option").removeClass("selected");
    $(this).addClass("selected");
    $(".card.payment-info.un-selected").removeClass("un-selected");
    // $(".card.payment-info").css({
    //     'height':'100%',
    //     'opacity':'100',
    // });
    // Add-On cost is dependent upon plan selection; enable inputs after a selection is made.
    $(".video-stroke-analysis input").attr( "disabled", false);
    $(".agree-coach-alts-certification input").attr( "disabled", false);
});

$(".membership-length--currentYear").on( "click", function() {
    productCardTotal = 70;
    $(".membership-length--total.card__total--amount").text("$70.00");
    $(".payment-info__line-item--usms .payment-info__line-item--price").text("$70.00");
    $(".price-string__video-stroke-analysis").text(" for 110.00");
    var strokeFocus = $('#strokeFocus').val();
    if (strokeFocus !== 'blank' && $("#videoStrokeAnalysisYesInput").prop( "checked", true )) {
        $(".video-stroke-analysis--total").text("$99.00");
        $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$99.00");
    }
    // var coachAltsCertCard = $(".price-string__coach-alts-certification").text("$30.00");
    $(".price-string__coach-alts-certification").text("for $30.00");
});
    
$(".membership-length--usmsPlus").on( "click", function() {
    productCardTotal = 174;
    $(".membership-length--total.card__total--amount").text("$174.00");
    $(".payment-info__line-item--usms .payment-info__line-item--price").text("$174.00");
    $(".price-string__video-stroke-analysis").text(" for FREE!");
    var strokeFocus = $('#strokeFocus').val();
    if (strokeFocus !== 'blank' && $("#videoStrokeAnalysisYesInput").prop( "checked", true )) {
        $(".video-stroke-analysis--total").text("$0.00");
        $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$__.__");
    }
    $(".price-string__coach-alts-certification").text("for $30.00");
});