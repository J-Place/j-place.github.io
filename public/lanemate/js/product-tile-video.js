console.log("load product-tile-video.js");
$(document).ready(function() {
    $("#addVideoStrokeAnalysis").on('click', function(updateProductCardTotal) {
        addVideo(updateProductCardTotal);
    });
    $("#removeVideoStrokeAnalysis").on('click', function(updateProductCardTotal) {
        removeVideo(updateProductCardTotal);
    });
});

// var videoVal = 120;

var addVideo = function() {
    $(".product-option.product-option_video-stroke-analysis").addClass('selected');
    $("#addVideoStrokeAnalysis").hide();
    $("#removeVideoStrokeAnalysis").show();
    videoVal = 120;
    productCardTotal = productCardTotal + videoVal;
    renderLineItemVideo();
    updateProductCardTotal();
}

var removeVideo = function() {
    $(".product-option.product-option_video-stroke-analysis").removeClass('selected');
    $("#strokeSelect").val('Select a stroke').change();
    $("#addVideoStrokeAnalysis").prop("disabled",true);
    $("#addVideoStrokeAnalysis").show();
    $("#removeVideoStrokeAnalysis").hide();
    videoVal = 120;
    productCardTotal = productCardTotal - videoVal;
    removeLineItemVideo();
    updateProductCardTotal();
}

var renderLineItemVideo = function() {
    removeLineItemVideo();
    // videoVal = 120;
    console.log("render Video line item");
    // var inputDonation = $("input[name='swimming-saves-lives']");
    // var lineItemCoachAlts = $('.payment-info__line-item--coach-alts');
    // var donationVal = inputDonation.val();
    // var donationNum = parseInt(donationVal);
    // if (lineItemCoachAlts.length === 1 ) {
    //     $(".payment-info__line-item--summary").find('.payment-info__line-item--coach-alts').prepend('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis">Video Stroke Analysis: <span class="payment-info__line-item--price"></span></p>');
    // } else if (donationNum == 0 ) {
    //     $(".payment-info__line-item--summary").first().append('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis">Video Stroke Analysis: <span class="payment-info__line-item--price"></span></p>');
    // } else {
    //     $(".payment-info__line-item--summary").find('.payment-info__line-item--donation').prepend('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis">Video Stroke Analysis: <span class="payment-info__line-item--price"></span></p>');
    // }
    // $(".payment-info__line-item--summary").first().append('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis">Video Stroke Analysis: <span class="payment-info__line-item--price"></span></p>');
    $(".payment-info__line-item--summary").last().append('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis">Video Stroke Analysis: <span class="payment-info__line-item--price"></span></p>');
    $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text('$ ' + videoVal + '.00');
}

var removeLineItemVideo = function() {
    $(".payment-info__line-item--summary").find('.payment-info__line-item--video-stroke-analysis').remove();
}

// Handle Stroke Select ////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document.body).on('change','#strokeSelect',function(){
    var strokeSelectVal = $('#strokeSelect').val();
    var strokeNotSelected = strokeSelectVal === 'Select a stroke';
    if (strokeNotSelected === false) {
        $("#addVideoStrokeAnalysis").prop('disabled', false);
    } else {
        $("#addVideoStrokeAnalysis").prop('disabled', true);
    }
});