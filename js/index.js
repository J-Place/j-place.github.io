// Assume first time user is not authorized
var isAuthorizedUser = true;

// Check if user is authorized
var checkUserValidation = function() {
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
    return;
  }
}
checkUserValidation();


// This is to mock the authorization process //////////////////////////////
$("#getStarted").click(function() {
  $('#modalAuthorize').modal('show');
});
$("#authorizeAgree").click(function() {
  isAuthorizedUser = true;
  $("#modalAuthorize").modal('hide');
  loadLatestSwims();
  loadSwimRecords();
});
// End mock authorization //////////////////////////////


// Get latest swim data
function loadLatestSwims() {
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "https://j-place.github.io/swimFeed.json",
    success: function(response) {
      console.log(response);
      createSwimsHtml(response);
    },
    error: function() {
      console.log("FAIL");
    }
  });
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

// To Do: Set up pagination
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

// To Do: Revoke Authorization
$("#disconnectFeed").click(function() {
  $('#modalDisconnect').modal('show');
});
