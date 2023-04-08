
document.addEventListener("DOMContentLoaded", function () {

    let stickyHeight = 0;    

    const mobile = window.matchMedia("screen and (max-width:991px)").matches; // window.innerWidth < 992;
    const viewSm = window.matchMedia("screen and (min-width:576px)").matches;
    const viewMd = window.matchMedia("screen and (min-width:768px)").matches;
    const viewLg = window.matchMedia("screen and (min-width:992px)").matches;
    const viewXl = window.matchMedia("screen and (min-width:1200px)").matches;
    const viewXxl = window.matchMedia("screen and (min-width:1400px)").matches;

    // Sets height for known ad sizes
    if (viewSm) {
        stickyHeight = 255;
    } else if (viewMd) {
        stickyHeight = 315;
    } else if (viewLg) {
        stickyHeight = 315;
    } else if (viewXl) {
        stickyHeight = 315;
    } else if (viewXxl) {
        stickyHeight = 315;
    }

    const stickyAd = document.querySelector('.ad__space'); // JP: create a new class to toggle via rendering parameter, this is temp for testing in QA
    const stickyAds = document.querySelectorAll('.ad__space');
    const mainContent = document.querySelector('header + .section');
    // const mainContentTop = mainContent.getBoundingClientRect().top;
    // const mainContentHeight = mainContent.getBoundingClientRect().height;
    const mainContentHeight = mainContent.scrollHeight;
    const stickyTop = stickyAd.parentElement.offsetTop;
    const stickyBottom = stickyHeight*4 + mainContentHeight;
    const footer = document.querySelector('footer');

    function setAdTop() {
        for (let i = 0; i < stickyAds.length; i++) {
            // if (window.scrollY < stickyTop) {
            //     stickyAds[i].style.top = stickyTop + 'px';
            // }
            stickyAd.style.top = stickyTop + 'px';
        }
    }
    setAdTop();

    function handleAdPosition() {
        var scrollTop = window.pageYOffset; // window.scrollTop;
        if (!mobile && scrollTop === 0) {
            // console.log("At the top ...");
            // for (let i = 0; i < stickyAds.length; i++) {
            //     stickyAds[i].style.display = 'block';
            //     stickyAds[i].style.top = stickyTop + 'px';
            // }
            stickyAd.style.display = 'block';
            stickyAd.style.top = stickyTop + 'px';
        }
        if (!mobile && scrollTop <= stickyTop) {
            // console.log("Scroll is above main content ...");
            // for (let i = 0; i < stickyAds.length; i++) {
            //     stickyAds[i].style.display = 'block';
            //     stickyAds[i].style.top = stickyTop - window.pageYOffset + 'px';
            // }
            stickyAd.style.display = 'block';
            stickyAd.style.top = stickyTop - window.pageYOffset + 'px';
    }
        if (!mobile && scrollTop > stickyTop) {
            // console.log("Scroll is in main content ...");
            // for (let i = 0; i < stickyAds.length; i++) {
            //     stickyAds[i].style.display = 'block';
            //     stickyAds[i].style.top = 10 + 'px';
            // }
            stickyAd.style.display = 'block';
            stickyAd.style.top = 10 + 'px';
    }
        if (!mobile && scrollTop >= stickyBottom) {
            // console.log("Scroll is below main content ...");
            // for (let i = 0; i < stickyAds.length; i++) {
            //     stickyAds[i].style.display = 'none';
            // }
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