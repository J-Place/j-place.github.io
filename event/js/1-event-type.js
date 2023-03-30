/* global saveEventType */
const sectionEventType = document.querySelector('#event-type');

(function () {

  const eventTypeAnsweredPool = document.querySelector('#eventTypeAnsweredPool');
  const eventTypeAnsweredOpenWater = document.querySelector('#eventTypeAnsweredOpenWater');

  // const lmsc = document.querySelector('#selectLmsc');
  // const club = document.querySelector('#selectClub');
  // const name = document.querySelector('#clubName');
  // const abbr = document.querySelector('#clubAbbr');

  // lmsc.addEventListener('change', handleLmscChange);

  if (eventTypeAnsweredPool) {
    eventTypeAnsweredPool.addEventListener('click',
      function () {
        console.log("Pool Event");
        // validateField(eventTypeAnsweredPool);
      });
  }
  if (eventTypeAnsweredOpenWater) {
    eventTypeAnsweredOpenWater.addEventListener('click',
      function () {
        console.log("Open Water Event");
        // validateField(eventTypeAnsweredOpenWater);
      });
  }
  
  currentSectionState = saveSectionState(sectionEventType);
  // console.log(currentSectionState);
})();

// function saveEventType(e) {
//   'use strict';
//   // alert("Save");
//     e.preventDefault();
//     showLoadingOverlay();
// }

const saveEventTypeButton = document.querySelector('#saveEventType');
saveEventTypeButton.addEventListener('click', function(e) {
  // alert("Save");
  e.preventDefault();
  showLoadingOverlay();
  console.log("Dynamically Set Next Section is", nextSection);
  if (nextSection) {
    $(nextSection).find('.section__content').collapse('show');
    nextSection = null;
  } else {
    console.log("Manually Set Next Section in Event Info");
    $('#event-type .section__content').collapse('hide');
    $('#event-info .section__content').collapse('show');
  }

});