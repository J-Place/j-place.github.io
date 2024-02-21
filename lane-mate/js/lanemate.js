// $("").removeClass("");
// $("").addClass("");

$("#confirmLaneMateMonthlyPlan").on( "click", function() {
    $(".current-plan__renewal-date").removeClass("current-plan--selected");
    $(".current-plan__renewal-date__lane-mate-monthly").addClass("current-plan--selected");
    $(".current-plan__summary").removeClass("current-plan--selected");
    $(".current-plan_lane-mate-monthly").addClass("current-plan--selected");
    $(".plan-option").removeClass("plan-option-selected");
    $(".plan-option_lane-mate-monthly").addClass("plan-option-selected");
});

$("#confirmLaneMateYearlyPlan").on( "click", function() {
    $(".current-plan__renewal-date").removeClass("current-plan--selected");
    $(".current-plan__renewal-date__lane-mate-yearly").addClass("current-plan--selected");
    $(".current-plan__summary").removeClass("current-plan--selected");
    $(".current-plan_lane-mate-yearly").addClass("current-plan--selected");
    $(".plan-option").removeClass("plan-option-selected");
    $(".plan-option_lane-mate-yearly").addClass("plan-option-selected");
});

$("#confirmUsmsYearlyPlan").on( "click", function() {
    $(".current-plan__renewal-date").removeClass("current-plan--selected");
    $(".current-plan__renewal-date__usms-yearly").addClass("current-plan--selected");
    $(".current-plan__summary").removeClass("current-plan--selected");
    $(".current-plan_usms-yearly").addClass("current-plan--selected");
    $(".plan-option").removeClass("plan-option-selected");
    $(".plan-option_usms-yearly").addClass("plan-option-selected");
});

$("#btnEditCreditCard").on("click", function() {
    $(".cancel-auto-renew--confirmation").hide();
    $(".cancel-auto-renew--form").hide();
    $(".payment-information--form").show();
});

$("#btnEditCreditCardSubmit").on("click", function() {
    $(".payment-information--form").hide();
});

$("#btnEditCreditCardCancel").on("click", function() {
    $(".payment-information--form").hide();
});



$("#btnCancelAutoRenew").on("click", function() {
    $(".cancel-auto-renew--confirmation").hide();
    $(".payment-information--form").hide();
    $(".cancel-auto-renew--form").show();
});

$("#btnYesCancelAutoRenew").on("click", function() {
    $(".payment-information--form").hide();
    $(".cancel-auto-renew--form").hide();
    $(".cancel-auto-renew--confirmation").show();
});

$("#btnNoKeepAutoRenew").on("click", function() {
    $(".payment-information--form").hide();
    $(".cancel-auto-renew--form").hide();
});