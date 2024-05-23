$(document).ready(function() {
    $(".form-group.agree-terms").hide();
    enableEditButtons();
    $("#btnEnrollAutoRenew").prop('disabled', false);
    console.log($("#btnEnrollAutoRenew"));
});





var enableEditButtons = function() {
    $("#btnEnrollAutoRenew").prop('disabled', false);
    $("#btnEditCreditCard").prop('disabled', false);
    $("#btnCancelAutoRenew").prop('disabled', false);
}

var disableEditButtons = function() {
    $("#btnEnrollAutoRenew").prop('disabled', true);
    $("#btnEditCreditCard").prop('disabled', true);
    $("#btnCancelAutoRenew").prop('disabled', true);
}

var hideConfirmationMessages = function() {
    $(".enroll-auto-renew--confirmation").hide();
    $(".cancel-auto-renew--confirmation").hide();
    $(".payment-information--confirmation").hide();
}





// Manage Payment Method Edit Buttons

$("#btnEditCreditCard").on("click", function() {
    disableEditButtons();
    hideConfirmationMessages();
    $(".cancel-auto-renew--form").hide();
    $(".payment-information--form").show();
    $(".agree-terms").not(".agree-terms-auto-renew").show();
    $(".agree-terms-auto-renew").hide();
    $("#btnEnrollAutoRenewSubmit").hide();
    $("#btnEditCreditCardSubmit").show();
});

$("#btnEditCreditCardSubmit").on("click", function() {
    enableEditButtons();
    $(".payment-information--form").hide();
    $(".payment-information--confirmation").show();
});

$("#btnEditCreditCardCancel").on("click", function() {
    enableEditButtons();
    $(".payment-information--form").hide();
    $('.help-block').removeClass('has-error');
});








// Cancel Auto Renew

$("#btnCancelAutoRenew").on("click", function() {
    disableEditButtons();
    hideConfirmationMessages();
    $(".payment-information--form").hide();
    $(".cancel-auto-renew--form").show();
    $('.help-block').removeClass('has-error');
});

$("#btnYesCancelAutoRenew").on("click", function() {    
    enableEditButtons();
    hideConfirmationMessages();
    $("#btnEditCreditCard").prop('disabled', false);
    $("#btnCancelAutoRenew").prop('disabled', false);
    $(".payment-information--summary .card-number").hide();
    $(".payment-information--summary .card-expiration").hide();
    $(".payment-information--form").hide();
    $("#btnEnrollAutoRenew").show();
    $("#btnEditCreditCard").hide();
    $("#btnCancelAutoRenew").hide();
    $(".cancel-auto-renew--confirmation").show();
    $(".cancel-auto-renew--form").hide();
});

$("#btnNoKeepAutoRenew").on("click", function() {
    enableEditButtons();
    hideConfirmationMessages();
    $(".payment-information--form").hide();
    $(".cancel-auto-renew--form").hide();
});






// Enroll in Auto Renew

$("#btnEnrollAutoRenew").on( "click", function() {
    disableEditButtons();
    hideConfirmationMessages();
    $(".agree-terms").hide();
    $("#btnEditCreditCardSubmit").hide();
    $("#btnEnrollAutoRenewSubmit").show();
    $(".cancel-auto-renew--form").hide();
    $(".form-group.agree-terms-auto-renew").show();
    $(".payment-information--form").show();
});

$("#btnEnrollAutoRenewSubmit").on( "click", function() {
    enableEditButtons();
    hideConfirmationMessages();
    $("#btnEnrollAutoRenew").hide();
    $("#btnEditCreditCard").show();
    $("#btnCancelAutoRenew").show();
    $(".payment-information--summary .card-number").show();
    $(".payment-information--summary .card-expiration").show();
    $(".enroll-auto-renew--confirmation").show();
    $(".payment-information--form").hide();
    $(".agree-terms-auto-renew").hide();
});










$("#showValidation").on("click", function () {
    $('.help-block').toggleClass('has-error');
});







