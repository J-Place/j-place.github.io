$(document).ready(function() {
    // hideInputsPublic();
    hideInputsPrivate();
    // inputMailTextUsms.show();
    // inputSwimmer.show();
    $(".form-group-display-value").show();
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
});

// env = 'lanemate';

var setEnv = function() {
    if (env === 'usms') {
        console.log("environment is usms");
        // $('.my-account__container').toggleClass('usms');
        // $('.my-account__container').toggleClass('lanemate');
    } else {
        console.log("environment is lanemate");
        $('.my-account__container').toggleClass('usms');
        $('.my-account__container').toggleClass('lanemate');
    }
};





// // Public
// $("#editPublicInfo").on( "click", function() {
//     showInputsPublic();
//     toggleEditButtonsPublic();
// });
// $("#cancelPublicInfo").on( "click", function() {
//     hideInputsPublic();
//     toggleEditButtonsPublic();
// });
// $("#confirmPublicInfoModal").on( "click", function() {
//     hideInputsPublic();
//     toggleEditButtonsPublic();
// });





// Private
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


// var toggleEditButtonsPublic = function() {
//     $("#editPublicInfo").toggle();
//     $("#savePublicInfo").toggle();
//     $("#cancelPublicInfo").toggle();    
// };

// var hideInputsPublic = function() {
//     inputTextAreaPublic.hide();
//     inputCheckboxPublic.hide();
//     inputSelectPublic.hide();
//     inputTextPublic.hide();
//     $(".public-information .form-group-display-value").show();
// }

// var showInputsPublic = function() {
//     inputTextAreaPublic.show();
//     inputCheckboxPublic.show();
//     inputSelectPublic.show();
//     inputTextPublic.show();
//     $(".public-information .form-group-display-value").hide();
// }


var toggleEditButtonsPrivate = function() {
    $("#editPrivateInfo").toggle();
    $("#savePrivateInfo").toggle();
    $("#cancelPrivateInfo").toggle();    
};

var hideInputsPrivate = function() {
    inputTextPrivate.hide();
    inputTextAreaPrivate.hide();
    // inputCheckboxPrivate.hide();
    // inputSelectPrivate.hide();
    $('#SwimmerPrint').hide();
    $(".mail-text").addClass('disabled');
    // labelMailTextUsms.show();
    // inputMailTextUsms.prop("disabled", true);
    $('#sendMailUSMS').prop("disabled", true);
    $('#sendTextUSMS').prop("disabled", true);
    $('.interests-swimmer input[type=checkbox').prop("disabled", true);
    $(".swimmer").addClass('disabled');
    labelSwimmer.show();
    inputSwimmer.prop("disabled", true);
    $(".general-information .form-group-display-value").show();
}

var showInputsPrivate = function(env) {
    inputTextPrivate.show();
    inputTextAreaPrivate.show();
    // inputCheckboxPrivate.show();
    // inputSelectPrivate.show();
    $('#SwimmerPrint').show();
    $(".mail-text").removeClass('disabled');
    // labelMailTextUsms.show();
    // inputMailTextUsms.prop("disabled", false);
    $('#sendMailUSMS').prop("disabled", false);
    $('#sendTextUSMS').prop("disabled", false);
    $('.interests-swimmer input[type=checkbox').prop("disabled", false);
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