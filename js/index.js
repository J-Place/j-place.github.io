$("#getFeed").click(function(e) {
  e.preventDefault();
  $.ajax({
      type: "GET",
      dataType: "json",
      url: "https://j-place.github.io/swimFeed.json",
      success: function(response) {
        // var data = JSON.parse(response);
        var data = response;
        createSwimsHtml(data);
      },
      error: function() {
        console.log("FAIL");
      }
      });
});

$("#getFeed").click(function(e) {
  e.preventDefault();
  $.ajax({
      type: "GET",
      dataType: "json",
      url: "https://j-place.github.io/swimFeed.json",
      success: function(response) {
        // var data = JSON.parse(response);
        var data = response;
        createSwimsHtml(data);
        $("#getFeed").collapse('toggle');
        $("#disconnectFeed").collapse('toggle');
        $(".feed-body").collapse('toggle');
      },
      error: function() {
        console.log("FAIL");
      }
      });
});

// var getSwimFeed = $.ajax({
//   url: "https://j-place.github.io/swimFeed.json",
//   type: "GET",
//   success: function(response) {
//     var data = JSON.parse(getSwimFeed.responseText);
//     createSwimsHtml(data);
//   },
//   error: function(xhr) {
//     console.log("FAIL");
//   }
// });

var getPersonalRecords = $.ajax({
  url: "https://j-place.github.io/personalRecords.json",
  type: "GET",
  success: function(response) {
    var data = JSON.parse(getPersonalRecords.responseText);
    createRecordsHtml(data);
  },
  error: function(xhr) {
    console.log("FAIL");
  }
});

var getRecordsData = function() {
  alert("Call Function");
}

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
