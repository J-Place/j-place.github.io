var updateTotalPayment = function(){
    var inputDonation = $("input[name='swimming-saves-lives']");
    var donationVal = inputDonation.val();
    var donationNum = parseInt(donationVal);    
    var totalPaymentVal = usmsPlusVal + videoVal + coachAltsVal + donationNum;
    var totalPaymentNum = Number(totalPaymentVal);
    $(".payment-info__line-item--total .payment-info__line-item--price").text('$ ' + totalPaymentNum + '.00');
};