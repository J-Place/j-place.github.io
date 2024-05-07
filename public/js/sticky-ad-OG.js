
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
    const stickyAd = document.querySelector('.ad__space'); // JP: create a new class to toggle via rendering parameter
    const stickyAds = document.querySelectorAll('.ad__space');
    const articleBylineHeight = document.querySelector('.article__byline').clientHeight;
    const articleBodyHeight = document.querySelector('.article__body').clientHeight;
    const mainContentHeight = articleBylineHeight + articleBodyHeight;
    const stickyTop = stickyAd.parentElement.offsetTop;
    const stickyBottom = mainContentHeight - stickyHeight;
    // const stickyBottom = mainContentHeight;



    const footerTop = document.querySelector('#footerOverlay');
    const stickyAdTag = document.querySelector('.sticky-ad');
    console.log(footerTop.offsetTop);
    console.log(window.scrollY);


    function setAdTop() {
        for (let i = 0; i < stickyAds.length; i++) {
            stickyAd.style.top = stickyTop + 'px';
        }
    }
    setAdTop();

    function handleAdPosition() {
        const contentWidth = document.querySelector('.usms-container').offsetWidth;
        const windowWidth = window.innerWidth;
        const contentMargins = windowWidth - contentWidth;
        const contentMargin = contentMargins/2;
        const contentMarginWhole = Math.round(contentMargin);

        var scrollTop = window.pageYOffset;

        if (viewSm && scrollTop === 0) {
            // stickyAd.style.display = 'block';
            stickyAd.style.top = stickyTop + 'px';
        }
        if (viewSm && scrollTop <= stickyTop) {
            // stickyAd.style.display = 'block';
            stickyAd.style.top = stickyTop - window.pageYOffset + 'px';
    }
        if (viewSm && scrollTop > stickyTop) {
            // stickyAd.style.display = 'block';
            stickyAd.style.top = 10 + 'px';
    }
        if (viewSm && scrollTop >= stickyBottom) {
            stickyAd.style.display = 'none';
        }
    }
    handleAdPosition();

    function scroll() {
        handleAdPosition();
    }

    function resize() {
        handleAdPosition();
    }

    window.addEventListener('scroll', scroll);
    window.addEventListener('resize', resize);

});