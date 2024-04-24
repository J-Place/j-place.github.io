console.log("load product-group-usms-eligible.js");
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
});
var renderProductCardTotal = function() {
    var cardTotalValProduct = usmsPlusVal + videoVal + coachAltsVal;
    $(".add-on-products .card__total--amount").text("$ " + cardTotalValProduct + ".00");
}
var resetProductCardTotal = function() {
    $(".add-on-products .card__total--amount").text("$__.__");
}
var updateProductCardTotal = function() {
    var usmsPlusSelected = $(".product-option_usms-plus.selected");
    var videoSelected = $(".product-option_video-stroke-analysis.selected");
    var videoEligibleSelected = $(".product-option_video-stroke-analysis-eligible.selected");
    var coachAltsSelected = $(".product-option_coach-alts.selected");

    if (coachAltsSelected.length !== 1 && videoEligibleSelected.length !== 1) {
        console.log("if 1.0");
        $(".add-on-products .card__total--amount").text('$__.__');
        updateTotalPayment();
        // return;
    }
    if (coachAltsSelected.length !== 1 && usmsPlusSelected.length !== 1 && videoEligibleSelected.length !== 1) {
        console.log("if 2.0");
        usmsPlusVal = 0;
        videoVal = 0;
        coachAltsVal = 0;
        renderProductCardTotal();
        removeLineItemUsmsPlus();
        removeLineItemCoachAlts();
        removeLineItemVideo();
        updateTotalPayment();
        // return;
    } else if (coachAltsSelected.length !== 1 && usmsPlusSelected.length === 1 && videoEligibleSelected.length !== 1) {
        console.log("else if 2.1");
        usmsPlusVal = 179;
        videoVal = 0;
        coachAltsVal = 0;
        removeLineItemCoachAlts();
        renderProductCardTotal();
        renderLineItemUsmsPlus();
        updateTotalPayment();
        // return;
    } else if (coachAltsSelected.length !== 1 && usmsPlusSelected.length !== 1 && videoEligibleSelected.length === 1) {
        console.log("else if 2.2");
        usmsPlusVal = 0;
        videoVal = 0;
        coachAltsVal = 30;
        renderProductCardTotal();
        removeLineItemUsmsPlus();
        renderLineItemVideo();
        removeLineItemCoachAlts();
        updateTotalPayment();
        // return;
    } else if (coachAltsSelected.length !== 1 && usmsPlusSelected.length === 1 && videoEligibleSelected.length === 1) {
        console.log("else if 2.3");
        usmsPlusVal = 179;
        videoVal = 0;
        coachAltsVal = 0;
        renderProductCardTotal();
        renderLineItemVideo();
        removeLineItemCoachAlts();
        updateTotalPayment();
        // return;
    } else if (coachAltsSelected.length === 1 && usmsPlusSelected.length !== 1 && videoEligibleSelected.length !== 1) {
        console.log("else if 2.4");
        usmsPlusVal = 0;
        videoVal = 0;
        coachAltsVal = 30;
        renderProductCardTotal();
        removeLineItemUsmsPlus();
        removeLineItemVideo();
        renderLineItemCoachAlts();
        updateTotalPayment();
        // return;
    } else if (coachAltsSelected.length === 1 && usmsPlusSelected.length === 1 && videoEligibleSelected.length === 1) {
        console.log("else if 2.5");
        usmsPlusVal = 179;
        videoVal = 0;
        coachAltsVal = 30;
        renderLineItemUsmsPlus();
        renderLineItemVideo();
        renderLineItemCoachAlts(); // <!---------------- ???
        updateTotalPayment();
    } else if (coachAltsSelected.length === 1 && usmsPlusSelected.length !== 1 && videoEligibleSelected.length === 1) {
        console.log("else if 2.6");
        usmsPlusVal = 0;
        videoVal = 0;
        coachAltsVal = 30;
        renderProductCardTotal();
        removeLineItemUsmsPlus();
        renderLineItemVideo();
        renderLineItemCoachAlts();
        updateTotalPayment();
    } else if (coachAltsSelected.length === 1 && usmsPlusSelected.length === 1 && videoEligibleSelected.length !== 1) {
        console.log("else if 2.7");
        usmsPlusVal = 179;
        videoVal = 0;
        coachAltsVal = 30;
        renderProductCardTotal();
        renderLineItemUsmsPlus();
        removeLineItemVideo();
        renderLineItemCoachAlts();
        updateTotalPayment();
    }
};