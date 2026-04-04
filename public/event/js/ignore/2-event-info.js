const sectionEventInfo = document.querySelector('#event-info');
const saveEventInfoButton = document.querySelector('#saveEventInfo');
saveEventInfoButton.addEventListener('click', function(e) {
  sectionEventInfo.classList.add('hasData');
  e.preventDefault();
  showLoadingOverlay();
  console.log("Dynamically Set Next Section is", nextSection);
  if (nextSection) {
    $(nextSection).find('.section__content').collapse('show');
    nextSection = null;
  } else {
    console.log("Manually Set Next Section in Contact Info");
    $('#event-info .section__content').collapse('hide');
    $('#contact-info .section__content').collapse('show');
  }
});
$("#dateStart input").on('change', function () {
});