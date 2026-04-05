
// function showLocationInputs() {

// }


/* global regionalClub, hideLoadingOverlay, showLoadingOverlay,
  showErrorModal, validateField, getAddress, setSectionInputStatus,
  FindPos, sectionContainsErrors, closeConfirmationModal, showConfirmationModal,
  getUrlParams, google, nextSection, closeSaveModal, setInputStatus,
  locationMissingInformation, removeText, editText
 */
  const sectionLocation = document.querySelector('.section#club-location');
  const locationDetails = document.querySelector('.location-details');
  const locationName = document.querySelector('#locationName');
  const locationAddressStreet = document.getElementById('locationAddressStreet');
  const locationAddressCity = document.getElementById('locationAddressCity');
  const locationAddressState = document.getElementById('locationAddressState');
  const locationAddressZip = document.getElementById('locationAddressZip');
  const locationAddressStreetGoogle = document.getElementById('locationAddressStreet--google');
  const locationAddressLat = document.getElementById('locationAddressLat');
  const locationAddressLng = document.getElementById('locationAddressLng');
  const locationType = document.getElementById('locationType');
  const locationTypeOther = document.querySelector('.location-type--other');
  const locationTypeOtherInput = document.querySelector('#locationTypeOther');
  const venueNameInput = document.getElementById('venueName');
  const venuePoolSelect = document.getElementById('poolType');
  const venueOpenWaterSelect = document.getElementById('openWaterType');
  const venueCableCourseCheckbox = document.getElementById('venueCableCourse');
  const venueBulkheadCheckbox = document.getElementById('bulkhead');
  const venueAdaCompliantCheckbox = document.getElementById('adaCompliant');
  const venueCableCourseInput = document.getElementById('venueCableCourseValue');
  const venueCableCourseSelect = document.getElementById('venueCableCourseUnit');
  const configurationName = document.getElementById('configurationName');
  const configurationLanes = document.getElementById('configurationLanes');
  const configurationLength = document.getElementById('configurationLength');
  const configurationOtherLength = document.getElementById('configurationOtherLength');
  const configurationUsmsVerified = document.getElementById('usmsVerified');
  const configurationUsmsVerifiedDate = document.getElementById('usmsVerifiedDate');
  const openWaterTypeSelect = document.getElementById('openWaterType');
  let googlePlaceLocation = null;
  let currentLocation = null;
  let currentLocationId = null;
  let currentVenue = null;
  let editingLocation = null;
  let editingPool = null;
  let editingPoolConfiguration = null;
  
  function handleConfigurationLengthChange() {
    const selectedLength = configurationLength.options[configurationLength.selectedIndex].innerHTML;
    if (selectedLength === 'Other') {
      document.querySelector('.input-group--configurationLengthOther').classList.remove('fade');
    } else {
      document.querySelector('.input-group--configurationLengthOther').classList.add('fade');
    }
  }
  
  function isValidAddress() {
    const val = locationAddressStreet.value;
    if (!val.endsWith('USA') || val.split(',').length !== 4) {
      setInputStatus(locationAddressStreet, false);
      return false;
    }
    setInputStatus(locationAddressStreet, true);
    return true;
  }
  
  function updateLocationFields(address) {
    locationAddressStreetGoogle.value = address.address;
    locationAddressCity.value = address.city;
    locationAddressState.value = address.state.short_name;
    locationAddressZip.value = address.zip;
    locationAddressLat.value = address.lat;
    locationAddressLng.value = address.lng;
  }
  
  function handleLocationPlaceChanged() {
    const place = googlePlaceLocation.getPlace();
    if (place === undefined) {
      setInputStatus(locationAddressStreet, false);
      showErrorModal('Error while calling Google Places api, place not found');
      return;
    }
    if (!place.geometry) {
      setInputStatus(locationAddressStreet, false);
      return;
    }
    if (!place.address_components) {
      setInputStatus(locationAddressStreet, false);
      return;
    }
  
    const address = getAddress(place);
    updateLocationFields(address);
    isValidAddress();
  }
  
  function editLocation() {
    sectionLocation.classList.add('isEdit');
    setSectionInputStatus(sectionLocation, false);
  }
  
  function checkLocationData() {
    const locName = document.querySelector('.list-item:not(.list-item--fade-out) .location-name');
    if (locName && locName.value !== '') {
      document.querySelector('.section-location').classList.add('hasData');
      $('#editLocationBtn').show();
    } else {
      document.querySelector('.section-location').classList.remove('hasData');
      $('#editLocationBtn').hide();
    }
  }
  
  function discardLocationEdit() {
    const removedItems = sectionLocation.querySelectorAll('.list-item--removed');
    const addedItems = sectionLocation.querySelectorAll('.list-item--new');
    for (let i = 0; i < removedItems.length; i += 1) {
      removedItems[i].classList.remove('list-item--removed');
      removedItems[i].classList.remove('list-item--fade-out');
    }
    for (let i = 0; i < addedItems.length; i += 1) {
      addedItems[i].parentNode.parentNode.removeChild(addedItems[i]);
    }
  }
  
  function clearLocationInputs() {
    if (locationDetails) {
      locationAddressCity.value = '';
      locationName.value = '';
      locationAddressState.value = '';
      locationAddressZip.value = '';
      locationAddressStreet.value = '';
      locationType.value = '';
      locationTypeOtherInput.value = '';
  
      const indoorCheckboxes = document.querySelectorAll('.location-type--indoor input[type="checkbox"]:checked');
      for (let i = 0; i < indoorCheckboxes.length; i += 1) {
        indoorCheckboxes[i].checked = false;
      }
  
      const outdoorCheckboxes = document.querySelectorAll('.location-type--outdoor input[type="checkbox"]:checked');
      for (let i = 0; i < outdoorCheckboxes.length; i += 1) {
        outdoorCheckboxes[i].checked = false;
      }
  
      const openWaterRadio = document.querySelector('.location-type--openwater input[type="radio"]:checked');
      if (openWaterRadio) {
        openWaterRadio.checked = false;
      }
      setInputStatus(locationName, true);
      setInputStatus(locationAddressStreet, true);
      setInputStatus(locationType, true);
    }
  }
  
  function hideLocationDetails() {
    if (locationDetails) {
      clearLocationInputs();
      locationDetails.classList.remove('show');
    }
  }
  
  function hideLocationInputs() {
    const locationInput = sectionLocation.querySelector('.location-inputs');
    if (locationInput && locationDetails) {
      clearLocationInputs();
      $('#addLocationBtn').show();
      $('#cancelAddLocationBtn').hide();
      $('#doneEditLocationBtn').hide();
      $('#cancelAddLocationBtnFooter').hide(() => {
        window.scroll(0, FindPos(document.querySelector('#club-location')));
      });
      document.getElementById('saveLocation').disabled = false;
      locationInput.classList.remove('show');
      locationDetails.classList.remove('show');
      $('.locations-list__header').hide();
      $('.locations-list__header').css('display', 'none');
      locationType.disabled = false;
      if (editingLocation) {
        const wrapper = document.querySelector(`.location-id--value[value="${editingLocation}"]`).parentNode;
        wrapper.querySelector('.location-add-venue').style.display = 'block';
        wrapper.querySelector('.location-name').style.display = 'block';
        wrapper.querySelector('.location-address-street').style.display = 'block';
        wrapper.querySelector('.list__controls').style.display = 'inline-block';
        if (wrapper.querySelector('.venue__list .list__controls')) {
          wrapper.querySelector('.venue__list .list__controls').style.display = 'block';
        }
        editingLocation = null;
      }
    }
  }
  
  function hideLocatinEditInputs() {
    hideLocationInputs();
  }
  
  function cancelLocationList() {
    const list = sectionLocation.querySelector('.list');
    const locationItemsHidden = sectionLocation.querySelectorAll('.list-item--fade-out');
    if (locationItemsHidden.length >= 1) {
      for (let i = 0; i < locationItemsHidden.length; i += 1) {
        locationItemsHidden[i].classList.remove('list-item--fade-out');
      }
    }
    setTimeout(() => {
      for (let i = 0; i < locationItemsHidden.length; i += 1) {
        locationItemsHidden[i].parentNode.style.display = 'block';
      }
    }, 250);
    list.classList.remove('edit-list');
    document.getElementById('saveLocation').disabled = false;
    document.getElementById('addLocationBtn').disabled = false;
  }
  
  function cancelLocationEdit() {
    hideLocationDetails();
    sectionLocation.classList.remove('isEdit');
    cancelLocationList();
    setSectionInputStatus(sectionLocation, true);
    const newItems = sectionLocation.querySelectorAll('.list-item--new');
    for (let i = 0; i < newItems.length; i += 1) {
      newItems[0].parentNode.removeChild(newItems[0]);
      document.getElementById('saveLocation').disabled = false;
    }
  }
  
  function removeCurrentLocations() {
    const listContainer = document.querySelector('.section#club-location .list__container .row');
    if (listContainer) {
      const locationItems = listContainer.querySelectorAll('.list-item');
      if (locationItems) {
        while (listContainer.firstChild) {
          listContainer.removeChild(listContainer.firstChild);
        }
      }
    }
  }
  
  function handleUsmsVerifiedChange(e) {
    if (e.target.checked) {
      document.querySelector('.usms-verified-form').classList.remove('usms-verified-form--fade');
    } else {
      document.querySelector('.usms-verified-form').classList.add('usms-verified-form--fade');
    }
  }
  
  function handleCableCourseChange(e) {
    if (e.target.checked) {
      document.querySelector('.list-venue-form__cable-course-form').classList.remove('list-venue-form__cable-course-form--fade');
    } else {
      document.querySelector('.list-venue-form__cable-course-form').classList.add('list-venue-form__cable-course-form--fade');
    }
  }
  
  function handleAddVenue(el, location) {
    handleCancelVenue();
    handleCancelConfiguration();
    hideLocationInputs();
    currentLocationId = el.querySelector('.location-id--value').value;
    document.querySelector('div.list-venue-form').classList.remove('list-venue-form__fade');
    currentLocation = el;
    el.classList.remove('has-error');
    currentLocation.querySelector('.location-add-venue').style.display = 'none';
    document.querySelector('#venueName').focus();
    document.querySelector('#editLocationBtn').style.display = 'none';
    document.querySelector('div.list-configuration-form').classList.add('list-configuration-form__fade');
  
    document.querySelector('#venueIsOpenWater').value = el.querySelector('.location-isOpenWater--value').value;
    if (location.isOpenWater) {
      document.querySelector('.input-group--openWaterType').classList.remove('fade');
      document.querySelector('.input-group--poolType').classList.add('fade');
      document.querySelector('.input-group--bulkhead').classList.add('fade');
      document.querySelector('.input-group--venueCableCourse').classList.remove('fade');
      document.querySelector('.input-group--adaCompliant').classList.add('fade');
    } else {
      document.querySelector('.input-group--poolType').classList.remove('fade');
      document.querySelector('.input-group--openWaterType').classList.add('fade');
      document.querySelector('.input-group--venueCableCourse').classList.add('fade');
      document.querySelector('.input-group--bulkhead').classList.remove('fade');
      document.querySelector('.input-group--adaCompliant').classList.remove('fade');
    }
  }
  
  function removeLocation(wrapper) {
    const locationList = sectionLocation.querySelector('.list__container');
    locationList.classList.add('list__container--modified');
    wrapper.classList.remove('has-error');
    wrapper.classList.add('list-item--fade-out');
    setTimeout(() => {
      wrapper.style.display = 'absolute';
      wrapper.parentNode.style.display = 'none';
    }, 250);
    closeConfirmationModal();
  }
  
  function handleRemoveLocation(wrapper) {
    showConfirmationModal('This will delete your existing pool(s) and configuration(s). Are you sure you want to continue?',
      () => {
        removeLocation(wrapper);
      });
  }
  
  function getSelectValueFromOptionInnerHTML(select, innerHTML) {
    if (!select || !innerHTML) return -1;
    let selectedTypeIndex = -1;
    for (let i = 0; i < select.options.length; i += 1) {
      if (select.options[i].innerHTML === innerHTML) {
        selectedTypeIndex = i;
        break;
      }
    }
    if (selectedTypeIndex !== -1) {
      return select.options[selectedTypeIndex].value;
    }
  
    return -1;
  }
  
  function handleEditLocation(el) {
    const locationInput = sectionLocation.querySelector('.location-inputs');
    $('.locations-list__header').hide();
    $('#addLocationBtn').hide();
    const wrapper = el;
    wrapper.classList.remove('has-error');
    wrapper.querySelector('p.location-name').style.display = 'none';
    wrapper.querySelector('p.location-address-street').style.display = 'none';
    wrapper.querySelector('.list__controls').style.displey = 'none';
    wrapper.querySelector('.location-name').style.displey = 'none';
    wrapper.querySelector('.location-address-street').style.displey = 'none';
    wrapper.querySelector('.list__controls').style.display = 'none';
    wrapper.querySelector('.location-add-venue').style.display = 'none';
    locationName.value = wrapper.querySelector('p.location-name').innerHTML;
    locationAddressStreet.value = `${wrapper.querySelector('.location-address--value').value}, ${wrapper.querySelector('.location-city--value').value}, ${wrapper.querySelector('.location-state--value').value}, USA`;
    locationAddressStreetGoogle.value = wrapper.querySelector('.location-address--value').value;
    locationAddressLat.value = wrapper.querySelector('.location-lat--value').value;
    locationAddressLng.value = wrapper.querySelector('.location-lng--value').value;
    editingLocation = el.querySelector('.location-id--value').value;
    locationType.value = wrapper.querySelector('.location-type--value').value;
    locationType.disabled = true;
    $('#cancelAddLocationBtn').show();
    $('#cancelAddLocationBtnFooter').show();
    locationInput.classList.add('show');
    locationDetails.classList.add('show');
    locationName.focus();
  }
  
  function editExistingLocation(location) {
    const wrapper = document.querySelector(`.location-id--value[value="${location.locationId}"`).parentNode;
    if (location.city) {
      wrapper.querySelector('.location-city--value').value = location.city;
    }
    if (location.address) {
      wrapper.querySelector('.location-address--value').value = location.address;
    }
    if (location.state) {
      wrapper.querySelector('.location-state--value').value = location.state;
    }
    if (location.zip) {
      wrapper.querySelector('.location-zip--value').value = location.zip;
    }
    wrapper.querySelector('.location-type--value').value = location.locationType;
    wrapper.querySelector('.location-lng--value').value = location.lng;
    wrapper.querySelector('.location-lat--value').value = location.lat;
    wrapper.querySelector('.location-name').innerHTML = locationName.value;
    wrapper.querySelector('.location-address-street').innerHTML = locationAddressStreet.value;
  }
  
  function addLocation(location, fromApi = false) {
    const listContainer = document.querySelector('.section#club-location .list__container .row');
    // $('.location-list__header').show();
    $('#listLocationSettings').show();
  
    if (!listContainer) return null;
  
    const col = document.createElement('div');
    col.className = 'col-xs-12';
  
    const div = document.createElement('div');
    if (fromApi) {
      div.className = 'list-item list-item--fade-out';
    } else {
      div.className = 'list-item list-item--fade-out list-item--new';
    }
  
    // Define location elements
    const locationListControls = document.createElement('div');
    locationListControls.className = 'list__controls';
    const buttonEdit = document.createElement('button');
    buttonEdit.innerHTML = 'Edit';
    buttonEdit.className = 'btn btn-link list-item__edit';
    buttonEdit.addEventListener('click', () => handleEditLocation(div));
  
    const buttonDelete = document.createElement('button');
    buttonDelete.innerHTML = 'Remove';
    buttonDelete.className = 'btn btn-link list-item__delete';
    buttonDelete.addEventListener('click', () => handleRemoveLocation(div));
    locationListControls.appendChild(buttonEdit);
    locationListControls.appendChild(buttonDelete);
  
    const name = document.createElement('p');
    name.className = 'location-name text-bold';
    name.innerHTML = location.name;
  
    const address = document.createElement('p');
    address.classList.add('location-address-street');
    address.innerHTML = `${location.address} | ${location.city}, ${location.state} ${location.zip}`;
  
    // const city = document.createElement('div');
    // city.classList.add('location-city');
    // city.innerHTML = location.city + ', ' + location.state + ' ' + location.zip;
  
    const addVenueButton = document.createElement('button');
    addVenueButton.className = 'location-add-venue btn btn-small btn-outline';
    if (location.isOpenWater) {
      addVenueButton.innerHTML = `<span><i class="fa fa-plus"></i></span>${addVenueButtonText}`;
    } else {
      addVenueButton.innerHTML = `<span><i class="fa fa-plus"></i></span>${addPoolButtonText}`;
    }
    addVenueButton.addEventListener('click', () => {
      handleAddVenue(div, location);
    });
  
    const nameHidden = document.createElement('input');
    nameHidden.setAttribute('type', 'hidden');
    nameHidden.className = 'location-name--value';
    nameHidden.value = location.name;
  
    const addressHidden = document.createElement('input');
    addressHidden.setAttribute('type', 'hidden');
    addressHidden.className = 'location-address--value';
    addressHidden.value = location.address;
  
    const idHidden = document.createElement('input');
    idHidden.setAttribute('type', 'hidden');
    idHidden.className = 'location-id--value';
    idHidden.value = location.locationId;
  
    const cityHidden = document.createElement('input');
    cityHidden.setAttribute('type', 'hidden');
    cityHidden.className = 'location-city--value';
    cityHidden.value = location.city;
  
    const latHidden = document.createElement('input');
    latHidden.setAttribute('type', 'hidden');
    latHidden.className = 'location-lat--value';
    latHidden.value = location.lat;
  
    const lngHidden = document.createElement('input');
    lngHidden.setAttribute('type', 'hidden');
    lngHidden.className = 'location-lng--value';
    lngHidden.value = location.lng;
  
    const stateHidden = document.createElement('input');
    stateHidden.setAttribute('type', 'hidden');
    stateHidden.className = 'location-state--value';
    stateHidden.value = location.state;
  
    const typeHidden = document.createElement('input');
    typeHidden.setAttribute('type', 'hidden');
    typeHidden.className = 'location-type--value';
    typeHidden.value = location.locationType;
  
    const isOpenWaterHidden = document.createElement('input');
    isOpenWaterHidden.setAttribute('type', 'hidden');
    isOpenWaterHidden.className = 'location-isOpenWater--value';
    isOpenWaterHidden.value = location.isOpenWater;
  
    const zipHidden = document.createElement('input');
    zipHidden.setAttribute('type', 'hidden');
    zipHidden.className = 'location-zip--value';
    zipHidden.value = location.zip;
  
    const venueWrapper = document.createElement('div');
    venueWrapper.classList.add('venue__list');
    const listControls = document.createElement('div');
    listControls.className = 'list__controls';
    const listControlsEdit = document.createElement('button');
    listControlsEdit.className = 'btn btn-link';
    listControlsEdit.innerHTML = 'Edit';
    const listControlsRemove = document.createElement('button');
    listControlsRemove.className = 'btn btn-link';
    listControlsRemove.innerHTML = 'Remove';
    listControls.appendChild(listControlsEdit);
    listControls.appendChild(listControlsRemove);
    // venueWrapper.appendChild(listControls);
  
    const helpBlock = document.createElement('span');
    helpBlock.className = 'help-block';
    helpBlock.innerHTML = locationMissingPool;
  
    div.appendChild(idHidden);
    div.appendChild(addressHidden);
    div.appendChild(cityHidden);
    div.appendChild(stateHidden);
    div.appendChild(zipHidden);
    div.appendChild(typeHidden);
    div.appendChild(lngHidden);
    div.appendChild(latHidden);
    div.appendChild(isOpenWaterHidden);
    div.appendChild(locationListControls);
    div.appendChild(name);
    div.appendChild(address);
    // div.appendChild(city);
    div.appendChild(helpBlock);
    div.appendChild(addVenueButton);
    div.appendChild(venueWrapper);
    // End define location elements
  
    col.appendChild(div);
    listContainer.appendChild(col);
    setTimeout(() => {
      div.classList.remove('list-item--fade-out');
    }, 250);
    return div;
  }
  
  function handleAddConfiguration(venue) {
    handleCancelVenue();
    handleCancelConfiguration();
    hideLocationInputs();
    document.querySelector('.list-configuration-form').classList.remove('list-configuration-form__fade');
    document.querySelector('div.list-venue-form').classList.add('list-venue-form__fade');
    currentVenue = venue;
    venue.classList.remove('has-error');
    configurationName.focus();
  }
  
  function handleCancelConfiguration() {
    editingPoolConfiguration = null;
    document.querySelector('.list-configuration-form').classList.add('list-configuration-form__fade');
    configurationName.value = '';
    configurationOtherLength.value = '';
    configurationUsmsVerified.checked = false;
    configurationUsmsVerifiedDate.value = '';
    if (document.querySelector('.usms-verified-form')) {
      document.querySelector('.usms-verified-form').classList.add('usms-verified-form--fade');
    }
    configurationLength.value = '';
    configurationLanes.value = '';
    if (document.querySelector('.input-group--configurationLengthOther')) {
      document.querySelector('.input-group--configurationLengthOther').classList.add('fade');
    }
  }
  
  function validateConfigurationFields() {
    validateField(configurationName);
    validateField(configurationLanes);
    validateField(configurationLength);
    const selectedLength = configurationLength.options[configurationLength.selectedIndex].innerHTML;
    if (selectedLength === 'Other') {
      validateField(configurationOtherLength);
    }
    if (configurationUsmsVerified.checked) {
      validateField(configurationUsmsVerifiedDate);
    }
  }
  
  function editPoolConfiguration(config) {
    const wrapper = document.querySelector(`.configuration-poolConfiguration-id[value="${config.poolConfigurationId}"]`).parentNode;
    if (wrapper) {
      const lengthId = config.length || config.lengthOther;
      const lengthText = document.querySelector(`option[value="${lengthId}"]`).innerHTML;
      wrapper.querySelector('p.configuration-title').innerHTML = `${config.name} - ${lengthText}, ${config.lanes} Lanes`;
      wrapper.querySelector('.configuration-name').value = config.name;
      wrapper.querySelector('.configuration-lanes').value = config.lanes;
      wrapper.querySelector('.configuration-length').value = config.length;
      wrapper.querySelector('.configuration-otherLength').value = config.lengthOther;
      if (typeof config.usmsVerified === 'string') {
        wrapper.querySelector('.configuration-usmsVerified').value = config.usmsVerified.toLowerCase() === 'yes';
      } else if (typeof config.usmsVerified === 'boolean') {
        wrapper.querySelector('.configuration-usmsVerified').value = config.usmsVerified;
      }
      wrapper.querySelector('.configuration-usmsVerifiedDate').value = config.usmsVerifiedDate;
    }
  }
  
  function removePoolConfiguration(poolConfigurationId) {
    showLoadingOverlay();
    const xhr = new XMLHttpRequest();
  
    xhr.open('DELETE', `/apis/v1/clubweb/poolConfiguration/remove?poolConfigurationId=${poolConfigurationId}`, true);
    xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    xhr.withCredentials = true;
    xhr.onload = function () {
      closeConfirmationModal();
      hideLoadingOverlay();
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.response);
        if (!response.error) {
          if (response.data) {
            document.querySelector(`.configuration-poolConfiguration-id[value="${poolConfigurationId}"]`).parentNode.classList.add('fade');
            document.querySelector(`.configuration-poolConfiguration-id[value="${poolConfigurationId}"]`).parentNode.remove();
          }
        } else {
          showErrorModal(response.error);
        }
      } else {
        showErrorModal('Error removing pool configuration');
      }
    };
    xhr.send();
  }
  
  function handleRemovePoolConfiguration(e) {
    let poolConfigurationId = e.querySelector(".configuration-poolConfiguration-id").value;
  
    showConfirmationModal('Are you sure you want to delete this configuration?',
      () => {
        removePoolConfiguration(poolConfigurationId);
      });
  }
  
  function removePool(wrapper) {
    showLoadingOverlay();
    wrapper.classList.remove('has-error');
    const xhr = new XMLHttpRequest();
  
    const poolId = wrapper.querySelector('.pool-id').value;
    xhr.open('DELETE', `/apis/v1/clubweb/pool/remove?poolId=${poolId}`, true);
    xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    xhr.withCredentials = true;
    xhr.onload = function () {
      closeConfirmationModal();
      hideLoadingOverlay();
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.response);
        if (!response.error) {
          if (response.data) {
            document.querySelector(`.pool-id[value="${poolId}"]`).parentNode.classList.add('fade');
            document.querySelector(`.pool-id[value="${poolId}"]`).parentNode.remove();
          }
        } else {
          showErrorModal(response.error);
        }
      } else {
        showErrorModal('Error removing pool');
      }
    };
    xhr.send();
  }
  
  function handleRemovePool(wrapper) {
    showConfirmationModal('This will remove your existing configuration(s). Are you sure you want to continue?',
      () => {
        removePool(wrapper);
      });
  }
  
  function handleEditPoolConfiguration(wrapper) {
    document.querySelector('div.list-venue-form').classList.add('list-venue-form__fade');
    document.querySelector('.list-configuration-form').classList.remove('list-configuration-form__fade');
    if (!wrapper) return;
    configurationName.value = wrapper.querySelector('.configuration-name').value;
    configurationOtherLength.value = wrapper.querySelector('.configuration-otherLength').value;
    configurationLength.value = wrapper.querySelector('.configuration-length').value;
    configurationUsmsVerified.checked = wrapper.querySelector('.configuration-usmsVerified').value === 'true';
    configurationLanes.value = wrapper.querySelector('.configuration-lanes').value;
  
    if (configurationUsmsVerified.checked) {
      configurationUsmsVerifiedDate.value = wrapper.querySelector('.configuration-usmsVerifiedDate').value;
      document.querySelector('.usms-verified-form').classList.remove('usms-verified-form--fade');
    } else {
      document.querySelector('.usms-verified-form').classList.add('usms-verified-form--fade');
    }
  
    if (configurationOtherLength.value.length > 0) {
      document.querySelector('.input-group--configurationLengthOther').classList.remove('fade');
    }
  
    editingPoolConfiguration = wrapper.querySelector('.configuration-poolConfiguration-id').value;
    const poolId = wrapper.querySelector('.configuration-pool-id').value;
    currentVenue = document.querySelector(`.pool-id[value="${poolId}"]`).parentNode;
  }
  
  function addPoolConfiguration(config) {
    const wrapper = currentVenue.querySelector('.configuration__list');
    const div = document.createElement('div');
    div.className = 'configuration__list--item';
  
    const nameElement = document.createElement('p');
    const lengthId = config.length || config.lengthOther;
  
    // we send to sitecore id and receive name from salesforce
    // this is to handle both cases
    const lengthElement = document.querySelector(`option[value="${lengthId}"]`);
    const lengthText = lengthElement ? lengthElement.innerHTML : lengthId;
  
    nameElement.className = 'configuration-title';
    nameElement.innerHTML = `${config.name} - ${lengthText}, ${config.lanes} Lanes`;
  
    const editControls = document.createElement('div');
    editControls.className = 'list__controls';
    const removeButton = document.createElement('button');
    removeButton.className = 'btn btn-link configuration-remove-button';
    removeButton.innerHTML = `${removeText}`;
    removeButton.addEventListener('click', () => {
      handleRemovePoolConfiguration(div);
    });
    const editButton = document.createElement('button');
    editButton.innerHTML = `${editText}`;
    editButton.className = 'btn btn-link configuration-edit-button';
    editButton.addEventListener('click', () => {
      handleEditPoolConfiguration(div);
    });
    editControls.appendChild(editButton);
    editControls.appendChild(removeButton);
  
    const hiddenName = document.createElement('input');
    hiddenName.value = config.name;
    hiddenName.className = 'configuration-name';
    hiddenName.setAttribute('type', 'hidden');
  
    const hiddenLanes = document.createElement('input');
    hiddenLanes.value = config.lanes;
    hiddenLanes.className = 'configuration-lanes';
    hiddenLanes.setAttribute('type', 'hidden');
  
    const hiddenLength = document.createElement('input');
    hiddenLength.value = config.length;
    hiddenLength.className = 'configuration-length';
    hiddenLength.setAttribute('type', 'hidden');
  
    const hiddenOtherLength = document.createElement('input');
    hiddenOtherLength.value = config.lengthOther;
    hiddenOtherLength.className = 'configuration-otherLength';
    hiddenOtherLength.setAttribute('type', 'hidden');
  
    const hiddenUsmsVerified = document.createElement('input');
    if (typeof config.usmsVerified === 'string') {
      hiddenUsmsVerified.value = config.usmsVerified.toLowerCase() === 'yes';
    } else if (typeof config.usmsVerified === 'boolean') {
      hiddenUsmsVerified.value = config.usmsVerified;
    }
    hiddenUsmsVerified.className = 'configuration-usmsVerified';
    hiddenUsmsVerified.setAttribute('type', 'hidden');
  
    const hiddenUsmsVerifiedDate = document.createElement('input');
    hiddenUsmsVerifiedDate.value = config.usmsVerifiedDate;
    hiddenUsmsVerifiedDate.className = 'configuration-usmsVerifiedDate';
    hiddenUsmsVerifiedDate.setAttribute('type', 'hidden');
  
    const hiddenPoolId = document.createElement('input');
    hiddenPoolId.value = config.poolId;
    hiddenPoolId.className = 'configuration-pool-id';
    hiddenPoolId.setAttribute('type', 'hidden');
  
    const hiddenPoolConfigurationId = document.createElement('input');
    hiddenPoolConfigurationId.value = config.poolConfigurationId;
    hiddenPoolConfigurationId.className = 'configuration-poolConfiguration-id';
    hiddenPoolConfigurationId.setAttribute('type', 'hidden');
  
    div.appendChild(editControls);
    div.appendChild(nameElement);
    div.appendChild(hiddenName);
    div.appendChild(hiddenLanes);
    div.appendChild(hiddenPoolId);
    div.appendChild(hiddenPoolConfigurationId);
    div.appendChild(hiddenLength);
    div.appendChild(hiddenOtherLength);
    div.appendChild(hiddenUsmsVerified);
    div.appendChild(hiddenUsmsVerifiedDate);
    wrapper.appendChild(div);
  }
  
  function handleSaveConfiguration() {
    validateConfigurationFields();
    if (sectionContainsErrors(sectionLocation)) {
      window.scroll(0, FindPos(sectionLocation.querySelectorAll('span.help-block.has-error')[0]));
      return;
    }
    if (currentVenue) {
      const config = {
        name: document.querySelector('#configurationName').value,
        lanes: document.querySelector('#configurationLanes').value,
        length: document.querySelector('#configurationLength').value,
        lengthOther: document.querySelector('#configurationOtherLength').value,
        usmsVerified: document.querySelector('#usmsVerified').checked,
        usmsVerifiedDate: document.querySelector('#usmsVerifiedDate').value,
        poolId: currentVenue.querySelector('.pool-id').value,
        poolConfigurationId: editingPoolConfiguration,
      };
      const xhr = new XMLHttpRequest();
  
      xhr.open('POST', '/apis/v1/clubweb/poolConfiguration/add', true);
      xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
      xhr.withCredentials = true;
      xhr.onload = function () {
        hideLoadingOverlay();
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.response);
          if (!response.error) {
            if (editingPoolConfiguration) {
              editPoolConfiguration(response.data);
            } else {
              addPoolConfiguration(response.data);
            }
            handleCancelConfiguration();
          } else {
            showErrorModal(response.error);
          }
        } else {
          showErrorModal('Error saving pool');
        }
      };
      xhr.send(JSON.stringify(config));
    } else {
      console.error('currentVenue not found');
    }
  }
  
  function handleEditPool(wrapper) {
    document.querySelector('div.list-configuration-form').classList.add('list-configuration-form__fade');
    editingPool = wrapper.querySelector('.pool-id').value;
    currentLocationId = wrapper.querySelector('.location-id').value;
    currentLocation = document.querySelector(`.location-id--value[value="${currentLocationId}"]`).parentNode;
    venueNameInput.value = wrapper.querySelector('.venue-name').innerHTML;
    venueBulkheadCheckbox.checked = wrapper.querySelector('.venue-bulkhead').value === 'true';
    venueAdaCompliantCheckbox.checked = wrapper.querySelector('.venue-adaCompliant').value === 'true';
    document.querySelector('div.list-venue-form').classList.remove('list-venue-form__fade');
  
    document.querySelector('#venueName').focus();
    document.querySelector('#venueIsOpenWater').value = wrapper.querySelector('.venue-isOpenWater').value;
    if (wrapper.querySelector('.venue-isOpenWater').value === 'true') {
      const cableCourse = wrapper.querySelector('.venue-cableCourse').value === 'true';
      venueCableCourseCheckbox.checked = cableCourse;
      if (cableCourse) {
        document.querySelector('.list-venue-form__cable-course-form').classList.remove('list-venue-form__cable-course-form--fade');
      }
      venueCableCourseSelect.value = wrapper.querySelector('.venue-cableCourseUnit').value;
      venueCableCourseInput.value = Number(wrapper.querySelector('.venue-cableCourseValue').value);
      venueOpenWaterSelect.value = wrapper.querySelector('.venue-subType').value;
      document.querySelector('.input-group--openWaterType').classList.remove('fade');
      document.querySelector('.input-group--poolType').classList.add('fade');
      document.querySelector('.input-group--venueCableCourse').classList.remove('fade');
      document.querySelector('.input-group--bulkhead').classList.add('fade');
      document.querySelector('.input-group--adaCompliant').classList.add('fade');
    } else {
      venuePoolSelect.value = wrapper.querySelector('.venue-subType').value;
      document.querySelector('.input-group--poolType').classList.remove('fade');
      document.querySelector('.input-group--openWaterType').classList.add('fade');
      document.querySelector('.input-group--venueCableCourse').classList.add('fade');
      document.querySelector('.input-group--bulkhead').classList.remove('fade');
      document.querySelector('.input-group--adaCompliant').classList.remove('fade');
      document.querySelector('.list-venue-form__cable-course-form').classList.add('list-venue-form__cable-course-form--fade');
    }
  }
  
  function addPool(pool) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('venue__list--item');
  
    const editControls = document.createElement('div');
    editControls.className = 'list__controls';
    const removeButton = document.createElement('button');
    removeButton.className = 'btn btn-link venue-remove-button';
    removeButton.innerHTML = `${removeText}`;
    removeButton.addEventListener('click', () => {
      handleRemovePool(wrapper);
    });
    const editButton = document.createElement('button');
    editButton.innerHTML = `${editText}`;
    editButton.className = 'btn btn-link venue-edit-button';
    editButton.addEventListener('click', () => {
      handleEditPool(wrapper);
    });
  
    const configurationList = document.createElement('div');
    configurationList.classList.add('configuration__list');
  
    const venueName = document.createElement('p');
    venueName.className = 'venue-name';
    venueName.innerHTML = pool.name;
  
    const venueType = document.createElement('p');
    venueType.className = 'venue-type';
    const optionSubType = document.querySelector(`option[value="${pool.subType}"]`);
    // we send to sitecore id and receive name from salesforce
    // this is to handle both cases
    if (pool.subType) {
      venueType.innerHTML = optionSubType ? `(${optionSubType.innerHTML})` : `(${pool.subType})`;
    }
  
    const hiddenCableCourse = document.createElement('input');
    hiddenCableCourse.value = pool.cableCourse;
    hiddenCableCourse.className = 'venue-cableCourse';
    hiddenCableCourse.setAttribute('type', 'hidden');
  
    const hiddenCableCourseValue = document.createElement('input');
    hiddenCableCourseValue.value = pool.cableCourseDistance;
    hiddenCableCourseValue.className = 'venue-cableCourseValue';
    hiddenCableCourseValue.setAttribute('type', 'hidden');
  
    const hiddenCableCourseUnit = document.createElement('input');
    hiddenCableCourseUnit.value = pool.cableCourseUnit;
    hiddenCableCourseUnit.className = 'venue-cableCourseUnit';
    hiddenCableCourseUnit.setAttribute('type', 'hidden');
  
    const hiddenPoolId = document.createElement('input');
    hiddenPoolId.className = 'pool-id';
    hiddenPoolId.value = pool.poolId;
    hiddenPoolId.setAttribute('type', 'hidden');
  
    const hiddenLocationId = document.createElement('input');
    hiddenLocationId.className = 'location-id';
    hiddenLocationId.value = pool.locationId;
    hiddenLocationId.setAttribute('type', 'hidden');
  
    const hiddenBulkhead = document.createElement('input');
    hiddenBulkhead.className = 'venue-bulkhead';
    hiddenBulkhead.value = pool.bulkhead;
    hiddenBulkhead.setAttribute('type', 'hidden');
  
    const hiddenAdaCompliant = document.createElement('input');
    hiddenAdaCompliant.className = 'venue-adaCompliant';
    hiddenAdaCompliant.value = pool.adaCompliant;
    hiddenAdaCompliant.setAttribute('type', 'hidden');
  
    const hiddenIsOpenWater = document.createElement('input');
    hiddenIsOpenWater.className = 'venue-isOpenWater';
    hiddenIsOpenWater.value = pool.isOpenWater;
    hiddenIsOpenWater.setAttribute('type', 'hidden');
  
    const hiddenSubType = document.createElement('input');
    hiddenSubType.className = 'venue-subType';
    hiddenSubType.value = pool.subType;
    hiddenSubType.setAttribute('type', 'hidden');
  
    const addConfigurationButton = document.createElement('button');
    addConfigurationButton.className = 'location-add-configuration btn btn-small btn-outline';
    addConfigurationButton.innerHTML = `<span><i class="fa fa-plus"></i></span>${addConfigurationText}`;
    addConfigurationButton.addEventListener('click', () => {
      handleAddConfiguration(wrapper);
    });
  
    const listControls = document.createElement('div');
    listControls.className = 'list__controls';
    const listControlsEdit = document.createElement('button');
    listControlsEdit.className = 'btn btn-link';
    listControlsEdit.innerHTML = 'Edit';
    const listControlsRemove = document.createElement('button');
    listControlsRemove.className = 'btn btn-link';
    listControlsRemove.innerHTML = 'Remove';
    listControls.appendChild(listControlsEdit);
    listControls.appendChild(listControlsRemove);
  
    const helpBlock = document.createElement('span');
    helpBlock.className = 'help-block';
    helpBlock.innerHTML = poolMissingConfiguration;
    // configurationList.appendChild(listControls);
    editControls.appendChild(editButton);
    editControls.appendChild(removeButton);
    wrapper.appendChild(editControls);
    wrapper.appendChild(venueName);
    wrapper.appendChild(venueType);
    if (!pool.isOpenWater) {
      wrapper.appendChild(helpBlock);
    }
    wrapper.appendChild(configurationList);
    if (!pool.isOpenWater) {
      wrapper.appendChild(addConfigurationButton);
    }
    wrapper.appendChild(hiddenCableCourse);
    wrapper.appendChild(hiddenCableCourseValue);
    wrapper.appendChild(hiddenCableCourseUnit);
    wrapper.appendChild(hiddenPoolId);
    wrapper.appendChild(hiddenLocationId);
    wrapper.appendChild(hiddenBulkhead);
    wrapper.appendChild(hiddenAdaCompliant);
    wrapper.appendChild(hiddenIsOpenWater);
    wrapper.appendChild(hiddenSubType);
    currentLocation.querySelector('.venue__list').appendChild(wrapper);
    return wrapper;
  }
  
  function editPool(pool) {
    const wrapper = document.querySelector(`.pool-id[value="${pool.poolId}"]`).parentNode;
    if (wrapper) {
      wrapper.querySelector('.venue-name').innerHTML = pool.name;
      wrapper.querySelector('.venue-type').innerHTML = `(${pool.subType})`;
      wrapper.querySelector('.venue-cableCourse').value = pool.cableCourse;
      wrapper.querySelector('.venue-cableCourseUnit').value = pool.cableCourseUnit;
      wrapper.querySelector('.venue-cableCourseValue').value = pool.cableCourseDistance;
      wrapper.querySelector('.venue-bulkhead').value = pool.bulkhead;
      wrapper.querySelector('.venue-adaCompliant').value = pool.adaCompliant;
      wrapper.querySelector('.venue-subType').value = pool.subType;
    }
  }
  
  function validateVenueFields() {
    validateField(venueNameInput);
    const isOpenWater = document.querySelector('#venueIsOpenWater').value;
    if (isOpenWater === 'true') {
      validateField(venueOpenWaterSelect);
    } else {
      validateField(venuePoolSelect);
    }
    if (venueCableCourseCheckbox.checked) {
      validateField(venueCableCourseInput);
      validateField(venueCableCourseSelect);
    }
  }
  
  function validateLocationsFields() {
    if (!isValidAddress()) {
      setInputStatus(locationAddressStreet, false);
    }
    if (locationAddressStreet.value === '') {
      validateField(locationAddressStreet);
    }
    validateField(locationName);
    validateField(locationType);
  }
  
  function handleSavePool() {
    validateVenueFields();
    if (sectionContainsErrors(sectionLocation)) {
      window.scroll(0, FindPos(sectionLocation.querySelectorAll('span.help-block.has-error')[0]));
      return;
    }
    const isOpenWater = document.querySelector('#venueIsOpenWater').value;
    let subType = '';
    if (isOpenWater === 'true') {
      subType = venueOpenWaterSelect.options[venueOpenWaterSelect.selectedIndex].value;
    } else {
      subType = venuePoolSelect.options[venuePoolSelect.selectedIndex].value;
    }
    const pool = {
      name: venueNameInput.value,
      isOpenWater,
      subType,
      bulkhead: venueBulkheadCheckbox.checked,
      adaCompliant: venueAdaCompliantCheckbox.checked,
      cableCourse: venueCableCourseCheckbox.checked,
      cableCourseDistance: venueCableCourseInput.value,
      cableCourseUnit: venueCableCourseSelect.value,
      clubId: getUrlParams('clubId'),
      locationId: currentLocationId,
      poolId: editingPool,
    };
    if (currentLocation) {
      const xhr = new XMLHttpRequest();
  
      xhr.open('POST', '/apis/v1/clubweb/pool/add', true);
      xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
      xhr.withCredentials = true;
      xhr.onload = function () {
        hideLoadingOverlay();
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.response);
          if (!response.error) {
            if (editingPool) {
              editPool(response.data);
              handleCancelVenue();
            } else {
              const newPool = addPool(response.data);
              handleCancelVenue();
              if (!response.data.isOpenWater) handleAddConfiguration(newPool);
            }
          } else {
            showErrorModal(response.error);
          }
        } else {
          showErrorModal('Error saving pool');
        }
      };
      xhr.send(JSON.stringify(pool));
    } else {
      console.log('no currentLocation');
    }
  }
  
  function hideEditLocationInputs() {
    document.querySelector('#club-location .list.locations').classList.remove('edit-list');
    document.querySelector('#club-location #doneEditLocationBtn').style.display = 'none';
    $('#club-location .list-item').removeClass('is-edit');
    $('#club-location .venue__list').removeClass('is-edit');
    $('#club-location .location-add-venue').css('display', 'none');
    $('#club-location .location-add-configuration').css('display', 'none');
    $('#club-location .configuration__list').removeClass('is-edit');
    $('#club-location .list__controls').css('display', 'none');
    checkLocationData();
  }
  
  function getCurrentLocations() {
    hideEditLocationInputs();
    const clubId = getUrlParams('clubId');
    if (typeof getUrlParams('clubId') === 'undefined') return;
    removeCurrentLocations();
    const xhr = new XMLHttpRequest();
  
    if (clubId) {
      xhr.open('GET', `/apis/v1/clubweb/locations/${clubId || ''}`, true);
      xhr.withCredentials = true;
      xhr.onload = function () {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.response);
          for (let i = 0; i < response.length; i += 1) {
            currentLocation = addLocation(response[i], true);
            if (response[i].pools) {
              for (let j = 0; j < response[i].pools.length; j += 1) {
                currentVenue = addPool(response[i].pools[j]);
                if (response[i].pools[j].configurations) {
                  for (let k = 0; k < response[i].pools[j].configurations.length; k += 1) {
                    addPoolConfiguration(response[i].pools[j].configurations[k]);
                  }
                }
              }
            }
          }
          currentLocation = null;
          currentVenue = null;
        } else {
          showErrorModal('Error retrieving locations');
        }
        // addLocation has an animation that takes 250ms
        // chaining things need a little delay or it wont work
        setTimeout(() => {
          checkLocationData();
        }, 300);
      };
      xhr.send();
    }
  }
  
  function getLocations() {
    const locations = [];
    const listContainer = document.querySelector('.section#club-location .list__container .row');
    if (listContainer) {
      const locationItems = listContainer.querySelectorAll('.list-item');
      if (locationItems) {
        for (let i = 0; i < locationItems.length; i += 1) {
          const location = locationItems[i];
          locations.push({
            name: location.querySelector('.location-name').innerHTML,
            state: location.querySelector('.location-state--value').value,
            city: location.querySelector('.location-city--value').value,
            zip: location.querySelector('.location-zip--value').value,
            lat: location.querySelector('.location-lat--value').value,
            lng: location.querySelector('.location-lng--value').value,
            address: location.querySelector('.location-address--value').value,
            locationType: location.querySelector('.location-type--value').value,
            locationId: location.querySelector('.location-id--value').value,
            isOpenWater: location.querySelector('.location-isOpenWater--value').value,
          });
        }
      }
    }
    return locations;
  }
  
  function getCheckboxesChecked(section) {
    const result = [];
    if (!section) return result;
  
    const checked = section.querySelectorAll('input[type="checkbox"]:checked');
    for (let i = 0; i < checked.length; i += 1) {
      result.push(checked[i].value);
    }
    return result;
  }
  
  function saveLocationEdit(showNextSection = true, callback = null) {
    showLoadingOverlay();
    hideEditLocationInputs();
    handleCancelConfiguration();
    handleCancelVenue();
  
    const removedItems = sectionLocation.querySelectorAll('.list-item--fade-out');
    for (let i = 0; i < removedItems.length; i += 1) {
      removedItems[i].parentNode.parentNode.removeChild(removedItems[i].parentNode);
    }
    const updatedItems = sectionLocation.querySelectorAll('.list-item--new');
    for (let i = 0; i < updatedItems.length; i += 1) {
      updatedItems[i].classList.remove('list-item--new');
    }
    if (!callback) {
      if (!validateLocations()) {
        sectionLocation.classList.add('isEdit');
        $('#club-location .section__content').collapse('show');
        hideLoadingOverlay();
        showEditLocationInputs();
        showErrorModal(locationMissingInformation);
        return;
      }
    }
    if (showNextSection) {
      setSectionInputStatus(sectionLocation, true);
    }
    hideLocationInputs();
  
    const locations = getLocations();
    checkLocationData();
    const xhr = new XMLHttpRequest();
  
    xhr.open('POST', '/apis/v1/clubweb/location/save', true);
    xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    xhr.withCredentials = true;
    xhr.onload = function () {
      hideLoadingOverlay();
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.response);
        if (!response.error) {
          if (showNextSection) {
            closeSaveModal();
            sectionLocation.classList.remove('isEdit');
            sectionLocation.querySelector('.list__container').classList.remove('list__container--modified');
            cancelLocationEdit();
            if (nextSection) {
              $(nextSection).find('.section__content').collapse('show');
              nextSection = null;
            } else {
              $('#gold-club .section__content').collapse('show');
            }
          } else {
            const locItems = document.querySelectorAll('.list.locations > .list__container .list-item');
            for (let i = 0; i < locItems.length; i += 1) {
              const matchedItem = response.data.data.filter(x => x.name === locItems[i].querySelector('p.location-name').innerHTML);
              if (matchedItem && matchedItem.length > 0) {
                locItems[i].querySelector('.location-id--value').value = matchedItem[0].locationId;
              } else {
                console.error('Couldnt find new location data');
              }
            }
            if (callback) {
              callback();
            }
          }
        } else {
          showErrorModal(response.error);
        }
      } else {
        showErrorModal('Error saving location');
      }
    };
    xhr.send(JSON.stringify({
      clubId: getUrlParams('clubId'),
      locations,
    }));
  }
  
  function handleAddLocation() {
    locationType.disabled = false;
    validateLocationsFields();
    if (sectionContainsErrors(sectionLocation)) {
      window.scroll(0, FindPos(sectionLocation.querySelectorAll('span.help-block.has-error')[0]));
      return;
    }
    const location = {
      name: locationName.value,
      state: locationAddressState.value,
      city: locationAddressCity.value,
      zip: locationAddressZip.value,
      address: sectionLocation.querySelector('input#locationAddressStreet--google').value,
      lat: sectionLocation.querySelector('input#locationAddressLat').value,
      lng: sectionLocation.querySelector('input#locationAddressLng').value,
      locationType: locationType.value,
      description: sectionLocation.querySelector('input#locationTypeOther').value,
      locationId: editingLocation,
      isOpenWater: locationType.options[locationType.selectedIndex].innerHTML === 'Open Water',
    };
    if (editingLocation) {
      const wrapper = document.querySelector(`.location-id--value[value="${editingLocation}"]`).parentNode;
      wrapper.querySelector('.list__controls').style.display = 'inline-block';
      if (wrapper.querySelector('.venue__list .list__controls')) {
        wrapper.querySelector('.venue__list .list__controls').style.display = 'block';
      }
      wrapper.querySelector('p.location-name').style.display = 'block';
      wrapper.querySelector('p.location-address-street').style.display = 'block';
      wrapper.querySelector('.location-add-venue').style.display = 'block';
      editExistingLocation(location);
      hideLocationInputs();
      editingLocation = null;
    } else {
      const newLocationDiv = addLocation(location);
      // addLocation has an animation that takes 250ms
      // chaining things need a little delay or it wont work
      setTimeout(() => {
        saveLocationEdit(false, () => handleAddVenue(newLocationDiv, location));
        checkLocationData();
        showEditLocationInputs();
      }, 300);
    }
  }
  
  function handleTypeClick(e) {
    e.target.value === '{DA4AD338-1F22-4760-92E7-EB1A35F09959}' ?
      locationTypeOther.parentNode.classList.add('show') :
      locationTypeOther.parentNode.classList.remove('show');
  }
  
  function editLocationList() {
    const list = document.querySelectorAll('.section#club-location .list');
    for (let i = 0; i < list.length; i += 1) {
      if (list[0].classList.contains('edit-list')) {
        list[0].classList.remove('edit-list');
        cancelLocationList();
        document.getElementById('saveLocation').disabled = false;
        document.getElementById('addLocationBtn').disabled = false;
      } else {
        list[0].classList.add('edit-list');
        $('#saveLocationsList').show();
        document.getElementById('saveLocation').disabled = true;
        document.getElementById('addLocationBtn').disabled = true;
      }
    }
  }
  
  function handleCancelVenue() {
    editingPool = null;
    document.querySelector('div.list-venue-form').classList.add('list-venue-form__fade');
    if (currentLocation) {
      $('.location-add-venue').css('display', 'block');
      currentLocationId = null;
      currentLocation = null;
    }
    venueNameInput.value = '';
    venueBulkheadCheckbox.checked = false;
    venueAdaCompliantCheckbox.checked = false;
    venueCableCourseCheckbox.checked = false;
    venueCableCourseSelect.value = '';
    venuePoolSelect.value = '';
    venueCableCourseInput.value = 0;
    openWaterTypeSelect.value = '';
    document.querySelector('.list-venue-form__cable-course-form').classList.add('list-venue-form__cable-course-form--fade');
  }
  
  function showLocationInputs() {
    handleCancelVenue();
    handleCancelConfiguration();
    if (sectionLocation) {
      document.getElementById('saveLocation').disabled = true;
      const locationInput = sectionLocation.querySelector('.location-inputs');
      if (locationInput && locationDetails) {
        $('.locations-list__header').hide();
        $('#addLocationBtn').hide();
        $('#cancelAddLocationBtn').show();
        $('#cancelAddLocationBtnFooter').show();
        locationInput.classList.add('show');
        locationDetails.classList.add('show');
        locationName.focus();
      }
    }
  }
  
  function saveLocationList() {
    showLoadingOverlay();
    const removedItems = sectionLocation.querySelectorAll('.list-item--fade-out');
    for (let i = 0; i < removedItems.length; i += 1) {
      removedItems[i].parentNode.parentNode.removeChild(removedItems[i].parentNode);
    }
    const updatedItems = sectionLocation.querySelectorAll('.list-item--new');
    for (let i = 0; i < updatedItems.length; i += 1) {
      updatedItems[i].classList.remove('list-item--new');
    }
    const locations = getLocations();
    checkLocationData();
    $('#club-location').addClass('hasData');
    const xhr = new XMLHttpRequest();
  
    xhr.open('POST', '/apis/v1/clubweb/location/save', true);
    xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    xhr.withCredentials = true;
    xhr.onload = function () {
      hideLoadingOverlay();
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.response);
        const list = sectionLocation.querySelector('.list');
        if (!response.error) {
          list.classList.remove('edit-list');
          document.getElementById('saveLocation').disabled = false;
          document.getElementById('addLocationBtn').disabled = false;
        } else {
          showErrorModal(response.error);
        }
      } else {
        showErrorModal('Error saving location');
      }
    };
    xhr.send(JSON.stringify({
      clubId: getUrlParams('clubId'),
      locations,
    }));
  }
  
  function validateLocations() {
    const clubLocations = getLocations();
    if (clubLocations.length === 0 && (!regionalClub || !regionalClub.checked)) {
      return false;
    }
    for (let i = 0; i < clubLocations.length; i += 1) {
      const locationItem = sectionLocation.querySelector(`input.location-id--value[value="${clubLocations[i].locationId}"]`).parentNode;
      if (!locationItem.querySelector('.venue__list--item')) {
        locationItem.classList.add('has-error');
        return false;
      }
      if (clubLocations[i].isOpenWater === 'false') {
        const poolItems = locationItem.querySelectorAll('.venue__list--item');
        for (let j = 0; j < poolItems.length; j += 1) {
          if (!poolItems[j].querySelector('.configuration__list--item')) {
            poolItems[j].classList.add('has-error');
            return false;
          }
        }
      }
    }
    return true;
  }
  
  function showEditLocationInputs() {
    handleCancelConfiguration();
    handleCancelVenue();
    $('.list-item').addClass('is-edit');
    $('.venue__list').removeClass('is-edit');
    $('.location-add-venue').css('display', 'block');
    $('.location-add-configuration').css('display', 'block');
    $('.configuration__list').addClass('is-edit');
    $('.list__controls').css('display', 'inline-block');
    $('.venue__list .list__controls').css('display', 'block');
    document.querySelector('.list.locations').classList.add('edit-list');
    document.querySelector('#doneEditLocationBtn').style.display = 'inline-block';
    document.querySelector('#editLocationBtn').style.display = 'none';
  }
  
  (function () {
    getCurrentLocations();
    if (!google) return;
  
    const options = {
      //types: ['geocode','address','establishment'],
      componentRestrictions: {
        country: 'us',
      },
      types: ['address'],
    }
    googlePlaceLocation = new google.maps.places.Autocomplete(locationAddressStreet, options);
    googlePlaceLocation.addListener('place_changed', handleLocationPlaceChanged);
    // locationName.addEventListener('input', () => validateField(locationName));
    // locationAddressStreet.addEventListener('input', () => validateField(locationAddressStreet));
    venueNameInput.addEventListener('input', function () {
      validateField(venueNameInput);
    });
    venueCableCourseInput.addEventListener('input', function () {
      validateField(venueCableCourseInput);
    });
    configurationName.addEventListener('input', function () {
      validateField(configurationName);
    });
    configurationLanes.addEventListener('input', function () {
      validateField(configurationLanes);
    });
    configurationOtherLength.addEventListener('input', function () {
      validateField(configurationOtherLength);
    });
    configurationUsmsVerifiedDate.addEventListener('input', function () {
      validateField(configurationUsmsVerifiedDate);
    });
    configurationLength.addEventListener('change', function () {
      handleConfigurationLengthChange();
    })
  
    venueCableCourseSelect.addEventListener('change', function () {
      validateField(venueCableCourseSelect);
    })
  
    venueOpenWaterSelect.addEventListener('change', function () {
      validateField(venueOpenWaterSelect);
    })
  
    configurationUsmsVerifiedDate.addEventListener('blur', function () {
      validateField(configurationUsmsVerifiedDate);
    })
  
    $('input[name="usmsVerifiedDate"]').mask('0000-00-00', { placeholder: 'YYYY-MM-DD' });
  })();
  