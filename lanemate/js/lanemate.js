$("#confirmLaneMateMonthlyPlan").on( "click", function() {
    $(".current-plan__renewal-date").removeClass("current-plan--selected");
    $(".current-plan__renewal-date__lanemate-monthly").addClass("current-plan--selected");
    $(".current-plan__summary").removeClass("current-plan--selected");
    $(".current-plan_lanemate-monthly").addClass("current-plan--selected");
    $(".plan-option").removeClass("plan-option-selected");
    $(".plan-option_lanemate-monthly").addClass("plan-option-selected");
    // $(".plan-option_usms-yearly .switch-plan-label a").text("Switch to this plan");
});

$("#confirmLaneMateYearlyPlan").on( "click", function() {
    $(".current-plan__renewal-date").removeClass("current-plan--selected");
    $(".current-plan__renewal-date__lanemate-yearly").addClass("current-plan--selected");
    $(".current-plan__summary").removeClass("current-plan--selected");
    $(".current-plan_lanemate-yearly").addClass("current-plan--selected");
    $(".plan-option").removeClass("plan-option-selected");
    $(".plan-option_lanemate-yearly").addClass("plan-option-selected");
    // $(".plan-option_usms-yearly .switch-plan-label a").text("Contact Membership Services");
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

// $("#btnEditCreditCardSubmit").on("click", function() {
//     $(".payment-information--form").hide();
// });

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

$(".usms-modal-link").on("click", function() { 
    
    // var planMonthly = $(".plan-option_lanemate-monthly.plan-option-selected");
    // var planYearly = $(".plan-option_lanemate-yearly.plan-option-selected");
    // if (planMonthly) { 
    //     $(".usmsModalMonthly").show();
    // } if (planYearly) {
    //     $(".usmsModalYearly").show();
    // }
    if ($(".plan-option_lanemate-monthly.plan-option-selected").length) {
        $("#usmsModalMonthly").show();
        $("body").addClass("modal-open");
    }
    if ($(".plan-option_lanemate-yearly.plan-option-selected").length) {
        $("#usmsModalYearly").show();
        $("body").addClass("modal-open");
    }
});

$("#confirmMonthlyUpgrade").on("click", function () {
    $("#usmsModalMonthly").hide();
    $(".plan-option").removeClass("plan-option-selected");
    $(".plan-option_usms-yearly").addClass("plan-option-selected");
    $("body").removeClass("modal-open");
});

$("#confirmYearlyUpgrade").on("click", function () {
    $("#usmsModalYearly").hide();
    $(".plan-option").removeClass("plan-option-selected");
    $(".plan-option_usms-yearly").addClass("plan-option-selected");
    $("body").removeClass("modal-open");
});

$("#btnEditCreditCardSubmit").on("click", function () {
    // document.querySelectorAll('.help-block').classList.add('has-error');
    $('.help-block').addClass('has-error');
});
