$(document).ready(function () {

// let sortBtn = document.getElementsByClassName('btn-sort');

$(".btn-sort").on('click', function (event) {
    $('.selected').removeClass('selected');
    $target = $(event.target);
        if ($target.hasClass('selected')) {
            return;
        } else {
            $target.addClass('selected');
        }
    });
});