// Assume first time user is not authorized
var isAuthorizedUser = false;

// Check if user is authorized
var checkUserAuthorization = function() {
  if ( isAuthorizedUser === true ) {
    // Hide get started button and show tabs
    $("#getStarted").collapse('toggle').on('hidden.bs.collapse', function () {
      $(".feed-body").collapse('toggle');
      $("#disconnectFeed").collapse('toggle');
    });
    loadLatestSwims(); // Loads the first X number of swims
    loadSwimRecords();
  }
  else if ( isAuthorizedUser === false ) {
    $("#getStarted").collapse('toggle');
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
  xhr.onload = function () {
    if (xhr.status === 200) {
      hideLoadingOverlay();
      const response = JSON.parse(xhr.response);
      // coachesFromApi.push(
        // `${response.firstName} ${response.lastName} ${response.city} ${response.state}`);
      // return (coachesFromApi);
      createSwimsHtml(response);
      return;
    }
    alert("Error retrieving swim information");
    return null;
  };
  xhr.send();
}

// Get personal records data
function loadSwimRecords() {
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "https://j-place.github.io/personalRecords.json",
    success: function(recordsResponse) {
      createRecordsHtml(recordsResponse);
    },
    error: function(xhr) {
      console.log("FAIL");
    }
  });
}

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
  document.body.className = "loading";
}

function hideLoadingOverlay() {
  document.body.className = "";
}


// To Do: Revoke Authorization
$("#disconnectFeed").click(function() {
  $('#modalDisconnect').modal('show');
});
