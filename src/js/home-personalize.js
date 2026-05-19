(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var section = document.querySelector('.personalize');
    var content = document.querySelector('.personalize__content');
    var cols = document.querySelectorAll('.personalize .cta-row .col-lg-3.cta-col');
    var cards = document.querySelectorAll('.personalize .personalize__content-column');

    if (!section || !content) return;

    // React mounted content with opacity:0 / z-index:-1, then transitioned to visible
    // Use double rAF so the CSS transition fires instead of jumping
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        content.style.opacity = '1';
        content.style.zIndex = '1';
      });
    });

    function equalizeCards() {
      cards.forEach(function (c) { c.style.minHeight = ''; });
      var maxH = 0;
      cards.forEach(function (c) { maxH = Math.max(maxH, c.offsetHeight); });
      var offset = window.innerWidth >= 1200 ? 40 : 0;
      cards.forEach(function (c) { c.style.minHeight = maxH - offset + 'px'; });
    }

    // React calculated section height from content — set it and keep it updated on resize
    function syncHeight() {
      // React set flex:1 on each column to fill the row equally — only at desktop widths
      var isWide = window.innerWidth >= 992;
      cols.forEach(function (col) {
        col.style.flex = isWide ? '1' : '';
      });
      equalizeCards();
      section.style.height = content.scrollHeight + 0 + 'px';
    }

    syncHeight();

    if (window.ResizeObserver) {
      var syncing = false;
      new ResizeObserver(function () {
        if (syncing) return;
        syncing = true;
        syncHeight();
        syncing = false;
      }).observe(section);
    } else {
      window.addEventListener('resize', syncHeight);
    }
  });
})();
