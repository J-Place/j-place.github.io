
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

    // const windowWidth = window.innerWidth;
    // alert(windowWidth);

    console.log(window.innerWidth);
    console.log(window.outerWidth);
    console.log(window.document.body.offsetWidth);
    console.log(screen.width);
    console.log(screen.availWidth);


    function handleAdPosition() {
        const contentWidth = document.querySelector('.usms-container').offsetWidth;
        // const windowWidth = window.innerWidth;
        const windowWidth = window.document.body.offsetWidth;
        const adPosX = stickyAd.offsetLeft;
        const clientWidth = document.querySelector('html').innerWidth;
        // console.log(clientWidth);
        // console.log(contentWidth);
        // console.log(adPosX);
        const contentMargins = windowWidth - contentWidth;
        // console.log(contentMargins);
        const contentMargin = contentMargins/2;
        // console.log(contentMargin);
        const contentMarginWhole = Math.round(contentMargin);
        // console.log(contentMarginWhole);
        stickyAd.style.right = contentMargin + 15 + 'px';
        const stickyTop = stickyAd.parentElement.offsetTop;
        var scrollTop = window.scrollY;
        if (mobile) {
            // console.log("0");
            return;
        }
        if (mobile == false && window.scrollY > stickyTop ) {
            stickyAd.classList.add('sticky-start');
            // console.log("1");
        } else {
            stickyAd.classList.remove('sticky-start');
        }

        if (mobile == false && scrollTop === 0) {
            stickyAd.style.display = 'block';
            stickyAd.style.top = stickyTop + 'px';
            // console.log("2");
        }
        if (mobile == false && scrollTop <= stickyTop) {
            stickyAd.style.display = 'block';
            stickyAd.style.top = stickyTop - window.scrollY + 'px';
            // console.log("3");
        }
        if (mobile == false && scrollTop > stickyTop) {
            stickyAd.style.display = 'block';
            stickyAd.style.top = 0 + 'px';
            // console.log("4");
        }
        if (mobile == false && scrollTop >= stickyBottom) {
            stickyAd.style.display = 'none';
            // console.log("5");
        }
    }
    handleAdPosition();
    function scroll() {
        handleAdPosition();
    }
    function resize() {
        var mobile = window.matchMedia("screen and (max-width:1199px)").matches;
        handleAdPosition();
    }
    window.addEventListener('scroll', scroll);
    window.addEventListener('resize', resize);
});

