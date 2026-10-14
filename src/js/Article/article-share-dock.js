// Enhancement, no production analog: Share This Article bar (partials/Article/ArticleShareThis.njk)
// sticks to the top of the window from where the editor placed it until the end of the article
// body (.share-this-article-dock), then joins the page there and scrolls with it, until the reader
// scrolls back above its original position, which resets it.
//
// Docking moves the bar from its original slot to the dock. At that moment the sticky bar is
// already pushed up against the end of its container, so it's moved to exactly where it's showing
// (any difference from collapsing margins is scrolled away), and nothing on screen moves. The
// content between the two slots shifts up while it's hidden under the bar or above the window.
// Undocking moves it back once its original slot is below the window, so that's off screen too.
(function () {
  const bar = document.querySelector('.share-this-article');
  const dock = document.querySelector('.share-this-article-dock');
  if (!bar || !dock || bar.parentNode !== dock.parentNode) return;

  const body = bar.parentNode;
  // Scroll anchoring would "correct" the docking shift with a visible jump; this script corrects
  // it itself.
  body.style.overflowAnchor = 'none';

  // Marks the bar's original slot while it's docked.
  const home = document.createElement('div');
  body.insertBefore(home, bar);

  let docked = false;
  bar.classList.add('is-sticky');

  function update() {
    if (!docked) {
      // Scrolled past its slot, and the sticky bar has reached the end of its container.
      const pushed = bar.getBoundingClientRect().bottom >= body.getBoundingClientRect().bottom - 1;
      if (pushed && home.getBoundingClientRect().top < 0) {
        const before = bar.getBoundingClientRect().top;
        bar.classList.remove('is-sticky');
        body.insertBefore(bar, dock);
        window.scrollBy(0, bar.getBoundingClientRect().top - before);
        docked = true;
      }
    } else if (home.getBoundingClientRect().top >= window.innerHeight) {
      home.after(bar);
      bar.classList.add('is-sticky');
      docked = false;
    }
  }

  let queued = false;
  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      update();
    });
  }

  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  update();
})();
