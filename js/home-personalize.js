(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var section = document.querySelector('.personalize');
    var content = document.querySelector('.personalize__content');
    var cols = document.querySelectorAll('.personalize .cta-row .col-lg-3.cta-col');

    if (!section || !content) return;

    // React set flex:1 on each column to fill the row equally
    cols.forEach(function (col) {
      col.style.flex = '1';
    });

    // React mounted content with opacity:0 / z-index:-1, then transitioned to visible
    // Use double rAF so the CSS transition fires instead of jumping
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        content.style.opacity = '1';
        content.style.zIndex = '1';
      });
    });

    // React calculated section height from content — set it and keep it updated on resize
    function syncHeight() {
      section.style.height = content.scrollHeight + 40 + 'px';
    }
    syncHeight();
    window.addEventListener('resize', syncHeight);
  });
})();
