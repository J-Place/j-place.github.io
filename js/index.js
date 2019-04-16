// Assuming first time user that is not authorized
var isValid = true;

// Check if user is authorized
function checkUserValidation() {
  if ( isValid === true ) {
    startFeed();
  }
  else if ( isValid === false ) {
    alert('please click the "Get Started" button.');
  }
}

// User clicks 'Get Started' button ...
$("#getStarted").click(function() {
  $('#modalAuthorize').modal('show');
});

// And clicks "I Agree" in modal window
$("#authorizeAgree").click(function() {
  isValid = true;
  $("#modalAuthorize").modal('hide');
  startFeed();
});

// Load both feeds - may need to create separate records feed
function startFeed() {
  // Hide start button and show tabs
  $("#getStarted").collapse('toggle').on('hidden.bs.collapse', function () {
    $(".feed-body").collapse('toggle');
    $("#disconnectFeed").collapse('toggle');
  });
  // Get Swims
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "https://j-place.github.io/swimFeed.json",
    success: function(response) {
      createSwimsHtml(response);
    },
    error: function() {
      console.log("FAIL");
    }
  });
  // Get Records
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

// To Do: Update records per flag in swims data
function updateRecords() {}

// Populate Swims Handlebars Template
function createSwimsHtml(swimData) {
  var rawTemplate = document.getElementById("swimTemplate").innerHTML;
  var compiledTemplate = Handlebars.compile(rawTemplate);
  var ourGeneratedHTML = compiledTemplate(swimData)
  var swimsWrapper = document.getElementById("swimsWrapper");
  swimsWrapper.innerHTML = ourGeneratedHTML;
}

// Populate Records Handlebars Template
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
