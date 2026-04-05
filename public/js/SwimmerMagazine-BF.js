/* global window, document, navList */
const mobile = window.matchMedia('screen and (max-width:991px)').matches;
if (mobile && document.querySelector('.article-nav')) {
  document.querySelector('.article-nav').classList.add('mobile');
}

function toggleMobileNav() {
  const mobileNavList = document.getElementById('navList');
  const mobileWindowHeight = window.screen.height;
  if (mobile && mobileNavList.classList.contains('show')) {
    mobileNavList.classList.remove('show');
    document.querySelector('.article-nav-title').classList.remove('open');
    document.querySelector('body').style.overflow = 'scroll';
  } else if (mobile && !mobileNavList.classList.contains('show')) {
    mobileNavList.classList.add('show');
    document.querySelector('.article-nav-title').classList.add('open');
    document.querySelector('body').style.overflow = 'hidden';
  } else {
    return false
  }
  document.querySelector('#navList').style.maxHeight = `${mobileWindowHeight - 50}px`;
}

document.addEventListener('DOMContentLoaded', () => {
  const articleNav = document.querySelector('.article-nav');
  if (!articleNav) return;
  const isScroll = articleNav.classList.contains('article-nav--Scroll');
  const displayH3s = articleNav.classList.contains('article-nav--DisplayH3');
  const articleNavHeight = articleNav.offsetHeight;
  const h2sInPage = document.querySelectorAll('h2');
  let firsth2 = null;
  for (let i = 0; i < h2sInPage.length; i += 1) {
    if (navList.some(x => x.href === h2sInPage[i].id)) {
      firsth2 = h2sInPage[i];
      break;
    }
  }
  if (!firsth2) firsth2 = document.querySelector('h2');
  const articleStart = isScroll ?
    firsth2.offsetTop :
    articleNav.offsetTop;
  const articleEnd = document.querySelector('footer').offsetTop;

  if (window.scrollY >= articleStart && window.scrollY <= articleEnd) {
    // Set nav position on initial page load
    articleNav.classList.add('sticky-start');
    articleNav.classList.remove('sticky-end');
  }
  // Set nav position on page reload or loading page from hash links
  if (mobile) {
    articleNav.style.top = 30 + 'px';
  }

  function setArticleIds() {
    const contentHeadings = displayH3s ?
      document.querySelectorAll('.section div + div h2, .section div + div h3') :
      document.querySelectorAll('.section div + div h2');
    for (let i = 0; i < contentHeadings.length; i++) {
      var contentHeadingHtml = contentHeadings[i].innerText;
      var contentHeadingHtmlClean = contentHeadingHtml = contentHeadingHtml.replace(/\s/g, '').replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '');
      contentHeadings[i].id = contentHeadingHtmlClean;
    };
  }
  setArticleIds();

  function renderNavList() {
    const contentHeadings = displayH3s ?
      document.querySelectorAll('.section div + div h2, .section div + div h3') :
      document.querySelectorAll('.section div + div h2');
    let str = '';
    for (let i = 0; i < contentHeadings.length; i++) {
      if (!navList.some(x => x.Href === contentHeadings[i].id)) continue;

      var id = contentHeadings[i];
      var idPos = id.offsetParent.getBoundingClientRect().top;
      var idZero = idPos + contentHeadings[i].offsetTop;
      var activeClass = '';
      if (idZero < window.screenTop + 90) {
        activeClass = ' active';
      }
      else if (idZero > window.screenTop) {
        activeClass = '';
      }
      else if (idZero >= -100 && idZero <= 100) {
        activeClass = ' active';
      }
      str += '<li class="' + contentHeadings[i].tagName + 'link' + activeClass + '"><a href="#' + contentHeadings[i].id + '">' + contentHeadings[i].innerHTML + '</a></li>';
    }
    document.getElementById('navList').innerHTML = str;
  }
  window.addEventListener('scroll', renderNavList);
  renderNavList(); // Draw nav on page load

  let mobileNavList = document.querySelector('#navList');
  let mobileNavButton = document.querySelector('.article-nav-title');
  document.body.addEventListener('click', function (event) {
    if (mobile && window.scrollY < articleStart - 70) {
      document.querySelector('.section').scrollIntoView();
    }
    if (mobile && window.scrollY < articleStart && mobileNavButton.contains(event.target)) {
      articleNav.style.top = 0 + 'px';
    }
    if (mobile && mobileNavList.contains(event.target)) {
      toggleMobileNav();
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
      if (!articleNav.classList.contains('sticky-start') && !articleNav.classList.contains('sticky-end') && window.scrollY >= articleStart && window.scrollY <= articleEnd) {
        articleNav.classList.add('sticky-start');
        articleNav.style.top = 0 + 'px';
      }
      if (!articleNav.classList.contains('sticky-start') && articleNav.classList.contains('sticky-end') && window.scrollY >= articleStart && window.scrollY <= articleEnd + articleNavHeight) {
        articleNav.classList.add('sticky-start');
        articleNav.classList.remove('sticky-end');
        articleNav.style.top = 0 + 'px';
      }
      if (articleNav.classList.contains('sticky-start') && window.scrollY >= articleStart && window.scrollY >= articleEnd - articleNavHeight - articleNavHeight) {
        articleNav.classList.remove('sticky-start');
        articleNav.classList.add('sticky-end');
        articleNav.style.top = 0 + 'px';
      }
    } else if (!mobile) {
      if (window.scrollY < articleStart && !articleNav.classList.contains('sticky-start')) {
        // console.log("1");
        articleNav.style.top = 0 + 'px';
      }
      if (window.scrollY < articleStart && articleNav.classList.contains('sticky-start')) {
        // console.log("2");
        articleNav.classList.remove('sticky-start');
        articleNav.style.top = 0 + 'px';
      }
      if (window.scrollY >= articleStart && window.scrollY <= articleEnd && !articleNav.classList.contains('sticky-start') && !articleNav.classList.contains('sticky-end')) {
        // console.log("3");
        articleNav.classList.add('sticky-start');
        articleNav.style.top = 0 + 'px';
      }
      if (window.scrollY >= articleStart && window.scrollY <= articleEnd - articleNavHeight && !articleNav.classList.contains('sticky-start') && articleNav.classList.contains('sticky-end')) {
        // console.log("4");
        articleNav.classList.add('sticky-start');
        articleNav.classList.remove('sticky-end');
        articleNav.style.top = 0 + 'px';
      }
      if (window.scrollY >= articleEnd - articleNavHeight - 140 && articleNav.classList.contains('sticky-start')) {
        // console.log("5");
        articleNav.classList.remove('sticky-start');
        articleNav.classList.add('sticky-end');
        articleNav.style.top = 0 + 'px';
      }
    }
  }
  window.addEventListener('scroll', setNavPosition);
  setNavPosition();
});