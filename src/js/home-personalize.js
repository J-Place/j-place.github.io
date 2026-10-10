(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var content = document.querySelector('.personalize__content');
    if (!content) return;

    // Production's React (Personalize.jsx) leaves exactly these inline styles on
    // .personalize__content once mounted — nothing on the section, columns or cards.
    // Section height and container width come from CSS (vendored home.min.css and
    // css/Home/home-page-content-styles.css). It mounts at opacity:0 / z-index:-1 and
    // transitions to visible; double rAF so the transition fires instead of jumping.
    content.style.transition = 'all 250ms ease-in-out 0s';
    content.style.transform = 'translate(-50%, 0px)';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        content.style.opacity = '1';
        content.style.zIndex = '1';
      });
    });
  });
})();
