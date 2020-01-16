function getWorkouts() {
    var workoutFocus = "Triathlon Training";

    // showLoadingOverlay();
    const xhr = new XMLHttpRequest();
  
    xhr.open('GET', '/KD Great Workout.json?ver=1', true);
    // xhr.open('GET', '/swimFeedJP.json?asd=1', true);
    xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    // xhr.withCredentials = true;
    xhr.onload = function () {
      if (xhr.status === 200) {
        hideLoadingOverlay();
        const response = JSON.parse(xhr.response);
        allWorkouts = response.workouts;
        const stripped = { response, workouts: response.workouts.slice(0, (perPage - 1) * currentPage++) };
        createWorkoutsHtml(stripped);
        console.log("Load JSON");
        return;
      }
      console.log("Error retrieving swim information");
      return null;
    };
    xhr.send();
  }

  getWorkouts();