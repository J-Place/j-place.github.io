// Enhancement override of production's getArticleEnd()
// (production/src/Project/USMS/code/Scripts/inThisArticle.js:45, vendored in
// swimmerMagazine.min.js). Production ends the sticky In This Article nav at the first
// .related-content on the page; with the "Show in Page" rendering parameter that's the in-page
// copy inside the article column, so it skips .related-content.show-in-page. Proposed dev handoff
// change (show-in-page is new, not in production). Otherwise identical to production.
// Must load after swimmerMagazine.min.js: a later top-level function declaration replaces the
// global one, and production's scroll handler looks getArticleEnd up on every call.
function getArticleEnd() {
  let result = document.querySelector('footer').offsetTop;
  if (document.querySelector('.article-stepper')) {
    result = document.querySelector('.article-stepper').offsetTop;
  }
  if (document.querySelector('.national-sponsors__item') && document.querySelector('.national-sponsors__item').offsetTop < result) {
    const nationalSponsorsWrapper = findParentElementByClass(document.querySelector('.national-sponsors__item'), 'bg-blue');
    if (nationalSponsorsWrapper) {
      result = nationalSponsorsWrapper.offsetTop;
    } else {
      result = document.querySelector('.national-sponsors__item').offsetTop;
    }
  }
  const relatedContent = document.querySelector('.related-content:not(.show-in-page)');
  if (relatedContent && relatedContent.offsetTop < result) {
    result = relatedContent.offsetTop;
  }
  return result;
}
