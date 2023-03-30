var mobile = window.matchMedia("screen and (max-width:480px)").matches;
if (mobile) {
    document.querySelector('.sticky-nav').classList.add('mobile');
}

document.addEventListener("DOMContentLoaded", function () {
    const stickyNav = document.querySelector('.sticky-nav');
    const stickyNavLeft = document.querySelector('.sticky-nav.sticky-nav-left');
    // const allAds = document.querySelectorAll('.sticky-ad');
    const stickyNavRight = document.querySelector('.sticky-nav.sticky-nav-right');
    const stickyNavHeight = stickyNav.offsetHeight;
    // const relatedArticlesTop = relatedArticles.offsetParent.offsetTop;
    const articleStart = document.querySelector('.article-body').offsetTop;
    const articleEnd = document.querySelector('.article-end').offsetTop;

    const usmsContainer = document.querySelector('.usms-container').clientWidth;
    const windowContainer = document.querySelector('body').clientWidth;

    const stickyAdMargin = (windowContainer - usmsContainer) / 2;

    // console.log((windowContainer - usmsContainer) / 2);
    console.log(stickyAdMargin);

    if (window.scrollY >= articleStart && window.scrollY <= articleEnd) {
        // Set nav position on initial page load
        // stickyNav.style.top = 0 + 'px';
        stickyNavRight.classList.add('sticky-start');
        // stickyNav.classList.add('sticky-start');
        
        stickyNavLeft.classList.remove('sticky-end');
        stickyNavRight.classList.remove('sticky-end');
    } else { 
        // Set nav position on page reload or loading page from hash links
        if (mobile) {
            stickyNav.style.top = 30 + 'px';
        } else if (!mobile) {
            // stickyNav.style.top = articleStart + 'px';
        }
    }

    let mobileNavList = document.querySelector('#navList');
    let mobileNavButton = document.querySelector('.sticky-nav-title');
    document.body.addEventListener('click', function(event){
        if (mobile && window.scrollY < articleStart - 70) {
            document.querySelector('.article-body').scrollIntoView();
            console.log("DOES THIS EVER FIRE?");
        }
        if (mobile && window.scrollY < articleStart && mobileNavButton.contains(event.target)) {
            stickyNav.style.top = 0 + 'px';            
            console.log("Freeze");
        }
        if (mobile && mobileNavList.contains(event.target)){
            toggleMobileNav();
            console.log("Twister");
        } else {
            return false
        }
    });


    // Set position on scroll
    function setNavPosition() {
        if (mobile) {
            if (window.scrollY < articleStart) {                
                stickyNav.style.top = 0 + 'px';
                stickyNav.classList.remove('sticky-start');
                stickyNav.classList.remove('sticky-end');
            }
            if (window.scrollY >= articleStart) {
                stickyNav.style.top = 0 + 'px';
                stickyNav.classList.add('sticky-start');
                stickyNav.classList.remove('sticky-end');
            }
            if (!stickyNav.classList.contains('sticky-start') 
                && !stickyNav.classList.contains('sticky-end') 
                && window.scrollY >= articleStart 
                && window.scrollY <= articleEnd) {    
                stickyNav.classList.add('sticky-start');
                stickyNav.style.top = 0 + 'px';
            }
            if (!stickyNav.classList.contains('sticky-start') 
                && stickyNav.classList.contains('sticky-end') 
                && window.scrollY >= articleStart 
                && window.scrollY <= articleEnd + stickyNavHeight) {
                stickyNav.classList.add('sticky-start');
                stickyNav.classList.remove('sticky-end');
                stickyNav.style.top = 0 + 'px';
            }
            if (stickyNav.classList.contains('sticky-start') 
                && window.scrollY >= articleStart 
                && window.scrollY >= articleEnd - stickyNavHeight - stickyNavHeight) {
                stickyNav.classList.remove('sticky-start');
                stickyNav.classList.add('sticky-end');
                stickyNav.style.top = 0 + 'px';
            }
        } else if (!mobile) {
            if (window.scrollY < articleStart 
                && !stickyNav.classList.contains('sticky-start')) {
                // stickyNav.style.top = 0 + 'px';
            }
            if (window.scrollY < articleStart 
                && stickyNav.classList.contains('sticky-start')) {
                stickyNav.classList.remove('sticky-start');
                stickyNavRight.classList.remove('sticky-start');
                // stickyNav.style.top = 0 + 'px';
                stickyNavLeft.style.left = 0 + 'px';
                stickyNavRight.style.right = 0 + 'px';
            }
            if (window.scrollY >= articleStart 
                && window.scrollY <= articleEnd
                && !stickyNav.classList.contains('sticky-start') 
                && !stickyNav.classList.contains('sticky-end')) {    
                stickyNav.classList.add('sticky-start');
                stickyNavRight.classList.add('sticky-start');
                // stickyNav.style.top = 0 + 'px';
                stickyNavLeft.style.left = stickyAdMargin + 22 + 'px';
                stickyNavRight.style.right = stickyAdMargin + 22 + 'px';
                console.log("SAT");
            }
            if (window.scrollY >= articleStart 
                && window.scrollY <= articleEnd - stickyNavHeight 
                && !stickyNav.classList.contains('sticky-start') 
                && stickyNav.classList.contains('sticky-end')) {
                stickyNav.classList.add('sticky-start');
                stickyNavRight.classList.add('sticky-start');
                stickyNav.classList.remove('sticky-end');
                // stickyNav.style.top = 0 + 'px';
                console.log("ACT");
            }
            if (window.scrollY >= articleEnd - stickyNavHeight
                && stickyNav.classList.contains('sticky-start')) {
                stickyNav.classList.remove('sticky-start');
                stickyNavRight.classList.remove('sticky-start');
                stickyNav.classList.add('sticky-end');
                // stickyNav.style.top = 0 + 'px';
                console.log("TST");
            }    
        }
    }
    window.addEventListener('scroll', setNavPosition);
    setNavPosition();

});



