$(document).ready(function() {
    updateTotal();
    getDonationValue();
    console.log(videoVal);
    // console.log(donationVal);
});

var updateTotal = function(){  
    var video = $('payment-info__line-item--video-stroke-analysis').length;
    var donation = $('payment-info__line-item--donation').length;
    if (video) {
        console.log("Video");
    } if (donation) { 
        console.log("Yes Donation");
        getDonationValue();
    } else {
        console.log("Nadax");
    }
};

var getDonationValue = function() {
    var inputDonation = $("input[name='swimming-saves-lives']");
    var donationVal = inputDonation.val();
    console.log(donationVal);
}