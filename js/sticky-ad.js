document.addEventListener("DOMContentLoaded", function () {

    const stickyAd = document.querySelector('.sticky-ad');
    const stickyAds = document.querySelectorAll('.sticky-ad');
    const stickyAdTop = stickyAd.parentElement.offsetTop || stickyAd.parentElement.getBoundingClientRect().top;

    // Position ads on page load
    function setAdTop() {
        for (let i = 0; i < stickyAds.length; i++) {
            stickyAds[i].style.top = stickyAdTop + 'px';
        }
    }
    setAdTop();

    const footer = document.querySelector('footer');
    const footerTop = footer.offsetTop;

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
        stickyAdHeight = 255;
    } else if (viewLG) {
        stickyAdHeight = 315;
    } else if (viewXL) {
        stickyAdHeight = 315;
    } else if (viewXXL) {
        stickyAdHeight = 315;
    }

    console.log(stickyAdTop);

    function handleAdPosition() {
        var stickyAds = document.querySelectorAll('.sticky-ad');
        var scrollTop = window.pageYOffset || window.scrollTop;
        if (scrollTop = 0) {
            stickyAds[i].style.top = stickyAdTop + 'px';
        } else if (scrollTop <= stickyAdTop) {
            console.log("Start moving ads");
            for (let i = 0; i < stickyAds.length; i++) {
                stickyAds[i].style.top = stickyAdTop - window.pageYOffset + 'px';
            }
        }
    }

    function handleAdDisplay() {
        var mobile = window.matchMedia("screen and (max-width:991px)").matches;
        // var mobile = window.innerWidth < 992;
        if (mobile) {
            document.querySelector('body').classList.add('mobile');
            for (let i = 0; i < stickyAds.length; i++) {
                stickyAds[i].style.display = 'none';
            }
        } else if (!mobile && window.scrollY < footerTop - stickyAdHeight) {
            for (let i = 0; i < stickyAds.length; i++) {
                stickyAds[i].style.display = 'block';
            }
        } else if (!mobile && window.scrollY >= footerTop - stickyAdHeight) {
            for (let i = 0; i < stickyAds.length; i++) {
                stickyAds[i].style.display = 'none';
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

    handleAdDisplay();
    window.addEventListener('scroll', scroll);
    window.addEventListener('resize', resize);

});