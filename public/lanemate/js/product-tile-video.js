console.log("load product-tile-video.js");

$(document).ready(function() {
    $("#addVideoStrokeAnalysis").on('click', function(updateProductCardTotal) {
        addVideo(updateProductCardTotal);
    });
    $("#removeVideoStrokeAnalysis").on('click', function(updateProductCardTotal) {
        removeVideo(updateProductCardTotal);
    });

    $("#addUsmsPlus").on('click', function() {
    //     $(".product-option_video-stroke-analysis").hide();
    //     $(".product-option_video-stroke-analysis-eligible").show();
    //     $("#strokeSelectEligible").val('Select a stroke').change();
    //     $("#addVideoStrokeAnalysisEligible").prop("disabled",true);
    //     $("#removeVideoStrokeAnalysisEligible").prop("disabled",true);
    //     $(".product-option.product-option_video-stroke-analysis").removeClass('selected');
    //     // removeVideo();
        removeLineItemVideo();
    });

    $("#removeUsmsPlus").on('click', function() {
        $(".product-option_video-stroke-analysis-eligible").hide();
        $(".product-option_video-stroke-analysis").show();
        $("#addVideoStrokeAnalysisEligible").prop("disabled",false);
        $("#removeVideoStrokeAnalysisEligible").prop("disabled",false);
        $("#addVideoStrokeAnalysis").show();
        $("#removeVideoStrokeAnalysis").hide();
        $("#strokeSelect").val('Select a stroke').change();
        removeVideoEligible();
        removeLineItemVideo();
        removeLineItemVideoEligible();
    });

});

var addVideo = function() {
    $(".product-option.product-option_video-stroke-analysis").addClass('selected');
    $("#addVideoStrokeAnalysis").hide();
    $("#removeVideoStrokeAnalysis").show();
    if (usmsPlusSelected.length === 0 && videoSelected.length === 0 ) {
        videoVal = 110;
    } 
    else if (usmsPlusSelected.length === 0 && videoSelected.length === 1) {
        videoVal = 0;
    }
    productCardTotal = productCardTotal + videoVal;
    renderLineItemVideo();
    updateProductCardTotal();
}

var removeVideo = function() {
    var usmsPlusSelected = $(".product-option_usms-plus.selected");
    $(".product-option.product-option_video-stroke-analysis").removeClass('selected');
    $("#strokeSelect").val('Select a stroke').change();
    $("#addVideoStrokeAnalysis").prop("disabled",true);
    $("#addVideoStrokeAnalysis").show();
    $("#removeVideoStrokeAnalysis").hide();
    productCardTotal = productCardTotal - videoVal;
    if (usmsPlusSelected.length === 1) {
        videoVal = 110;
    } 
    removeLineItemVideo();
    updateProductCardTotal();
}

var renderLineItemVideo = function() {
    removeLineItemVideo();
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