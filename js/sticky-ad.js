
document.addEventListener("DOMContentLoaded", function () {

    var mobile = window.matchMedia("screen and (max-width:1199px)").matches;
    let stickyHeight = 0;
    const viewSm = window.matchMedia("screen and (min-width:576px)").matches;
    const viewMd = window.matchMedia("screen and (min-width:768px)").matches;

    // Sets height for known ad sizes
    if (viewSm) {
        stickyHeight = 255;
    } else if (viewMd) {
        stickyHeight = 315;
    }
    const stickyAd = document.querySelector('.sticky-ad'); // JP: create a new class to toggle via rendering parameter
    const footerTop = document.querySelector('footer').offsetTop;
    const stickyTop = stickyAd.parentElement.offsetTop;
    const stickyBottom = footerTop - stickyHeight - 150;

    function setAdTop() {
            stickyAd.style.top = stickyTop + 'px';
        }
    setAdTop();

    function handleAdPosition() {
        const contentWidth = document.querySelector('.usms-container').offsetWidth;
        const windowWidth = window.innerWidth;
        const contentMargins = windowWidth - contentWidth;
        const contentMargin = contentMargins/2;
        const contentMarginWhole = Math.round(contentMargin);
        stickyAd.style.right = contentMarginWhole - 4 + 'px';

        var scrollTop = window.scrollY;
        console.log(scrollTop);

        const stickyTop = stickyAd.parentElement.offsetTop;
        if (mobile == false && window.scrollY > stickyTop ) {
            stickyAd.classList.add('sticky-start');
        } else {
            stickyAd.classList.remove('sticky-start');
        }

        if (mobile == false && scrollTop === 0) {
            // stickyAd.style.display = 'block';
            stickyAd.style.top = stickyTop + 'px';
        }
        if (mobile == false && scrollTop <= stickyTop) {
            // stickyAd.style.display = 'block';
            stickyAd.style.top = stickyTop - window.scrollY + 'px';
        }
        if (mobile == false && scrollTop > stickyTop) {
            stickyAd.style.display = 'block';
            stickyAd.style.top = 0 + 'px';
    }
        if (mobile == false && scrollTop >= stickyBottom) {
            stickyAd.style.display = 'none';
        }
    }
    handleAdPosition();

    // function handleAdPosition() {
    //     const footerTop = document.querySelector('#footerOverlay');
    //     const stickyAd = document.querySelector('.sticky-ad');
    //     // if (window.scrollY > footerTop.offsetTop - 400) {
    //     if (window.scrollY > footerTop.offsetTop - 400) {
    //         stickyAd.classList.add('sticky-ad--bottom');
    //     } else {
    //         stickyAd.classList.remove('sticky-ad--bottom');
    //     }
    // }
    // handleAdPosition();

    function scroll() {
        handleAdPosition();
    }

    function resize() {
        handleAdPosition();
    }

    window.addEventListener('scroll', scroll);
    window.addEventListener('resize', resize);

});