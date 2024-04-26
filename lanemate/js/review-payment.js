console.log("load review-payment.js");

var usmsPlusSelected = $(".product-option_usms-plus.selected");
var videoSelected = $(".product-option_video-stroke-analysis.selected");
var videoEligibleSelected = $(".product-option_video-stroke-analysis-eligible.selected");
var coachAltsSelected = $(".product-option_coach-alts.selected");

var updateTotalPayment = function(callback) {
    var inputDonation = $("input[name='swimming-saves-lives']");
    var donationVal = inputDonation.val();
    var donationNum = parseInt(donationVal);
    var totalPaymentVal = productCardTotal + donationNum;
    var totalPaymentNum = Number(totalPaymentVal);
    $(".payment-info__line-item--total .payment-info__line-item--price").text('$ ' + totalPaymentNum + '.00');
};

var showValidation = function() {
    $('.help-block').addClass('has-error');
}
var hideValidation = function() {
    $('.help-block').removeClass('has-error');
}