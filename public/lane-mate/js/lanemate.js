
$("#confirmLaneMateMonthlyPlan").on( "click", function() {
    $(".current-plan__summary").removeClass("current-plan--selected");
    $(".current-plan_lane-mate-monthly").addClass("current-plan--selected");
    $(".plan-option").removeClass("plan-option-selected");
    $(".plan-option_lane-mate-monthly").addClass("plan-option-selected");
});

$("#confirmLaneMateYearlyPlan").on( "click", function() {
    $(".current-plan__summary").removeClass("current-plan--selected");
    $(".current-plan_lane-mate-yearly").addClass("current-plan--selected");
    $(".plan-option").removeClass("plan-option-selected");
    $(".plan-option_lane-mate-yearly").addClass("plan-option-selected");
});

$("#confirmUsmsYearlyPlan").on( "click", function() {
    $(".current-plan__summary").removeClass("current-plan--selected");
    $(".current-plan_usms-yearly").addClass("current-plan--selected");
    $(".plan-option").removeClass("plan-option-selected");
    $(".plan-option_usms-yearly").addClass("plan-option-selected");
});

$("#btnEditCreditCard").on("click", function() {
    // .payment-information--form
    // $("").removeClass("");
    // $("").addClass("");
    $(".payment-information--form").show();
});
$("#btnEditCreditCardSubmit").on("click", function() {
    $(".payment-information--form").hide();
});
$("#btnEditCreditCardCancel").on("click", function() {
    $(".payment-information--form").hide();
});