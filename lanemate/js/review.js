// $(document).ready(function() {
    // updateTotal();
    // getDonationValue();
    // console.log(videoVal);
    // console.log(donationVal);
// });

// $(document.body).on('change',function(){
    // updateTotal();
// });

var updateTotalPayment = function(){
    var inputDonation = $("input[name='swimming-saves-lives']");
    var donationVal = inputDonation.val();
    var donationValNum = Number(donationVal);
    var videoValNum = Number(videoVal);
    let addOnVideo = $(".payment-info__line-item--video-stroke-analysis");
    let addOnDonation = $(".payment-info__line-item--donation");
    var noVideoSelected = $("#addVideoStrokeAnalysis").prop('disabled');
    if (noVideoSelected && addOnDonation.length !== 1) {
        $(".payment-info__line-item--total .payment-info__line-item--price").text("$__.__");
    }
    else if (addOnVideo.length === !1 && addOnDonation.length !== 1) {
        $(".payment-info__line-item--total .payment-info__line-item--price").text("$__.__");
    } else if (addOnVideo.length === 1 && addOnDonation.length === 1) {
        console.log("No THIS?");
        $(".payment-info__line-item--total .payment-info__line-item--price").text(videoValNum + donationValNum);
        $(".payment-info__line-item--total .payment-info__line-item--price").prepend('<span>$ </span>');
        $(".payment-info__line-item--total .payment-info__line-item--price").append('<span>.00</span>');
    } else if (addOnDonation.length === 1 && addOnVideo.length !== 1) {
        console.log("Or THIS?");
        $(".payment-info__line-item--total .payment-info__line-item--price").text(donationValNum);
        $(".payment-info__line-item--total .payment-info__line-item--price").prepend('<span>$ </span>');
        $(".payment-info__line-item--total .payment-info__line-item--price").append('<span>.00</span>');
    } else if (addOnVideo.length === 1 && addOnDonation.length !== 1) {
        $(".payment-info__line-item--total .payment-info__line-item--price").text(videoValNum);
        $(".payment-info__line-item--total .payment-info__line-item--price").prepend('<span>$ </span>');
        $(".payment-info__line-item--total .payment-info__line-item--price").append('<span>.00</span>');
    }
};