console.log("load payment-info.js");

$("#registerButton").on( "click", function() {
    $(".help-block").toggleClass("has-error");
});

$("#btnSubmitOrder").on( "click", function() {
    validateProductOptions();    
});

var showPaymentInfo = function() {
    $('.payment-info .card__content').show();
}
var hidePaymentInfo = function() {
    $('.payment-info .card__content').hide();
}

const disclaimerUsmsPlus = document.getElementsByClassName('.agree-usmsplus-terms');
const disclaimerCompetition = document.getElementsByClassName('.agree-terms-competition');

var enableSubmit = function() {
    $("#btnSubmitOrder").prop('disabled', false);
    $("#agreeTerms").prop('disabled', false);
    $(".agree-terms").removeClass('disabled');
}
var disableSubmit = function() {
    $("#btnSubmitOrder").prop('disabled', true);
    $("#agreeTerms").prop('disabled', true);
    $(".agree-terms").addClass('disabled');
}

var validateProductOptions = function() {
    // $(".add-on-products");
    if (productCardTotal === 0 && donationVal == 0) {
        $(".add-on-products .help-block").toggleClass("has-error");
    }
}