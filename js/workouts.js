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

	function getWorkouts() {
	  var workoutFocus = "Triathlon Training";

	  // showLoadingOverlay();
	  var xhr = new XMLHttpRequest();

	  xhr.open('GET', '/KD Great Workout.json?ver=1', true);
	  // xhr.open('GET', '/swimFeedJP.json?asd=1', true);
	  xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
	  // xhr.withCredentials = true;
	  xhr.onload = function () {
	    if (xhr.status === 200) {
	      // hideLoadingOverlay();
	      var response = JSON.parse(xhr.response);
	      allWorkouts = response.workouts;
	      var stripped = { response: response, workouts: response.workouts.slice(0, (perPage - 1) * currentPage++) };
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

/***/ })
/******/ ]);