function getWorkouts() {
	// showLoadingOverlay();
	const xhr = new XMLHttpRequest();
  
	xhr.open('GET', '/KD Great Workout.json?ver=1', true);
	xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
	xhr.onload = function () {
	  if (xhr.status === 200) {
		const response = JSON.parse(xhr.response);
    // createWorkoutsHtml(response);
    data = response.data;
		console.log(data);
		return;
	  }
	  console.log("Error retrieving swim information");
	  return null;
	};
	xhr.send();
  }
  
  getWorkouts();