$(document).ready(function() {

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
        getDonationValue();
        setDonationCardValue();
        updateDonationLineItem();
    });

});

// var setInputValue = function() {
//     var btnValue = $(this).val();
//     $("input[name='swimming-saves-lives']").val(btnValue);
// }

var getDonationValue = function() {
    var inputDonation = $("input[name='swimming-saves-lives']");
    var donationVal = inputDonation.val();
    console.log(donationVal);
}

var setDonationCardValue = function() {
    $('.total-donations.card__total--amount').text($('[name=swimming-saves-lives]').val());
    $('.total-donations.card__total--amount').prepend('<span>$ </span>');
}

var updateDonationLineItem = function() {
    $(".payment-info__line-item--summary").find('.payment-info__line-item--donation').remove();
    $(".payment-info__line-item--summary").append('<p class="payment-info__line-item payment-info__line-item--donation">Donation Total: <span class="payment-info__line-item--price"></span></p>');
    $('.payment-info__line-item--donation .payment-info__line-item--price').text($('[name=swimming-saves-lives]').val());
    $('.payment-info__line-item--donation .payment-info__line-item--price').prepend('<span>$ </span>');
}

var formatCurrency = function(number) {
    if(number == "") return;
    number = parseFloat(number).toFixed(2);
    var n = number.split('').reverse().join("");
    console.log(n);
    var n2 = n.replace(/\d\d\d(?!$)/g, "$&,");    
    return '$' + n2.split('').reverse().join('');
}

// function formatCurrency(number){
//     if(number == "") return;
//     number = parseFloat(number).toFixed(2);
//     var n = number.split('').reverse().join("");
//     console.log(n);
//     var n2 = n.replace(/\d\d\d(?!$)/g, "$&,");    
//     return '$' + n2.split('').reverse().join('');
// }

$(document.body).on('change',function(){
    

//     var strokeSelectVal = $('#strokeSelect').val();
//     // console.log(strokeSelectVal);
//     var strokeNotSelected = strokeSelectVal === 'Select a stroke';
//     if (strokeNotSelected === false) {
//         // alert("One");
//         $("#addVideoStrokeAnalysis").prop('disabled', false);
//     } else {
//         $("#addVideoStrokeAnalysis").prop('disabled', true);
//         // alert("Two");
//     }
//     updateDonationPaymentTotal();
});

var updateDonationPaymentTotal = function(){
    var priceTextDonations = $('.payment-info__line-item.payment-info__line-item--donation');
    if (priceTextDonations.length === 1) {
        console.log("test 1 xxx");
    } else {
        console.log("test 3 xxx");
    }
};