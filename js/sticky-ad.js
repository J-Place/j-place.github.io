document.addEventListener("DOMContentLoaded", function () {

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

    function handleScroll() {
        console.log("XXX");
        if (window.scrollY < footerTop - 750) {
            console.log("Above footer ...");
            for (let i = 0; i < stickyAds.length; i++) {
                stickyAds[i].style.display = 'block';
            }
        } else if (window.scrollY >= footerTop - 750) {
            console.log("Below footer ...");
            for (let i = 0; i < stickyAds.length; i++) {
                stickyAds[i].style.display = 'none';
            }
        }
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll);

});