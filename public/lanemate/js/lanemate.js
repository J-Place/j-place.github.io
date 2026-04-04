$(document).ready(function() {
    // $("#usmsModalPaymentFailed").modal('show');
    // $("body").addClass("modal-open");
});

$("#confirmPaymentFailedModal").on( "click", function() {
    $(".payment-information--form").show();
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#paymentInformationForm").offset().top
    }, 0);
});

$("#usmsModalPaymentFailed").on( "click", function() {
    $(".payment-information--form").show();
});

$("#confirmLaneMateMonthlyPlan").on( "click", function() {
    $(".current-plan__renewal-date").removeClass("current-plan--selected");
    $(".current-plan__renewal-date__lanemate-monthly").addClass("current-plan--selected");
    $(".current-plan__summary").removeClass("current-plan--selected");
    $(".current-plan_lanemate-monthly").addClass("current-plan--selected");
    $(".product-option").removeClass("product-option-selected");
    $(".product-option_lanemate-monthly").addClass("product-option-selected");
    // $(".product-option_usms-yearly .switch-plan-label a").text("Switch to this plan");
});

$("#confirmLaneMateYearlyPlan").on( "click", function() {
    $(".current-plan__renewal-date").removeClass("current-plan--selected");
    $(".current-plan__renewal-date__lanemate-yearly").addClass("current-plan--selected");
    $(".current-plan__summary").removeClass("current-plan--selected");
    $(".current-plan_lanemate-yearly").addClass("current-plan--selected");
    $(".product-option").removeClass("product-option-selected");
    $(".product-option_lanemate-yearly").addClass("product-option-selected");
    // $(".product-option_usms-yearly .switch-plan-label a").text("Contact Membership Services");
});

$("#confirmUsmsYearlyPlan").on( "click", function() {
    $(".current-plan__renewal-date").removeClass("current-plan--selected");
    $(".current-plan__renewal-date__usms-yearly").addClass("current-plan--selected");
    $(".current-plan__summary").removeClass("current-plan--selected");
    $(".current-plan_usms-yearly").addClass("current-plan--selected");
    $(".product-option").removeClass("product-option-selected");
    $(".product-option_usms-yearly").addClass("product-option-selected");
});

$("#btnEditCreditCard").on("click", function() {
    $(".cancel-auto-renew--confirmation").hide();
    $(".cancel-auto-renew--form").hide();
    $(".payment-information--confirmation").hide();
    $(".payment-information--form").show();
});

$("#btnEditCreditCardSubmit").on("click", function() {
    $(".payment-information--form").hide();
    $(".payment-information--confirmation").show();
});

$("#btnEditCreditCardCancel").on("click", function() {
    $(".payment-information--form").hide();
    $('.help-block').removeClass('has-error');
});

$("#btnCancelAutoRenew").on("click", function() {
    $(".payment-information--confirmation").hide();
    $(".cancel-auto-renew--confirmation").hide();
    $(".payment-information--form").hide();
    $(".cancel-auto-renew--form").show();
    $('.help-block').removeClass('has-error');
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
    if ($(".product-option_lanemate-monthly.product-option-selected").length) {
        $("#usmsModalMonthly").modal('show');
        $("body").addClass("modal-open");
    }
    if ($(".product-option_lanemate-yearly.product-option-selected").length) {
        $("#usmsModalYearly").modal('show');
        $("body").addClass("modal-open");
    }
});

$("#confirmMonthlyUpgrade").on("click", function () {
    $("#usmsModalMonthly").hide();
    $(".product-option").removeClass("product-option-selected");
    $("body").removeClass("modal-open");
});

$("#confirmYearlyUpgrade").on("click", function () {
    $("#usmsModalYearly").hide();
    $("body").removeClass("modal-open");
});

$("#showValidation").on("click", function () {
    $('.help-block').toggleClass('has-error');
});
