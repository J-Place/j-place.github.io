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
var usmsPlusVal = 0;
var videoVal = 0;
var coachAltsVal = 0;
var renderProductCardTotal = function() {
    var cardTotalValProduct = usmsPlusVal + videoVal + coachAltsVal;
    $(".add-on-products .card__total--amount").text("$ " + cardTotalValProduct + ".00");
}
var resetProductCardTotal = function() {
    $(".add-on-products .card__total--amount").text("$__.__");
}
var updateProductCardTotal = function() {
    console.log(videoVal);
    console.log(coachAltsVal);
    var usmsPlusSelected = $(".product-option_usms-plus.selected");
    // var videoSelected = $(".product-option_video-stroke-analysis.selected");
    var videoEligibleSelected = $(".product-option_video-stroke-analysis-eligible.selected");
    var coachAltsSelected = $(".product-option_coach-alts.selected");
    if (coachAltsSelected.length !== 1 && videoEligibleSelected.length !== 1) {
        console.log("Eligible 1");
        $(".add-on-products .card__total--amount").text('$__.__');
        updateTotalPayment();
        return;
    }
    if (coachAltsSelected.length !== 1 && usmsPlusSelected.length !== 1 && videoEligibleSelected.length !== 1) {
        console.log("Coach Alts 1");
        usmsPlusVal = 0;
        videoVal = 0;
        coachAltsVal = 0;
        // $(".add-on-products .card__total--amount").text('$__.__');
        renderProductCardTotal();
        removeLineItemUsmsPlus();
        removeLineItemCoachAlts();
        removeLineItemVideo();
        updateTotalPayment();
        // return;
    } else if (coachAltsSelected.length !== 1 && usmsPlusSelected.length === 1 && videoEligibleSelected.length !== 1) {
        console.log("Coach Alts 2");
        usmsPlusVal = 179;
        videoVal = 0;
        coachAltsVal = 0;
        removeLineItemCoachAlts();
        renderProductCardTotal();
        renderLineItemUsmsPlus();
        updateTotalPayment();
        // return;
    } else if (coachAltsSelected.length !== 1 && usmsPlusSelected.length !== 1 && videoEligibleSelected.length === 1) {
        console.log("Coach Alts 3");
        usmsPlusVal = 0;
        videoVal = 0;
        coachAltsVal = 0;
        renderProductCardTotal();
        removeLineItemUsmsPlus();
        renderLineItemVideo();
        removeLineItemCoachAlts();
        updateTotalPayment();
        // return;
    } else if (coachAltsSelected.length !== 1 && usmsPlusSelected.length === 1 && videoEligibleSelected.length === 1) {
        console.log("Coach Alts 4");
        usmsPlusVal = 179;
        videoVal = 0;
        coachAltsVal = 0;
        renderProductCardTotal();
        // removeLineItemUsmsPlus();
        renderLineItemVideo();
        removeLineItemCoachAlts();
        updateTotalPayment();
        // return;
    } else if (coachAltsSelected.length === 1 && usmsPlusSelected.length !== 1 && videoEligibleSelected.length !== 1) {
        console.log("Product Options 1");
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
        console.log("Product Options 2");
        usmsPlusVal = 179;
        videoVal = 0;
        coachAltsVal = 30;
        // renderProductCardTotal();
        renderLineItemUsmsPlus();
        renderLineItemVideo();
        renderLineItemCoachAlts(); // <!---------------- ???
        updateTotalPayment();
    } else if (coachAltsSelected.length === 1 && usmsPlusSelected.length !== 1 && videoEligibleSelected.length === 1) {
        console.log("Product Options 3");
        usmsPlusVal = 0;
        videoVal = 0;
        coachAltsVal = 30;
        renderProductCardTotal();
        removeLineItemUsmsPlus();
        renderLineItemVideo();
        renderLineItemCoachAlts();
        updateTotalPayment();
    } else if (coachAltsSelected.length === 1 && usmsPlusSelected.length === 1 && videoEligibleSelected.length !== 1) {
        console.log("Product Options 4");
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