$(document).ready(function() {
    $("#addVideoStrokeAnalysisEligible").on('click', function() {
        addVideoEligible(updateProductCardTotal);
    });
    $("#removeVideoStrokeAnalysisEligible").on('click', function() {
        removeVideoEligible(updateProductCardTotal);
    });
});

// var videoVal = 120;

var addVideoEligible = function() {
    videoVal = 0;
    $(".product-option.product-option_video-stroke-analysis-eligible").addClass('selected');
    $("#addVideoStrokeAnalysisEligible").hide();
    $("#removeVideoStrokeAnalysisEligible").show();
    renderLineItemVideo();
    updateProductCardTotal();
}

var removeVideoEligible = function() {
    $(".product-option.product-option_video-stroke-analysis-eligible").removeClass('selected');
    $("#strokeSelectEligible").val('Select a stroke').change();
    $("#addVideoStrokeAnalysisEligible").prop("disabled",true);
    $("#addVideoStrokeAnalysisEligible").show();
    $("#removeVideoStrokeAnalysisEligible").hide();
    removeLineItemVideo();
    updateProductCardTotal();
}

var renderLineItemVideo = function() {
    removeLineItemVideo();
    $(".payment-info__line-item--summary").append('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis">Video Stroke Analysis: <span class="payment-info__line-item--price"></span></p>');
    $(".payment-info__line-item--video-stroke-analysis .payment-info__line-item--price").text('$ ' + videoVal + '.00');
}
var removeLineItemVideo = function() {
    $(".payment-info__line-item--summary").find('.payment-info__line-item--video-stroke-analysis').remove();
}

// Handle Stroke Select ////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document.body).on('change','#strokeSelectEligible',function(){
    var strokeSelectVal = $('#strokeSelectEligible').val();
    var strokeNotSelected = strokeSelectVal === 'Select a stroke';
    if (strokeNotSelected === false) {
        $("#addVideoStrokeAnalysisEligible").prop('disabled', false);
    } else {
        $("#addVideoStrokeAnalysisEligible").prop('disabled', true);
    }
});