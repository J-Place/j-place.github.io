// Assume first time user is not authorized
var isAuthorizedUser = false;

// Check if user is authorized
var checkUserAuthorization = function() {
  if ( isAuthorizedUser === true ) {
    console.log(isAuthorizedUser);
    // If authorized, hide Get Started button and show tabs
    $("#getStarted").collapse('toggle').on('hidden.bs.collapse', function () {
      $(".feed-body").collapse('toggle');
      $("#disconnectFeed").collapse('toggle');
    });
     // Then load the latest X number of swims
    loadLatestSwims();
  }
  else if ( isAuthorizedUser === false ) {
    console.log(isAuthorizedUser);
    // If not authorized, show Get Started button
    $("#getStarted").collapse('toggle').on('hidden.bs.collapse', function () {
      $(".feed-body").collapse('hide');
      $("#disconnectFeed").collapse('hide');
    });
  }
}
checkUserAuthorization();


// This is to mock the authorization process //////////////////////////////
$("#getStarted").click(function() {
  $('#modalAuthorize').modal('show');
});
$("#authorizeAgree").click(function() {
  isAuthorizedUser = true;
  $("#modalAuthorize").modal('hide');
  checkUserAuthorization();

});
// End mock authorization //////////////////////////////



// Get latest swim data

// function loadLatestSwims() {
//   $.ajax({
//     type: "GET",
//     dataType: "json",
//     url: "https://j-place.github.io/swimFeed.json",
//     success: function(response) {
//       console.log(response);
//       createSwimsHtml(response);
//     },
//     error: function() {
//       console.log("FAIL");
//     }
//   });
// }

function loadLatestSwims() {
  showLoadingOverlay();
  const xhr = new XMLHttpRequest();

  xhr.open('GET', 'https://j-place.github.io/swimFeed.json', true);
  xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
  // xhr.withCredentials = true;
  // xhr.isAuthorizedUser = true;
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


function loadPersonalRecords() {
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

// Get personal records when tab is clicked
$("#tabPersonalRecords").click(function() {
  loadPersonalRecords();
});


// To Do: Append more swims to latest swims
function loadMoreSwims() {}


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

function showLoadingOverlay() {
  console.log("Loading");
  $("body").addClass("test");
  document.body.className = "loading";
}

function hideLoadingOverlay() {
  document.body.className = "";
}

function disconnetFeed() {
  var isAuthorizedUser = false;
  checkUserAuthorization();
}

// To Do: Set up revoke authorization
$("#disconnectFeed").click(function() {
  $('#modalDisconnect').modal('show');
});

$("#btnDisconnectFeed").click(function() {
  disconnetFeed();
});
