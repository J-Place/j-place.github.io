var getSwimFeed = $.ajax({
  url: "https://j-place.github.io/swimFeed.json",
  type: "GET",
  success: function(response) {
    console.log("Success");
    var data = JSON.parse(getSwimFeed.responseText);
    console.log(data);
    createSwimsHtml(data);
    createBioHtml(data);
    createRecordsHtml(data);
  },
  error: function(xhr) {
    console.log("FAIL");
  }
})

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

function createRecordsHtml(recordsData) {
  var rawTemplate = document.getElementById("recordsTemplate").innerHTML;
  var compiledTemplate = Handlebars.compile(rawTemplate);
  var ourGeneratedHTML = compiledTemplate(recordsData)
  var recordsWrapper = document.getElementById("recordsWrapper");
  recordsWrapper.innerHTML = ourGeneratedHTML;
}
