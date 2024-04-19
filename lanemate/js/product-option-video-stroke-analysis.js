$(document).ready(function() {
    $("#addVideoStrokeAnalysis").on('click', function() {
        $(".add-on-products .card__total--amount").text("$120.00");
        $("#addVideoStrokeAnalysis").hide();
        $("#removeVideoStrokeAnalysis").show();
        $(".payment-info__line-item--summary").prepend('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis">Video Stroke Analysis: <span class="payment-info__line-item--price">$120.00</span></p>');
        // console.log(videoVal);
    });
    $("#removeVideoStrokeAnalysis").on('click', function() {
        $("#strokeSelect").val('Select a stroke').change();
        $(".add-on-products .card__total--amount").text("$__.__");
        $("#addVideoStrokeAnalysis").prop("disabled",true);
        $("#addVideoStrokeAnalysis").show();
        $("#removeVideoStrokeAnalysis").hide();
        $(".payment-info__line-item--summary").find('.payment-info__line-item--video-stroke-analysis').remove();
    });
});

$(document.body).on('change','#strokeSelect',function(){
    var strokeSelectVal = $('#strokeSelect').val();
    var strokeNotSelected = strokeSelectVal === 'Select a stroke';
    if (strokeNotSelected === false) {
        $("#addVideoStrokeAnalysis").prop('disabled', false);
    } else {
        $("#addVideoStrokeAnalysis").prop('disabled', true);
    }
});

var videoVal = '120.00';

var updateTotalVideo = function() {  
    var priceTextVideoStrokeAnalysis = $('payment-info__line-item--video-stroke-analysis');
    if (!priceTextVideoStrokeAnalysis) {
        console.log("test 1 zzz");
    } else {
        console.log("test 2 zzz");
    }
};