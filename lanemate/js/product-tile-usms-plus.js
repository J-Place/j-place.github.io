console.log("load product-tile-usms-plus.js");

$(document).ready(function() {
    $("#addUsmsPlus").on('click', function(updateProductCardTotal) {
        addUsmsPlus(updateProductCardTotal);
        $(".agree-usmsplus-terms").show();
    });
    $("#removeUsmsPlus").on('click', function(updateProductCardTotal) {
        removeUsmsPlus(updateProductCardTotal);
        $(".agree-usmsplus-terms").hide();
    });
});

var addUsmsPlus = function() {
    // var usmsPlusSelected = $(".product-option_usms-plus.selected");
    var videoSelected = $(".product-option_video-stroke-analysis.selected");
    $(".product-option.product-option_usms-plus").toggleClass('selected');
    $("#addUsmsPlus").hide();
    $("#removeUsmsPlus").show();
    usmsPlusVal = 179;
    productCardTotal = productCardTotal + usmsPlusVal;
    if (videoSelected.length === 1) {
        productCardTotal = productCardTotal - videoVal;
    }
    isVideoEligible = true;
    renderLineItemUsmsPlus();
    updateProductCardTotal();
}
var removeUsmsPlus = function() {
    $(".product-option.product-option_usms-plus").removeClass('selected');
    $("#addUsmsPlus").show();
    $("#removeUsmsPlus").hide();
    usmsPlusVal = 179;
    productCardTotal = productCardTotal - usmsPlusVal;
    isVideoEligible = false;
    removeLineItemUsmsPlus();
    updateProductCardTotal();
}
var renderLineItemUsmsPlus = function() {
    removeLineItemUsmsPlus();
    $(".payment-info__line-item--summary").prepend('<p class="payment-info__line-item payment-info__line-item--usms-plus">USMS+: <span class="payment-info__line-item--price"></span></p>');
    $(".payment-info__line-item--usms-plus .payment-info__line-item--price").text('$ ' + usmsPlusVal + '.00');
}
var removeLineItemUsmsPlus = function() {
    $(".payment-info__line-item--summary").find('.payment-info__line-item--usms-plus').remove();
}