var mobile = window.matchMedia("screen and (max-width:480px)").matches;
if (mobile) {
    document.querySelector('.article-nav').classList.add('mobile');
}

// document.addEventListener('click', toggleMobileNav); 
// const mobileNavListItem = document.querySelector('article-nav li');
// function closeMobileNav() {

//     console.log("Closing Mobile Nav");
    
//     if (e.target = mobileNavListItem) {
//         toggleMobileNav();
//     }
// }
// mobileNavListItem.onclick = toggleMobileNav();

// mobileNavListItem.addEventListener('click', closeMobileNav); 


function toggleMobileNav() {
    console.log("Clicked Mobile Nav");
    const mobileNavContainer = document.querySelector('.article-nav');
    const mobileNavButton = document.querySelector('article-nav-title');
    const mobileNavList = document.getElementById('navList');    
    if (mobile && mobileNavList.classList.contains('show')) {
        mobileNavList.classList.remove('show');
        document.querySelector('.article-nav-title').classList.remove('open');
    } else if (mobile && !mobileNavList.classList.contains('show')) {
        mobileNavList.classList.add('show');
        document.querySelector('.article-nav-title').classList.add('open');
        var mobileWindowHeight = window.screen.height;
    } else {
        return false
    }
    document.querySelector('.article-nav').style.maxHeight = mobileWindowHeight + 20 + "px";
    document.querySelector('body').style.overflow = "hidden";
}


document.addEventListener("DOMContentLoaded", function () {
    const articleNav = document.querySelector('.article-nav');
    const articleTitle = document.querySelector('.article-body'); // was '.feature-title'
    const relatedArticles = document.querySelector('.article-stepper');
    const articleNavHeight = articleNav.offsetHeight;
    // const articleStart = articleTitle.offsetParent.offsetTop; // This one works with technique article; relative to parent container
    const articleStart = articleTitle.offsetTop; // This one works with swimming 101 page; relative to container
    const relatedArticlesTop = relatedArticles.offsetParent.offsetTop;
    const relatedArticlesHeight = relatedArticles.offsetHeight;
    const articleEnd = relatedArticlesTop - articleNavHeight;

    if (window.scrollY >= articleStart && window.scrollY <= articleEnd) {
        // Set nav position on initial page load
        articleNav.style.top = 0 + 'px';
        articleNav.classList.add('sticky-start');
        articleNav.classList.remove('sticky-end');
    } else { 
        // Set nav position on page reload or loading page from hash links
        if (mobile) {
            articleNav.style.top = 30 + 'px';
        } else if (!mobile) {
            articleNav.style.top = articleStart + 'px';
        }
    }

    function handleNavUI() {
        const ab = document.querySelectorAll('.article-body h2, .article-body h3');
        var str = '';        
        for (i = 0; i < ab.length; i++) {            
            var id = ab[i];
            var idPos = id.offsetParent.getBoundingClientRect().top;
            var idZero = idPos + ab[i].offsetTop;
            var activeClass = '';
            if (idZero < window.screenTop + 90) {
                activeClass = " active";
            } 
            else if (idZero > window.screenTop) {
                activeClass = " BBB";
            }
            else if (idZero >= -100 && idZero <= 100) {
                activeClass = " active XXX";
                console.log("XXX");
            } 
            str  += '<li class="' + ab[i].tagName + 'link' +  activeClass + '"><a href="#' + ab[i].id + '">' + ab[i].innerHTML + '</a></li>';
        }        
        document.getElementById('navList').innerHTML = str;
    }
    window.addEventListener('scroll', handleNavUI);
    handleNavUI(); // Draw nav on page load


    let containingElement = document.querySelector('#navList');
    document.body.addEventListener('click', function( event ){
        if( mobile && containingElement.contains( event.target ) ){
            toggleMobileNav();
            console.log("Toggling Nav");
        } else {
            console.log("Returning False");
            return false
        }
    });


    // Set position on scroll
    function setNavPosition() {
        if (mobile) {
            if (window.scrollY < articleStart) {
                // articleNav.style.top = - 20 + 'px';
                articleNav.style.top = 0 + 'px';
                articleNav.classList.remove('sticky-start');
                articleNav.classList.remove('sticky-end');
                console.log("111 mobile");
            }
            if (window.scrollY >= articleStart) {
                articleNav.style.top = 0 + 'px';
                // articleNav.style.top = articleStart - articleNavHeight - 198 + 'px';
                articleNav.classList.add('sticky-start');
                articleNav.classList.remove('sticky-end');
                console.log("111XXX mobile");
            }
            if (!articleNav.classList.contains('sticky-start') 
                && !articleNav.classList.contains('sticky-end') 
                && window.scrollY >= articleStart 
                && window.scrollY <= articleEnd) {    
                articleNav.classList.add('sticky-start');
                articleNav.style.top = 0 + 'px';
                console.log("222 mobile");
            }
            if (!articleNav.classList.contains('sticky-start') 
                && articleNav.classList.contains('sticky-end') 
                && window.scrollY >= articleStart 
                && window.scrollY <= articleEnd + articleNavHeight) {
                articleNav.classList.add('sticky-start');
                articleNav.classList.remove('sticky-end');
                articleNav.style.top = 0 + 'px';
                console.log("333 mobile");
            }
            if (articleNav.classList.contains('sticky-start') 
                && window.scrollY >= articleStart 
                && window.scrollY >= articleEnd - articleNavHeight - articleNavHeight) {
                articleNav.classList.remove('sticky-start');
                articleNav.classList.add('sticky-end');
                articleNav.style.top = 0 + 'px';
                console.log("444 mobileq");
            }
        } else if (!mobile) {
            if (window.scrollY < articleStart 
                && !articleNav.classList.contains('sticky-start')) {
                // articleNav.style.top = articleStart - articleNavHeight + 150 + 'px';
                // articleNav.style.top = articleStart - articleNavHeight + 'px';
                // articleNav.style.top = articleStart - articleNavHeight - 80 + 'px';
                // articleNav.style.top = articleStaclrt - articleNavHeight + 'px';
                articleNav.style.top = 0 + 'px';
                // articleNav.classList.remove('sticky-start');
                // articleNav.classList.add('sticky-end');
                console.log("111", articleStart);
            }
            if (window.scrollY < articleStart 
                && articleNav.classList.contains('sticky-start')) {
                articleNav.classList.remove('sticky-start');
                // articleNav.classList.remove('sticky-end');
                articleNav.style.top = 0 + 'px';
                // articleNav.style.top = articleStart + 'px';
                console.log("QQQ");
            }
            if (window.scrollY >= articleStart 
                && window.scrollY <= articleEnd
                && !articleNav.classList.contains('sticky-start') 
                && !articleNav.classList.contains('sticky-end')) {    
                articleNav.classList.add('sticky-start');
                articleNav.style.top = 0 + 'px';
                // articleNav.style.top = articleStart - articleNavHeight + 'px';
                console.log("222");
            }
            if (window.scrollY >= articleStart 
                && window.scrollY <= articleEnd - articleNavHeight - articleNavHeight 
                && !articleNav.classList.contains('sticky-start') 
                && articleNav.classList.contains('sticky-end')) {
                articleNav.classList.add('sticky-start');
                articleNav.classList.remove('sticky-end');
                // articleNav.style.top = 60 + 'px';
                articleNav.style.top = 0 + 'px';
                // articleNav.style.top = articleEnd - articleNavHeight + 'px';
                console.log("333");
            }
            if (window.scrollY >= articleEnd - articleNavHeight - articleNavHeight 
                && articleNav.classList.contains('sticky-start')) {
                articleNav.classList.remove('sticky-start');
                articleNav.classList.add('sticky-end');
                // articleNav.style.top = articleEnd - articleNavHeight - 800 + 'px';
                // articleNav.style.top = articleStart + 'px';
                articleNav.style.top = 0 + 'px';
                console.log("444");
            }    
        }
    }
    window.addEventListener('scroll', setNavPosition);
    setNavPosition();


    // window.addEventListener('scroll', function () {
    //     console.log("EVFWQEWEEDWEDWE");
    //         setNavPosition();
    //         handleNavUI();
    // });
    
    
    // let scrolling = false; 
    // console.log("RRR" , scrolling);   
    // window.scroll = () => {
    //     scrolling = true;
    //     console.log("SSS" , scrolling);
    // };
    
    // setInterval(() => {
    //     if (scrolling) {
    //         setNavPosition();
    //         handleNavUI();
    //         console.log("Finsihing 2");
    //         scrolling = false;
    //     }
    // },20);
            

});



