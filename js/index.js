



////////////////////////////////////////////
// Assume first time user is not authorized
var isAuthorizedUser = false;

// Check if user is authorized
var checkUserAuthorization = function() {
  if ( isAuthorizedUser === true ) {
    // If authorized, hide Get Started button and show tabs
    $("#getStarted").collapse('hide').on('hidden.bs.collapse', function () {
      $(".feed-body").collapse('show');
      $("#disconnectFeed").collapse('show');
    });
     // Then load the latest X number of swims
    getLatestSwims();
  }
  else if ( isAuthorizedUser === false ) {
    // If not authorized, show Get Started button and hide tabs
    $(".feed-body").collapse('hide');
    $("#disconnectFeed").collapse('hide');
    $("#getStarted").collapse('show');
  }
}
checkUserAuthorization();




////////////////////////////////////////////
// Modal to mock the authorization window
$("#getStarted").click(function() {
  $('#modalAuthorize').modal('show');
});
$("#authorizeAgree").click(function() {
  isAuthorizedUser = true;
  $("#modalAuthorize").modal('hide');
  checkUserAuthorization();

});
// End mock authorization




////////////////////////////////////////////
// Get latest swim data
function getLatestSwims() {
  showLoadingOverlay();
  const xhr = new XMLHttpRequest();

  xhr.open('GET', 'https://j-place.github.io/swimFeed.json', true);
  xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
  // xhr.withCredentials = true;
  xhr.onload = function () {
    if (xhr.status === 200) {
      hideLoadingOverlay();
      const response = JSON.parse(xhr.response);
      createSwimsHtml(response);
      return;
    }
    console.log("Error retrieving swim information");
    return null;
  };
  xhr.send();
}

// To Do: Append more swims to latest swims
function loadMoreSwims() {}




////////////////////////////////////////////
// Get personal records
function getPersonalRecords() {
  showLoadingOverlay();
  const xhr = new XMLHttpRequest();

  xhr.open('GET', 'https://j-place.github.io/personalRecords.json', true);
  xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
  // xhr.withCredentials = true;
  xhr.onload = function () {
    if (xhr.status === 200) {
      hideLoadingOverlay();
      const response = JSON.parse(xhr.response);
      createRecordsHtml(response);
      return;
    }
    console.log("Error retrieving swim information");
    return null;
  };
  xhr.send();
}

// Display personal records when tab is clicked
$("#tabPersonalRecords").click(function() {
  getPersonalRecords();
});




////////////////////////////////////////////
// Populate Swim Feed Template
function createSwimsHtml(swimData) {
  var rawTemplate = document.getElementById("swimTemplate").innerHTML;
  var compiledTemplate = Handlebars.compile(rawTemplate);
  var ourGeneratedHTML = compiledTemplate(swimData)
  var swimsWrapper = document.getElementById("swimsWrapper");
  swimsWrapper.innerHTML = ourGeneratedHTML;
}

// Populate Personal Records Template
function createRecordsHtml(recordsData) {
  var rawTemplate = document.getElementById("recordsTemplate").innerHTML;
  var compiledTemplate = Handlebars.compile(rawTemplate);
  var ourGeneratedHTML = compiledTemplate(recordsData)
  var recordsWrapper = document.getElementById("recordsWrapper");
  recordsWrapper.innerHTML = ourGeneratedHTML;
}




////////////////////////////////////////////
// To Do: Set up account de-authorization
function disconnetFeed() {
  isAuthorizedUser = false;
  checkUserAuthorization();
}

// Revoke authorization modal
$("#disconnectFeed").click(function() {
  $('#modalDisconnect').modal('show');
});
 
$("#disconnectAgree").click(function() {
  disconnetFeed();
});




////////////////////////////////////////////
// Loading spinner
function showLoadingOverlay() {
  document.body.className = "loading";
}

function hideLoadingOverlay() {
  document.body.className = "";
}



