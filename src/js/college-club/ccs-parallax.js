/* College Club Swimming — parallax scroll effect */

(function () {
    /*
     * Reveal: as the section scrolls into view, the crowd starts high in the frame
     * and slides down to its resting place while zooming in, the pool rises behind
     * it so the water shows above the heads, and the words rise from behind the
     * crowd into the gap between them.
     *
     * Each layer eases from its "from" values to its "to" values between the
     * section's top edge entering the bottom of the viewport and the whole section
     * being on screen, then holds the "to" values.
     *   data-y-from / data-y-to:       vertical offset as a fraction of the
     *                                  section's height (negative = up). Default 0.
     *   data-zoom-from / data-zoom-to: scale, from the layer's transform-origin
     *                                  (ccs.css). Default 1.
     * A crowd y-from of -1 would pin it to the bottom of the viewport on the way in.
     *
     * The pool must be the clean plate (crowd removed): the gaps between heads
     * show it while the crowd and pool are out of their comp alignment.
     */
    var stage = document.querySelector("[data-ccs-plx]");
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function num(el, name, fallback) {
        var v = parseFloat(el.dataset[name]);
        return isNaN(v) ? fallback : v;
    }

    var layers = Array.prototype.map.call(stage.querySelectorAll(".ccs-plx__layer"), function (el) {
        return {
            el: el,
            y0: num(el, "yFrom", 0), y1: num(el, "yTo", 0),
            z0: num(el, "zoomFrom", 1), z1: num(el, "zoomTo", 1)
        };
    }).filter(function (l) { return l.y0 || l.y1 || l.z0 !== 1 || l.z1 !== 1; });

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
            var y = (l.y0 + (l.y1 - l.y0) * p) * r.height;
            var z = l.z0 + (l.z1 - l.z0) * p;
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
