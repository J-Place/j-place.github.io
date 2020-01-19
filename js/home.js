/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	'use strict';

	function getWorkoutData() {
	  var xhr = new XMLHttpRequest();

	  // xhr.open('GET', '/swimFeedJP.json?ver=1', true);
	  xhr.open('GET', '/KD Great Workout.json', true);
	  xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
	  xhr.onload = function () {
	    if (xhr.status === 200) {
	      var response = JSON.parse(xhr.response);
	      var workoutData = response;
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
	  console.log(workout.data.workouttitle);
	  var rawTemplate = document.getElementById("workoutResultsTemplate").innerHTML;
	  var compiledTemplate = Handlebars.compile(rawTemplate);
	  var ourGeneratedHTML = compiledTemplate(workout);
	  var wrapper = document.getElementById("workoutResultsWrapper");
	  wrapper.innerHTML = ourGeneratedHTML;
	}

/***/ })
/******/ ]);