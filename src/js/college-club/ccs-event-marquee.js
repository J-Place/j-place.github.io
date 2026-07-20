/* College Club Swimming — event marquee: infinite drag/touch/auto-scroll */

document.addEventListener("DOMContentLoaded", () => {
    const marquee = document.getElementById("eventMarquee");
    const track = document.getElementById("track");
    if (!marquee || !track) return;

    const itemWidth = 280;
    const spacing = 20;
    const totalWidth = itemWidth + spacing;

    const original = Array.from(track.children);
    const itemCount = original.length;

    function cloneSet() {
        return original.map(item => item.cloneNode(true));
    }

    const before1 = cloneSet();
    const before2 = cloneSet();
    const after1 = cloneSet();
    const after2 = cloneSet();

    before2.reverse().forEach(n => track.insertBefore(n, track.firstChild));
    before1.reverse().forEach(n => track.insertBefore(n, track.firstChild));

    after1.forEach(n => track.appendChild(n));
    after2.forEach(n => track.appendChild(n));

    let position = -totalWidth * itemCount * 2;

    function applyTransform() {
        track.style.transform = `translateX(${position}px)`;
    }
    applyTransform();

    function wrap() {
        const maxLeft = -totalWidth * itemCount * 3;
        const maxRight = 0;

        if (position > maxRight) {
            position -= totalWidth * itemCount;
        } else if (position < maxLeft) {
            position += totalWidth * itemCount;
        }
    }

    const speed = 1.3;
    let auto = null;

    function startAuto() {
        stopAuto();
        auto = setInterval(() => {
            position -= speed;
            wrap();
            applyTransform();
        }, 16);
    }

    function stopAuto() {
        clearInterval(auto);
    }

    let isDragging = false;
    let startX = 0;
    let startPos = 0;

    function down(x) {
        isDragging = true;
        startX = x;
        startPos = position;
        marquee.style.cursor = "grabbing";
        stopAuto();
    }

    function move(x) {
        if (!isDragging) return;
        const delta = x - startX;
        position = startPos + delta;
        wrap();
        applyTransform();
    }

    function up() {
        if (!isDragging) return;
        isDragging = false;
        marquee.style.cursor = "grab";
        startAuto();
    }

    marquee.addEventListener("mousedown", e => down(e.pageX));
    window.addEventListener("mousemove", e => move(e.pageX));
    window.addEventListener("mouseup", up);

    let touchMoved = false;

    marquee.addEventListener("touchstart", e => {
        touchMoved = false;
        down(e.touches[0].pageX);
    }, { passive: true });

    marquee.addEventListener("touchmove", e => {
        const deltaX = Math.abs(e.touches[0].pageX - startX);
        if (deltaX > 5) {
            touchMoved = true;
            move(e.touches[0].pageX);
            e.preventDefault();
        }
    }, { passive: false });

    marquee.addEventListener("touchend", e => {
        up();
        if (!touchMoved) {
            const target = e.target.closest("a");
            if (target) target.click();
        }
    });

    marquee.addEventListener("mouseenter", () => !isDragging && stopAuto());
    marquee.addEventListener("mouseleave", () => !isDragging && startAuto());

    startAuto();
});
