// Add Default Component Line Item to Payment on Page Load
$( document ).ready(function() {
    const disclaimerUsmsPlus = document.getElementById('disclaimerCheckboxUsmsPlus');
    const disclaimerCompetition = document.getElementById('disclaimerCheckboxCompetition');
    const disclaimerStandard = document.getElementById('disclaimerCheckboxStandard');

    $(".membership-length--option").on( "click", function() {
        $(".membership-length--option").removeClass("selected");
        $(this).addClass("selected");
        // Add-On cost is dependent upon plan selection; enable inputs after a selection is made.
        $(".video-stroke-analysis input").attr( "disabled", false);
        $(".agree-coach-alts-certification input").attr( "disabled", false);    
    });

    $(".membership-length--currentYear").on( "click", function() {
        productCardTotal = 0;
        $(".membership-length--total.card__total--amount").text("$0.00");
        $(".payment-info__line-item--usms .payment-info__line-item--price").text("$0.00");
        $(".price-string__video-stroke-analysis").text(" for $110.00");
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

    $(".membership-length--currentYearEvent").on( "click", function() {
        disclaimerCompetition.style.display = 'flex';
        disclaimerUsmsPlus.style.display = 'none';
        productCardTotal = 0;
        cardCompetition.classList.add('active');
        $(".membership-length--total.card__total--amount").text("$0.00");
        $(".payment-info__line-item--usms .payment-info__line-item--price").text("$0.00");
        $(".price-string__video-stroke-analysis").text(" for $110.00");
        $(".price-string__coach-alts-certification").text("for $30.00");
        $('.form-group.card-name').addClass('un-selected');
        $('.form-group.card-number').addClass('un-selected');
        $('.form-group.card-zip').addClass('un-selected');
        updateTotalPayment();
    });

    $(".membership-length--yearPlus").on( "click", function() {
        productCardTotal = 174;
        $(".membership-length--total.card__total--amount").text("$174.00");
        $(".payment-info__line-item--usms .payment-info__line-item--price").text("$174.00");
        $(".price-string__video-stroke-analysis").text(" for $110.00");
        $(".price-string__coach-alts-certification").text("for $30.00");
        $('.form-group.card-name').addClass('un-selected');
        $('.form-group.card-number').addClass('un-selected');
        $('.form-group.card-zip').addClass('un-selected');
        updateTotalPayment();
    });

    $(".membership-length--yearPlusEvent").on( "click", function() {
        disclaimerCompetition.style.display = 'flex';
        disclaimerUsmsPlus.style.display = 'none';
        productCardTotal = 125;
        cardCompetition.classList.add('active');
        $(".membership-length--total.card__total--amount").text("$125.00");
        $(".payment-info__line-item--usms .payment-info__line-item--price").text("$125.00");
        $(".price-string__video-stroke-analysis").text(" for $110.00");
        $(".price-string__coach-alts-certification").text("for $30.00");
        $('.form-group.card-name').addClass('un-selected');
        $('.form-group.card-number').addClass('un-selected');
        $('.form-group.card-zip').addClass('un-selected');
        updateTotalPayment();
    });

    $(".membership-length--usmsPlus").on( "click", function() {
        disclaimerCompetition.style.display = 'flex';
        disclaimerUsmsPlus.style.display = 'flex';
        productCardTotal = 174;
        cardCompetition.classList.add('active');
        $(".membership-length--total.card__total--amount").text("$174.00");
        $(".payment-info__line-item--usms .payment-info__line-item--price").text("$174.00");
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

        $("#agreeUsmsPlusTerms").prop('disabled', false);
        $(".agree-usmsplus-terms").removeClass('disabled');

        updateTotalPayment();
    });

});