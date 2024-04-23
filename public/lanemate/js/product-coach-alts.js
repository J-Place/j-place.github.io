$(document).ready(function(updateProductCardTotal) {
    $("#addCoachAlts").on('click', function() {
        addCoachAlts(updateProductCardTotal);
    });
    $("#removeCoachAlts").on('click', function() {
        removeCoachAlts(updateProductCardTotal);
    });
});

// var coachAltsVal = 0;

var addCoachAlts = function() {
    // coachAltsVal = 30;
    $(".product-option.product-option_coach-alts").addClass('selected');
    $("#addCoachAlts").hide();
    $("#removeCoachAlts").show();
    renderLineItemCoachAlts();
    updateProductCardTotal();
}
var removeCoachAlts = function() {
    coachAltsVal = 0;
    $(".product-option.product-option_coach-alts").removeClass('selected');
    $("#addCoachAlts").show();
    $("#removeCoachAlts").hide();
    removeLineItemCoachAlts();
    updateProductCardTotal();
}
var renderLineItemCoachAlts = function() {
    removeLineItemCoachAlts();
    $(".payment-info__line-item--summary").append('<p class="payment-info__line-item payment-info__line-item--coach-alts">Coach/ALTS Certification: <span class="payment-info__line-item--price"></span></p>');
    $(".payment-info__line-item--coach-alts .payment-info__line-item--price").text('$ ' + coachAltsVal + '.00');
}
var removeLineItemCoachAlts = function() {
    $(".payment-info__line-item--summary").find('.payment-info__line-item--coach-alts').remove();
}