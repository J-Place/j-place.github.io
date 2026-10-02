(function () {
  var cue = document.querySelector('.hero-scroll-cue');
  var hero = document.querySelector('.page-header.page-header__image');
  if (!cue || !hero) return;

  // Native behavior:'smooth' duration isn't configurable and runs quite
  // fast (a few hundred ms) — this animates the scroll by hand over a fixed
  // 500ms instead.
  var DURATION = 700;

  // Mild easing — sine in/out is a gentler curve than quad/cubic (a shallow
  // S rather than a pronounced accelerate/decelerate), so motion still
  // reads as "smooth scroll" rather than an obviously eased animation.
  function easeInOutSine(t) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  }

  function smoothScrollTo(targetY) {
    var startY = window.scrollY;
    var distance = targetY - startY;
    var startTime = null;

    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / DURATION, 1);
      // behavior:'instant' is required here — the plain two-arg scrollTo(x,y)
      // form defaults to behavior:'auto', which defers to the page's CSS
      // scroll-behavior. Bootstrap sets scroll-behavior:smooth on <html>
      // sitewide (vendored www.usms.org-bootstrap.min.css), so each of these
      // per-frame jumps would otherwise get its own native smooth-scroll
      // layered on top — constantly interrupted and barely moving for most
      // of the duration, then finishing in one uninterrupted burst on the
      // last frame rather than the easing curve below.
      window.scrollTo({ top: startY + distance * easeInOutSine(progress), left: 0, behavior: 'instant' });
      if (progress < 1) window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
  }

  // Stops 50px short of fully scrolling past the hero, so its bottom 50px
  // stays visible at the top of the viewport at rest instead of scrolling
  // completely out of view.
  var VISIBLE_HERO_REMAINDER = 50;

  // Once scrolled to rest, the cue flips into a "back to top" control
  // instead of "scroll to content" — classList.contains reads whatever
  // updateCueSticky last set, so this always reflects the cue's actual
  // state, not just clicks. Checks --flipped (see updateCueSticky), not
  // --pinned: --pinned only describes the box's current on-screen position
  // and clears as soon as the hero scrolls back into its "fixed" zone,
  // which happens well before the user is back at the top of the page —
  // --flipped has its own one-way-until-scrollY-0 hysteresis so the cue
  // doesn't flip back to "down" mid-scroll-up.
  cue.addEventListener('click', function () {
    if (cue.classList.contains('hero-scroll-cue--flipped')) {
      smoothScrollTo(0);
      return;
    }
    var targetY = window.scrollY + hero.getBoundingClientRect().bottom - VISIBLE_HERO_REMAINDER;
    smoothScrollTo(targetY);
  });

  // --- Sticky emulation -----------------------------------------------
  //
  // CSS position:sticky can't be used here: .hero-scroll-cue's containing
  // block for sticky purposes is .page-header__image-container, but that
  // sits inside <header class="... bg-media ...">, and .bg-media sets
  // overflow:hidden (production/src/App/pages/Home.css:64-70, needed to
  // clip the oversized, vertically-centered hero <img>). An overflow:hidden
  // ancestor becomes the sticky scrollport, and since <header> itself never
  // scrolls (the *page* scrolls, not that box), sticky never activates —
  // confirmed empirically, not just per spec. So this hand-rolls the same
  // three states a real position:sticky; top:0 element would move through,
  // toggled on scroll/resize:
  //
  //   1. "normal"  — heroContainer hasn't reached the top of the viewport
  //      yet. Sits at its authored position:absolute; top:0; left:0
  //      (relative to heroContainer, the hero's top-left corner).
  //   2. "fixed"   — heroContainer's top has scrolled above the viewport,
  //      but its bottom is still more than CUE_SIZE away. Pins to the
  //      viewport's top edge (position:fixed; top:0), left set to the
  //      container's current on-screen left so it stays visually anchored
  //      to the photo rather than the window edge.
  //   3. "pinned"  — heroContainer's bottom is within CUE_SIZE of the
  //      viewport top (i.e. VISIBLE_HERO_REMAINDER or less of the hero is
  //      left showing). Reverts to position:absolute, now anchored
  //      bottom:0 instead of top:0, so it scrolls away together with the
  //      hero past this point instead of staying stuck mid-content.
  //
  // CUE_SIZE matches VISIBLE_HERO_REMAINDER (both 50px) by design: the
  // scroll-cue's own click target stops exactly when heroContainer.bottom
  // reaches 50, which is the same instant state 2 hands off to state 3 —
  // so the box is still fully "stuck" flush at the viewport's top edge at
  // the exact scroll position where that edge is also flush with the
  // hero's bottom-left corner. Those two descriptions are the same frame,
  // not two things that need separate alignment.
  var heroImageContainer = document.querySelector('.page-header__image-container');
  var CUE_SIZE = 50;

  // Separate from the three position states above: whether the cue is
  // flipped (up arrow, "scroll to top") or not (down arrow, "scroll to
  // content"). This has its own one-way latch instead of tracking the
  // position state directly — once the user has scrolled down far enough
  // to reach state 3 at least once, it stays flipped through the entire
  // scroll back up (including re-entering states 2 and 1 along the way,
  // which happens well before reaching the top) and only resets once
  // scrollY is back to exactly 0.
  var flipped = false;

  function updateCueSticky() {
    if (!heroImageContainer) return;
    var rect = heroImageContainer.getBoundingClientRect();

    cue.classList.remove('hero-scroll-cue--fixed', 'hero-scroll-cue--pinned');
    cue.style.left = '';

    if (rect.bottom <= CUE_SIZE) {
      flipped = true; // reached state 3 at least once this trip down
    } else if (window.scrollY <= 0) {
      flipped = false; // back at the very top — reset for the trip down
    }

    cue.classList.toggle('hero-scroll-cue--flipped', flipped);
    cue.setAttribute('aria-label', flipped ? 'Scroll to top' : 'Scroll to article content');

    if (rect.top > 0) {
      return; // state 1: normal, authored CSS position already correct
    }

    if (rect.bottom > CUE_SIZE) {
      cue.classList.add('hero-scroll-cue--fixed'); // state 2: stuck to viewport
      cue.style.left = rect.left + 'px';
    } else {
      cue.classList.add('hero-scroll-cue--pinned'); // state 3: rides away with the hero
    }
  }

  var ticking = false;
  function onScrollOrResize() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateCueSticky();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScrollOrResize);
  window.addEventListener('resize', onScrollOrResize);
  updateCueSticky();
})();
