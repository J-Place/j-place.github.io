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

// $("#location-information__content").addClass("in");
// document.getElementById("#location-information__content").classList.add('in');

function showLocationInputs() {
    const locationInput = sectionLocation.querySelector('.location-inputs');
    $('.locations-list__header').hide();
    $('#addLocationBtn').hide();
    $('#cancelAddLocationBtn').show();
    $('#cancelAddLocationBtnFooter').show();
    locationInput.classList.add('show');
    locationDetails.classList.add('show');
}

function handleAddLocation() {
    let editingLocation = true;
    const locationInput = sectionLocation.querySelector('.location-inputs');
    if (editingLocation) {
        $('#addLocationBtn').show();
        $('#addLocationBtn').prop('disabled', true);
        // $('#doneEditLocationBtn').show();
        $('#cancelAddLocationBtn').hide();
        $('#addLocationBtn').show();
        const wrapper = document.getElementById('club-location');
        locationInput.classList.remove('show');
        locationDetails.classList.remove('show');
        wrapper.querySelector('.list__controls').style.display = 'inline-block';
        wrapper.querySelector('.list__container').style.display = 'inline-block';
        wrapper.querySelector('p.location-name').style.display = 'block';
        wrapper.querySelector('p.location-address-street').style.display = 'block';
        document.querySelector('div.list-venue-form').classList.remove('list-venue-form__fade');
    }

}

function handleSavePool() {
    document.querySelector('div.list-venue-form').classList.add('list-venue-form__fade');
    document.querySelector('.venue__list').style.display = 'inline-block';
}

function hideLocationInputs() {
    const locationInput = sectionLocation.querySelector('.location-inputs');
    // if (locationInput && locationDetails) {
        // clearLocationInputs();
        $('#addLocationBtn').show();
        $('#cancelAddLocationBtn').hide();
        // $('#doneEditLocationBtn').hide();
        //   $('#cancelAddLocationBtnFooter').hide(() => {
        //     window.scroll(0, FindPos(document.querySelector('#club-location')));
        //   });
        $('#cancelAddLocationBtnFooter').hide();

        document.getElementById('saveLocation').disabled = false;
        locationInput.classList.remove('show');
        locationDetails.classList.remove('show');
        $('.locations-list__header').hide();
        $('.locations-list__header').css('display', 'none');
        locationType.disabled = false;
        let editingLocation = true;
        if (editingLocation) {
            // const wrapper = document.querySelector(`.location-id--value[value="${editingLocation}"]`).parentNode;
            const wrapper = document.getElementById('club-location');
            wrapper.querySelector('.location-add-venue').style.display = 'block';
            wrapper.querySelector('.location-name').style.display = 'block';
            wrapper.querySelector('.location-address-street').style.display = 'block';
            wrapper.querySelector('.list__controls').style.display = 'inline-block';
        }
        // if (wrapper.querySelector('.venue__list .list__controls')) {
        //     wrapper.querySelector('.venue__list .list__controls').style.display = 'block';
        // }
        editingLocation = null;
        // }
    // }
}

function handleCancelVenue() {
    document.querySelector('div.list-venue-form').classList.add('list-venue-form__fade');
}