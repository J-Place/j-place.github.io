function hideLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingWrapper');
    loadingSpinner.classList.add('hide');
}
hideLoadingSpinner();  

var getParticipants = $.ajax({
    url: "https://j-place.github.io/zones.json",
    type: "GET",
    success: function(response) {
      var data = JSON.parse(getParticipants.responseText);
      createHtml(data);
    },
    error: function(xhr) {
      console.log("Failed to load data.");
    }
})

// function getParticipants() {
//   const xhr = new XMLHttpRequest();
//   xhr.open('GET', `https://test.usms.org/apis/v1/gtd/zlc-participation`, true);
//   xhr.withCredentials = true;
//   console.log("Status is " + xhr.status);
//   xhr.onload = function () {
//     console.log("Loading Data");
//     if (xhr.status === 200) {
//       const response = JSON.parse(xhr.responseText);
//       console.log(response.data);
//     } else {
//       showErrorModal('Error updating coaches');
//     }
//   };
//   xhr.send(null);
// }
// getParticipants();

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