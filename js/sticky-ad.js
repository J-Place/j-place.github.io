document.addEventListener("DOMContentLoaded", function () {

    const stickyAd = document.querySelector('.sticky-ad');
    // const stickyAdTop = stickyAd.parentElement.getBoundingClientRect().top;
    const stickyAdTop = stickyAd.parentElement.offsetTop;
    // const stickyScrollTop = stickyAd.parentElement.scrollTop;
    const stickyAds = document.querySelectorAll('.sticky-ad');

    function setAdTop() {
        for (let i = 0; i < stickyAds.length; i++) {
            stickyAds[i].style.top = stickyAdTop + 'px';
        }
    }
    setAdTop();

    const footer = document.querySelector('footer');
    const footerTop = footer.offsetTop;
    const adHeight = stickyAd.clientHeight + 200;

    const viewXS = window.matchMedia("screen and (max-width:575px)").matches;
    const viewSM = window.matchMedia("screen and (min-width:576px)").matches;
    const viewMD = window.matchMedia("screen and (min-width:768px)").matches;
    const viewLG = window.matchMedia("screen and (min-width:992px)").matches;
    const viewXL = window.matchMedia("screen and (min-width:1200px)").matches;
    const viewXXL = window.matchMedia("screen and (min-width:1400px)").matches;

    if (viewXS) {
        stickyAdHeight = 255;
    } else if (viewSM) {
        stickyAdHeight = 255;
    } else if (viewMD) {
        stickyAdHeight = 315;
    } else if (viewLG) {
        stickyAdHeight = 315;
    } else if (viewXL) {
        stickyAdHeight = 315;
    }

    function handleAdDisplay() {
        var mobile = window.matchMedia("screen and (max-width:991px)").matches;
        // var mobile = window.innerWidth < 992;
        if (mobile) {
            document.querySelector('body').classList.add('mobile');
            for (let i = 0; i < stickyAds.length; i++) {
                stickyAds[i].style.display = 'none';
            }
        } else if (!mobile && window.scrollY < footerTop - adHeight) {
            for (let i = 0; i < stickyAds.length; i++) {
                stickyAds[i].style.display = 'block';
            }
        } else if (!mobile && window.scrollY >= footerTop - adHeight) {
            for (let i = 0; i < stickyAds.length; i++) {
                stickyAds[i].style.display = 'none';
            }
        }
    }
    handleAdDisplay();

    function handleAdPosition() {
        var stickyAds = document.querySelectorAll('.sticky-ad');
        var scrollTop = window.pageYOffset;
        // var scrollTop = window.scrollTop;
        if (scrollTop === 0) {
            console.log("At the top ...");
            for (let i = 0; i < stickyAds.length; i++) {
                stickyAds[i].style.top = stickyAdTop + 'px';
            }            
        }
        if (scrollTop <= stickyAdTop) {
            for (let i = 0; i < stickyAds.length; i++) {
                stickyAds[i].style.top = stickyAdTop - window.pageYOffset + 'px';
            }
        }
    }

    function scroll() {
        handleAdDisplay();
        handleAdPosition();
    }

    function resize() {
        handleAdDisplay();
        setAdTop();
    }

    window.addEventListener('scroll', scroll);
    window.addEventListener('resize', resize);

});