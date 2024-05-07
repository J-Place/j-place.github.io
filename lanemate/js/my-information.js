$(document).ready(function() {
    // hideInputsPublic();
    hideInputsPrivate();
    // inputMailTextUsms.show();
    // inputSwimmer.show();
    $(".form-group-display-value").show();
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
});

var setEnv = function() {
    if (env === 'usms') {
        console.log("environment is usms");
        $('.my-account__container').addClass('usms');
        $('.my-account__container').removeClass('lanemate');
    } else {
        console.log("environment is lanemate");
        $('.my-account__container').removeClass('usms');
        $('.my-account__container').addClass('lanemate');
    }
};

$('#showUsmsView').on('click', function() {
    if (env === 'lanemate') {
        $('#showLanemateView').toggleClass('btn-link-selected');
        $(this).toggleClass('btn-link-selected');
    }
    env = 'usms';
    setEnv();
});

$('#showLanemateView').on('click', function() {
    if (env === 'usms') {
        $('#showUsmsView').toggleClass('btn-link-selected');
        $(this).toggleClass('btn-link-selected');
    }
    //  else {
    //     $('#showUsmsView').toggleClass('btn-link-selected');
    //     $(this).toggleClass('btn-link-selected');
    // }
    env = 'lanemate';
    setEnv();
});

$("#showValidation").on('click', function() {
    // $(this).toggleClass('btn-link-selected');
    $('.help-block').toggleClass('has-error');
    $('.help-block + .form-control').toggleClass('has-error');
});

$("#editPrivateInfo").on( "click", function() {
    showInputsPrivate();
    toggleEditButtonsPrivate();
    $("#showValidation").show();
});
$("#cancelPrivateInfo").on( "click", function() {
    hideInputsPrivate();
    toggleEditButtonsPrivate();
    $("#showValidation").hide();
});
$("#confirmPrivateInfoModal").on( "click", function() {
    hideInputsPrivate();
    toggleEditButtonsPrivate();
    $("#showValidation").hide();
});


// var inputTextAreaPublic = $(".public-information .input-group textarea");
// var inputCheckboxPublic = $(".public-information .checkbox-label");
// var inputSelectPublic = $(".public-information .form-group select");
// var inputTextPublic = $(".public-information .form-group input[type=text]");

var inputTextAreaPrivate = $(".general-information .input-group textarea");
var inputCheckboxPrivate = $(".general-information .checkbox-group:not('mail-text') .checkbox-label");

// var labelMailTextUsms = $(".general-information .mail-text-usms .checkbox-label");
// var inputMailTextUsms = $(".general-information .mail-text-usms input[type=checkbox");

var labelSwimmer = $(".general-information .swimmer label");
var inputSwimmer = $(".general-information .swimmer select");

var inputSelectPrivate = $(".general-information .form-group select");
var inputTextPrivate = $(".general-information .form-group input[type=text]");


var toggleEditButtonsPrivate = function() {
    $("#editPrivateInfo").toggle();
    $("#savePrivateInfo").toggle();
    $("#cancelPrivateInfo").toggle();    
};

var hideInputsPrivate = function() {
    inputTextPrivate.hide();
    inputTextAreaPrivate.hide();
    // inputCheckboxPrivate.hide();
    inputSelectPrivate.hide();
    $('#SwimmerPrint').hide();
    $(".mail-text").addClass('disabled');
    // labelMailTextUsms.show();
    // inputMailTextUsms.prop("disabled", true);

    $('#sendMailUSMS').prop("disabled", true);
    $('#sendTextUSMS').prop("disabled", true);

    $('#sendMailLaneMate').prop("disabled", true);
    $('#sendTextLaneMate').prop("disabled", true);

    $('.interests .checkbox-label').hide();
    $('.interests-swimmer input[type=checkbox').prop("disabled", true);
    inputSelectPrivate.prop("disabled", true);
    $(".swimmer").addClass('disabled');
    labelSwimmer.show();
    inputSwimmer.prop("disabled", true);
    $(".general-information .form-group-display-value").show();
}

var showInputsPrivate = function(env) {
    inputTextPrivate.show();
    inputTextAreaPrivate.show();
    // inputCheckboxPrivate.show();
    inputSelectPrivate.show();
    $('#SwimmerPrint').show();
    $(".mail-text").removeClass('disabled');
    // labelMailTextUsms.show();
    // inputMailTextUsms.prop("disabled", false);

    $('#sendMailUSMS').prop("disabled", false);
    $('#sendTextUSMS').prop("disabled", false);

    $('#sendMailLaneMate').prop("disabled", false);
    $('#sendTextLaneMate').prop("disabled", false);

    $('.interests .checkbox-label').show();
    $('.interests-swimmer input[type=checkbox').prop("disabled", false);
    inputSelectPrivate.prop("disabled", false);
    $(".swimmer").removeClass('disabled');
    labelSwimmer.show();
    inputSwimmer.prop("disabled", false);
    $(".general-information .form-group-display-value").hide();
    
    setEnv(env);

    // if (env === 'usms') {
    //     alert("usms xxx");
    //     $('label[for=sendMailLaneMate]').hide();
    //     $('label[for=sendTextLaneMate]').hide();
    // } else if (env === 'lanemate') {
    //     alert("lanemate xxx");
    //     $('label[for=sendMailUSMS]').hide();
    //     $('label[for=sendTextUSMS]').hide();    
    // }
}



// var hideMastersInputs = function() {
//     $('#swimmerMagazine').hide();
//     $('#eventsThisYear').hide();
//     $('.club-lmsc').hide();
//     $('.coach-alts').hide();
//     $('#swimmerMagazine').hide();
//     // $('label[for=sendMailUSMS]').hide();
//     // $('label[for=sendTextUSMS]').hide();
// }



// var hideLaneMateInputs = function() {
//     // $('label[for=sendMailLaneMate]').hide();
//     // $('label[for=sendTextLaneMate]').hide();
// }