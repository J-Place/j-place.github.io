$(document.body).on('change',function(){
    console.log("Coach ALTS Cert is Rendering");
    // var coachAltsCertificationLineItem = $('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis">Coach and ALTS Certification: <span class="payment-info__line-item--price">$__.__</span></p>');
    // $('.payment-info__form-summary').append(coachAltsCertificationLineItem);
    $(".payment-info__form-summary").append("<p>This is the added paragraph.</p>");
    if ($("#videoStrokeAnalysisYesInput").prop( "checked", true )) {
        $(".coach-alts-cert--total.card__total--amount").text("$9.99");
    } else {
        $(".coach-alts-cert--total.card__total--amount").text("$__.__");
    }
});

// $('[id^=clickme]').click(function () {
//     var alreadyVotedSpan = $('<span id="msg"> You already voted for this post</span>');
//     $(this).closest('.post').find('.date').append(alreadyVotedSpan);
//     alreadyVotedSpan.fadeIn('fast').delay(1000).fadeOut('fast').delay(1000, function() { this.remove() });
// });