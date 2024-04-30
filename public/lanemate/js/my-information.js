$(document).ready(function() {
    hideInputsPublic();
    hideInputsPrivate();
});

$("#editPublicInfo").on( "click", function() {
    showInputsPublic();
    toggleEditButtonsPublic();
});

$("#editPrivateInfo").on( "click", function() {
    showInputsPrivate();
    toggleEditButtonsPrivate();
});

$("#cancelPublicInfo").on( "click", function() {
    hideInputsPublic();
    toggleEditButtonsPublic();
});

$("#cancelPrivateInfo").on( "click", function() {
    hideInputsPrivate();
    toggleEditButtonsPrivate();
});

$("#savePublicInfo").on( "click", function() {
    hideInputsPublic();
    toggleEditButtonsPublic();
});

$("#savePrivateInfo").on( "click", function() {
    hideInputsPrivate();
    toggleEditButtonsPrivate();
});

var inputTextAreaPublic = $(".public-information .input-group textarea");
var inputCheckboxPublic = $(".public-information .checkbox-label");
var inputSelectPublic = $(".public-information .form-group select");
var inputTextPublic = $(".public-information .form-group input[type=text]");

var inputTextAreaPrivate = $(".private-information .input-group textarea");
var inputCheckboxPrivate = $(".private-information .checkbox-label");
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
    $(".public-information .hide").show();
}

var showInputsPublic = function() {
    inputTextAreaPublic.show();
    inputCheckboxPublic.show();
    inputSelectPublic.show();
    inputTextPublic.show();
    $(".public-information .hide").hide();
}

var hideInputsPrivate = function() {
    inputTextAreaPrivate.hide();
    inputCheckboxPrivate.hide();
    inputSelectPrivate.hide();
    inputTextPrivate.hide();
    $(".private-information .hide").show();
}

var showInputsPrivate = function() {
    inputTextAreaPrivate.show();
    inputCheckboxPrivate.show();
    inputSelectPrivate.show();
    inputTextPrivate.show();
    $(".private-information .hide").hide();
}