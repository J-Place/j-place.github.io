document.addEventListener("DOMContentLoaded", function () {
    const mobile = window.matchMedia("screen and (max-width:1199px)").matches;
    if (mobile) {
        document.querySelector('.article-nav').classList.add('mobile');
    }

    function setArticleIds() {
        const contentHeadings = document.querySelectorAll('.article-body h2, .article-body h3');
        for (i = 0; i < contentHeadings.length; i++) {  
            var contentHeadingHtml = contentHeadings[i].innerHTML;
            var contentHeadingHtmlClean = contentHeadingHtml = contentHeadingHtml.replace(/\s/g, '').replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '');
            contentHeadings[i].id = contentHeadingHtmlClean;
        };
    }
    setArticleIds();

    function renderNavList() {
        const contentHeadings = document.querySelectorAll('.article-body h2, .article-body h3');
        var str = '';
        for (i = 0; i < contentHeadings.length; i++) {
            var id = contentHeadings[i];
            var idPos = id.offsetParent.getBoundingClientRect().top;
            var idZero = idPos + contentHeadings[i].offsetTop;
            var activeClass = '';
            if (idZero < window.screenTop + 90) {
                activeClass = " active";
            } 
            else if (idZero > window.screenTop) {
                activeClass = "";
            }
            else if (idZero >= -100 && idZero <= 100) {
                activeClass = " active";
            } 
            str  += '<li class="' + contentHeadings[i].tagName + 'link' +  activeClass + '"><a href="#' + contentHeadings[i].id + '">' + contentHeadings[i].innerHTML + '</a></li>';
        }        
        document.getElementById('navList').innerHTML = str;
    }
    window.addEventListener('scroll', renderNavList);
    renderNavList(); // Draw nav on page load

    function toggleMobileNav() {
        const mobileNavList = document.getElementById('navList');
        if (mobile && mobileNavList.classList.contains('show')) {
            mobileNavList.classList.remove('show');
            document.querySelector('.article-nav-title').classList.remove('open');
            document.querySelector('body').style.overflow = "scroll";
        } else if (mobile && !mobileNavList.classList.contains('show')) {
            mobileNavList.classList.add('show');
            document.querySelector('.article-nav-title').classList.add('open');
            var mobileWindowHeight = window.screen.height;
            document.querySelector('body').style.overflow = "hidden";
        } else {
            return false
        }
        document.querySelector('#navList').style.maxHeight = mobileWindowHeight - 50 + "px";    
    }

    const footerTop = document.getElementById('footerOverlay').offsetTop;
    const articleStepper = document.querySelector('.article-stepper');
    const stickyNav = document.querySelector('.article-nav');
    const stickyNavHeight = stickyNav.clientHeight;
    let stickyNavBottom = 0;
    if (articleStepper) {
        const articleStepperTop = document.querySelector('.article-stepper').parentElement.offsetTop;
        stickyNavBottom = articleStepperTop;
    } else {
        stickyNavBottom = footerTop - stickyNavHeight;
    }
    function handleNavPosition() {
        stickyNav.style.left = 0;
        const stickyNavTop = stickyNav.parentElement.offsetTop - 20;
        var scrollTop = window.scrollY;
        if (mobile) {
            return;
        }
        if (mobile == false && window.scrollY > stickyNavTop ) {
            stickyNav.classList.add('sticky-start');
        } else {
            stickyNav.classList.remove('sticky-start');
        }
        if (mobile == false && scrollTop === 0) {
            stickyNav.style.display = 'block';
            stickyNav.style.top = stickyNavTop + 'px';
        }
        if (mobile == false && scrollTop <= stickyNavTop) {
            stickyNav.style.display = 'block';
            stickyNav.style.top = stickyNavTop - window.scrollY + 'px';
        }
        if (mobile == false && scrollTop > stickyNavTop) {
            stickyNav.style.display = 'block';
            stickyNav.style.top = 0 + 'px';
        }
        if (mobile == false && scrollTop >= stickyNavBottom) {
            stickyNav.style.display = 'none';
        }
    }
    handleNavPosition();
    function scroll() {
        handleNavPosition();
    }
    function resize() {
        handleNavPosition();
    }
    window.addEventListener('scroll', scroll);
    window.addEventListener('resize', resize);
});

