document.addEventListener("DOMContentLoaded", function () {

    var mobile = window.matchMedia("screen and (max-width:480px)").matches;
    if (mobile) {
        // Run javascript for mobile only
        document.querySelector('.article-nav').classList.add('mobile');
    } else {
        // Run javascript for sizes above mobile

        handleNavUI(); // Draw nav on page load
        function handleNavUI() {
            const ab = document.querySelectorAll('.article-body h2, .article-body h3');
            var str = '';        
            for (i = 0; i < ab.length; i++) {            
                var id = ab[i];
                var idPos = id.offsetParent.getBoundingClientRect().top;
                var idZero = idPos + ab[i].offsetTop;
                var activeClass = '';
                // if (idPos + ab[i].offsetTop == 0) {
                if (idZero < window.screenTop + 90) {
                    activeClass = " active";    
                    console.log("AAA");
                } 
                else if (idZero > window.screenTop) {
                    activeClass = " BBB";
                    console.log("BBB");
                }
                else if (idZero >= -100 && idZero <= 100) {
                    activeClass = " activeXXX";
                    console.log("XXX");
                } 
                str  += '<li class="' + ab[i].tagName + 'link' +  activeClass + '"><a href="#' + ab[i].id + '">' + ab[i].innerHTML + '</a></li>';
                // console.log(ab[i].offsetTop);
            }        
            document.getElementById('navList').innerHTML = str;
        }
        window.addEventListener('scroll', handleNavUI);
        
    
        const articleNav = document.querySelector('.article-nav');
        const articleTitle = document.querySelector('.article-body'); // was '.feature-title'
        const relatedArticles = document.querySelector('.article-stepper');
        const articleNavHeight = articleNav.offsetHeight;
        // const articleStart = articleTitle.offsetParent.offsetTop; // This one works with technique article; relative to parent container
        const articleStart = articleTitle.offsetTop; // This one works with swimming 101 page; relative to container
        const relatedArticlesTop = relatedArticles.offsetParent.offsetTop;
        const relatedArticlesHeight = relatedArticles.offsetHeight;
        const articleEnd = relatedArticlesTop - articleNavHeight;

        // const articleTop = articleBody.offsetParent.getBoundingClientRect().top;
        // const articleBottom = articleBody.offsetParent.getBoundingClientRect().bottom;
    
    
        if (window.scrollY >= articleStart && window.scrollY <= articleEnd) {
            // Set nav position on initial page load
            articleNav.style.top = 0 + 'px';
            articleNav.classList.add('sticky-start');
            articleNav.classList.remove('sticky-end');
        } else { 
            // Set nav position on page reload or loading page from hash links
            articleNav.style.top = articleStart + 'px'; 
        }
    
    
        // Set position on scroll
        function setNavPosition() {
            if (window.scrollY < articleStart) {
                articleNav.style.top = articleStart - articleNavHeight + 30 + 'px';
                articleNav.classList.remove('sticky-start');
                articleNav.classList.add('sticky-end');
                console.log("111", articleStart);
            }
            if (!articleNav.classList.contains('sticky-start') && !articleNav.classList.contains('sticky-end') && window.scrollY >= articleStart && window.scrollY <= articleEnd) {    
                articleNav.classList.add('sticky-start');
                articleNav.style.top = 0 + 'px';
                console.log("222");
            }
            if (!articleNav.classList.contains('sticky-start') && articleNav.classList.contains('sticky-end') && window.scrollY >= articleStart && window.scrollY <= articleEnd + articleNavHeight) {
                articleNav.classList.add('sticky-start');
                articleNav.classList.remove('sticky-end');
                articleNav.style.top = 0 + 'px';
                console.log("333");
            }
            if (articleNav.classList.contains('sticky-start') && window.scrollY >= articleStart && window.scrollY >= articleEnd) {
                articleNav.classList.remove('sticky-start');
                articleNav.classList.add('sticky-end');
                // articleNav.style.top = articleEnd + articleNavHeight + 'px';
                articleNav.style.top = articleStart + 'px';
                console.log("444");
            }
        }
        window.addEventListener('scroll', setNavPosition);
    
    
    
        // function setActiveItem(e) {
        //     const navListItems = document.querySelectorAll('.article-nav li a');
        //     var isActive = e.target.classList.contains('active')        
        //     if (e.target = navListItems && !isActive) {
        //         for (elem of document.getElementsByClassName("active")) {
        //             elem.classList.remove("active");
        //         }
        //         e.target.classList.add('active');
        //     } else if (e.target = navListItems && isActive) {
        //         console.log("Is the Active Nav Link");
        //         return;
        //     } 
        // }
        // window.addEventListener('click', setActiveItem);

        
    }
});