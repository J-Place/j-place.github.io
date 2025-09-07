console.log("load review-payment.js");


const paymentFormHeader = document.getElementsByClassName('payment-info___form-header');
if (paymentFormHeader) {
    $(".usms-membership-container").prepend('<p class="payment-info__line-item payment-info__line-item--usms">USMS Membership: <span class="payment-info__line-item--price">$__.__</span></p>');
}


var usmsPlusSelected = $(".product-option_usms-plus.selected");
var videoSelected = $(".product-option_video-stroke-analysis.selected");
var videoEligibleSelected = $(".product-option_video-stroke-analysis-eligible.selected");
var coachAltsSelected = $(".product-option_coach-alts.selected");
var isVideoEligible = false;
// var totalPaymentNum = 0;

var updateTotalPayment = function() {
    var inputDonation = $("input[name='swimming-saves-lives']");
    var donationVal = inputDonation.val();
    var donationNum = parseInt(donationVal);
    var totalPaymentVal = productCardTotal + donationNum;
    var totalPaymentNum = Number(totalPaymentVal);
    $(".payment-info__line-item--total .payment-info__line-item--price").text('$ ' + totalPaymentNum + '.00')    
    // console.log(isVideoEligible);
    if (totalPaymentNum > 0) {
        // console.log("A");
        showPaymentInfo();
        enableSubmit();
    } else if (totalPaymentNum == 0 && isVideoEligible == true) {
        // console.log("B");
        hidePaymentInfo();
        enableSubmit();
    } else { 
        // console.log("C");
        hidePaymentInfo();
        disableSubmit();
    }
};

var showValidation = function() {
    $('.help-block').addClass('has-error');
}
var hideValidation = function() {
    $('.help-block').removeClass('has-error');
}