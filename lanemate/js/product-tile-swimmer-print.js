console.log("load product-tile-swimmer-print.js");

$(document).ready(function() {
    $("#addSwimmerMagPrint").on('click', function(updateProductCardTotal) {
        addSwimmerMagPrint(updateProductCardTotal);
    });
    $("#removeSwimmerMagPrint").on('click', function(updateProductCardTotal) {
        removeSwimmerMagPrint(updateProductCardTotal);
    });
});

var swimmerMagPrintSelected = $(".product-option.product-option_swimmer-mag-print.selected");

swimmerMagPrintVal = 10;

var addSwimmerMagPrint = function() {
    $(".product-option.product-option_swimmer-mag-print").addClass('selected');
    $("#addSwimmerMagPrint").hide();
    $("#removeSwimmerMagPrint").show();
    swimmerMagPrintVal = 10;
    productCardTotal = productCardTotal + swimmerMagPrintVal;
    renderLineItemSwimmerMagPrint();
    updateProductCardTotal();
}
var removeSwimmerMagPrint = function() {
    $(".product-option.product-option_swimmer-mag-print").removeClass('selected');
    $("#addSwimmerMagPrint").show();
    $("#removeSwimmerMagPrint").hide();
    swimmerMagPrintVal = 10;
    productCardTotal = productCardTotal - swimmerMagPrintVal;
    removeLineItemSwimmerMagPrint();
    updateProductCardTotal();
}

var renderLineItemSwimmerMagPrint = function() {
    removeLineItemSwimmerMagPrint();
    $(".payment-info__line-item--summary").last().append('<p class="payment-info__line-item payment-info__line-item--swimmer-mag-print">Print <i>SWIMMER</i> Magazine: <span class="payment-info__line-item--price"></span></p>');
    $(".payment-info__line-item--swimmer-mag-print .payment-info__line-item--price").text('$ ' + swimmerMagPrintVal + '.00');
}
var removeLineItemSwimmerMagPrint = function() {
    $(".payment-info__line-item--summary").find('.payment-info__line-item--swimmer-mag-print').remove();
}