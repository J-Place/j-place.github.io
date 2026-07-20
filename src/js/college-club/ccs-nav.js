/* College Club Swimming — nav interaction and scroll-hide behavior */

function setSearchSubmenuWidth() {
    const logo = document.querySelector('.ccs-logo');
    const mainNav = document.querySelector('nav.main');
    const adminNav = document.querySelector('nav.admin');
    const searchSubmenu = document.getElementById('submenuSearch');
    const searchTypeAhead = document.querySelector('.aa-Panel');
    let containerWidth = 0;

    if (!logo || !mainNav || !adminNav || !searchSubmenu) return;

    if (window.innerWidth >= 1200) {
        containerWidth = 1100;
    } if (window.innerWidth >= 1400) {
        containerWidth = 1200;
    } if (window.innerWidth >= 1600) {
        containerWidth = 1400;
    }
    const meganavElementsWidth = logo.offsetWidth + mainNav.offsetWidth + adminNav.offsetWidth;
    const availableWidth = containerWidth - meganavElementsWidth;
    if (window.innerWidth >= 1200) {
        searchSubmenu.style.width = `${availableWidth}px`;
        if (searchTypeAhead) searchTypeAhead.style.width = `${availableWidth}px`;
    } else {
        searchSubmenu.style.width = '100%';
        if (searchTypeAhead) searchTypeAhead.style.width = '100%';
    }
}

window.addEventListener('DOMContentLoaded', setSearchSubmenuWidth);
window.addEventListener('resize', setSearchSubmenuWidth);

document.addEventListener('DOMContentLoaded', function () {
    const mobileNavBtn = document.getElementById('mobileNavBtn');
    const mobileMenuMain = document.getElementById('mobileNavMain');
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const searchSubmitBtn = document.getElementById("searchSubmit");
    const searchMenu = document.getElementById("submenuSearch");
    const adminNavBtn = document.getElementById('adminNavBtn');
    const adminMenu = document.getElementById('submenuAdmin');
    const typeaheadPanel = document.querySelector('.aa-Panel');

    function closeMainNav() {
        document.querySelectorAll('.menu > li > button').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
        document.querySelectorAll('.menu > li > button').forEach(btn => btn.blur());
        document.querySelectorAll('.submenu').forEach(menu => menu.setAttribute('aria-hidden', 'true'));
    }

    function closeMainNavMobile() {
        if (mobileNavBtn) mobileNavBtn.classList.remove('open');
        if (mobileMenuMain) mobileMenuMain.classList.remove('open');
        closeSubNavMobile();
    }

    function closeSubNavMobile() {
        document.querySelectorAll('.menu > li > button').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
        document.querySelectorAll('.submenu').forEach(menu => menu.setAttribute('aria-hidden', 'true'));
        if (mobileMenuMain) {
            const buttons = mobileMenuMain.getElementsByTagName('button');
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].className = '';
            }
        }
    }

    function clickMainNavMobile() {
        if (!mobileMenuMain || !mobileNavBtn) return;
        if (mobileMenuMain.classList.contains("open")) {
            closeSubNavMobile();
            mobileMenuMain.classList.remove('open');
            mobileNavBtn.classList.remove('open');
        } else {
            mobileMenuMain.classList.add('open');
            mobileNavBtn.classList.add('open');
        }
    }

    function openSearch() {
        if (searchBtn) searchBtn.classList.add('open');
        if (searchMenu) searchMenu.classList.toggle('open');
    }

    function closeSearch() {
        if (searchBtn) searchBtn.classList.remove('open');
        if (searchMenu) searchMenu.classList.remove('open');
        if (searchInput) searchInput.blur();
    }

    function openAdmin() {
        if (adminNavBtn) adminNavBtn.classList.toggle("open");
        if (adminMenu) adminMenu.classList.toggle("open");
    }

    function closeAdmin() {
        if (adminNavBtn) adminNavBtn.classList.remove("open");
        if (adminMenu) adminMenu.classList.remove("open");
    }

    function showTypeahead() {
        if (typeaheadPanel) typeaheadPanel.classList.add('open');
    }

    function hideTypeahead() {
        if (typeaheadPanel) typeaheadPanel.classList.remove('open');
    }

    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            searchInput.placeholder = '';
        });
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'N') {
                showTypeahead();
            } else {
                hideTypeahead();
            }
        });
        searchInput.addEventListener('blur', () => {
            searchInput.value = '';
            hideTypeahead();
            setTimeout(() => {
                searchInput.placeholder = 'Enter search term';
            }, 1000);
        });
    }

    document.querySelectorAll('.menu > li > button').forEach(button => {
        button.addEventListener('click', () => {
            closeSearch();
            closeAdmin();
            const expanded = button.getAttribute('aria-expanded') === 'true';
            const submenu = document.getElementById(button.getAttribute('aria-controls'));
            document.querySelectorAll('.menu > li > button').forEach(btn => {
                btn.setAttribute('aria-expanded', 'false');
            });
            document.querySelectorAll('.submenu').forEach(menu => {
                menu.setAttribute('aria-hidden', 'true');
            });
            button.setAttribute('aria-expanded', String(!expanded));
            if (submenu) submenu.setAttribute('aria-hidden', String(expanded));

            if (mobileMenuMain) {
                const buttons = mobileMenuMain.getElementsByTagName('button');
                for (let i = 0; i < buttons.length; i++) {
                    buttons[i].className = 'open';
                }
            }
        });
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                button.setAttribute('aria-expanded', 'false');
                const submenu = document.getElementById(button.getAttribute('aria-controls'));
                if (submenu) submenu.setAttribute('aria-hidden', 'true');
                button.focus();
            }
        });
    });

    document.querySelectorAll('.menu-return').forEach(function (e) {
        e.addEventListener('click', function (e) {
            e.preventDefault();
            closeSubNavMobile();
        });
    });

    document.addEventListener('click', (e) => {
        const isOpen = e.target.classList;
        if (e.target === searchBtn && isOpen.contains('open') === true) {
            closeSearch();
        } else if (e.target === searchBtn) {
            closeMainNav();
            closeMainNavMobile();
            closeAdmin();
            openSearch();
        }
        if (e.target === searchInput) {
            return;
        }
        if (e.target === searchSubmitBtn) {
            closeMainNav();
            closeSearch();
        }
        if (e.target === adminNavBtn) {
            closeMainNav();
            closeMainNavMobile();
            closeSearch();
            openAdmin();
        }
        if (e.target === mobileNavBtn) {
            closeMainNav();
            closeSearch();
            closeAdmin();
            clickMainNavMobile();
        }
        if (!e.target.closest('nav')) {
            closeMainNav();
            closeMainNavMobile();
            closeSearch();
            closeAdmin();
        }
    });

    /* Scroll-hide behavior */
    let lastScrollTop = 0;
    const header = document.querySelector('.header-static');
    let isHidden = false;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 110) {
            if (scrollTop > lastScrollTop) {
                if (!isHidden) {
                    if (header) header.classList.add('hidden');
                    isHidden = true;
                    closeMainNav();
                    closeMainNavMobile();
                    closeSearch();
                    closeAdmin();
                }
            } else {
                if (isHidden) {
                    if (header) header.classList.remove('hidden');
                    isHidden = false;
                }
            }
        } else {
            if (header) header.classList.remove('hidden');
            isHidden = false;
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
});
