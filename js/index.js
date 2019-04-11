var getSwimFeed = $.ajax({
  url: "https://j-place.github.io/swimFeed.json",
  type: "GET",
  success: function(response) {
    var data = JSON.parse(getSwimFeed.responseText);
    // createSwimsHtml(data);
    loadSwimFeed(data)
    // loadSwimFeed(data);
  },
  error: function(xhr) {
    console.log("FAIL");
  }
});

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

// function createSwimsHtml(swimData) {
//   var rawTemplate = document.getElementById("swimTemplate").innerHTML;
//   var compiledTemplate = Handlebars.compile(rawTemplate);
//   var ourGeneratedHTML = compiledTemplate(swimData)
//   var swimsWrapper = document.getElementById("swimsWrapper");
//   swimsWrapper.innerHTML = ourGeneratedHTML;
// }

var loadSwimFeed = function(swimData) {
// function loadSwimFeed(swimData) {
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

// var getFeedBtn = document.getElementById("getFeed");
// getFeedBtn.click(loadSwimFeed);

var loadSwimFeedClick = function() {
  alert("Test");
  loadSwimFeed();
}