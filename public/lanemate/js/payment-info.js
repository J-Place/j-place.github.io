console.log("load payment-info.js");

$("#registerButton").on( "click", function() {
    $(".help-block").toggleClass("has-error");
});

var showPaymentInfo = function() {
    $('.payment-info .card__content').show();
}
var hidePaymentInfo = function() {
    $('.payment-info .card__content').hide();
}


var enableSubmit = function() {
    $("#btnSubmitOrder").prop('disabled', false);
    $("#agreeTerms").prop('disabled', false);
}
var disableSubmit = function() {
    $("#btnSubmitOrder").prop('disabled', true);
    $("#agreeTerms").prop('disabled', true);
}