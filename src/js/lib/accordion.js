// Ports production/src/Feature/Accordion/code/Scripts/Accordion/Accordion.js verbatim (the
// Sitecore content-accordion component -- .accordion-frame/.accordion/.accordion__header, not
// the separate React Accordion.jsx used elsewhere in the app). Styling for these classes ships
// in the vendored common.min.css/usms.min.css bundles already loaded by head-css.njk.

function openAccordion(accordion) {
  if (!accordion) return;
  var currentContent = accordion.querySelector('.accordion__content');
  var currentIcon = accordion.querySelector('.accordion__icon');
  currentContent.classList.add('accordion__content--shown');
  currentContent.style.height = currentContent.scrollHeight + 'px';
  currentIcon.classList.add('fa-rotate-180');
  currentIcon.classList.add('fa-minus-square');
  currentIcon.classList.remove('fa-plus-square');
}

function closeAccordion(accordion) {
  if (!accordion) return;
  var currentContent = accordion.querySelector('.accordion__content');
  var currentIcon = accordion.querySelector('.accordion__icon');
  currentContent.classList.remove('accordion__content--shown');
  currentContent.style.height = 0;
  currentIcon.classList.remove('fa-rotate-180');
  currentIcon.classList.remove('fa-minus-square');
  currentIcon.classList.add('fa-plus-square');
}

function handleAccordionClick(e, id) {
  if (!id || document.getElementById(id) === null) return;
  var currentAccordion = document.getElementById(id);
  var accordionFrame = currentAccordion.parentNode;
  if (!accordionFrame) return;

  if (currentAccordion.querySelector('.accordion__content--shown')) {
    closeAccordion(currentAccordion);
    return;
  }

  var accordions = accordionFrame.querySelectorAll('.accordion');
  for (var i = 0; i < accordions.length; i += 1) {
    if (accordions[i].id === id) {
      openAccordion(accordions[i]);
    } else {
      closeAccordion(accordions[i]);
    }
  }
}

(function () {
  var frames = document.querySelectorAll('.accordion-frame');
  for (var i = 0; i < frames.length; i += 1) {
    var firstToOpen = frames[i].querySelector('input[name="firstToOpen"]');
    if (firstToOpen && firstToOpen.value === '1') {
      var firstAccordion = frames[i].querySelector('.accordion');
      if (firstAccordion) openAccordion(firstAccordion);
    }
  }
})();
