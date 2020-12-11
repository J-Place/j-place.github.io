

function hideLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingWrapper');
    loadingSpinner.classList.add('hide');
}
hideLoadingSpinner();  



var getParticipants = $.ajax({
    url: "https://j-place.github.io/participants_all.json",
    type: "GET",
    success: function(response) {
      var data = JSON.parse(getParticipants.responseText);
      console.log(data.data[0].name);
      createHtml(data);
    },
    error: function(xhr) {
      console.log("Failed to load data.");
    }
})


function createHtml(dataLmsc) {
    var rawTemplate = document.getElementById("lmscTemplate").innerHTML;
    var compiledTemplate = Handlebars.compile(rawTemplate);
    var generatedHTML = compiledTemplate(dataLmsc)
    var lmscWrapper = document.getElementById("lmscWrapper");
    lmscWrapper.innerHTML = generatedHTML;
}