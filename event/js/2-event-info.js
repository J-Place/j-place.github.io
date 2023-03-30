
// const sectionClubContact = document.querySelector('#club-contact');
const sectionContactInfo = document.querySelector('#contact-info');
// const selectContactType = document.querySelector('#contactType');
const radioEventDirectorCurrent = document.querySelector('#eventDirectorCurrent');
const radioEventDirectorOther = document.querySelector('#eventDirectorOther');
// let googlePlaceContact = null;
// let contactsFromApi = [];
// let latestContact = null;

(function () {
  radioEventDirectorCurrent.addEventListener('click', handleEventDirector);
  radioEventDirectorOther.addEventListener('click', handleEventDirector);
//   autocompleteContactsByName(document.getElementById('lookupContactName'));
//   $('input[name="ContactPhonePrimary"]').mask('000-000-0000');
//   $('input[name="NewContactPhonePrimary"]').mask('000-000-0000');
//   checkInitContactData();
})();



function toggleContactInfoSection(status, section) {
    if (status === 'show') {
      document.querySelector(`.club-contact__${section}-container`).style.display = 'block';
      document.querySelector(`.club-contact__${section}-container`).style.visibility = 'visible';
    } else {
      document.querySelector(`.club-contact__${section}-container`).style.display = 'none';
      document.querySelector(`.club-contact__${section}-container`).style.visibility = 'hidden';
    }
  }
  
  function getContact() {
    let contact = null;
    const listContainer = document.querySelector('.section#club-contact .list__container .row');
    if (listContainer) {
      const contactItems = listContainer.querySelectorAll('.list-item');
      if (contactItems) {
        for (let i = 0; i < contactItems.length; i += 1) {
          contact = {
            firstName: contactItems[i].querySelector('.contact-name').innerHTML.split(' ')[0].trim(),
            city: contactItems[i].querySelector('.contact-location') ? contactItems[i].querySelector('.contact-location').innerHTML.split(',')[0] : '',
            state: contactItems[i].querySelector('.contact-location') ? contactItems[i].querySelector('.contact-location').innerHTML.split(',')[1].trim() : '',
            lastName: contactItems[i].querySelector('.contact-name').innerHTML.split(' ')[1].trim(),
            phone: contactItems[i].querySelector('.contact-phone').innerHTML,
            email: contactItems[i].querySelector('.contact-email').innerHTML,
            swimmerId: contactItems[i].querySelector('.contact-id__value') ? contactItems[i].querySelector('.contact-id__value').innerHTML : '',
          };
        }
      }
    }
    return contact;
  }
  
  function editContact() {
    setSectionInputStatus(sectionClubContact, false);
    sectionClubContact.classList.add('isEdit');
  }









function handleEventDirector(e) {
    // validateField(radioContactTypeCurrent);
    // clearContactInputs();
    // document.querySelector('#lookupContactName').value = '';
    switch (e.target.value) {
        case 'eventDirectorCurrent': {
            // $('.contact-list__header').hide();
            // toggleContactSection('hide', 'other');
            // toggleContactSection('hide', 'not-member');
            // document.querySelector('#confirmCurrentContact').style.display = 'block';
            
            // document.querySelector('.list__event-director-current').style.display = 'block';
            document.querySelector('.contact-column').style.display = 'block'; // This is a static container now; will be dynamically written markup and inner html
            document.querySelector('#confirmCurrentContact').style.display = 'block';
            
            // document.querySelector('.club-contact__add-new').style.display = 'none';
            document.querySelector('.contact-info__event-director-other--container').style.display = 'none';
            document.querySelector('.contact-info__event-director--add-new-container').style.display = 'none';
            document.querySelector('.contact-info__event-director-other--add-new').style.display = 'none';
            // $('.contact-info__event-director-other--container').hide();

            if (!document.querySelector('#currentSwimmerId').value) {
            // this is a non member login, get details from profile
            // document.querySelector('#newContactFirstName').value = document.querySelector('#currentFirstName').value;
            // document.querySelector('#newContactLastName').value = document.querySelector('#currentLastName').value;
            // document.querySelector('#newContactEmailPrimary').value = document.querySelector('#currentEmail').value;
            // document.querySelector('#newContactPhonePrimary').value = document.querySelector('#currentPhone').value;
                if (document.querySelector('#currentCity').value && document.querySelector('#currentState')) {
                    // document.querySelector('#newContactCity').value = document.querySelector('#currentCity').value;
                    // document.querySelector('#newContactState').value = document.querySelector('#currentState').value;
                }
        
                // disable it because it is their login
                // document.querySelector('#newContactEmailPrimary').disabled = true;
                return;
            }
            // const contact = {
            // firstName: document.querySelector('#currentFirstName').value,
            // lastName: document.querySelector('#currentLastName').value,
            // swimmerId: document.querySelector('#currentSwimmerId').value,
            // email: document.querySelector('#currentEmail').value,
            // phone: document.querySelector('#currentPhone').value,
            // validated: document.querySelector('#currentValidated').value,
            // city: document.querySelector('#currentCity').value,
            // state: document.querySelector('#currentState').value,
            // isMember: document.querySelector('#currentIsMember').value,
            // };
            // setCurrentContact(contact);
            // addContact(contact);
            break;
        }
        case 'eventDirectorOther': {
            // toggleContactSection('show', 'other');
            // toggleContactSection('hide', 'not-member');
            // document.getElementById('lookupContactName').focus();
            // document.querySelector('#confirmCurrentContact').style.display = 'none';
            
            document.querySelector('.contact-info__event-director-other--add-new').style.display = 'block';
            document.querySelector('.contact-info__event-director-other--container').style.display = 'block';
            // $('.contact-info__event-director-other--container').show();
            document.querySelector('.contact-column').style.display = 'none'; // This is a static container now; will be dynamically written markup and inner html
            document.querySelector('#confirmCurrentContact').style.display = 'none';
            break;
        }
        default:
    }
}

function showNewEventDirectorInputs() {
    $('.contact-info__event-director--add-new-container').show();
    document.querySelector('.contact-info__event-director--add-new-container').style.visibility = 'visible';
  }
  
  const saveEventInfoButton = document.querySelector('#saveEventInfo');
  saveEventInfoButton.addEventListener('click', function(e) {
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