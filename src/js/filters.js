(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var filterToggle = document.querySelector('.toggle-filters');
    var filterControl = document.querySelector('.list-control-filter');

    if (filterToggle && filterControl) {
      filterToggle.addEventListener('click', function () {
        filterControl.classList.toggle('show-filters');
      });
    }
  });
})();
