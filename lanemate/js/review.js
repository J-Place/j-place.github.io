var updateTotalPayment = function(){
    console.log("Update total payment");
    var inputDonation = $("input[name='swimming-saves-lives']");
    var donationVal = inputDonation.val();
    var donationNum = parseInt(donationVal);
    var totalPaymentVal = usmsPlusVal + videoVal + coachAltsVal + donationNum;
    var totalPaymentNum = Number(totalPaymentVal);
    if (totalPaymentNum === '0' || totalPaymentNum === '00' || totalPaymentNum === '0.00' || totalPaymentNum === '00.00' ) {
        $(".payment-info__line-item--total .payment-info__line-item--price").text('$ 00.00');
        console.log("Review static price");
    } else {
        $(".payment-info__line-item--total .payment-info__line-item--price").text('$ ' + totalPaymentNum + '.00');
        console.log("Review dynamic price");
    }
};