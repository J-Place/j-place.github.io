
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
    var target = $(this).data('target');
    $('.mega-main-menu__items li').removeClass("active");
    $(this).addClass("active");
    $('body').addClass('no-scroll');
    $('.my-element').css('z-index', 100);
    $('#' + target).addClass("is-flex");
    // $('.mega-menu-overlay').not('#' + target).hide();
    $('.mega-menu-overlay').not('#' + target).removeClass('is-flex');
});

$(document).on('click', function(event) {    
    var target = $(event.target);
    // Check if the clicked element is not a menu item or dropdown
    if (!target.closest('.mega-main-menu__items li, .mega-menu-overlay').length) {
        $('.mega-menu-overlay').removeClass("is-flex");
        $('body').removeClass('no-scroll');
    }
});