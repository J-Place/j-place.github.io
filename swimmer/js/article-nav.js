document.addEventListener("DOMContentLoaded", function () {
    const articleNav = document.querySelector('.article-nav');
    const footerPos = document.querySelector('footer');
    const articleTitle = document.querySelector('.feature-title');
    const relatedArticles = document.querySelector('.article-stepper');
    const articleStart = articleTitle.offsetParent.offsetTop;
    const articleEnd = relatedArticles.offsetParent.offsetTop;
    // if (window.scrollY >= 680) {    
    //     articleNav.classList.add('sticky-start');
    // }
    // console.log(scrollY);
    // console.log(articleStart, articleEnd);
    function stickynavbar() {
        // console.log(articleStart);
        // console.log(scrollY);
        // console.log(articleEnd.offsetTop);
        if (window.scrollY >= articleStart && window.scrollY <= articleEnd) {    
            articleNav.classList.add('sticky-start');
        }  else if (window.scrollY >= articleEnd) {
            articleNav.classList.remove('sticky-start');
            articleNav.classList.add('sticky-end');
        } 
        else {
            articleNav.classList.remove('sticky-start', 'sticky-end');
        }
    }
    window.addEventListener('scroll', stickynavbar);
});