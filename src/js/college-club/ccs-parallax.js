/* College Club Swimming — parallax scroll effect */

(function () {
    /*
     * Reveal: as the section scrolls into view, the crowd starts high in the frame
     * and slides down to its resting place, uncovering the pool behind it, while
     * the words rise from behind the crowd into the gap between them.
     *
     * data-shift = where a layer starts, as a fraction of the section's height
     * (negative = higher, positive = lower). It eases to 0 as the section scrolls
     * in, and every layer is at rest (the flattened comp) once the section's
     * bottom edge reaches the bottom of the viewport. -1 would pin the crowd to
     * the bottom of the viewport the whole way in.
     *
     * data-zoom = the layer's scale once the section is fully in view (1.3 = 30%
     * bigger). It starts at 1 and grows on the same schedule, so the layer zooms
     * in as you scroll down. It scales from the layer's transform-origin (ccs.css).
     *
     * Whatever is below the crowd is always below the fold, so the pool photo can
     * stay put. It must be the clean plate (crowd removed): the gaps between heads
     * show it while the crowd is still above its resting place.
     */
    var stage = document.querySelector("[data-ccs-plx]");
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var layers = Array.prototype.map.call(stage.querySelectorAll("[data-shift], [data-zoom]"), function (el) {
        return { el: el, shift: parseFloat(el.dataset.shift) || 0, zoom: parseFloat(el.dataset.zoom) || 1 };
    }).filter(function (l) { return l.shift !== 0 || l.zoom !== 1; });

    var ticking = false, inView = false;

    // Measured every frame, not cached: images above this section load after the
    // script runs and push it down the page, so a cached position goes stale.
    function update() {
        ticking = false;
        var vh = window.innerHeight;
        var r = stage.getBoundingClientRect();
        // 0 = top edge just entering the bottom of the viewport, 1 = fully in view.
        var p = Math.min(Math.max((vh - r.top) / r.height, 0), 1);
        layers.forEach(function (l) {
            var y = l.shift * (1 - p) * r.height;
            var z = 1 + (l.zoom - 1) * p;
            l.el.style.transform = "translate3d(0," + y.toFixed(1) + "px,0) scale(" + z.toFixed(4) + ")";
        });
    }

    function onScroll() {
        if (!inView || ticking) return;
        ticking = true;
        requestAnimationFrame(update);
    }

    new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) onScroll();
    }, { rootMargin: "100px 0px" }).observe(stage);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
})();
