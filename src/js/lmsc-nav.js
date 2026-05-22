(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var nav     = document.querySelector('.mega-main-menu');
    var overlay = document.querySelector('.mega-menu-overlay');
    var items   = document.querySelectorAll('.mega-main-menu__items > li.has--children');

    if (!nav) return;

    function setOverlayTop() {
      if (overlay) overlay.style.top = nav.offsetHeight + 'px';
    }

    function getActiveItem() {
      return document.querySelector('.mega-main-menu__items > li.active');
    }

    function closeMenu() {
      var active = getActiveItem();
      if (active) active.classList.remove('active');
      if (overlay) overlay.style.display = 'none';
    }

    function openMenu(item) {
      closeMenu();
      item.classList.add('active');
      setOverlayTop();
      if (overlay) overlay.style.display = 'flex';
    }

    if (overlay) {
      var closeTimer;
      function scheduleClose() { closeTimer = setTimeout(closeMenu, 150); }
      function cancelClose()   { clearTimeout(closeTimer); }

      var itemsList = nav.querySelector('.mega-main-menu__items');
      if (itemsList) {
        itemsList.addEventListener('mouseleave', scheduleClose);
        itemsList.addEventListener('mouseenter', cancelClose);
      }
      overlay.addEventListener('mouseenter', cancelClose);
      overlay.addEventListener('mouseleave', closeMenu);
    }

    items.forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.stopPropagation();
        item.classList.contains('active') ? closeMenu() : openMenu(item);
      });
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) closeMenu();
    });

    window.addEventListener('resize', function () {
      if (getActiveItem()) setOverlayTop();
    });

    window.addEventListener('scroll', function () {
      closeMenu();
    }, { passive: true });

    // Mobile menu
    var mobileToggle = document.querySelector('.mega-main-menu__toggle-mobile');
    var mobileMenu   = document.querySelector('.mobile-menu');
    var mobileClose  = document.querySelector('.mobile-menu__toggle');

    if (mobileToggle && mobileMenu) {
      mobileMenu.style.transform = 'translateY(-100%)';

      function openMobileMenu() {
        closeMenu();
        mobileMenu.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
        mobileMenu.style.zIndex     = '100';
        mobileMenu.style.opacity    = '1';
        mobileMenu.style.transform  = 'translateY(0)';
        document.body.style.overflow = 'hidden';
      }

      function closeMobileMenu() {
        mobileMenu.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
        mobileMenu.style.opacity    = '0';
        mobileMenu.style.transform  = 'translateY(-100%)';
        document.body.style.overflow = '';
        setTimeout(function () {
          if (parseFloat(mobileMenu.style.opacity) === 0) mobileMenu.style.zIndex = '-1';
        }, 300);
      }

      mobileToggle.addEventListener('click', openMobileMenu);
      if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.style.zIndex !== '-1') closeMobileMenu();
      });

      document.querySelectorAll('.mobile-menu-overlay__item-content').forEach(function (content) {
        var chevron   = content.querySelector('.fa-chevron-right');
        var container = content.nextElementSibling;
        if (!chevron || !container) return;

        content.addEventListener('click', function () {
          var isOpen = container.style.maxHeight && container.style.maxHeight !== '0px';
          if (isOpen) {
            container.style.maxHeight = '0px';
            chevron.classList.remove('fa--rotate');
          } else {
            container.style.maxHeight = container.scrollHeight + 'px';
            chevron.classList.add('fa--rotate');
          }
        });
      });
    }
  });
})();
