(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var btnGrid  = document.getElementById('buttonGrid');
    var btnList  = document.getElementById('buttonList');
    var listLarge = document.querySelector('.results-list-large');
    var listSmall = document.querySelector('.results-list-small');

    if (!btnGrid || !btnList || !listLarge || !listSmall) return;

    var spanGrid = btnGrid.closest('.toggle-grid');
    var spanList = btnList.closest('.toggle-list');

    function showGrid() {
      listLarge.style.display = 'block';
      listSmall.style.display = 'none';
      spanGrid.classList.add('active');
      spanList.classList.remove('active');
    }

    function showList() {
      listLarge.style.display = 'none';
      listSmall.style.display = 'block';
      spanList.classList.add('active');
      spanGrid.classList.remove('active');
    }

    btnGrid.addEventListener('click', showGrid);
    btnList.addEventListener('click', showList);
  });
})();
