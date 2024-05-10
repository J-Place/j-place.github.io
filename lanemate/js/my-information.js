$(document).ready(function() {
    hideInputs();
    $(".form-group-display-value").show();
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
});

$("#editPrivateInfo").on( "click", function() {
    showInputs();
    toggleEditButtons();
    $("#showValidation").show();
});
$("#cancelPrivateInfo").on( "click", function() {
    hideInputs();
    toggleEditButtons();
    $("#showValidation").hide();
    $('.help-block').removeClass('has-error');
    $('.help-block + .form-control').removeClass('has-error');
});
$("#confirmPrivateInfoModal").on( "click", function() {
    hideInputs();
    toggleEditButtons();
    $("#showValidation").hide();
    $('.help-block').removeClass('has-error');
    $('.help-block + .form-control').removeClass('has-error');
});

var inputTextAreaPrivate = $(".my-account__container .input-group textarea");
var inputCheckboxPrivate = $(".my-account__container .checkbox-group:not('mail-text') .checkbox-label");
var labelSwimmer = $(".my-account__container .swimmer label");
var inputSwimmer = $(".my-account__container .swimmer select");
var inputSelectPrivate = $(".my-account__container .form-group select");
var inputTextPrivate = $(".my-account__container .form-group input[type=text]");

var toggleEditButtons = function() {
    $("#editPrivateInfo").toggle();
    $("#savePrivateInfo").toggle();
    $("#cancelPrivateInfo").toggle();    
};

var hideInputs = function() {
    inputTextPrivate.hide();
    inputTextAreaPrivate.hide();
    inputSelectPrivate.hide();
    $('#SwimmerPrint').hide();
    $(".mail-text").addClass('disabled');
    $('#sendMailUSMS').prop("disabled", true);
    $('#sendTextUSMS').prop("disabled", true);
    $('#sendMailLaneMate').prop("disabled", true);
    $('#sendTextLaneMate').prop("disabled", true);
    $('.interests .checkbox-label').hide();
    $('.fun-facts .checkbox-label').hide();
    $('.interests-swimmer input[type=checkbox').prop("disabled", true);
    inputSelectPrivate.prop("disabled", true);
    $(".swimmer").addClass('disabled');
    labelSwimmer.show();
    inputSwimmer.prop("disabled", true);
    $(".my-account__container .form-group-display-value").show();
}

var showInputs = function(env) {
    inputTextPrivate.show();
    inputTextAreaPrivate.show();
    inputSelectPrivate.show();
    $('#SwimmerPrint').show();
    $(".mail-text").removeClass('disabled');
    $('#sendMailUSMS').prop("disabled", false);
    $('#sendTextUSMS').prop("disabled", false);
    $('#sendMailLaneMate').prop("disabled", false);
    $('#sendTextLaneMate').prop("disabled", false);
    $('.interests .checkbox-label').show();
    $('.fun-facts .checkbox-label').show();
    $('.interests-swimmer input[type=checkbox').prop("disabled", false);
    inputSelectPrivate.prop("disabled", false);
    $(".swimmer").removeClass('disabled');
    labelSwimmer.show();
    inputSwimmer.prop("disabled", false);
    $(".my-account__container .form-group-display-value").hide();    
    setEnv(env);
}

// This is temporary fopr toggling between USMS and LaneMate in the mockups //////////////////////////
// Classes set here are only used in the mockups, no other css is dependent on these classes
var setEnv = function() {
    if (env === 'usms') {
        $('.my-account__container').addClass('usms');
        $('.my-account__container').removeClass('lanemate');
    } else {
        $('.my-account__container').removeClass('usms');
        $('.my-account__container').addClass('lanemate');
    }
};
// This is temporary fopr toggling between USMS and LaneMate in the mockups //////////////////////////
$('#showUsmsView').on('click', function() {
    if (env === 'lanemate') {
        $('#showLanemateView').toggleClass('btn-link-selected');
        $(this).toggleClass('btn-link-selected');
    }
    env = 'usms';
    setEnv();
});
// This is temporary fopr toggling between USMS and LaneMate in the mockups //////////////////////////
$('#showLanemateView').on('click', function() {
    if (env === 'usms') {
        $('#showUsmsView').toggleClass('btn-link-selected');
        $(this).toggleClass('btn-link-selected');
    }
    env = 'lanemate';
    setEnv();
});
// This is temporary fopr toggling between USMS and LaneMate in the mockups //////////////////////////
$("#showValidation").on('click', function() {
    $(this).toggleClass('btn-link-selected');
    $('.help-block').toggleClass('has-error');
    $('.help-block + .form-control').toggleClass('has-error');
});
///////////////////////////////////////////////////////////////////////////////////////////////
