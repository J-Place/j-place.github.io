function getWorkoutData() {
    const xhr = new XMLHttpRequest();
  
    // xhr.open('GET', '/swimFeedJP.json?ver=1', true);
    xhr.open('GET', '/KD Great Workout.json', true);
    xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    xhr.onload = function () {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.response);
        var workoutData = response.data;
        renderWorkouts(workoutData);       
        return;
      }
      console.log("Error retrieving swim information");
      return null;
    };
    xhr.send();
  }
  getWorkoutData();


//   var workoutData = require('./KD Great Workout.json');

//   renderWorkouts(workoutData);

  // Populate Workout Results Template
function renderWorkouts(workout) {
    console.log(workout.workouttitle);
    console.log(workout)
    var rawTemplate = document.getElementById("workoutResultsTemplate").innerHTML;
    var compiledTemplate = Handlebars.compile(rawTemplate);
    var ourGeneratedHTML = compiledTemplate(workout)
    var wrapper = document.getElementById("workoutResultsWrapper");
    wrapper.innerHTML = ourGeneratedHTML;
  }