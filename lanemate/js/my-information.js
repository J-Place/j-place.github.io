$(document).ready(function() {
    hideInputsPublic();
    hideInputsPrivate();
    inputMailText.show();
    inputSwimmer.show();
    $(".form-group-display-value").show();
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
});

$("#editPublicInfo").on( "click", function() {
    showInputsPublic();
    toggleEditButtonsPublic();
});
$("#cancelPublicInfo").on( "click", function() {
    hideInputsPublic();
    toggleEditButtonsPublic();
});
$("#confirmPublicInfoModal").on( "click", function() {
    hideInputsPublic();
    toggleEditButtonsPublic();
});

$("#editPrivateInfo").on( "click", function() {
    showInputsPrivate();
    toggleEditButtonsPrivate();
});
$("#cancelPrivateInfo").on( "click", function() {
    hideInputsPrivate();
    toggleEditButtonsPrivate();
});
$("#confirmPrivateInfoModal").on( "click", function() {
    hideInputsPrivate();
    toggleEditButtonsPrivate();
});

var inputTextAreaPublic = $(".public-information .input-group textarea");
var inputCheckboxPublic = $(".public-information .checkbox-label");
var inputSelectPublic = $(".public-information .form-group select");
var inputTextPublic = $(".public-information .form-group input[type=text]");

var inputTextAreaPrivate = $(".private-information .input-group textarea");
var inputCheckboxPrivate = $(".private-information .checkbox-group:not('mail-text') .checkbox-label");

var labelMailText = $(".private-information .mail-text .checkbox-label");
var inputMailText = $(".private-information .mail-text input[type=checkbox");

var labelSwimmer = $(".private-information .swimmer .checkbox-label");
var inputSwimmer = $(".private-information .swimmer input[type=checkbox");

var inputSelectPrivate = $(".private-information .form-group select");
var inputTextPrivate = $(".private-information .form-group input[type=text]");

var toggleEditButtonsPublic = function() {
    $("#editPublicInfo").toggle();
    $("#savePublicInfo").toggle();
    $("#cancelPublicInfo").toggle();    
};

var toggleEditButtonsPrivate = function() {
    $("#editPrivateInfo").toggle();
    $("#savePrivateInfo").toggle();
    $("#cancelPrivateInfo").toggle();    
};

var hideInputsPublic = function() {
    inputTextAreaPublic.hide();
    inputCheckboxPublic.hide();
    inputSelectPublic.hide();
    inputTextPublic.hide();
    $(".public-information .form-group-display-value").show();
}

var showInputsPublic = function() {
    inputTextAreaPublic.show();
    inputCheckboxPublic.show();
    inputSelectPublic.show();
    inputTextPublic.show();
    $(".public-information .form-group-display-value").hide();
}

var hideInputsPrivate = function() {
    inputTextAreaPrivate.hide();
    inputCheckboxPrivate.hide();
    inputSelectPrivate.hide();
    inputTextPrivate.hide();
    $(".mail-text").addClass('disabled');
    labelMailText.show();
    inputMailText.prop("disabled", true);
    $(".swimmer").addClass('disabled');
    labelSwimmer.show();
    inputSwimmer.prop("disabled", true);
    $(".private-information .form-group-display-value").show();
}

var showInputsPrivate = function() {
    inputTextAreaPrivate.show();
    inputCheckboxPrivate.show();
    inputSelectPrivate.show();
    inputTextPrivate.show();
    $(".mail-text").removeClass('disabled');
    labelMailText.show();
    inputMailText.prop("disabled", false);
    $(".swimmer").removeClass('disabled');
    labelSwimmer.show();
    inputSwimmer.prop("disabled", false);
    $(".private-information .form-group-display-value").hide();
}