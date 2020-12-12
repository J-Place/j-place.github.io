

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
      createHtml(data);
    //   formatMiles(data);
      cleanData(data);
      console.log(data.data[0].miles.toFixed(2));
    },
    error: function(xhr) {
      console.log("Failed to load data.");
    }
})

function formatMiles(miles) {  
    miles = data[0].miles.toFixed(2);
    return miles;
}


function cleanData(data) {
    for (var i = 0; i < tempData.length; i++) {
        tempData[i].miles = formatMiles(data[i].miles);
    }
};

let tempData = data; // Use local data object until api access is fixed
cleanData(data);


function createHtml(dataLmsc) {
    var rawTemplate = document.getElementById("lmscTemplate").innerHTML;
    var compiledTemplate = Handlebars.compile(rawTemplate);
    var generatedHTML = compiledTemplate(dataLmsc)
    var lmscWrapper = document.getElementById("lmscWrapper");
    lmscWrapper.innerHTML = generatedHTML;
}