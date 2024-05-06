$(document).ready(function() {
    console.log("load product-group.js");
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
    var usmsPlusSelected = $(".product-option_usms-plus.selected");
    var videoSelected = $(".product-option_video-stroke-analysis.selected");
    var coachAltsSelected = $(".product-option_coach-alts.selected");
    var tileUsmsPlus = $(".product-option.product-option_usms-plus");
    var tileVideo = $(".product-option.product-option_video-stroke-analysis");
    var tileCoachAlts = $(".product-option.product-option_coach-alts");
    if (coachAltsSelected.length !== 1 && usmsPlusSelected.length !== 1 && videoSelected.length !== 1) {
        console.log("Coach Alts 1");
        usmsPlusVal = 0;
        videoVal = 0;
        coachAltsVal = 0;
        if (tileUsmsPlus.length === 1 ) {
            removeLineItemUsmsPlus();
        }
        if (tileVideo.length === 1 ) {
            removeLineItemVideo();
        }
        if (tileCoachAlts.length === 1 ) {
            removeLineItemCoachAlts();
        }
        if (donationVal === 0 ) {
            $(".payment-info__line-item--price").text('$__.__');
        } else {
            updateTotalPayment();
        }
        $(".add-on-products .card__total--amount").text('$__.__');
        // updateTotalPayment();
        // return;
    } else if (coachAltsSelected.length !== 1 && usmsPlusSelected.length === 1 && videoSelected.length !== 1) {
        console.log("Coach Alts 2");
        usmsPlusVal = 179;
        videoVal = 0;
        coachAltsVal = 0;
        if (tileCoachAlts.length === 1 ) {
            removeLineItemCoachAlts();
        }
        renderProductCardTotal();
        if (tileUsmsPlus.length === 1 ) {
            renderLineItemUsmsPlus();
        }
        updateTotalPayment();
        // return;
    } else if (coachAltsSelected.length !== 1 && usmsPlusSelected.length !== 1 && videoSelected.length === 1) {
        console.log("Coach Alts 3");
        usmsPlusVal = 0;
        videoVal = 120;
        // videoVal = 0;
        coachAltsVal = 0;
        renderProductCardTotal();
        if (tileUsmsPlus.length === 1 ) {
            removeLineItemUsmsPlus();
            }
        renderLineItemVideo();
        if (tileCoachAlts.length === 1 ) {
            removeLineItemCoachAlts();
        }
        // updateTotalPayment();
        // $(".add-on-products .card__total--amount").text('$__.__');
        var tileUsmsPlus = $(".product-option.product-option_usms-plus");
        if (tileUsmsPlus.length !== 1 ) {
            console.log("USMS+ Tile is not on the page")
            // updateTotalPayment();
            $(".add-on-products .card__total--amount").text('$__.__');
        } else if (tileUsmsPlus.length === 1 ) {
            $(".add-on-products .card__total--amount").text('$__.__');
        }
        // return;
    } else if (coachAltsSelected.length !== 1 && usmsPlusSelected.length === 1 && videoSelected.length === 1) {
        console.log("Coach Alts 4");
        usmsPlusVal = 179;
        videoVal = 0;
        coachAltsVal = 0;
        renderProductCardTotal();
        // removeLineItemUsmsPlus();
        renderLineItemVideo();
        if (tileUsmsPlus.length === 1 ) {
            removeLineItemCoachAlts();
        }
        updateTotalPayment();
        // return;
    } else if (coachAltsSelected.length === 1 && usmsPlusSelected.length !== 1 && videoSelected.length !== 1) {
        console.log("Product Options 1");
        usmsPlusVal = 0;
        videoVal = 0;
        coachAltsVal = 30;
        renderProductCardTotal();
        if (tileUsmsPlus.length === 1 ) {
            removeLineItemUsmsPlus();
        }
        removeLineItemVideo();
        if (tileUsmsPlus.length === 1 ) {
            renderLineItemCoachAlts();
        }
        updateTotalPayment();
        // return;
    } else if (coachAltsSelected.length === 1 && usmsPlusSelected.length === 1 && videoSelected.length === 1) {
        console.log("Product Options 2");
        usmsPlusVal = 179;
        videoVal = 0;
        coachAltsVal = 30;
        // renderProductCardTotal();
        if (tileUsmsPlus.length === 1 ) {
            renderLineItemUsmsPlus();
        }
        renderLineItemVideo();
        if (tileUsmsPlus.length === 1 ) {
            renderLineItemCoachAlts(); // <!---------------- ???
        }
        updateTotalPayment();
    } else if (coachAltsSelected.length === 1 && usmsPlusSelected.length !== 1 && videoSelected.length === 1) {
        console.log("Product Options 3");
        usmsPlusVal = 0;
        videoVal = 120;
        coachAltsVal = 30;
        renderProductCardTotal();
        if (tileUsmsPlus.length === 1 ) {
            removeLineItemUsmsPlus();
        }
        renderLineItemVideo();
        if (tileUsmsPlus.length === 1 ) {
            renderLineItemCoachAlts();
        }
        updateTotalPayment();
    } else if (coachAltsSelected.length === 1 && usmsPlusSelected.length === 1 && videoSelected.length !== 1) {
        console.log("Product Options 4");
        usmsPlusVal = 179;
        videoVal = 0;
        coachAltsVal = 30;
        renderProductCardTotal();
        if (tileUsmsPlus.length === 1 ) {
            renderLineItemUsmsPlus();
        }
        removeLineItemVideo();
        if (tileUsmsPlus.length === 1 ) {
            renderLineItemCoachAlts();
        }
        updateTotalPayment();
    }
};