$( document ).ready(function() {
    // $(".payment-info__form-summary").prepend('<p class="payment-info__line-item payment-info__line-item--coach-alts-certification">Coach and ALTS Certification: <span class="payment-info__line-item--price">$__.__</span></p>');
    $(".payment-info__line-item--usms").after('<p class="payment-info__line-item payment-info__line-item--coach-alts-certification">Coach and ALTS Certification: <span class="payment-info__line-item--price">$__.__</span></p>');
});

// coachAltsCertificationYes

// .coach-alts-certification--total.card__total--amount




$("#coachAltsCertificationNo").on( "click", function () {    
    if ($(".membership-length--option.selected")[0]) {
        $("#coachAltsCertificationYesInput").prop( "checked", false );
        $("#coachAltsCertificationNoInput").prop( "checked", true );
        $(".coach-alts-certification--total.card__total--amount").text("$__.__");
        $(".payment-info__line-item--coach-alts-certification .payment-info__line-item--price").text("$__.__");
    } else return;
});

$("#coachAltsCertificationYes").on( "click", function () {    
    if ($(".membership-length--option.selected")[0]) {
        $("#coachAltsCertificationYesInput").prop( "checked", true );
        $("#coachAltsCertificationNoInput").prop( "checked", false );
        $(".coach-alts-certification--total.card__total--amount").text("$30.00");
        $(".payment-info__line-item--coach-alts-certification .payment-info__line-item--price").text("$30.00");
    } else return;
});



