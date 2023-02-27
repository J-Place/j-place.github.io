document.addEventListener("DOMContentLoaded", function () {
// setTimeout(() => {
    const articleNav = document.querySelector('.article-nav');
    const articleTitle = document.querySelector('.feature-title');
    const relatedArticles = document.querySelector('.article-stepper');
    const articleNavHeight = articleNav.offsetHeight;
    // const articleStart = articleTitle.offsetParent.offsetTop; // This one works with technique article; relative to container
    const articleStart = articleTitle.offsetTop; // This one works with swimming 101 page; relative to container
    const relatedArticlesTop = relatedArticles.offsetParent.offsetTop;
    const relatedArticlesHeight = relatedArticles.offsetHeight;
    // const articleEnd = relatedArticlesTop + relatedArticlesHeight;
    const articleEnd = relatedArticlesTop - articleNavHeight;


    // Set position on page load
    if (window.scrollY >= articleStart && window.scrollY <= articleEnd) {
        // articleNav.style.top = articleStart + 'px';
        articleNav.style.top = 0 + 'px';
        articleNav.classList.add('sticky-start');
        articleNav.classList.remove('sticky-end');
        // console.log(articleNav);
        // console.log(articleTitle);
        // console.log(relatedArticles);
        // console.log(relatedArticlesTop);
        // console.log(relatedArticlesHeight);
        // console.log(articleStart);
        // console.log("on page load, if window has been scrolled down");
    } else {
        articleNav.style.top = articleStart + 'px';
        console.log("on page load else set px position on article nav");
    }

    // Set position on scroll
    function stickynavbar() {
        
        // console.log("running stickynavbar function ...");

        if (window.scrollY < articleStart) {
            articleNav.style.top = articleStart + 'px';
            articleNav.classList.remove('sticky-start');
            articleNav.classList.add('sticky-end');
            console.log("Start scrolling at top of page");
        }
        if (!articleNav.classList.contains('sticky-start') && !articleNav.classList.contains('sticky-end') && window.scrollY >= articleStart && window.scrollY <= articleEnd) {    
            articleNav.classList.add('sticky-start');
            articleNav.style.top = 0 + 'px';
            console.log("Scroll is at top of article");
        }
        // Scroll back up after scrolling down
        if (!articleNav.classList.contains('sticky-start') && articleNav.classList.contains('sticky-end') && window.scrollY >= articleStart && window.scrollY <= articleEnd + articleNavHeight) {
            articleNav.classList.add('sticky-start');
            articleNav.classList.remove('sticky-end');
            articleNav.style.top = 0 + 'px';
            console.log("Scroll back up after scrolling down");
        }
        if (articleNav.classList.contains('sticky-start') && window.scrollY >= articleStart && window.scrollY >= articleEnd) {
            articleNav.classList.remove('sticky-start');
            articleNav.classList.add('sticky-end');
            // articleNav.style.top = articleEnd + articleNavHeight + 'px';
            articleNav.style.top = articleEnd + articleNavHeight + 'px';
            // articleNav.style.top = articleEnd + 'px';
            console.log("Scrolled to bottom of article");
        }
    }
    window.addEventListener('scroll', stickynavbar);







    const navListItems = document.querySelectorAll('.article-nav li a');
    const navListItemActive = document.querySelectorAll('.article-nav li a.active');
    // const navItemActive = navListItems.item.classList.contains('.active');

    // function navbarDisplay() {
        // if (navListItemActive) {
            // console.log("Yes");
        // }
        // console.log(navItemActive);
    // }
    // navbarDisplay();
    
    document.addEventListener('click', function(e) {
        var isActive = e.target.classList.contains('active')
        
        // navListItems.classList.remove('active');
        
        console.log(navListItems.classList);
        // console.log("Clicked" + isActive);
        // navListItemActive.classList.remove('active');
        // navListItemActive[0].classList.add('reactive');
        console.log(e.target.navListItems);
        if (e.target = navListItems && !isActive) {
            console.log(navListItemActive.classList);
            // navListItemActive.classList.add('testy')
            e.target.classList.add('active');
        } else if (e.target = navListItems && isActive) {
            console.log("Is the Active Nav Link");
            return;
        } 
        // else {
            // isActive.classList.remove('active');
            // e.target.classList.add('active');
            // console.log("Click That.");
            // console.log(isActive);
            // console.log(navListItems[i].classList);
        // }
    });



});
// }, 2000);