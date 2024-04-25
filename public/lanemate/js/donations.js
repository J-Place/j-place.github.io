$(document).ready(function() {
    // Handle Button Values //////////////////////////////////////////////////////////////
    $(".btn-donate--1").on('click', function() {
        $("input[name='swimming-saves-lives']").val("30.00");
    });
    $(".btn-donate--2").on('click', function() {
        $("input[name='swimming-saves-lives']").val("60.00");
    });
    $(".btn-donate--3").on('click', function() {
        $("input[name='swimming-saves-lives']").val("120.00");
    });
    $(".btn-donate--4").on('click', function() {
        $("input[name='swimming-saves-lives']").val("240.00");
    });
    $(".btn-donate").on('click', function() {
        updateDonationCardValue();
        updateLineItemDonation();
        updateTotalPayment();
    });
    // Handle Input Values //////////////////////////////////////////////////////////////
    $("#swimmingSavesLivesInput").keyup(function(e) {
        if (e.which == 13) // Enter key
            $(this).blur();
    });
    $('#swimmingSavesLivesInput').on('blur', function() {
        var value = $(this).val(parseFloat($(this).val()).toFixed(2));
        if ($(this).val() == 0 ) {
            removeLineItemDonation();
            updateDonationCardValue(value);
            updateTotalPayment(value);
        } else { 
            updateDonationCardValue(value);
            updateLineItemDonation(value);
            updateTotalPayment(value);
        }
    });
});
var inputDonation = $("input[name='swimming-saves-lives']");
var donationVal = inputDonation.val();
var donationNum = parseInt(donationVal);
var updateDonationCardValue = function() {
    $('.total-donations.card__total--amount').text($('[name=swimming-saves-lives]').val());
    $('.total-donations.card__total--amount').prepend('<span>$ </span>');
}
var updateLineItemDonation = function() {
    removeLineItemDonation();
    $(".payment-info__line-item--summary").find('.payment-info__line-item--donation').remove();
    $(".payment-info__line-item--summary").append('<p class="payment-info__line-item payment-info__line-item--donation">Donation Total: <span class="payment-info__line-item--price"></span></p>');
    $('.payment-info__line-item--donation .payment-info__line-item--price').text($('[name=swimming-saves-lives]').val());
    $('.payment-info__line-item--donation .payment-info__line-item--price').prepend('<span>$ </span>');
}
var removeLineItemDonation = function() {
    // $(".total-donations.card__total--amount").find('.payment-info__line-item--donation').remove();
    $(".payment-info__line-item--summary").find('.payment-info__line-item--donation').remove();
}