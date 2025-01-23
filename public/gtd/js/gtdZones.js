function hideLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingWrapper');
    loadingSpinner.classList.add('hide');
}
hideLoadingSpinner();  

var getParticipants = $.ajax({
    // url: "https://j-place.github.io/zones.json",
    // url: "/apis/v1/gtd/zlc-participation?zone=' + zone + '&lmsc=' + lmsc + '&club=' + club + '&year=' + pageYear",
    url: "https://www.usms.org/apis/v1/gtd/zlc-participation?zone=2&lmsc=14&club=SHARK&year=2022",
    type: "GET",
    success: function(response) {
      var data = JSON.parse(getParticipants.responseText);
      createHtml(data);
    },
    error: function(xhr) {
      console.log("Failed to load data.");
    }
})

// Clear the select inputs on back to top
function resetSelects() {
  $('select').prop('selectedIndex', 0);
}

// Populate Handlebars template
function createHtml(data) {
    var rawTemplate = document.getElementById("zoneTemplate").innerHTML;
    var compiledTemplate = Handlebars.compile(rawTemplate);
    var generatedHTML = compiledTemplate(data)
    var gtdZones = document.getElementById("gtdZones");
    gtdZones.innerHTML = generatedHTML;
}