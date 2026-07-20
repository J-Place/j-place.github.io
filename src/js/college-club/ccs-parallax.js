/* College Club Swimming — parallax scroll effect */

document.addEventListener("scroll", function () {
    const container = document.querySelector(".parallax-container");
    if (!container) return;

    const foreground = document.querySelector(".parallax-foreground");
    const text = document.querySelector(".parallax-text");
    const containerRect = container.getBoundingClientRect();
    const startParallax = containerRect.top;
    const endParallax = containerRect.bottom;
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const scrollProgress = 1 - (containerRect.top / windowHeight);

    if (windowWidth < 768) {
        if (startParallax < windowHeight && endParallax > windowHeight) {
            const textOffset = scrollProgress * -300;
            if (text) text.style.transform = `translateY(calc(${textOffset}px))`;
        }
    }
    if (windowWidth >= 768 && windowWidth < 1200) {
        if (startParallax < windowHeight && endParallax > windowHeight) {
            const textOffset = scrollProgress * -390;
            if (text) text.style.transform = `translateY(calc(${textOffset}px))`;
        }
    }
});
