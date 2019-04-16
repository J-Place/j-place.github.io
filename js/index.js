// Assuming first time user that is not authorized
var isValid = false;

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

// Agree button starts the feed
function startFeed() {
  if ( isValid === true ) {
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
    // Get Personal Records
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
}

// var getPersonalRecords = $.ajax({
//   url: "https://j-place.github.io/personalRecords.json",
//   type: "GET",
//   success: function(response) {
//     var data = JSON.parse(getPersonalRecords.responseText);
//     createRecordsHtml(data);
//   },
//   error: function(xhr) {
//     console.log("FAIL");
//   }
// });

function createSwimsHtml(swimData) {
  var rawTemplate = document.getElementById("swimTemplate").innerHTML;
  var compiledTemplate = Handlebars.compile(rawTemplate);
  var ourGeneratedHTML = compiledTemplate(swimData)
  var swimsWrapper = document.getElementById("swimsWrapper");
  swimsWrapper.innerHTML = ourGeneratedHTML;
}

function createRecordsHtml(recordsData) {
  var rawTemplate = document.getElementById("recordsTemplate").innerHTML;
  var compiledTemplate = Handlebars.compile(rawTemplate);
  var ourGeneratedHTML = compiledTemplate(recordsData)
  var recordsWrapper = document.getElementById("recordsWrapper");
  recordsWrapper.innerHTML = ourGeneratedHTML;
}

$("#disconnectFeed").click(function() {
  $('#modalDisconnect').modal('show');
});
