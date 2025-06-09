// This is temporary fopr toggling between USMS and LaneMate in the mockups //////////////////////////
// Classes set here are only used in the mockups, no other css is dependent on these classes
var setEnv = function() {
    if (env === 'usms') {
        $('.my-usms--wrapper').addClass('usms');
        $('.my-usms--wrapper').removeClass('lanemate');
    } else {
        $('.my-usms--wrapper').removeClass('usms');
        $('.my-usms--wrapper').addClass('lanemate');
    }
};
env = 'usms';
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
