console.log("load product-tile-video-eligible.js");
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
        $(".product-option.product-option_video-stroke-analysis").removeClass('selected');
        removeVideoEligible();
    });
    $("#removeUsmsPlus").on('click', function() {
        console.log("NNNNNNNNNNNNN");
        $(".product-option_video-stroke-analysis-eligible").hide();
        $(".product-option_video-stroke-analysis").show();
        $("#addVideoStrokeAnalysisEligible").prop("disabled",false);
        $("#removeVideoStrokeAnalysisEligible").prop("disabled",false);
        // if (videoEligibleSelected.length === 1 ) {
        //     videoVal = 120;
        //     productCardTotal = productCardTotal - videoVal;
        // }
        productCardTotal = productCardTotal - videoEligibleVal;
        if (coachAltsSelected.length === 1 ) {
            // videoVal = 120;
            coachAltsVal = 30;
            productCardTotal = productCardTotal - coachAltsVal;
            console.log("TTTTTTTTTTTTTTT");
            console.log(productCardTotal);
        } else {
            console.log("SSSSSSSSSSSSSSSSSSS");
            console.log(productCardTotal);
        }
        removeVideoEligible();
        removeLineItemVideoEligible();
    });
});

var videoEligibleVal = 0;
var videoEligibleSelected =  $(".product-option_video-stroke-analysis-eligible.selected");

var addVideoEligible = function() {
    $(".product-option.product-option_video-stroke-analysis-eligible").addClass('selected');
    $("#addVideoStrokeAnalysisEligible").prop("disabled",true);
    $("#addVideoStrokeAnalysisEligible").hide();
    $("#removeVideoStrokeAnalysisEligible").show();
    videoEligibleVal = 0;
    productCardTotal = productCardTotal + videoEligibleVal;
    renderLineItemVideoEligible();
    updateProductCardTotal();
}

var removeVideoEligible = function() {
    $(".product-option.product-option_video-stroke-analysis-eligible").removeClass('selected');
    $("#strokeSelectEligible").val('Select a stroke').change();
    $("#addVideoStrokeAnalysisEligible").prop("disabled",true);
    $("#addVideoStrokeAnalysisEligible").show();
    $("#removeVideoStrokeAnalysisEligible").hide();
    videoEligibleVal = 0;
    productCardTotal = productCardTotal - videoEligibleVal;
    removeLineItemVideoEligible();
    updateProductCardTotal();
}

var renderLineItemVideoEligible = function() {
    removeLineItemVideoEligible();
    $(".payment-info__line-item--summary").append('<p class="payment-info__line-item payment-info__line-item--video-stroke-analysis-eligible">Video Stroke Analysis: <span class="payment-info__line-item--price"></span></p>');
    $(".payment-info__line-item--video-stroke-analysis-eligible .payment-info__line-item--price").text('$ ' + videoEligibleVal + '.00');
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