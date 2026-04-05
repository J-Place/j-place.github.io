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

    // More Filters toggle handled by filters.js
  });
})();
