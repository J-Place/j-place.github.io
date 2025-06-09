$(document).ready(function() {
    $('.article-carousel').each(function(index) {
        $(this).addClass('article-carousel-' + (index + 1));
    });
});