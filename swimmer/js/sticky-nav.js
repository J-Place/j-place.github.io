var mobile = window.matchMedia("screen and (max-width:480px)").matches;
if (mobile) {
    document.querySelector('.article-nav').classList.add('mobile');
}

document.addEventListener("DOMContentLoaded", function () {
    const articleNav = document.querySelector('.article-nav');
    const articleNavHeight = articleNav.offsetHeight;
    // const relatedArticlesTop = relatedArticles.offsetParent.offsetTop;
    const articleStart = document.querySelector('.article-body').offsetTop;
    const articleEnd = document.querySelector('.article-end').offsetTop;

    if (window.scrollY >= articleStart && window.scrollY <= articleEnd) {
        // Set nav position on initial page load
        // articleNav.style.top = 0 + 'px';
        articleNav.classList.add('sticky-start');
        articleNav.classList.remove('sticky-end');
    } else { 
        // Set nav position on page reload or loading page from hash links
        if (mobile) {
            articleNav.style.top = 30 + 'px';
        } else if (!mobile) {
            // articleNav.style.top = articleStart + 'px';
        }
    }

    // Last insgance of div.article-body ///////////////////////////////////////////////
    // const articleContainers = document.querySelectorAll('.article-body');
    // const articleLastContainer = articleContainers[articleContainers.length- 1];
    // let articleLastContainerBottom = articleLastContainer.getBoundingClientRect().bottom;
    // console.log(articleLastContainer);



    let mobileNavList = document.querySelector('#navList');
    let mobileNavButton = document.querySelector('.article-nav-title');
    document.body.addEventListener('click', function(event){
        if (mobile && window.scrollY < articleStart - 70) {
            document.querySelector('.article-body').scrollIntoView();
            console.log("DOES THIS EVER FIRE?");
        }
        if (mobile && window.scrollY < articleStart && mobileNavButton.contains(event.target)) {
            articleNav.style.top = 0 + 'px';            
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
                articleNav.style.top = 0 + 'px';
                articleNav.classList.remove('sticky-start');
                articleNav.classList.remove('sticky-end');
            }
            if (window.scrollY >= articleStart) {
                articleNav.style.top = 0 + 'px';
                articleNav.classList.add('sticky-start');
                articleNav.classList.remove('sticky-end');
            }
            if (!articleNav.classList.contains('sticky-start') 
                && !articleNav.classList.contains('sticky-end') 
                && window.scrollY >= articleStart 
                && window.scrollY <= articleEnd) {    
                articleNav.classList.add('sticky-start');
                articleNav.style.top = 0 + 'px';
            }
            if (!articleNav.classList.contains('sticky-start') 
                && articleNav.classList.contains('sticky-end') 
                && window.scrollY >= articleStart 
                && window.scrollY <= articleEnd + articleNavHeight) {
                articleNav.classList.add('sticky-start');
                articleNav.classList.remove('sticky-end');
                articleNav.style.top = 0 + 'px';
            }
            if (articleNav.classList.contains('sticky-start') 
                && window.scrollY >= articleStart 
                && window.scrollY >= articleEnd - articleNavHeight - articleNavHeight) {
                articleNav.classList.remove('sticky-start');
                articleNav.classList.add('sticky-end');
                articleNav.style.top = 0 + 'px';
            }
        } else if (!mobile) {
            if (window.scrollY < articleStart 
                && !articleNav.classList.contains('sticky-start')) {
                articleNav.style.top = 0 + 'px';
            }
            if (window.scrollY < articleStart 
                && articleNav.classList.contains('sticky-start')) {
                articleNav.classList.remove('sticky-start');
                articleNav.style.top = 0 + 'px';
            }
            if (window.scrollY >= articleStart 
                && window.scrollY <= articleEnd
                && !articleNav.classList.contains('sticky-start') 
                && !articleNav.classList.contains('sticky-end')) {    
                articleNav.classList.add('sticky-start');
                articleNav.style.top = 0 + 'px';
                console.log("SAT");
            }
            if (window.scrollY >= articleStart 
                && window.scrollY <= articleEnd - articleNavHeight 
                && !articleNav.classList.contains('sticky-start') 
                && articleNav.classList.contains('sticky-end')) {
                articleNav.classList.add('sticky-start');
                articleNav.classList.remove('sticky-end');
                articleNav.style.top = 0 + 'px';
                console.log("ACT");
            }
            if (window.scrollY >= articleEnd - articleNavHeight
                && articleNav.classList.contains('sticky-start')) {
                articleNav.classList.remove('sticky-start');
                articleNav.classList.add('sticky-end');
                articleNav.style.top = 0 + 'px';
                console.log("TST");
            }    
        }
    }
    window.addEventListener('scroll', setNavPosition);
    setNavPosition();

    // window.addEventListener('scroll', function () {
    //     console.log("EVFWQEWEEDWEDWE");
    //         setNavPosition();
    //         renderNavList();
    // });       

});



