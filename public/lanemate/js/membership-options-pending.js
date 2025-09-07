// Add Default Component Line Item to Payment on Page Load
$( document ).ready(function() {
    // const paymentFormHeader = document.getElementsByClassName('payment-info___form-header');
    // if (paymentFormHeader) {
    //     $(".usms-membership-total-container").prepend('<p class="payment-info__line-item payment-info__line-item--usms xxx">USMS Membership: <span class="payment-info__line-item--price">$__.__</span></p>');
    // }
});

// form-group agree-terms disabled

$(".membership-length--option").on( "click", function() {
    $(".membership-length--option").removeClass("selected");
    $(this).addClass("selected");
    
    // $(".card.payment-info.un-selected").removeClass("un-selected");

    // Add-On cost is dependent upon plan selection; enable inputs after a selection is made.
    $(".video-stroke-analysis input").attr( "disabled", false);
    $(".agree-coach-alts-certification input").attr( "disabled", false);

    // updateTotalPayment();
    
});

$(".membership-length--eventStandard").on( "click", function() {
    productCardTotal = 0;    
    $(".membership-length--total.card__total--amount").text("$0.00");
    $(".payment-info__line-item--usms .payment-info__line-item--price").text("$0.00");
    $(".price-string__video-stroke-analysis").text(" for $99.00");
    // var strokeFocus = $('#strokeFocus').val();
    // if (strokeFocus !== 'blank' && $("#videoStrokeAnalysisYesInput").prop( "checked", true )) {
    //     $(".video-stroke-analysis--total").text("$99.00");
    //     $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$99.00");
    // }
    $(".price-string__coach-alts-certification").text("for $30.00");
    $('.form-group.card-name').addClass('un-selected');
    $('.form-group.card-number').addClass('un-selected');
    $('.form-group.card-zip').addClass('un-selected');
    
    updateTotalPayment();
});

$(".membership-length--nextYear").on( "click", function() {
    productCardTotal = 179;
    $(".membership-length--total.card__total--amount").text("$179.00");
    $(".payment-info__line-item--usms .payment-info__line-item--price").text("$179.00");
    $(".price-string__video-stroke-analysis").text(" for $99.00");
    // var strokeFocus = $('#strokeFocus').val();
    // if (strokeFocus !== 'blank' && $("#videoStrokeAnalysisYesInput").prop( "checked", true )) {
    //     $(".video-stroke-analysis--total").text("$99.00");
    //     $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$99.00");
    // }
    $(".price-string__coach-alts-certification").text("for $30.00");
    $('.form-group.card-name').addClass('un-selected');
    $('.form-group.card-number').addClass('un-selected');
    $('.form-group.card-zip').addClass('un-selected');
    
    updateTotalPayment();
});

$(".membership-length--currentYear").on( "click", function() {
    productCardTotal = 0;
    $(".membership-length--total.card__total--amount").text("$0.00");
    $(".payment-info__line-item--usms .payment-info__line-item--price").text("$0.00");
    $(".price-string__video-stroke-analysis").text(" for $99.00");
    var strokeFocus = $('#strokeFocus').val();
    if (strokeFocus !== 'blank' && $("#videoStrokeAnalysisYesInput").prop( "checked", true )) {
        $(".video-stroke-analysis--total").text("$99.00");
        $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$99.00");
    }
    $(".price-string__coach-alts-certification").text("for $30.00");
    $('.form-group.card-name').addClass('un-selected');
    $('.form-group.card-number').addClass('un-selected');
    $('.form-group.card-zip').addClass('un-selected');
    
    updateTotalPayment();
});

$(".membership-length--usmsPlus").on( "click", function() {
    productCardTotal = 179;
    $(".membership-length--total.card__total--amount").text("$179.00");
    $(".payment-info__line-item--usms .payment-info__line-item--price").text("$179.00");
    $(".price-string__video-stroke-analysis").text(" for FREE!");
    var strokeFocus = $('#strokeFocus').val();
    if (strokeFocus !== 'blank' && $("#videoStrokeAnalysisYesInput").prop( "checked", true )) {
        $(".video-stroke-analysis--total").text("$0.00");
        $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text("$0.00");
    }
    $(".price-string__coach-alts-certification").text("for $30.00");
    $('.form-group.card-name').removeClass('un-selected');
    $('.form-group.card-number').removeClass('un-selected');
    $('.form-group.card-zip').removeClass('un-selected');

    updateTotalPayment();
});
