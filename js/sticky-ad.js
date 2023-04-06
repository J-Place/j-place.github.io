document.addEventListener("DOMContentLoaded", function () {


    console.log(window.innerWidth);

    const stickyAd = document.querySelector('.sticky-ad');
    // const stickyAdTop = stickyAd.parentElement.getBoundingClientRect().top;
    const stickyAdTop = stickyAd.parentElement.offsetTop;
    const stickyAds = document.querySelectorAll('.sticky-ad');
    function setAdTop() {
        for (let i = 0; i < stickyAds.length; i++) {
            stickyAds[i].style.top = stickyAdTop + 'px';
        }
    }
    setAdTop();

    const footer = document.querySelector('footer');
    const footerTop = footer.offsetTop;
    const adHeight = stickyAd.clientHeight;

    function handleAdDisplay() {
        var mobile = window.matchMedia("screen and (max-width:991px)").matches;
        // var mobile = window.innerWidth < 992;
        if (mobile) {
            console.log("Mobile ...");
            document.querySelector('body').classList.add('mobile');
            for (let i = 0; i < stickyAds.length; i++) {
                stickyAds[i].style.display = 'none';
            }
        } else if (!mobile && window.scrollY < footerTop - 750) {
            console.log("Above footer ...");
            for (let i = 0; i < stickyAds.length; i++) {
                stickyAds[i].style.display = 'block';
            }
        } else if (!mobile && window.scrollY >= footerTop - 750) {
            console.log("Below footer ...");
            for (let i = 0; i < stickyAds.length; i++) {
                stickyAds[i].style.display = 'none';
            }
        }
    }
    function test() {
        console.log("Resize");
        handleAdDisplay();
    }
    handleAdDisplay();
    window.addEventListener('scroll', handleAdDisplay);
    window.addEventListener('resize', test);

});