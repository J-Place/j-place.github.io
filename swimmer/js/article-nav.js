document.addEventListener("DOMContentLoaded", function () {
    const articleNav = document.querySelector('.article-nav');
    const articleTitle = document.querySelector('.feature-title');
    const relatedArticles = document.querySelector('.article-stepper');
    const relatedArticlesHeight = relatedArticles.offsetHeight;
    const articleStart = articleTitle.offsetParent.offsetTop;
    const relatedArticlesTop = relatedArticles.offsetParent.offsetTop;
    const articleEnd = relatedArticlesTop + relatedArticlesHeight;
    const articleNavHeight = articleNav.offsetHeight;

    // Set position on page load
    if (window.scrollY >= articleStart  && window.scrollY <= articleEnd) {
        // articleNav.style.top = articleStart + 'px';
        articleNav.style.top = 0 + 'px';
        articleNav.classList.add('sticky-start');
        articleNav.classList.remove('sticky-end');
    } else {
        articleNav.style.top = articleStart + 'px';
    }

    // Set position on scroll
    function stickynavbar() {
        if (window.scrollY < articleStart) {
            articleNav.style.top = articleStart + 'px';
            articleNav.classList.remove('sticky-start');
            articleNav.classList.add('sticky-end');
        }
        if (!articleNav.classList.contains('sticky-start') && !articleNav.classList.contains('sticky-end') && window.scrollY >= articleStart && window.scrollY <= articleEnd) {    
            articleNav.classList.add('sticky-start');
            articleNav.style.top = 0 + 'px';
        }
        if (articleNav.classList.contains('sticky-start') && window.scrollY >= articleStart && window.scrollY >= articleEnd) {
            articleNav.classList.remove('sticky-start');
            articleNav.classList.add('sticky-end');
            articleNav.style.top = articleEnd + articleNavHeight + 'px';
        }
        // Scroll back up after scrolling down
        if (!articleNav.classList.contains('sticky-start') && articleNav.classList.contains('sticky-end') && window.scrollY >= articleStart && window.scrollY <= articleEnd + articleNavHeight) {
            articleNav.classList.add('sticky-start');
            articleNav.classList.remove('sticky-end');
            articleNav.style.top = 0 + 'px';
        }
    }
    window.addEventListener('scroll', stickynavbar);
});