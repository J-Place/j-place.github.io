(function () {
  var loaderEl   = document.querySelector('.loading');
  var submitBtn  = document.getElementById('listSearchSubmit');
  var rangeSelect = document.getElementById('search-filter__range');

  function withLoader() {
    if (loaderEl) loaderEl.style.display = 'flex';
    setTimeout(function () {
      if (loaderEl) loaderEl.style.display = 'none';
    }, 1000);
  }

  if (submitBtn)   submitBtn.addEventListener('click', withLoader);
  if (rangeSelect) rangeSelect.addEventListener('change', withLoader);
})();
