var usmsPlusSelected = $(".product-option_usms-plus.selected");
var videoSelected = $(".product-option_video-stroke-analysis.selected");
var videoEligibleSelected = $(".product-option_video-stroke-analysis-eligible.selected");
var coachAltsSelected = $(".product-option_coach-alts.selected");

var updateTotalPayment = function(callback) {
    console.log("load review-payment.js");
    console.log(productCardTotal);
    var inputDonation = $("input[name='swimming-saves-lives']");
    var donationVal = inputDonation.val();
    var donationNum = parseInt(donationVal);
    var totalPaymentVal = productCardTotal + donationNum;
    var totalPaymentNum = Number(totalPaymentVal);
    $(".payment-info__line-item--total .payment-info__line-item--price").text('$ ' + totalPaymentNum + '.00');
    updateLineItems(callback);
};

var updateLineItems = function() {
    console.log("update payment line items");
    var usmsPlusSelected = $(".product-option_usms-plus.selected");

    // if (usmsPlusSelected.length !== 1 && videoSelected.length !== 1 && coachAltsSelected.length !== 1 && lineItemDonation.length === 0 ) {
    if (usmsPlusSelected.length !== 1 && videoSelected.length !== 1 && coachAltsSelected.length !== 1 && donationNum < 1 ) {
        console.log("if 1.0");
        if (lineItemUsmsPlus.length === 1) { removeLineItemUsmsPlus(); }
        if (lineItemVideo.length === 1) { removeLineItemVideo(); }
        if (lineItemVideoEligible.length === 1) { removeLineItemVideoEligible(); }
        if (lineItemCoachAlts.length === 1) { removeLineItemCoachAlts(); }
        if (lineItemDonation.length === 1) { removeLineItemDonation(); }
    }
    // else if (usmsPlusSelected.length === 1 && videoSelected.length !== 1 && coachAltsSelected.length !== 1 && lineItemDonation.length === 1 ) {
    else if (usmsPlusSelected.length === 1 && videoSelected.length !== 1 && coachAltsSelected.length !== 1 && donationNum > 0 ) {
        console.log("else if 1.1");
        if (lineItemVideo.length === 1) { removeLineItemVideo(); }
        if (lineItemCoachAlts.length === 1) { removeLineItemCoachAlts(); }
        if (lineItemDonation.length === 0) { renderLineItemDonation(); }
    }
    else if (usmsPlusSelected.length !== 1 && videoSelected.length !== 1 && coachAltsSelected.length !== 1 && donationNum > 0 ) {
        console.log("else if 1.2");
        renderLineItemUsmsPlus();
        renderLineItemVideoEligible();
        if (lineItemCoachAlts.length === 1) { removeLineItemCoachAlts(); }
        if (lineItemVideo.length === 1) { removeLineItemVideo(); }
        if (lineItemVideoEligible.length === 1) { removeLineItemVideoEligible(); }
    } else if (usmsPlusSelected.length === 1 && videoSelected.length !== 1 && coachAltsSelected.length !== 1) {
        console.log("else if 1.3");
        renderLineItemUsmsPlus();
        if (lineItemCoachAlts.length === 1) { removeLineItemCoachAlts(); }
    } else if (usmsPlusSelected.length !== 1 && videoSelected.length === 1 && coachAltsSelected.length !== 1) {
        console.log("else if 1.4");
        renderLineItemVideo();
        if (lineItemCoachAlts.length === 1) { removeLineItemCoachAlts(); }
    } else if (usmsPlusSelected.length === 1 && videoSelected.length === 1 && coachAltsSelected.length !== 1) {
        console.log("else if 1.5");
        renderLineItemVideo();
        if (lineItemCoachAlts.length === 1) { removeLineItemCoachAlts(); }
    } else if (usmsPlusSelected.length !== 1 && videoSelected.length !== 1 && coachAltsSelected.length === 1 ) {
        console.log("else if 1.6");
        if (lineItemUsmsPlus.length === 1) { removeLineItemUsmsPlus(); }
        if (lineItemVideo.length === 1) { removeLineItemVideo(); }
        if (lineItemVideoEligible.length === 1) { removeLineItemVideoEligible(); }
        renderLineItemCoachAlts();
    } else if (usmsPlusSelected.length === 1 && videoSelected.length === 1 && coachAltsSelected.length === 1 ) {
        console.log("else if 1.7");
        renderLineItemVideo();
        renderLineItemCoachAlts();
    } else if (usmsPlusSelected.length !== 1 && videoSelected.length === 1 && coachAltsSelected.length === 1 ) {
        console.log("else if 1.8");
        renderLineItemVideo();
        renderLineItemCoachAlts();
    } else if (usmsPlusSelected.length === 1 && videoSelected.length !== 1 && coachAltsSelected.length === 1 ) {
        console.log("else if 1.9");
        renderLineItemUsmsPlus();
        renderLineItemCoachAlts();
    }
};