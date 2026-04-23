(function () {
  var MENU_DATA = {
    'menu-item-0': {
      title: 'Training',
      cta: { href: '/workout-library', img: 'https://www-usms-hhgdctfafngha6hr.z01.azurefd.net/-/media/usms/developers/images/megamenu/fittraincta-200x150.png?rev=dc95a7fc0d8348648260d6495466eb1e', label: 'Workout Library' },
      links: [
        { title: 'Workout Library', url: '/workout-library' },
        { title: 'Articles and Videos', url: '/fitness-and-training/articles-and-videos' },
        { title: 'Swimming 101', url: '/fitness-and-training/guides/swimming-101' },
        { title: 'Training Plans', url: '/fitness-and-training/six-week-swim-training-plans/six-week-swim-training-plan-information' },
        { title: 'Swimming Guides', url: '/fitness-and-training/guides' },
        { title: 'Video Stroke Analysis', url: '/fitness-and-training/usms-video-stroke-analysis' },
        { title: 'Club Finder', url: '/clubs' },
        { title: 'Workout Tracking', url: '/fitness-and-training/workout-tracking' },
        { title: 'SWIMMER Magazine', url: '/about/swimmer-magazine' }
      ]
    },
    'menu-item-1': {
      title: 'Events',
      cta: { href: '/events', img: 'https://www-usms-hhgdctfafngha6hr.z01.azurefd.net/-/media/usms/developers/images/megamenu/eventscta_2-200x150.jpg?rev=4c1890fbd1bb4c19be738fbeb3fd13d0', label: 'Calendar of Events' },
      links: [
        { title: 'Calendar of Events', url: '/events' },
        { title: 'Virtual and Fitness Events', url: '/events/fitness-events' },
        { title: '2026 Spring Nationals', url: '/events/national-championships/pool-national-championships/2026-pool-national-championships/2026-spring-national-championship' },
        { title: 'National Championships', url: '/events/national-championships' },
        { title: 'Results and Rankings', url: '/events/event-results-database' },
        { title: 'Records', url: '/events/usms-records' },
        { title: 'Eligibility Policy', url: '/volunteer-central/policy-and-governance/usms-policies/interim-eligibility-policy' }
      ]
    },
    'menu-item-4': {
      title: 'About Us',
      cta: { href: '/about/what-is-us-masters-swimming', img: 'https://www-usms-hhgdctfafngha6hr.z01.azurefd.net/-/media/usms/developers/images/megamenu/aboutcta-200x150.png?rev=d3379460971e4ab1946a4e2971b7d818', label: 'What is Masters Swimming?' },
      links: [
        { title: 'What is Masters Swimming?', url: '/about/what-is-us-masters-swimming' },
        { title: 'USMS Community', url: 'http://community.usms.org' },
        { title: 'Logo Merchandise', url: 'https://www.swimoutlet.com/ProductBrand.asp?Brand=1766&click=1668780' },
        { title: 'Membership Benefits', url: '/join-usms/membership-benefits' },
        { title: 'Open Water Central', url: '/open-water-central' },
        { title: 'Club Central', url: '/club-central' },
        { title: 'Coach Central', url: '/coach-central' },
        { title: 'Volunteer Central', url: '/volunteer-central' },
        { title: 'Adult Learn-to-Swim Central', url: '/alts-central' }
      ]
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    var nav     = document.querySelector('.mega-main-menu');
    var overlay = document.querySelector('.mega-menu-overlay');
    var items   = document.querySelectorAll('.mega-main-menu__items > li.has--children');

    if (!nav || !overlay || !items.length) return;

    var titleEl  = overlay.querySelector('.mega-menu-overlay__title strong');
    var listEl   = overlay.querySelector('.mega-menu-overlay__items');
    var imgLink  = overlay.querySelector('.mega-menu-overlay__image-container a');
    var imgEl    = overlay.querySelector('.mega-menu-overlay__image');
    var imgTitle = overlay.querySelector('.mega-menu-overlay__image-title');

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

    function setDevSelectPointerEvents(val) {
      var sel = document.querySelector('.login-status__select');
      if (sel) sel.style.pointerEvents = val;
    }

    function closeLogin() {
      var lw = document.querySelector('.mega-main-menu__actions-login--wrapper');
      var ll = document.querySelector('.login__list');
      if (lw) lw.classList.remove('login--active');
      if (ll) ll.classList.remove('login--shown');
      var lc = document.querySelector('.login__items-container');
      if (lc) lc.style.zIndex = '';
      setDevSelectPointerEvents('');
    }

    function populateOverlay(item) {
      var data = MENU_DATA[item.id];
      if (!data) return false;

      titleEl.textContent = data.title;
      listEl.innerHTML = data.links.map(function (l) {
        return '<li><a href="' + l.url + '">' + l.title + '</a></li>';
      }).join('');
      imgLink.href    = data.cta.href;
      imgEl.src       = data.cta.img;
      imgEl.alt       = data.cta.label;
      imgTitle.textContent = data.cta.label;

      return true;
    }

    function openMenu(item) {
      closeMenu();
      closeLogin();
      if (!populateOverlay(item)) return;
      item.classList.add('active');
      setOverlayTop();
      overlay.style.display = 'flex';
    }

    // Production closes on mouseleave from the items list. Because our overlay
    // is a DOM sibling (not a child of the ul like in the React version), we
    // use a short timer so mousing from a nav item into the overlay doesn't
    // flicker closed.
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
      cancelClose();
      closeMenu();
    }, { passive: true });

    // Login toggle
    var loginWrapper   = document.querySelector('.mega-main-menu__actions-login--wrapper');
    var loginList      = document.querySelector('.login__list');
    var loginContainer = document.querySelector('.login__items-container');

    if (loginWrapper && loginList) {
      var loginCloseTimer;
      function scheduleLoginClose() { loginCloseTimer = setTimeout(closeLogin, 150); }
      function cancelLoginClose()   { clearTimeout(loginCloseTimer); }

      loginWrapper.addEventListener('click', function (e) {
        if (loginWrapper.dataset.loggedIn !== 'true') return;
        e.stopPropagation();
        if (loginWrapper.classList.contains('login--active')) {
          closeLogin();
        } else {
          closeMenu();
          closeSearch();
          loginWrapper.classList.add('login--active');
          loginList.classList.add('login--shown');
          if (loginContainer) loginContainer.style.zIndex = '10000';
          setDevSelectPointerEvents('none');
        }
      });

      [loginWrapper, loginList, loginContainer].forEach(function (el) {
        if (!el) return;
        el.addEventListener('mouseenter', cancelLoginClose);
        el.addEventListener('mouseleave', scheduleLoginClose);
      });

      document.addEventListener('click', function (e) {
        if (!loginWrapper.contains(e.target) && !loginList.contains(e.target)) {
          closeLogin();
        }
      });
    }

    // Search toggle
    var searchWrapper = document.querySelector('.mega-main-menu__actions-search--wrapper');
    var searchForm    = document.querySelector('.mega-main-menu .search');

    function closeSearch() {
      if (!searchWrapper || !searchForm) return;
      searchWrapper.classList.remove('search--active');
      searchForm.style.opacity = '0';
      searchForm.style.zIndex  = '-1';
    }

    if (searchWrapper && searchForm) {
      searchWrapper.addEventListener('click', function () {
        var isActive = searchWrapper.classList.toggle('search--active');
        searchForm.style.opacity  = isActive ? '1' : '0';
        searchForm.style.zIndex   = isActive ? '1' : '-1';
        if (isActive) {
          closeLogin();
          var input = searchForm.querySelector('input[type="text"], .aa-Input');
          if (input) input.focus();
        } else {
          var form = searchForm.querySelector('form');
          if (form) form.reset();
        }
      });

      document.addEventListener('click', function (e) {
        if (!searchWrapper.contains(e.target) && !searchForm.contains(e.target)) {
          closeSearch();
        }
      });
    }

    // ── Mobile menu ────────────────────────────────────────────────────────────

    var mobileToggle = document.querySelector('.mega-main-menu__toggle-mobile');
    var mobileMenu   = document.querySelector('.mobile-menu');
    var mobileClose  = document.querySelector('.mobile-menu__toggle');

    if (mobileToggle && mobileMenu) {
      // Start in the slide-up (closed) position
      mobileMenu.style.transform = 'translateY(-100%)';

      function openMobileMenu() {
        closeMenu();
        closeLogin();
        closeSearch();
        mobileMenu.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
        mobileMenu.style.zIndex     = '100';
        mobileMenu.style.opacity    = '1';
        mobileMenu.style.transform  = 'translateY(0)';
        document.body.style.overflow = 'hidden';
      }

      function closeMobileMenu() {
        mobileMenu.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
        mobileMenu.style.opacity   = '0';
        mobileMenu.style.transform = 'translateY(-100%)';
        document.body.style.overflow = '';
        // Move behind other content once the slide-out finishes
        setTimeout(function () {
          if (parseFloat(mobileMenu.style.opacity) === 0) {
            mobileMenu.style.zIndex = '-1';
          }
        }, 300);
      }

      mobileToggle.addEventListener('click', openMobileMenu);
      if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);

      // Close on Escape
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.style.zIndex !== '-1') closeMobileMenu();
      });

      // ── Mobile submenu accordion ─────────────────────────────────────────────

      document.querySelectorAll('.mobile-menu-overlay__item-content').forEach(function (content) {
        var chevron   = content.querySelector('.fa-chevron-right');
        var container = content.nextElementSibling; // .mobile-menu-overlay__submenu-container

        // Items without submenus (no chevron) get no click handler
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
