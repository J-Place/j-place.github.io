var usmsPlusVal = 0;
var videoVal = 0;
var coachAltsVal = 0;

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
    var usmsPlusSelected = $(".product-option_usms-plus.selected");
    var videoSelected = $(".product-option_video-stroke-analysis.selected");
    var coachAltsSelected = $(".product-option_coach-alts.selected");
    if (usmsPlusSelected.length !== 1 && videoSelected.length !== 1 && coachAltsSelected.length !== 1 && donationNum < 1 ) {
        console.log("Page load");
    }
    console.log(usmsPlusVal);
    console.log(videoVal);
    console.log(coachAltsVal);
    console.log(donationNum);
});
var renderProductCardTotal = function() {
    var cardTotalValProduct = usmsPlusVal + videoVal + coachAltsVal;
    $(".add-on-products .card__total--amount").text("$ " + cardTotalValProduct + ".00");
}
var resetProductCardTotal = function() {
    $(".add-on-products .card__total--amount").text("$__.__");
}
// var usmsPlusSelected = $(".product-option_usms-plus.selected");
// var videoSelected = $(".product-option_video-stroke-analysis.selected");
// var coachAltsSelected = $(".product-option_coach-alts.selected");

var updateProductCardTotal = function() {

    var usmsPlusSelected = $(".product-option_usms-plus.selected");
    var videoSelected = $(".product-option_video-stroke-analysis.selected");
    var videoEligibleSelected = $(".product-option_video-stroke-analysis-eligible.selected");
    var coachAltsSelected = $(".product-option_coach-alts.selected");
    
    var lineItemUsmsPlus = $('.payment-info__line-item--usms-plus');
    var lineItemVideo = $('.payment-info__line-item--video-stroke-analysis');
    var lineItemVideoEligible = $('.payment-info__line-item--video-stroke-analysis-eligible');
    var lineItemCoachAlts = $('.payment-info__line-item--coach-alts');
    var lineItemDonation = $('.payment-info__line-item--donation');
    
    // console.log("USMS+ " + lineItemUsmsPlus.length);
    // console.log("Video " + lineItemVideo.length);
    // console.log("Video Eligible " + lineItemVideoEligible.length);
    // console.log("Coach/Alts "+ lineItemCoachAlts.length);
    // console.log("Donation "+ lineItemDonation.length);

    // if (usmsPlusSelected.length !== 1 && videoSelected.length !== 1 && coachAltsSelected.length !== 1 && donationNum < 1 ) {
    if (usmsPlusSelected.length !== 1 && videoSelected.length !== 1 && coachAltsSelected.length !== 1 && lineItemDonation.length === 0 ) {
        console.log("Coach No Donation");
        usmsPlusVal = 0;
        videoVal = 0;
        coachAltsVal = 0;
        $(".add-on-products .card__total--amount").text('$__.__');
        $(".payment-info__line-item--price").text('$__.__');
        if (lineItemUsmsPlus.length === 1) { removeLineItemUsmsPlus(); }
        if (lineItemVideo.length === 1) { removeLineItemVideo(); }
        if (lineItemVideoEligible.length === 1) { removeLineItemVideoEligible(); }
        if (lineItemCoachAlts.length === 1) { removeLineItemCoachAlts(); }
        if (lineItemDonation.length === 1) { removeLineItemDonation(); }
        // removeLineItemVideo();
        // removeLineItemVideoEligible();
        // removeLineItemCoachAlts();
        // removeLineItemDonation();
        // updateTotalPayment();
        // return;
    }
    else if (usmsPlusSelected.length === 1 && videoSelected.length !== 1 && coachAltsSelected.length !== 1 && lineItemDonation.length === 1 ) {
    // else if (usmsPlusSelected.length === 1 && videoSelected.length !== 1 && coachAltsSelected.length !== 1 && donationNum > 0 ) {
        console.log("Coach Donation 1");
        usmsPlusVal = 120;
        videoVal = 0;
        coachAltsVal = 0;
        if (lineItemUsmsPlus.length === 0) { renderLineItemUsmsPlus(); }
        if (lineItemVideo.length === 1) { removeLineItemVideo(); }
        if (lineItemVideoEligible.length === 1) { removeLineItemVideoEligible(); }
        if (lineItemCoachAlts.length === 1) { removeLineItemCoachAlts(); }
        if (lineItemDonation.length === 0) { renderLineItemDonation(); }
        // if (lineItemDonation.length === 1) { removeLineItemDonation(); }
        // renderLineItemUsmsPlus();
        // removeLineItemVideo();
        // removeLineItemVideoEligible();
        // removeLineItemCoachAlts();
        // renderLineItemDonation();
        renderProductCardTotal();        
        updateTotalPayment();
    }
    else if (usmsPlusSelected.length !== 1 && videoSelected.length !== 1 && coachAltsSelected.length !== 1 && donationNum > 0 ) {
        console.log("Coach Donation 2");
        usmsPlusVal = 0;
        videoVal = 0;
        coachAltsVal = 0;
        $(".add-on-products .card__total--amount").text('$__.__');
        renderLineItemUsmsPlus();
        // removeLineItemCoachAlts();
        if (lineItemCoachAlts.length === 1) { removeLineItemCoachAlts(); }
        if (lineItemVideo.length === 1) { removeLineItemVideo(); }
        if (lineItemVideoEligible.length === 1) { removeLineItemVideoEligible(); }
        // updateTotalPayment();
        $(".payment-info__line-item--price").text('$__.__');
        // return;
    } else if (usmsPlusSelected.length === 1 && videoSelected.length !== 1 && coachAltsSelected.length !== 1) {
        console.log("Coach Alts 2");
        usmsPlusVal = 179;
        videoVal = 0;
        coachAltsVal = 0;
        renderLineItemUsmsPlus();
        // renderLineItemVideo();
        // if (lineItemVideo.length === 0) { renderLineItemVideo(); }
        // if (lineItemVideo.length === 0) { renderLineItemVideo(); }
        // if (lineItemVideoEligible.length === 0) { renderLineItemVideoEligible(); }
        // if (lineItemVideo.length === 1) { removeLineItemVideo(); }
        // if (lineItemVideoEligible.length === 1) { removeLineItemVideoEligible(); }
        // removeLineItemCoachAlts();
        if (lineItemCoachAlts.length === 1) { removeLineItemCoachAlts(); }
        renderProductCardTotal();        
        updateTotalPayment();
        // return;
    } else if (usmsPlusSelected.length !== 1 && videoSelected.length === 1 && coachAltsSelected.length !== 1) {
        console.log("Coach Alts 3");
        usmsPlusVal = 0;
        videoVal = 120;
        coachAltsVal = 0;
        renderProductCardTotal();
        renderLineItemVideo();
        // removeLineItemCoachAlts();
        if (lineItemCoachAlts.length === 1) { removeLineItemCoachAlts(); }
        updateTotalPayment();
        // return;
    } else if (usmsPlusSelected.length === 1 && videoSelected.length === 1 && coachAltsSelected.length !== 1) {
        console.log("Coach Alts 4");
        usmsPlusVal = 179;
        videoVal = 0;
        coachAltsVal = 0;
        renderProductCardTotal();
        renderLineItemVideo();
        // removeLineItemCoachAlts();
        if (lineItemCoachAlts.length === 1) { removeLineItemCoachAlts(); }
        updateTotalPayment();
        // return;
    } else if (usmsPlusSelected.length !== 1 && videoSelected.length !== 1 && coachAltsSelected.length === 1 ) {
        console.log("Product Options 1");
        usmsPlusVal = 0;
        videoVal = 0;
        coachAltsVal = 30;
        renderProductCardTotal();
        // removeLineItemUsmsPlus();
        if (lineItemUsmsPlus.length === 1) { removeLineItemUsmsPlus(); }
        // removeLineItemVideo();
        if (lineItemVideo.length === 1) { removeLineItemVideo(); }
        // removeLineItemVideoEligible();
        if (lineItemVideoEligible.length === 1) { removeLineItemVideoEligible(); }
        renderLineItemCoachAlts();
        updateTotalPayment();
        // return;
    } else if (usmsPlusSelected.length === 1 && videoSelected.length === 1 && coachAltsSelected.length === 1 ) {
        console.log("Product Options 2");
        usmsPlusVal = 179;
        videoVal = 0;
        coachAltsVal = 30;
        renderProductCardTotal();
        renderLineItemVideo();
        // if (lineItemVideo.length === 1) {
        //     removeLineItemUsmsPlus();
        // } else if (lineItemVideo.length === 0) {
        //     renderLineItemUsmsPlus();
        // }
        renderLineItemCoachAlts();
        updateTotalPayment();
    } else if (usmsPlusSelected.length !== 1 && videoSelected.length === 1 && coachAltsSelected.length === 1 ) {
        console.log("Product Options 3");
        // usmsPlusVal = 179;
        usmsPlusVal = 0;
        // videoVal = 0;
        videoVal = 120;
        coachAltsVal = 30;
        renderProductCardTotal();
        renderLineItemVideo();
        renderLineItemCoachAlts();
        updateTotalPayment();
    } else if (usmsPlusSelected.length === 1 && videoSelected.length !== 1 && coachAltsSelected.length === 1 ) {
        console.log("Product Options 4");
        usmsPlusVal = 179;
        videoVal = 0;
        coachAltsVal = 30;
        renderProductCardTotal();
        renderLineItemUsmsPlus();
        // removeLineItemVideo();
        // renderLineItemVideoEligible();
        renderLineItemCoachAlts();
        updateTotalPayment();
    }
    console.log(usmsPlusVal);
    console.log(videoVal);
    console.log(coachAltsVal);
    console.log(donationNum);
};