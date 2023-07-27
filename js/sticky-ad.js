
document.addEventListener("DOMContentLoaded", function () {

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
    const stickyAds = document.querySelectorAll('.sticky-ad');
    // const articleBylineHeight = document.querySelector('.article__byline').clientHeight;
    // const articleBodyHeight = document.querySelector('.article__body').clientHeight;
    // const mainContentHeight = articleBylineHeight + articleBodyHeight;
    const footerTop = document.querySelector('footer').offsetTop;
    console.log("footer top: " + footerTop);
    const stickyTop = stickyAd.parentElement.offsetTop;
    console.log("sticky top: " + stickyTop);
    // const stickyBottom = mainContentHeight - stickyHeight;
    const stickyBottom = footerTop;

    function setAdTop() {
        // for (let i = 0; i < stickyAds.length; i++) {
            stickyAd.style.top = stickyTop + 'px';
        // }
    }
    setAdTop();

    function handleAdPosition() {
        const contentWidth = document.querySelector('.usms-container').offsetWidth;
        const windowWidth = window.innerWidth;
        const contentMargins = windowWidth - contentWidth;
        const contentMargin = contentMargins/2;
        const contentMarginWhole = Math.round(contentMargin);
        stickyAd.style.right = contentMarginWhole - 4 + 'px';

        var scrollTop = window.pageYOffset;

        console.log(window.scrollY);

        const stickyTop = stickyAd.parentElement.offsetTop;
        if (window.scrollY > stickyTop ) {
            stickyAd.classList.add('sticky-start');
        } else {
            stickyAd.classList.remove('sticky-start');
        }

        if (viewSm && scrollTop === 0) {
            // stickyAd.style.display = 'block';
            stickyAd.style.top = stickyTop + 'px';
        }
        if (viewSm && scrollTop <= stickyTop) {
            // stickyAd.style.display = 'block';
            stickyAd.style.top = stickyTop - window.pageYOffset + 'px';
        }
        if (viewSm && scrollTop > stickyTop) {
            stickyAd.style.display = 'block';
            stickyAd.style.top = 0 + 'px';
    }
        if (viewSm && scrollTop >= stickyBottom - stickyHeight - 150) {
            stickyAd.style.display = 'none';
        }
    }
    handleAdPosition();

    // function handleAdPosition() {
    //     const footerTop = document.querySelector('#footerOverlay');
    //     const stickyAd = document.querySelector('.sticky-ad');
    //     // if (window.pageYOffset > footerTop.offsetTop - 400) {
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