const sectionContactInfo = document.querySelector('#contact-info');
const radioEventDirectorCurrent = document.querySelector('#contactTypeEventDirectorCurrent');
const radioEventDirectorOther = document.querySelector('#contactTypeEventDirectorOther');
let googlePlaceContact = null;
let contactsFromApi = [];
let latestContact = null;

(function () {
    radioEventDirectorCurrent.addEventListener('click', handleContactTypeEventDirector);
    radioEventDirectorOther.addEventListener('click', handleContactTypeEventDirector);
    autocompleteContactsByName(document.getElementById('LookupEventDirectorName'));
    //   $('input[name="ContactPhonePrimary"]').mask('000-000-0000');
    //   $('input[name="NewContactPhonePrimary"]').mask('000-000-0000');
    checkInitContactData();
})();


function toggleEventDirectorSection(status, section) {
    if (status === 'show') {
      document.querySelector(`.contact-info__${section}--container`).style.display = 'block';
      document.querySelector(`.contact-info__${section}--container`).style.visibility = 'visible';
    } else {
      document.querySelector(`.contact-info__${section}--container`).style.display = 'none';
      document.querySelector(`.contact-info__${section}--container`).style.visibility = 'hidden';
    }
}
  
function getContact() {
    let contact = null;
    const listContainer = document.querySelector('.section#contact-info .list__container .row');
    if (listContainer) {
        const contactItems = listContainer.querySelectorAll('.list-item');
        if (contactItems) {
        for (let i = 0; i < contactItems.length; i += 1) {
            contact = {
            firstName: contactItems[i].querySelector('.contact-name').innerHTML.split(' ')[0].trim(),
            lastName: contactItems[i].querySelector('.contact-name').innerHTML.split(' ')[1].trim(),
            email: contactItems[i].querySelector('.contact-email').innerHTML,
            phone: contactItems[i].querySelector('.contact-phone').innerHTML,
            city: contactItems[i].querySelector('.contact-location') ? contactItems[i].querySelector('.contact-location').innerHTML.split(',')[0] : '',
            state: contactItems[i].querySelector('.contact-location') ? contactItems[i].querySelector('.contact-location').innerHTML.split(',')[1].trim() : '',
            swimmerId: contactItems[i].querySelector('.contact-id__value') ? contactItems[i].querySelector('.contact-id__value').innerHTML : '',
            };
        }
    } else {
        alert("Contact Unknown");
    }
}
return contact;
}

function editContact() {
    setSectionInputStatus(sectionContactInfo, false);
    sectionContactInfo.classList.add('isEdit');
}

function handleBlur(input) {
    validateField(input);
}

function cancelContact() {
    setSectionInputStatus(sectionContactInfo, true);
    sectionContactInfo.classList.remove('isEdit');
}

function hideContactConfirmation() {
    if (sectionContactInfo) {
      const contactConfirmation = sectionContactInfo.querySelector('.lookup-confirm');
      if (contactConfirmation) {
        document.querySelector('#lookupEventDirectorName').value = '';
        contactConfirmation.classList.remove('show');
      }
    }
}

function removeContact(e) {
    e.preventDefault();
    const contactList = sectionContactInfo.querySelector('.list__container');
    contactList.classList.add('list__container--modified');
  
    const removedItems = sectionContactInfo.querySelectorAll('.list-item__delete');
    for (let i = 0; i < removedItems.length; i += 1) {
  
      const contactItem = removedItems[i].parentNode;
      contactItem.classList.add('list-item--fade-out');
      setTimeout(() => {
        $('.club-privacy').hide();
        contactItem.style.display = 'absolute';
        contactItem.parentNode.style.display = 'none';
      }, 250);
    }
}

function showContactConfirmation() {
    if (sectionContactInfo) {
      const contactConfirmation = sectionContactInfo.querySelector('.lookup-confirm');
      if (contactConfirmation) {
        contactConfirmation.classList.add('show');
      }
    }
}  

function setCurrentContact(contact) {
    latestContact = contact;
    if (sectionContactInfo) {
        const contactName = sectionContactInfo.querySelector('.lookup-confirm--name');
        if (contactName) {
            contactName.innerHTML = `Add ${contact.firstName} ${contact.lastName}`;
        }
    }
    showContactConfirmation();
}

function clearContactInputs() {
    // alert("Clearing contact inputs ...")
    document.querySelector('#newEventDirectorFirstName').value = '';
    setInputStatus(document.querySelector('#newEventDirectorFirstName'), true);
    document.querySelector('#newEventDirectorLastName').value = '';
    setInputStatus(document.querySelector('#newEventDirectorLastName'), true);
    document.querySelector('#newEventDirectorEmailPrimary').value = '';
    setInputStatus(document.querySelector('#newEventDirectorEmailPrimary'), true);
    document.querySelector('#newEventDirectorPhonePrimary').value = '';
    setInputStatus(document.querySelector('#newEventDirectorPhonePrimary'), true);
    document.querySelector('#newEventDirectorCity').value = '';
    setInputStatus(document.querySelector('#newEventDirectorCity'), true);
  
    $('#newEventDirectorState').val('Select State');
}

function hideContactLookupInputs() {
    $('.contact-info__event-director-other--container').hide();
    $(".contact-info__event-director-other--add-new").hide();
    clearContactInputs();
    hideContactConfirmation();
}

// Do we need Not Member lookup? <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<!!!!!!!!!!!!
// function showNewContactInputs() {
//     $('.club-contact__not-member-container').show();
//     document.querySelector('.club-contact__not-member-container').style.visibility = 'visible';
// }
function showNewEventDirectorInputs() {
    $('.contact-info__event-director--add-new-container').show();
    document.querySelector('.contact-info__event-director--add-new-container').style.display = 'block';
}


function cancelContactList() {
    const list = sectionContactInfo.querySelector('.list');
    const contactItemsHidden = sectionContactInfo.querySelectorAll('.list-item--fade-out');
    if (contactItemsHidden.length >= 1) {
      for (let i = 0; i < contactItemsHidden.length; i += 1) {
        contactItemsHidden[i].classList.remove('list-item--fade-out');
      }
    }
    setTimeout(() => {
      for (let i = 0; i < contactItemsHidden.length; i += 1) {
        contactItemsHidden[i].parentNode.style.display = 'block';
        $('.club-privacy').show();
      }
    }, 250);
    list.classList.remove('edit-list');
    document.getElementById('saveContact').disabled = false;
}

const editContactListButton = document.querySelector('#editContactList');
editContactListButton.addEventListener('click', function(e) {
    editContactList(e);
});
function editContactList() {
    const list = document.querySelector('.section#contact-info .list');
    if (list.classList.contains('edit-list')) {
      list.classList.remove('edit-list');
      cancelContactList();
      document.getElementById('saveContact').disabled = false;
    } else {
      list.classList.add('edit-list');
      $('#saveContactList').show();
      document.getElementById('saveContact').disabled = true;
    }
    const contactType = sectionContactInfo.querySelector('input[name="ContactTypeEventDirector"]:checked');
    if (!getContact() && contactType.value === 'contactTypeEventDirectorOther') {
    //   toggleContactSection('show', 'other');
    //   toggleContactSection('hide', 'not-member');
      toggleEventDirectorSection('show', 'event-director-other');
    //   toggleEventDirectorSection('hide', 'event-director-current');
      document.querySelector('#lookupEventDirectorName').focus();
    }
}

function removeCurrentContacts() {
    const listContainer = document.querySelector('.section#contact-list .list__container .row');
    if (listContainer) {
      const contactItems = listContainer.querySelectorAll('.list-item');
      if (contactItems) {
        while (listContainer.firstChild) {
          listContainer.removeChild(listContainer.firstChild);
        }
      }
    }
    $('.club-privacy').hide();
}

function uncheckContactTypeRadios() {
    radioEventDirectorCurrent.checked = false;
    radioEventDirectorOther.checked = false;
}

// Add event listener due to button onclick not working <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// const confirmCurrentEventDirectorButton = document.querySelector('#confirmCurrentEventDirector');
// confirmCurrentEventDirectorButton.addEventListener('click', function(e) {
//     confirmCurrentEventDirector(e);
// });
function confirmCurrentEventDirector() {
    alert("1");
    document.querySelector('#confirmCurrentEventDirector').style.display = 'none';
    document.querySelector('#saveContactInfoSection').disabled = false;
    $('.contact-info__event-director-type-form').hide();
    $('.club-privacy input[type="checkbox"]').removeAttr('checked');
    $('.club-privacy').show();
    $('.contact-list__event-director--header').show();
}

function addContact(contact, headerText = '', removeCurrent = true, fromApi = false) {
    alert("Adding contact ...");
    latestContact = null;
    if (removeCurrent) removeCurrentContacts();
  
    const listContainer = document.querySelector('.section#contact-info .list__container .row');
    hideContactLookupInputs();
    $('#listContactSettings').show();
    if (listContainer) {
      const col = document.createElement('div');
      col.className = 'col-xs-12 col-sm-6 col-md-4 contact-column';
      const div = document.createElement('div');
      if (fromApi) {
        div.className = 'list-item list-item--fade-out';
      } else {
        div.className = 'list-item list-item--fade-out list-item--new';
      }
      const button = document.createElement('button');
      button.innerHTML = 'Remove';
      button.classList.add('list-item__delete');
      button.addEventListener('click', removeContact);
      const name = document.createElement('div');
      name.classList.add('contact-name');
      name.innerHTML = `${contact.firstName} ${contact.lastName}`;
      const phone = document.createElement('div');
      phone.classList.add('contact-phone');
      phone.innerHTML = contact.phone;
      const email = document.createElement('div');
      email.classList.add('contact-email');
      email.innerHTML = contact.email;

      const location = document.createElement('div');
      location.classList.add('contact-location');
      location.innerHTML = `${contact.city}, ${contact.state}`;
  
      const validated = document.createElement('div');
      validated.classList.add('coach-validated');
      validated.innerHTML = 'Account Pending';
  
      let isMember = GetBoolean(contact.isMember);
  
      const id = document.createElement('div');
      id.classList.add('contact-id');
      if (!isMember) {
        id.style.display = 'none';
      }
  
      const hiddenIsMember = document.createElement('input');
      hiddenIsMember.type = 'hidden';
      hiddenIsMember.className = 'contact-isMember';
      hiddenIsMember.value = contact.isMember;
      div.appendChild(hiddenIsMember);
  
      const idValue = document.createElement('span');
      idValue.className = 'contact-id__value';
      idValue.innerHTML = contact.swimmerId;
      id.innerHTML = `${memberIdText} `;
      id.appendChild(idValue);
  
      div.appendChild(button);
  
      if (headerText !== '') {
        const header = document.createElement('div');
        header.classList.add('contact-header');
        header.innerHTML = `${headerText}`;
  
        div.appendChild(header);
      }
  
      let validatedBool = true;
      if (typeof contact.validated !== 'undefined') {
        validatedBool = GetBoolean(contact.validated);
      }
  
      if (!validatedBool) {
        div.appendChild(validated);
      }
      setSubmitStatus(validatedBool);
  
      div.appendChild(name);
      if (contact.city && contact.state) {
        div.appendChild(location);
      }
      div.appendChild(phone);
      div.appendChild(email);
  
      div.appendChild(id);
  
      col.appendChild(div);
      listContainer.appendChild(col);
      setTimeout(() => {
        div.classList.remove('list-item--fade-out');
      }, 250);
  
      if (!validatedBool || unvalidatedContactOnPage()) {
        document.querySelector('.contact-list__event-director--awaiting-message').style.display = 'block';
      } else {
        document.querySelector('.contact-list__event-director--awaiting-message').style.display = 'none';
      }
    }
}

// function addNewNonmemberContact(contact) {
//     const xhr = new XMLHttpRequest();
//     const formData = new FormData();
  
//     // gather the data
//     formData.append('firstName', contact.firstName);
//     formData.append('lastName', contact.lastName);
//     formData.append('email', contact.email);
//     formData.append('phoneNumber', contact.phone);
//     formData.append('city', contact.city);
//     formData.append('state', contact.state);
  
//     // create the api event
//     xhr.open('POST', `/apis/v1/account/club/`, true);
//     xhr.withCredentials = true;
//     xhr.onload = function () {
//       hideLoadingOverlay();
//       const status = xhr.status;
//       if (status === 200) {
//         const response = JSON.parse(xhr.response);
//         if (response.data) {
//           contact.swimmerId = response.data;
//           addContact(contact);
//           $('.list__header').show();
//           $('.contact-type-form').hide();
//           showNewContact_RecentlyAdded();
//           document.querySelector('#saveContact').disabled = false;
//           $('.club-privacy input[type="checkbox"]').removeAttr('checked');
//           $('.club-privacy').show();
//         } else {
//           showErrorModal(response.error);
//         }
//       } else {
//         showErrorModal('Error saving club information');
//       }
//     };
//     xhr.send(formData);
//   }

// function validateNotMemberForm() {
//     const inputFirstName = document.querySelector('#newContactFirstName');
//     const inputLastName = document.querySelector('#newContactLastName');
//     const inputPhone = document.querySelector('#newContactPhonePrimary');
//     const inputEmail = document.querySelector('#newContactEmailPrimary');
//     const inputCity = document.querySelector('#newContactCity');
//     const inputState = document.querySelector('#newContactState');
//     validateField(inputFirstName);
//     validateField(inputLastName);
//     validateField(inputPhone);
//     validateField(inputEmail);
//     validateField(inputCity);
//     validateField(inputState);
  
//     const formNotMember = document.querySelector('.club-contact__not-member-container');
//     if (sectionContainsErrors(formNotMember)) {
//       window.scroll(0, FindPos(formNotMember.querySelectorAll('span.help-block.has-error')[0]));
//       return false;
//     }
//     return true;
// }

function buildContact() {
    const inputFirstName = document.querySelector('#newEventDirectorFirstName');
    const inputLastName = document.querySelector('#newEventDirectorLastName');
    const inputPhone = document.querySelector('#newEventDirectorPhonePrimary');
    const inputEmail = document.querySelector('#newEventDirectorEmailPrimary');
    const inputCity = document.querySelector('#newEventDirectorCity');
    const inputState = document.querySelector('#newEventDirectorState');
    const contact = {
      swimmerId: '',
      firstName: inputFirstName.value,
      lastName: inputLastName.value,
      email: inputEmail.value,
      phone: inputPhone.value,
      city: inputCity.value,
      state: inputState.value,
      validated: false,
      isMember: false,
    };
    hideContactLookupInputs();
    addNewNonmemberContact(contact);
}

// AJAX Request here needs wired up <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
function checkContactExists(email) {
    // showLoadingOverlay();
    // const xhr = new XMLHttpRequest();
    // xhr.open('GET', `/apis/v1/account/swimmerexists?email=${email}`, true);
    // xhr.withCredentials = true;
    // xhr.onload = function () {
    //   if (xhr.status === 200) {
    //     const response = JSON.parse(xhr.response);
    //     if (!response.error) {
    //       if (response.data) {
    //         hideLoadingOverlay();
    //         return false;
    //       }
    //       return true;
    //     }
    //     hideLoadingOverlay();
    //     showErrorModal(response.error);
    //     return false;
    //   }
    //   hideLoadingOverlay();
    //   showErrorModal(`${errorSavingContactText}`);
    //   return false;
    // };
    // xhr.send();
    return true;
}

function handleAddContactButton() {
    if (!validateNotMemberForm()) {
      return;
    }  
    const email = document.querySelector('#newEventDirectorEmailPrimary').value;
    if (checkContactExists(email)) {
      buildContact();
    }
}

function checkInitContactData() {
    // alert("Checking initial contact data ...");
    document.querySelector('#confirmCurrentEventDirector').style.display = 'none';
    const contactType = sectionContactInfo.querySelector('input[name="EventDirectorType"]:checked');
    if (!contactType) {
        // alert("No contact type ...");
        document.querySelector('.section#contact-info').classList.remove('hasData');
        $('.contact-list__event-director--header').hide();
        $('#listContactSettings').hide();
        return;
    }
    if (contactType.value) {
        alert("Contact type has value ...");
        const contact = {
            swimmerId: document.querySelector('#newEventDirectorSwimmerId').value,
            firstName: document.querySelector('#newEventDirectorFirstName').value,
            lastName: document.querySelector('#newEventDirectorLastName').value,
            email: document.querySelector('#newEventDirectorEmail').value,
            phone: document.querySelector('#newEventDirectorPhone').value,
            validated: document.querySelector('#newEventDirectorValidated').value,
            isMember: document.querySelector('#newEventDirectorIsMember').value,
            city: document.querySelector('#newEventDirectorCity').value,
            state: document.querySelector('#newEventDirectorState').value,
        };
    
        let contactValidated = GetBoolean(contact.validated);
        if (!contactValidated) {
            addContact(contact, `${awaitingContactText}`, false);
        } else {
            addContact(contact, '', false);
        }
    
        if (!contactValidated) {
            const currentContact = {
                swimmerId: document.querySelector('#currentEventDirectorSwimmerId').value,
                firstName: document.querySelector('#currentEventDirectorFirstName').value,
                lastName: document.querySelector('#currentEventDirectorLastName').value,
                email: document.querySelector('#currentEventDirectorEmail').value,
                phone: document.querySelector('#currentEventDirectorPhone').value,
                validated: document.querySelector('#currentEventDirectorValidated').value,
                isMember: document.querySelector('#currentEventDirectorIsMember').value,
                city: document.querySelector('#currentEventDirectorCity').value,
                state: document.querySelector('#currentEventDirectorState').value,
            };
            addContact(currentContact, `${currentContactText}`, false);
        }
    
        document.querySelector('.section#contact-list').classList.add('hasData');
        $('.contact-list__event-director--header').show();
        $('.contact-type-form').hide();
        $('#listContactSettings').show();
        document.querySelector('#saveContact').disabled = false;
    } else {
        document.querySelector('.section#contact-list').classList.remove('hasData');
        $('.contact-list__event-director--header').hide();
        $('#listContactSettings').hide();
        uncheckContactTypeRadios();
        $('.contact-type-form').show();
    }
}

function setContactTitle(e) {
    e.preventDefault();
    $('.contact-info__event-director-type-form').hide();
    $('.contact-info__event-director-other--add-new').hide();
    hideContactConfirmation();
    addContact(latestContact);
    $('.contact-list__headecontact-list__event-director--headerr').show();
    const list = document.querySelector('.section#contact-list .list');
    list.classList.remove('edit-list');
    $('.club-privacy input[type="checkbox"]').removeAttr('checked');
    $('.club-privacy').show();
    document.querySelector('#saveContact').disabled = false;
}

function handleContactTypeEventDirector(e) {
    validateField(radioEventDirectorCurrent);
    clearContactInputs();
    document.querySelector('#lookupEventDirectorName').value = '';
    switch (e.target.value) {
        case 'contactTypeEventDirectorCurrent': {
            $('.contact-list__event-director--header').hide();
            toggleEventDirectorSection('hide', 'event-director-other');
            // toggleEventDirectorSection('hide', 'not-member');
            document.querySelector('#confirmCurrentEventDirector').style.display = 'block';
            document.querySelector('.contact-info__event-director-other--add-new').style.display = 'none';
            if (!document.querySelector('#currentEventDirectorSwimmerId').value) {
                        
            // document.querySelector('.contact-info__event-director--add-new-container').style.display = 'none';
            // document.querySelector('.contact-info__event-director--add-new-container').style.visibility = 'hidden';
            
            // this is a non member login, get details from profile
            document.querySelector('#newContactFirstName').value = document.querySelector('#newEventDirectorFirstName').value;
            document.querySelector('#newContactLastName').value = document.querySelector('#newEventDirectorLastName').value;
            document.querySelector('#newContactEmailPrimary').value = document.querySelector('#newEventDirectorEmail').value;
            document.querySelector('#newContactPhonePrimary').value = document.querySelector('#newEventDirectorPhone').value;
            if (document.querySelector('#currentEventDirectorCity').value && document.querySelector('#currentEventDirectorState')) {
                    document.querySelector('#newContactCity').value = document.querySelector('#currentEventDirectorCity').value;
                    document.querySelector('#newContactState').value = document.querySelector('#currentEventDirectorState').value;
                }
        
                // disable it because it is their login
                document.querySelector('#newContactEmailPrimary').disabled = true;
                return;
            }
            const contact = {
            firstName: document.querySelector('#currentEventDirectorFirstName').value,
            lastName: document.querySelector('#currentEventDirectorLastName').value,
            swimmerId: document.querySelector('#currentEventDirectorSwimmerId').value,
            email: document.querySelector('#currentEventDirectorEmail').value,
            phone: document.querySelector('#currentEventDirectorPhone').value,
            validated: document.querySelector('#currentEventDirectorValidated').value,
            city: document.querySelector('#currentEventDirectorCity').value,
            state: document.querySelector('#currentEventDirectorState').value,
            isMember: document.querySelector('#currentEventDirectorIsMember').value,
            };
            setCurrentContact(contact);
            addContact(contact);
            break;
        }
        case 'contactTypeEventDirectorOther': {
            toggleEventDirectorSection('show', 'event-director-other');
            // toggleContactSection('hide', 'not-member');
            toggleEventDirectorSection('hide', 'event-director-current'); // Might not need to hide this section
            document.getElementById('lookupEventDirectorName').focus();
            document.querySelector('#confirmCurrentEventDirector').style.display = 'none';
            document.querySelector('.contact-info__event-director-other--add-new').style.display = 'block';
            break;
      
            // document.querySelector('.contact-info__event-director-other--add-new').style.display = 'block';
            // document.querySelector('.contact-info__event-director-other--add-new').style.visibility = 'visible';
            // document.querySelector('.contact-info__event-director-other--container').style.display = 'block';
            // document.querySelector('.contact-info__event-director-other--container').style.visibility = 'visible';
            // document.querySelector('.contact-column').style.display = 'none'; // This is a static container now; will be dynamically written markup and inner html
            // document.querySelector('#confirmCurrentEventDirector').style.display = 'none';
            // break;
        }
        default:
    }
}

function handleContactConfirmation(e) {
    $('#modalContactInfoConfirmation').modal('hide');
    // selectContactType.value = 'contactOther';
    handleContactType(e);
}

// Add event listener due to button onclick not working <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const saveContactListButton = document.querySelector('#saveContactList');
saveContactListButton.addEventListener('click', function(e) {
    saveContactList(e);
});
function saveContactList() {
    const updatedItems = sectionContactInfo.querySelectorAll('.list-item--new');
    for (let i = 0; i < updatedItems.length; i += 1) {
      updatedItems[i].classList.remove('list-item--new');
    }
    const removedItems = sectionContactInfo.querySelectorAll('.list-item--fade-out');
    for (let i = 0; i < removedItems.length; i += 1) {
      removedItems[i].parentNode.parentNode.removeChild(removedItems[i].parentNode);
    }
    const list = document.querySelector('.section#contact-list .list');
    list.classList.remove('edit-list');
    list.querySelector('.list__container').classList.remove('list__container--modified');
    if (sectionContactInfo.querySelectorAll('.list-item').length > 0) {
      document.querySelector('.section#contact-list').classList.add('hasData');
    } else {
      document.querySelector('.section#contact-list').classList.remove('hasData');
      $('.contact-list__event-director--header').hide();
      $('#listContactSettings').hide();
      uncheckContactTypeRadios();
      $('.contact-info__event-director-type-form').show();
    }
}

function validateSectionContact() {
    validateField(radioEventDirectorCurrent);
    if (sectionContainsErrors(sectionContactInfo)) {
      hideLoadingOverlay();
      window.scroll(0, FindPos(sectionContactInfo.querySelectorAll('span.help-block.has-error')[0]));
      return false;
    }
    if (!getContact()) return false;
    return true;
}

// AJAX Request here needs wired up <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
function saveContact(e) {
    e.preventDefault();
    showLoadingOverlay();
  
    if (!validateSectionContact()) {
      hideLoadingOverlay();
      showErrorModal(`${contactRequiredText}`);
      return;
    }
  
    checkContactDataValid();
  
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
  
    const contact = getContact();
    formData.append('ContactSwimmerID', contact.swimmerId);
    formData.append('ContactFirstName', contact.firstName);
    formData.append('ContactLastName', contact.lastName);
    formData.append('ContactEmailPrimary', contact.email.toLowerCase());
    formData.append('ContactPhonePrimary', contact.phone);
    formData.append('ContactCity', contact.city);
    formData.append('ContactState', contact.state);
    // formData.append('ContactType', selectContactType.value.replace('contact', ''));
    const contactTypeValue = document.querySelector('input[type="radio"][name="ContactType"]:checked').value.replace('contact', '');
    formData.append('ContactType', contactTypeValue);
    formData.append('DisplayName', document.querySelector('#privacyName').checked);
    formData.append('DisplayEmail', document.querySelector('#privacyEmail').checked);
    formData.append('DisplayPhone', document.querySelector('#privacyPhone').checked);
  
    const clubId = getUrlParams('clubId');
    formData.append('clubId', clubId);
  
    // xhr.open('POST', '/apis/v1/clubweb/section/contact', true);
    // xhr.withCredentials = true;
    // xhr.onload = function () {
    //   hideLoadingOverlay();
    //   if (xhr.status === 200) {
    //     const response = JSON.parse(xhr.response);
    //     if (!response.error) {
    //       setSectionInputStatus(document.querySelector('#club-contact'), true);
    //       sectionClubContact.classList.remove('isEdit');
    //       cancelContact();
    //       if (nextSection) {
    //         $(nextSection).find('.section__content').collapse('show');
    //         nextSection = null;
    //       } else {
    //         const regionalClub = document.querySelector('#regionalClub');
    //         if (regionalClub && regionalClub.checked) $('#club-contact .section__content').collapse('hide');
    //         setSectionInputStatus(document.querySelector('#contact'), false);
    //         $('#coach .section__content').collapse('show');
    //       }
    //     } else {
    //       showErrorModal(response.error);
    //     }
    //   } else {
    //     showErrorModal(`${errorSavingContactText}`);
    //   }
    // };
    // xhr.send(formData);
}

function showNewContact_RecentlyAdded() {
    showNewContactMessage();
  
    $('#contact__recentlyadded').show();
    hideNewContact_RecentlyAdded();
    hideNewContact_RecentlyAdded();
}

function showNewContact_RecentlyAdded_Valid() {
    showNewContactMessage();
  
    hideNewContact_RecentlyAdded();
    $('#contact__recentlyadded-valid').show();
    hideNewContact_RecentlyAdded();
}

function showNewContact_RecentlyAdded_Invalid() {
    showNewContactMessage();
  
    hideNewContact_RecentlyAdded();
    hideNewContact_RecentlyAdded();
    $('#contact__recentlyadded-invalid').show();
}

function hideNewContact_RecentlyAdded() {
    $('#contact__recentlyadded').hide();
}

function hideNewContact_RecentlyAdded_Valid() {
    $('#contact__recentlyadded-valid').hide();
}

function hideNewContact_RecentlyAdded_Invalid() {
    $('#contact__recentlyadded-invalid').hide();
}

function showNewContactMessage() {
    $('.contact-info-event-director__current-message').show();
}

// Add event listener due to button onclick not working <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// const cancelAddEventDirectorBtnButton = document.querySelector('#cancelAddEventDirector');
// cancelAddEventDirectorBtnButton.addEventListener('click', function(e) {
//     handleCancelAddEventDirector(e);
// });
function handleCancelAddEventDirector() {
    hideContactLookupInputs();
    uncheckContactTypeRadios();
}

function GetBoolean(input) {
    let data = true;
    if (typeof input === 'boolean') {
      data = input;
    } else {
      data = input.toLowerCase() === 'true';
    } 
    return data;
}

function unvalidatedContactOnPage() {
    var unvalidatedContact = sectionContactInfo.querySelector('.coach-validated');
  
    if (unvalidatedContact)
      return true;
    else
      return false;  
}  