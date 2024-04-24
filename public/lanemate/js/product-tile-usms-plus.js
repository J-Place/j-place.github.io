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

// var usmsPlusVal = 179;

var addUsmsPlus = function() {
    $(".product-option.product-option_usms-plus").toggleClass('selected');
    $("#addUsmsPlus").hide();
    $("#removeUsmsPlus").show();
    usmsPlusVal = 179;
    console.log(productCardTotal);
    productCardTotal = productCardTotal + usmsPlusVal;
    console.log(productCardTotal);
    renderLineItemUsmsPlus();
    updateProductCardTotal();
}
var removeUsmsPlus = function() {
    $(".product-option.product-option_usms-plus").removeClass('selected');
    $("#addUsmsPlus").show();
    $("#removeUsmsPlus").hide();
    usmsPlusVal = 179;
    console.log(productCardTotal);
    productCardTotal = productCardTotal - usmsPlusVal;
    console.log(productCardTotal);
    removeLineItemUsmsPlus();
    updateProductCardTotal();
    // if (videoEligibleSelected.length === 1 ) {
    //     console.log("yup");
    //     productCardTotal = productCardTotal - usmsvideoVal;    
    // }
}
var renderLineItemUsmsPlus = function() {
    removeLineItemUsmsPlus();
    $(".payment-info__line-item--summary").prepend('<p class="payment-info__line-item payment-info__line-item--usms-plus">USMS+: <span class="payment-info__line-item--price"></span></p>');
    $(".payment-info__line-item--usms-plus .payment-info__line-item--price").text('$ ' + usmsPlusVal + '.00');
}
var removeLineItemUsmsPlus = function() {
    $(".payment-info__line-item--summary").find('.payment-info__line-item--usms-plus').remove();
}