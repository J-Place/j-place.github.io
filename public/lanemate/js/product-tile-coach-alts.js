console.log("load product-tile-coach-alts.js");

$(document).ready(function() {
    $("#addCoachAlts").on('click', function(updateProductCardTotal) {
        addCoachAlts(updateProductCardTotal);
    });
    $("#removeCoachAlts").on('click', function(updateProductCardTotal) {
        removeCoachAlts(updateProductCardTotal);
    });
});

var coachAltsSelected = $(".product-option.product-option_coach-alts.selected");

coachAltsVal = 30;

var addCoachAlts = function() {
    $(".product-option.product-option_coach-alts").addClass('selected');
    $("#addCoachAlts").hide();
    $("#removeCoachAlts").show();
    coachAltsVal = 30;
    productCardTotal = productCardTotal + coachAltsVal;
    renderLineItemCoachAlts();
    updateProductCardTotal();
}
var removeCoachAlts = function() {
    $(".product-option.product-option_coach-alts").removeClass('selected');
    $("#addCoachAlts").show();
    $("#removeCoachAlts").hide();
    coachAltsVal = 30;
    productCardTotal = productCardTotal - coachAltsVal;
    removeLineItemCoachAlts();
    updateProductCardTotal();
}

var renderLineItemCoachAlts = function() {
    removeLineItemCoachAlts();
    $(".payment-info__line-item--summary").last().append('<p class="payment-info__line-item payment-info__line-item--coach-alts">Coach/ALTS Designation: <span class="payment-info__line-item--price"></span></p>');
    $(".payment-info__line-item--coach-alts .payment-info__line-item--price").text('$ ' + coachAltsVal + '.00');
}
var removeLineItemCoachAlts = function() {
    $(".payment-info__line-item--summary").find('.payment-info__line-item--coach-alts').remove();
}