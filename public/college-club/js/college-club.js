
// $("#menu-item-0").on( "click", function() {
//     // $(".mega-menu-overlay").hide();
//     $("#megaMenu0").toggle();
//     // $(".mega-main-menu__items > li").removeClass('active');
//     // $("#menu-item-0").addClass('active');
// });
// $("#menu-item-1").on( "click", function() {
//     // $(".mega-menu-overlay").hide();
//     $("#megaMenu1").toggle();
//     // $(".mega-main-menu__items > li").removeClass('active');
//     // $("#menu-item-1").addClass('active');
// });



$('.mega-main-menu__items li').click(function() {
    $(this).toggleClass("active");
    var target = $(this).data('target');
    // $('#' + target).slideToggle();
    $('#' + target).toggle();
    $('.mega-menu-overlay').not('#' + target).hide();
});

$(document).on('click', function(event) {
    $('.mega-main-menu__items li').removeClass("active");
    var target = $(event.target);
    // Check if the clicked element is not a menu item or dropdown
    if (!target.closest('.mega-main-menu__items li, .mega-menu-overlay').length) {
        $('.mega-menu-overlay').hide();
    }
});