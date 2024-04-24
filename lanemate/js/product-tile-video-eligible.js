$(document).ready(function() {
    $("#addVideoStrokeAnalysisEligible").on('click', function(updateProductCardTotal) {
        addVideoEligible(updateProductCardTotal);
    });
    $("#removeVideoStrokeAnalysisEligible").on('click', function(updateProductCardTotal) {
        removeVideoEligible(updateProductCardTotal);
    });
    $("#addUsmsPlus").on('click', function() {
        $(".product-option_video-stroke-analysis").hide();
        $(".product-option_video-stroke-analysis-eligible").show();
        $("#strokeSelectEligible").val('Select a stroke').change();
        $("#addVideoStrokeAnalysisEligible").prop("disabled",true);
        $("#removeVideoStrokeAnalysisEligible").prop("disabled",true);
    });
    $("#removeUsmsPlus").on('click', function() {
        $(".product-option_video-stroke-analysis-eligible").hide();
        $(".product-option_video-stroke-analysis").show();
        $("#addVideoStrokeAnalysisEligible").prop("disabled",false);
        $("#removeVideoStrokeAnalysisEligible").prop("disabled",false);
        // if (lineItemVideoEligible.length === 1) { removeLineItemVideoEligible(); }
        // removeVideoEligible();
        // removeLineItemVideo();
    });
});

// var videoVal = 120;

var addVideoEligible = function() {
    videoVal = 0;
    $(".product-option.product-option_video-stroke-analysis-eligible").addClass('selected');
    $("#addVideoStrokeAnalysisEligible").prop("disabled",true);
    $("#addVideoStrokeAnalysisEligible").hide();
    $("#removeVideoStrokeAnalysisEligible").show();
    console.log("XXXXXXXXXXXXXXX");
    renderLineItemVideoEligible();
    updateProductCardTotal();
}

var removeVideoEligible = function() {
    $(".product-option.product-option_video-stroke-analysis-eligible").removeClass('selected');
    $("#strokeSelectEligible").val('Select a stroke').change();
    $("#addVideoStrokeAnalysisEligible").prop("disabled",true);
    $("#addVideoStrokeAnalysisEligible").show();
    $("#removeVideoStrokeAnalysisEligible").hide();
    removeLineItemVideoEligible();
    updateProductCardTotal();
}

var renderLineItemVideoEligible = function() {
    removeLineItemVideoEligible();
    $(".payment-info__line-item--summary").append('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis-eligible">Video Stroke Analysis: <span class="payment-info__line-item--price"></span></p>');
    $(".payment-info__line-item--video-stroke-analysis-eligible .payment-info__line-item--price").text('$ ' + videoVal + '.00');
}
var removeLineItemVideoEligible = function() {
    $(".payment-info__line-item--summary").find('.payment-info__line-item--video-stroke-analysis-eligible').remove();
}

// Handle Stroke Select ////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document.body).on('change','#strokeSelectEligible',function(){
    var strokeSelectVal = $('#strokeSelectEligible').val();
    var strokeNotSelected = strokeSelectVal === 'Select a stroke';
    if (strokeNotSelected === false) {
        $("#addVideoStrokeAnalysisEligible").prop('disabled', false);
        $("#removeVideoStrokeAnalysisEligible").prop("disabled",false);
    } else {
        $("#addVideoStrokeAnalysisEligible").prop('disabled', true);
    }
});