

function hideLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingWrapper');
    loadingSpinner.classList.add('hide');
}
hideLoadingSpinner();  

var data = [];

var getParticipants = $.ajax({
    url: "https://j-place.github.io/participants_all.json",
    type: "GET",
    success: function(response) {
      var data = JSON.parse(getParticipants.responseText);
      createHtml(data);
    //   formatMiles(data);
      // formatAvg(data);
    //   cleanData(data);
    //   console.log(data.data[0].average.toFixed(2));
    },
    error: function(xhr) {
      console.log("Failed to load data.");
    }
})


// var lmscGroup = _.groupBy(data, function(lmsc){ 
//     return lmsc.name.substr(0,1); 
// });

// function formatAvg(average) {
//     let formattedAvg = average.toFixed(2);;
//     average = formattedAvg;  
//     return average;
// }
  

  

// function formatMiles(miles) {  
//     miles = data[0].miles.toFixed(2);
//     return miles;
// }

// function cleanData(data) {
//     let tempData = data; // Use local data object until api access is fixed
//     for (var i = 0; i < tempData.length; i++) {
//         // tempData[i].miles = formatMiles(data[i].miles);
//         tempData[i].average = formatAvg(data[i].average);
//     }
// };

// cleanData(data);


function createHtml(data) {
    var rawTemplate = document.getElementById("zoneTemplate").innerHTML;
    var compiledTemplate = Handlebars.compile(rawTemplate);
    var generatedHTML = compiledTemplate(data)
    var gtdZones = document.getElementById("gtdZones");
    gtdZones.innerHTML = generatedHTML;
}