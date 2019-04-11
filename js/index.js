var getSwimFeed = $.ajax({
  url: "https://j-place.github.io/swimFeed.json",
  type: "GET",
  success: function(response) {
    var data = JSON.parse(getSwimFeed.responseText);
    createSwimsHtml(data);
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


var swimFeedList = document.getElementById("swimsWrapper");
var swimFeedListItems = [];

for (var i = 0; i < swimFeedList.childNodes.length; i++ ) {
  if (swimFeedList.childNodes[i].nodeName == "feed__item") {
    swimFeedListItems.push(swimFeedList.childNodes[i]);
  }
}

// var swimFeedListItem = document.getElementsByClassName("feed__item")
// var swimFeedListCount = swimFeedListItem.length;

console.log(swimFeedList.childNodes);
console.log(swimFeedList.childNodes.length);