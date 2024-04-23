$(document).ready(function() {
    $("#addUsmsPlus").on('click', function() {
        addUsmsPlus();
    });
    $("#removeUsmsPlus").on('click', function() {
        removeUsmsPlus();
    });
});

// var usmsPlusVal = 179;

var addUsmsPlus = function() {
    videoPriceShown = 0
    $(".product-option.product-option_usms-plus").toggleClass('selected');
    $(".product-option_video-stroke-analysis .product-price").text("$ " + videoPriceShown + "");
    $("#addUsmsPlus").prop("disabled",true);
    $("#addUsmsPlus").hide();
    $("#removeUsmsPlus").show();
    updateProductCardTotal();
}

var removeUsmsPlus = function() {
    videoPriceShown = 120;
    $(".product-option.product-option_usms-plus").removeClass('selected');
    $(".product-option_video-stroke-analysis .product-price").text("$ " + videoPriceShown + "");
    $("#addUsmsPlus").prop("disabled",false);
    $("#addUsmsPlus").show();
    $("#removeUsmsPlus").hide();
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