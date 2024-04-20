$(document).ready(function() {
    // updateTotal();
    // getDonationValue();
    // console.log(videoVal);
    // console.log(donationVal);
});

$(document.body).on('change',function(){
    // updateTotal();
});




var updateTotal = function(){
    let addOnVideo = $(".payment-info__line-item--video-stroke-analysis");
    let addOnDonation = $(".payment-info__line-item--donation");

    if (addOnVideo.length === 1) {
        alert("Yes Video");
    } if (addOnDonation.length === 1) {
        alert("Yes Donation");
    }
};

// var updateTotal = function(){  
//     var video = $('payment-info__line-item--video-stroke-analysis').length;
//     var donation = $('payment-info__line-item--donation').length;
//     if (video) {
//         console.log("Video");
//     } if (donation) { 
//         console.log("Yes Donation");
//         getDonationValue();
//     } else {
//         console.log("Nadax");
//     }
// };

// var getDonationValue = function() {
//     var inputDonation = $("input[name='swimming-saves-lives']");
//     var donationVal = inputDonation.val();
//     console.log(donationVal);
// }

var updateTotalPayment = function(){
    var inputDonation = $("input[name='swimming-saves-lives']");
    var donationVal = inputDonation.val();
    var donationValNum = Number(donationVal);
    var videoValNum = Number(videoVal);
    // console.log(typeof donationVal);
    console.log(videoValNum + donationValNum);




    let addOnVideo = $(".payment-info__line-item--video-stroke-analysis");
    let addOnDonation = $(".payment-info__line-item--donation");
    if (addOnVideo.length === 1 && addOnDonation.length === 1) {
        // var totalSumVal = videoVal + donationVal;
        // console.log(totalSumVal);
        console.log(videoVal + donationVal);
        $(".payment-info__line-item--total .payment-info__line-item--price").text(videoValNum + donationValNum);
        $(".payment-info__line-item--total .payment-info__line-item--price").prepend('<span>$ </span>');
        $(".payment-info__line-item--total .payment-info__line-item--price").append('<span>.00</span>');
    } else if (addOnDonation.length === 1 && addOnVideo.length !== 1) {
        console.log(donationVal);
        $(".payment-info__line-item--total .payment-info__line-item--price").text(donationValNum);
        $(".payment-info__line-item--total .payment-info__line-item--price").prepend('<span>$ </span>');
        $(".payment-info__line-item--total .payment-info__line-item--price").append('<span>.00</span>');
    } else if (addOnVideo.length === 1 && addOnDonation.length !== 1) {
        console.log(videoVal);
        $(".payment-info__line-item--total .payment-info__line-item--price").text(videoValNum);
        $(".payment-info__line-item--total .payment-info__line-item--price").prepend('<span>$ </span>');
        $(".payment-info__line-item--total .payment-info__line-item--price").append('<span>.00</span>');
    } else if (addOnVideo.length === !1 && addOnDonation.length !== 1) {
        console.log(videoVal + donationVal);
        return;
    }

    
};