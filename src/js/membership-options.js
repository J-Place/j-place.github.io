document.addEventListener('DOMContentLoaded', function () {
  var container = document.querySelector('.membership-length--container');

  function selectMembershipTier(tile) {
    document.querySelectorAll('.membership-length--option').forEach(function (t) {
      t.classList.remove('selected');
    });
    tile.classList.add('selected');
    if (container) container.classList.add('selection-made');
    document.dispatchEvent(new CustomEvent('membershipTierSelected', {
      detail: { tile: tile }
    }));
  }

  document.querySelectorAll('.membership-length--option').forEach(function (tile) {
    tile.addEventListener('click', function (e) {
      if (e.target.nodeName === 'INPUT' || e.target.nodeName === 'LABEL') return;
      if (tile.hasAttribute('disabled')) return;
      if (tile.classList.contains('selected')) return;
      selectMembershipTier(tile);
    });

    var radio = tile.querySelector('input[type="radio"]');
    if (radio) {
      radio.addEventListener('change', function () {
        if (tile.hasAttribute('disabled')) return;
        if (tile.classList.contains('selected')) return;
        selectMembershipTier(tile);
      });
    }
  });
});
