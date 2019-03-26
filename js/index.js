var getSwimFeed = $.ajax({
  url: "https://j-place.github.io/swimFeed.json",
  type: "GET",
  success: function(response) {
    var data = JSON.parse(getSwimFeed.responseText);
    createSwimsHtml(data);
    createBioHtml(data);
    checkForPR(data);
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



function createBioHtml(bioData) {
  var rawTemplate = document.getElementById("bioTemplate").innerHTML;
  var compiledTemplate = Handlebars.compile(rawTemplate);
  var ourGeneratedHTML = compiledTemplate(bioData)
  var bioWrapper = document.getElementById("bioWrapper");
  bioWrapper.innerHTML = ourGeneratedHTML;
}

function createSwimsHtml(swimData) {
  var rawTemplate = document.getElementById("swimTemplate").innerHTML;
  var compiledTemplate = Handlebars.compile(rawTemplate);
  var ourGeneratedHTML = compiledTemplate(swimData)
  var swimsWrapper = document.getElementById("swimsWrapper");
  swimsWrapper.innerHTML = ourGeneratedHTML;
}

function checkForPR(isPr) {
  console.log(isPr);
  console.log(isPr.swims[0].swimPr);
}

function createRecordsHtml(recordsData) {
  var rawTemplate = document.getElementById("recordsTemplate").innerHTML;
  var compiledTemplate = Handlebars.compile(rawTemplate);
  var ourGeneratedHTML = compiledTemplate(recordsData)
  var recordsWrapper = document.getElementById("recordsWrapper");
  recordsWrapper.innerHTML = ourGeneratedHTML;
}

// checkForPR();