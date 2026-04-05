(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.list-control-search-mobile__toggle');
    var content = document.querySelector('.list-control-search__content');

    if (toggle && content) {
      toggle.addEventListener('click', function () {
        var isVisible = content.style.display === 'block';
        content.style.display = isVisible ? '' : 'block';
        toggle.classList.toggle('show-search', !isVisible);
      });
    }

    // More Filters toggle
    var filterToggle = document.querySelector('.toggle-filters');
    var filterControl = document.querySelector('.list-control-filter');

    if (filterToggle && filterControl) {
      filterToggle.addEventListener('click', function () {
        filterControl.classList.toggle('show-filters');
      });
    }
  });
})();
