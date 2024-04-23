$(document).ready(function() {
    $("#addVideoStrokeAnalysis").on('click', function() {
        addVideo(updateProductCardTotal);
    });
    $("#removeVideoStrokeAnalysis").on('click', function() {
        removeVideo(updateProductCardTotal);
    });
});

// var videoVal = 120;

var addVideo = function() {
    videoVal = 120;
    $(".product-option.product-option_video-stroke-analysis").addClass('selected');
    $("#addVideoStrokeAnalysis").hide();
    $("#removeVideoStrokeAnalysis").show();
    renderLineItemVideo();
    updateProductCardTotal();
}

var removeVideo = function() {
    // videoVal = 0;
    $(".product-option.product-option_video-stroke-analysis").removeClass('selected');
    $("#strokeSelect").val('Select a stroke').change();
    $("#addVideoStrokeAnalysis").prop("disabled",true);
    $("#addVideoStrokeAnalysis").show();
    $("#removeVideoStrokeAnalysis").hide();
    removeLineItemVideo();
    updateProductCardTotal();
}

var renderLineItemVideo = function() {
    removeLineItemVideo();
    $(".payment-info__line-item--summary").append('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis xxx">Video Stroke Analysis: <span class="payment-info__line-item--price"></span></p>');
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