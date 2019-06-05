let allSwims = {};
let currentPage = 1;
let perPage = 10;

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

  xhr.open('GET', '/swimFeedJP.json?ver=1', true);
  // xhr.open('GET', '/swimFeedJP.json?asd=1', true);
  xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
  // xhr.withCredentials = true;
  xhr.onload = function () {
    if (xhr.status === 200) {
      hideLoadingOverlay();
      const response = JSON.parse(xhr.response);
      allSwims = response.swims;
      const stripped = { ...response, swims: response.swims.slice(0, (perPage - 1) * currentPage++) };
      createSwimsHtml(stripped);
      return;
    }
    console.log("Error retrieving swim information");
    return null;
  };
  xhr.send();
}

// To Do: Append more swims to latest swims
function loadMoreSwims() {
  let endElement = (currentPage * perPage) - 1;
  let startElement = perPage * (currentPage - 1);
  if (startElement > allSwims.length) {
    console.log('no more elements to load');
    return;
  }
  if (endElement >= allSwims.length - 1) endElement = allSwims.length - 1;
  console.log(`showing swims from ${startElement} to ${endElement}`);
  let result = {
    swims: allSwims.slice(startElement, endElement)
  }
  const rawTemplate = document.getElementById("swimTemplate").innerHTML;
  const compiledTemplate = Handlebars.compile(rawTemplate);
  $('#swimsWrapper').append(compiledTemplate(result));
  currentPage++;
}




////////////////////////////////////////////
// Get personal records
function getPersonalRecords() {
  showLoadingOverlay();
  const xhr = new XMLHttpRequest();

  xhr.open('GET', 'personalRecords.json', true);
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

var loadBtn = document.getElementById('viewMore');
window.onscroll = function(ev) {
    if ((window.innerHeight + Math.ceil(window.pageYOffset + 1)) >= document.body.offsetHeight) {
      loadMoreSwims();
    }
};



