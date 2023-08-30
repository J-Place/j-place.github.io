document.addEventListener("DOMContentLoaded", function () {
    const mobile = window.matchMedia("screen and (max-width:1199px)").matches;
    // Sets height of different ad sizes
    let stickyHeight = 0;
    const viewSm = window.matchMedia("screen and (min-width:576px)").matches;
    const viewMd = window.matchMedia("screen and (min-width:768px)").matches;
    if (viewSm) {
        stickyHeight = 255;
    } else if (viewMd) {
        stickyHeight = 315;
    }
    const stickyAd = document.querySelector('.sticky-ad');
    const footerTop = document.querySelector('footer').offsetTop;
    const articleStepper = document.querySelector('.article-stepper');
    // const stickyTop = stickyAd.parentElement.offsetTop;
    // const stickyBottom = footerTop - stickyHeight - 150
    let stickyBottom = 0;    

    if (articleStepper) {
        // const footer = document.querySelector('footer')
        // const articleStepper = document.querySelector('.article-stepper');
        const articleStepperTop = document.querySelector('.article-stepper').parentElement.offsetTop;
        // const articleStepperTop = articleStepper.offsetTop;
        console.log(articleStepperTop);
        console.log(footerTop);
        // stickyBottom = articleStepperTop - stickyHeight - 150;
        stickyBottom = articleStepperTop - stickyHeight - 100;
        // stickyBottom = articleStepperTop;
        console.log(articleStepperTop - stickyHeight - 50);
        console.log(stickyHeight);
    } else {
        stickyBottom = footerTop - stickyHeight - 150;
    }

    function handleAdPosition() {
        const contentWidth = document.querySelector('.usms-container').offsetWidth;
        const windowWidth = window.document.body.offsetWidth;
        const contentMargins = windowWidth - contentWidth;
        const contentMargin = contentMargins/2;
        // const contentMarginWhole = Math.round(contentMargin);
        stickyAd.style.right = contentMargin + 16 + 'px';
        // stickyAd.style.right = contentMarginWhole + 16 + 'px';
        const stickyTop = stickyAd.parentElement.offsetTop;
        var scrollTop = window.scrollY;

        if (mobile) {
            return;
        }
        if (mobile == false && window.scrollY > stickyTop ) {
            stickyAd.classList.add('sticky-start');
        } else {
            stickyAd.classList.remove('sticky-start');
        }
        if (mobile == false && scrollTop === 0) {
            stickyAd.style.display = 'block';
            stickyAd.style.top = stickyTop + 'px';
        }
        if (mobile == false && scrollTop <= stickyTop) {
            stickyAd.style.display = 'block';
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
    function scroll() {
        handleAdPosition();
    }
    function resize() {
        // var mobile = window.matchMedia("screen and (max-width:1199px)").matches;
        handleAdPosition();
    }
    window.addEventListener('scroll', scroll);
    window.addEventListener('resize', resize);
});

