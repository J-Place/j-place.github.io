(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var nav = document.querySelector('.mega-main-menu');
    var overlay = document.querySelector('.mega-menu-overlay');
    var items = document.querySelectorAll('.mega-main-menu__items > li.has--children');

    if (!nav || !overlay || !items.length) return;

    var titleEl  = overlay.querySelector('.mega-menu-overlay__title strong');
    var listEl   = overlay.querySelector('.mega-menu-overlay__items');
    var imgLink  = overlay.querySelector('.mega-menu-overlay__image-container a');
    var imgEl    = overlay.querySelector('.mega-menu-overlay__image');
    var imgTitle = overlay.querySelector('.mega-menu-overlay__image-title');

    // Map menu-item ids to template ids
    var templateMap = {
      'menu-item-0': 'megamenu-training',
      'menu-item-1': 'megamenu-events',
      'menu-item-4': 'megamenu-about-us'
    };

    function setOverlayTop() {
      overlay.style.top = nav.offsetHeight + 'px';
    }

    function getActiveItem() {
      return document.querySelector('.mega-main-menu__items > li.active');
    }

    function closeMenu() {
      var active = getActiveItem();
      if (active) active.classList.remove('active');
      overlay.style.display = 'none';
    }

    function populateOverlay(item) {
      var templateId = templateMap[item.id];
      if (!templateId) return false;

      var tpl = document.getElementById(templateId);
      if (!tpl) return false;

      var ul = tpl.content.querySelector('ul');
      var cta = tpl.content.querySelector('a');

      titleEl.textContent = item.textContent.trim();
      listEl.innerHTML = ul.innerHTML;
      imgEl.src = cta.querySelector('img').src;
      imgEl.alt = cta.querySelector('img').alt;
      imgLink.href = cta.href;
      imgTitle.textContent = cta.querySelector('span').textContent;

      return true;
    }

    function openMenu(item) {
      closeMenu();
      if (!populateOverlay(item)) return;
      item.classList.add('active');
      setOverlayTop();
      overlay.style.display = 'flex';
    }

    items.forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.stopPropagation();
        if (item.classList.contains('active')) {
          closeMenu();
        } else {
          openMenu(item);
        }
      });
    });

    // Click outside closes — mirrors handleMenuLeave
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) closeMenu();
    });

    window.addEventListener('resize', function () {
      if (getActiveItem()) setOverlayTop();
    });
  });
})();
