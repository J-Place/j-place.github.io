// Enhancement, no production analog: shows the In This Article nav's share icons
// (.article-nav-share, partials/Article/ArticleInThisArticleNav.njk) once the reader has
// scrolled past the byline's share icons, and hides them again as soon as those icons are back
// in view. Fade timing lives in css/Article/article-nav-share.css.
(function () {
  const navShare = document.querySelector('.article-nav-share');
  const bylineShare = document.querySelector('.article-meta__share .social-share');
  if (!navShare || !bylineShare || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(function (entries) {
    const entry = entries[0];
    // Scrolled past = out of view above the viewport (not below it, as on first load).
    const scrolledPast = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
    navShare.classList.toggle('is-visible', scrolledPast);
  });

  observer.observe(bylineShare);
})();
