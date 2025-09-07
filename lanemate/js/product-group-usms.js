console.log("load product-group-usms.js");

$(document).ready(function() {
    const mobile = window.matchMedia("screen and (max-width:1199px)").matches;
    if (mobile) {
        return;
    } else {
        // Find the tallest height
        var tallestHeight = 0;
        $('.product-option').each(function() {
            var currentHeight = $(this).height();
            if (currentHeight > tallestHeight) {
            tallestHeight = currentHeight;
            }
        });
        // Set the height
        $('.product-option').height(tallestHeight);
    }
    updateProductCardTotal();
});

var usmsPlusVal = 0;
var videoVal = 0;
var videoEligibleVal = 0;
var coachAltsVal = 0;
var productCardTotal = 0;

var inputDonation = $("input[name='swimming-saves-lives']");
var donationVal = inputDonation.val();
var donationNum = parseInt(donationVal);
var totalValProductCard = usmsPlusVal + videoVal + videoEligibleVal + coachAltsVal;
var totalPaymentVal = totalValProductCard + donationNum;
var totalPaymentNum = Number(totalPaymentVal);

var lineItemUsmsPlus = $('.payment-info__line-item--usms .payment-info__line-item--price');
var lineItemVideo = $('.payment-info__line-item--video-stroke-analysis');
var lineItemVideoEligible = $('.payment-info__line-item--video-stroke-analysis-eligible');
var lineItemCoachAlts = $('.payment-info__line-item--coach-alts');
var lineItemDonation = $('.payment-info__line-item--donation .payment-info__line-item--price');

var usmsPlusSelected = $(".product-option_usms-plus.selected");
var videoSelected = $(".product-option_video-stroke-analysis.selected");
var videoEligibleSelected = $(".product-option_video-stroke-analysis-eligible.selected");
var coachAltsSelected = $(".product-option_coach-alts.selected");

var inputDonation = $("input[name='swimming-saves-lives']");
var donationVal = inputDonation.val();
var donationNum = parseInt(donationVal);

var totalProductCardVal = usmsPlusVal + videoVal + videoEligibleVal + coachAltsVal;
var totalPaymentVal = totalProductCardVal + donationNum;

var updateProductCardTotal = function() {
    $(".add-on-products .card__total--amount").text("$ " + productCardTotal + ".00");
    updateTotalPayment();
}   