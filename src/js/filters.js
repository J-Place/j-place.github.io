(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var toggle        = document.querySelector('.list-control-search-mobile__toggle');
    var content       = document.querySelector('.list-control-search__content');
    var filterSection = document.querySelector('.list-control-filter');
    var filterToggle  = document.querySelector('.toggle-filters');

    // ── Mobile search toggle ──────────────────────────────────────────────
    if (toggle && content) {
      toggle.addEventListener('click', function () {
        var opening = !content.classList.contains('is-flex');
        content.classList.toggle('is-flex', opening);
        toggle.classList.toggle('show-search', opening);
        // Show/hide entire filter section alongside search content
        if (filterSection) filterSection.style.display = opening ? 'block' : '';
        // Always collapse More Filters when toggling Results open/close
        if (filterSection) filterSection.classList.remove('show-filters');
        if (filterToggle) filterToggle.textContent = 'More Filters';
      });
    }

    // ── More Filters toggle ───────────────────────────────────────────────
    // data-desktop-filters="toggle" on .list-control-filter opts into desktop toggle;
    // default (no attribute) keeps filters always open on desktop (header hidden via CSS).
    if (filterSection && filterSection.dataset.desktopFilters === 'toggle') {
      filterSection.classList.add('filters--desktop-toggle');
    }

    if (filterToggle && filterSection) {
      filterToggle.addEventListener('click', function () {
        var isOpen = filterSection.classList.toggle('show-filters');
        filterToggle.textContent = isOpen ? 'Fewer Filters' : 'More Filters';
      });
    }

    // ── Checkbox tag pills ────────────────────────────────────────────────
    var checkboxes    = document.querySelectorAll('.list-control-filter__content input[type="checkbox"]');
    var tagsContainer = document.querySelector('.list-control-search--tags');

    function syncTags() {
      if (!tagsContainer) return;
      tagsContainer.innerHTML = '';
      checkboxes.forEach(function (cb) {
        if (!cb.checked) return;
        var label = cb.id ? document.querySelector('label[for="' + cb.id + '"]') : null;
        var labelText = label
          ? label.textContent.replace(/\s+/g, ' ').trim()
          : cb.value;
        var tag = document.createElement('span');
        tag.className = 'tag-list--item';
        tag.textContent = labelText;
        tag.dataset.filterValue = cb.value;
        tag.dataset.filterName  = cb.name;
        tagsContainer.appendChild(tag);
      });
    }

    checkboxes.forEach(function (cb) {
      cb.addEventListener('change', function () {
        syncTags();
        document.dispatchEvent(new CustomEvent('filtersChanged'));
      });
    });

    if (tagsContainer) {
      tagsContainer.addEventListener('click', function (e) {
        var tag = e.target.closest('.tag-list--item');
        if (!tag) return;
        checkboxes.forEach(function (cb) {
          if (cb.value === tag.dataset.filterValue && cb.name === tag.dataset.filterName) {
            cb.checked = false;
          }
        });
        syncTags();
        document.dispatchEvent(new CustomEvent('filtersChanged'));
      });
    }

    syncTags(); // initial sync
  });
})();
