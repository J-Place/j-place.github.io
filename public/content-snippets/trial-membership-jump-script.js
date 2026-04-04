document.getElementById('trialClubFind').addEventListener('click', function () {
  const targetElement = document.querySelector('.input-group.contact-zip');
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth' });
  } else {
    return;
  }
});