/* global setSectionInputStatus, sectionSaved, showSaveModal,
  saveSectionState, getCurrentAlts, getCurrentCoaches, getCurrentLocations,
  setGoldClubFlag, FindPos */
let nextSection = null;
let currentSectionState = null;
let currentCallback = null;
let isRegionalClub = false;

$('#accordion .collapse').on('show.bs.collapse', (e) => {
  console.log("On collapse ...");
  const currentSection = e.target;
  setTimeout(() => {
    // window.scroll(0, FindPos(e.target.parentNode));
  }, 450);

  setSectionInputStatus(currentSection, false);
  currentSection.parentElement.classList.add('isEdit');
  switch (currentSection.id) {    
    case "event-type__content": // console.log("Accordion/onCollapse/Event Type");
    case "event-information__content": // console.log("Accordion/onCollapse/Event Information");
    case "contact-information__content":
    case "location-information__content":
    case "entry-information__content":
    case "accept-submit__content":
    currentSectionState = saveSectionState(currentSection);
    break;
    default:
    break;
  }
  const actives = $('#accordion').find('.in, .collapsing');
  actives.each((index, element) => {
    if (element !== nextSection) {
      $(element).collapse('hide');
    }
  });
});

$('#accordion h3.section__header').on('click', (e) => {
  const currentSection = e.target.parentNode;
  const previousSection = document.querySelector('.section__content.collapse.in');
  console.log("Click header ...");
  // console.log("Current Section is", currentSection.id);
  // console.log("Previous Section is", previousSection.parentNode.id);
  if (!previousSection) {
    console.log("1");
    return;
  }
  if (!sectionSaved(previousSection)) {
    console.log("2");
    nextSection = currentSection;
    // e.stopPropagation();
    // e.preventDefault();
    // showSaveModal(previousSection.querySelector('button.btn.save-section').onclick);
  } else {
    console.log("3");
    nextSection = null;
  }
});

$('#accordion .collapse').on('hide.bs.collapse', (e) => {
  const currentSection = e.target;
  setSectionInputStatus(currentSection, true);
  currentSection.parentElement.classList.remove('isEdit');
});
