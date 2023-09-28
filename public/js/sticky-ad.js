document.addEventListener("DOMContentLoaded", function () {
    const mobile = window.matchMedia("screen and (max-width:1199px)").matches;
    // Sets height of responsive ad sizes
    let stickyHeight = 0;
    const viewSm = window.matchMedia("screen and (min-width:576px)").matches;
    const viewMd = window.matchMedia("screen and (min-width:768px)").matches;
    if (viewSm) {
        stickyHeight = 255;
    } if (viewMd) {
        stickyHeight = 315;
    }
    const stickyAd = document.querySelector('.sticky-ad');
    const footerTop = document.querySelector('footer').offsetTop;
    const articleStepper = document.querySelector('.article-stepper');
    const articleAuthor = document.querySelector('.article-author');
    const emailSignup = document.querySelector('.sign-up');
    const relatedArticles = document.querySelector('.related-content');
    const offsetX = 50;
    let stickyBottom = 0;    
    if (articleStepper) {
        const articleStepperTop = document.querySelector('.article-stepper').parentElement.offsetTop;
        stickyBottom = articleStepperTop - stickyHeight - offsetX;
    } else if (articleAuthor){
        const articleAuthorTop = document.querySelector('.article-author').parentElement.offsetTop;
        stickyBottom = articleAuthorTop - stickyHeight - offsetX;
    } else if (emailSignup){
        const emailSignupTop = document.querySelector('.sign-up').parentElement.offsetTop;
        stickyBottom = emailSignupTop - stickyHeight - offsetX;
    } else if (relatedArticles){
        const relatedArticlesTop = document.querySelector('.related-content').parentElement.offsetTop;
        stickyBottom = relatedArticlesTop - stickyHeight - offsetX;
    } else {
        stickyBottom = footerTop - stickyHeight - offsetX;
    }
    function handleAdPosition() {
        const contentWidth = document.querySelector('.usms-container').clientWidth;
        const windowWidth = window.document.body.scrollWidth;
        const contentMargins = windowWidth - contentWidth;
        const contentMargin = contentMargins/2;
        const stickyTop = stickyAd.parentElement.offsetTop;
        var scrollTop = window.scrollY;
        if (mobile) {
            return;
        }
        if (mobile == false && window.scrollY > stickyTop ) {
            stickyAd.classList.add('sticky-ad-start');
        } else {
            stickyAd.classList.remove('sticky-ad-start');
        }
        if (mobile == false && scrollTop <= stickyTop) {
            stickyAd.style.display = 'block';
            stickyAd.style.right = 0 + "px";
            stickyAd.style.top = 0 + 'px';
        }
        if (mobile == false && scrollTop > stickyTop) {
            stickyAd.style.display = 'block';
            stickyAd.style.right = contentMargin + 2 + 'px';
            stickyAd.style.top = 0 + 'px';
        }
        if (mobile == false && scrollTop >= stickyBottom) {
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

