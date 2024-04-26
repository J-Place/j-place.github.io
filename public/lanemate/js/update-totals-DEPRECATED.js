$(document).ready(function() {
    console.log("load update-totals.js");
    var updateTotal = function(){  
        // alert("Update Total");
        var priceTextVideoStrokeAnalysis = $('payment-info__line-item--video-stroke-analysis').length;
        if (priceTextVideoStrokeAnalysis) {
            console.log("test 1");
        } else {
            console.log("test 2");
        }
    };
});