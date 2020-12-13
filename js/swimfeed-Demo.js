
let hostName = window.location.hostname;
let hostNickname = '';
let apiUrl = '';

function checkHost() {
  if (hostName === 'www.usms.org') {
    hostNickname = 'prod';
  } else if (hostName === 'test.usms.org') {
    hostNickname = 'qa';
  }
  return hostNickname;
}
checkHost();


///////////////////////////////////////////
// Account Integration
///////////////////////////////////////////

$('#getStarted').bind("click", function() {
  if (hostNickname === 'prod') {
    window.open("https://www.swim.com/oauth2/authorize?grant_type=token&client_id=AKIA5D3VK5K424ZC7VGU&redirect_url=https://www.usms.org/myusms/swimfeed/integrate.php", "_blank", "location=0,status=0,menubar =0,scrollbars=1");
  } else if (hostNickname === 'qa') {
    window.open("https://qa.swim.com/oauth2/authorize?grant_type=token&client_id=AKIAISQ54JN5YSDP566Q&redirect_url=https://usmssc9.buildabonfire.com/myusms/swimfeed/integrate.php", "_blank", "location=0,status=0,menubar =0,scrollbars=1");
  }
});


///////////////////////////////////////////
// Swim Events
///////////////////////////////////////////

function setApiUrl() {
  if (hostNickname === 'prod') {
    apiUrl = 'https://pro-api.swim.com/api/v1/';
  } else if (hostNickname === 'qa') {
    apiUrl = 'https://qa-api.swim.com/api/v1/';
  }
  return apiUrl;
}
setApiUrl();

let pageNum = 1;
let pageCount = 10;
let pageSort = 'descend';

function checkToken(token) {
  if (!token) {    
    $("#getStarted").collapse('show');
    $("#swimIntro").collapse('show');
    $("#accountMessage").collapse('hide');
    $(".feed-body").collapse('hide');
	  $("#disconnectFeed").collapse('hide');
    return null;
  } else {
    $("#getStarted").collapse('hide');
    $("#swimIntro").collapse('hide');
    $("#accountMessage").collapse('show');
	  $("#disconnectFeed").collapse('show');
    getSwimData(token);
  }
}

var getSwimData = function(token) {
  if (pageNum === 1) {
    showLoadingOverlay();
  }
  const xhr = new XMLHttpRequest();
  xhr.open('GET', apiUrl + 'swimmer/swims?page=' + pageNum + '&per_page=' + pageCount + '&sort=' + pageSort, true);
  xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
  xhr.setRequestHeader('Authorization', 'Bearer ' + token);
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function () {
    if (xhr.status === 200) {
      hideLoadingOverlay();
      hideButtonSpinner();
      const swimData = JSON.parse(xhr.response);
      if (swimData === null) {
        console.log("You have no swim data");
      } else {
        convertSwimData(swimData);
      }
      return;
    } else if (xhr.status === 401) {
      console.log("401 Error");
      $("#getStarted").collapse('show');
      $("#swimIntro").collapse('show');
      // hideLoadingOverlay();
      return null;
    } else {
      // hideLoadingOverlay();
      console.log("Error retrieving swim information");
    }
  };
  // xhr.onerror = function () {
  //   console.log("XHR On Error");
  //   $("#getStarted").collapse('show');
  //   $("#swimIntro").collapse('show');
  //   $(".feed-body").collapse('hide');
	//   $("#disconnectFeed").collapse('hide');
  //   hideLoadingOverlay();
  // }
  xhr.send();
}

var loadMoreSwims = function(token) {
  pageNum++;
  getSwimData(token);
  showButtonSpinner();
}

function formatSwimDateTime(swimDateTime) {
  let m = moment(swimDateTime);
  let swimYear = m.format('YYYY');
  let swimMonth = m.format('MMMM');
  let swimDay = m.format('DD');
  let swimMonthDay = (swimMonth + " " + swimDay + ", " + swimYear);
  swimDateTime = swimMonthDay;
  return swimDateTime;
}

function formatSwimDistance(course, courseUnit, swimDistance) {
  if (courseUnit === 'y') {
    rawCourseInYards = course * 1.09361; // Convert course (pool length) from meters to yards
    cleanCourseInYards = Math.round(rawCourseInYards); // Round course distance
    cleanSwimDistance = Math.round(swimDistance / cleanCourseInYards) * cleanCourseInYards; // Round swim distance to nearest course distance
    cleanSwimDistance = Math.trunc(cleanSwimDistance); // Remove distance decimal places
    cleanSwimDistance = cleanSwimDistance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add comma to thousands
  } else if (courseUnit === 'm') {
    swimDistance = Math.round(swimDistance / course) * course; // Round swim distance to nearest course distance
    cleanSwimDistance = swimDistance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add comma to thousands
  }
  swimDistance = cleanSwimDistance;
  return swimDistance;
}

function writeCourseUnit(courseUnit) {
  // Spells out course unit for use in labels
  var fullCourseUnit = '';
  if (courseUnit === 'y') {
    fullCourseUnit = 'Yards';
  } else {
    fullCourseUnit = 'Meters';
  }
  return fullCourseUnit;
}

function formatSwimDuration(swimDuration) {
  if (swimDuration > 0) {
    let cleanSwimDuration = moment.duration(swimDuration, "seconds").format();
    swimDuration = cleanSwimDuration;  
    return swimDuration;
  } else if (swimDuration === 0 ) {
    // In test, data was currupted and returning a value of '0' for time.
    // Moment.js plugin writes "O seconds", so we're overriding that here with "0:00".
    // This may not be necessary for production.
    swimDuration = "0:00";
    return swimDuration;
  }
}

function formatSwimPace(courseUnit, swimPace) {
  if (swimPace > 0) {    
    if (courseUnit === 'y') {
      let yardSwimPace = swimPace * 0.9144; // Convert meter duration to yard duration  
      let cleanSwimPace = moment.duration(yardSwimPace, "seconds").format();
      swimPace = cleanSwimPace;
      return swimPace;
    } else if (courseUnit === 'm') {
      let cleanSwimPace = moment.duration(swimPace, "seconds").format();
      swimPace = cleanSwimPace;
      return swimPace;
    }
  } else if (swimPace === 0 ) {
    // In test, data was currupted and returning a value of '0' for time.
    // Moment.js plugin writes "O seconds", so we're overriding that here with "0:00".
    // This may not be necessary for production.
    swimPace = "0:00";
    return swimPace;
  }
}

function convertSwimData(swimData) {  
  let cleanSwimData = swimData;
  for (var i = 0; i < swimData.data.length; i++) {
    cleanSwimData.data[i].swimDistance = formatSwimDistance(swimData.data[i].course, swimData.data[i].courseUnit, swimData.data[i].swimDistance); 
    cleanSwimData.data[i].fullCourseUnit = writeCourseUnit(swimData.data[i].courseUnit);
    cleanSwimData.data[i].swimDateTime = formatSwimDateTime(swimData.data[i].swimDateTime);
    cleanSwimData.data[i].swimDuration = formatSwimDuration(swimData.data[i].swimDuration);
    cleanSwimData.data[i].swimPace = formatSwimPace(swimData.data[i].courseUnit, swimData.data[i].swimPace);
  }
  if (pageNum === 1) {
    renderLatestSwims(cleanSwimData);
    $(".feed-body").collapse('show');
    setFeedHeight();

  } else {
    renderMoreSwims(cleanSwimData);
    $(".feed-body").collapse('show');
    setFeedHeight();
  }
}

function setFeedHeight() {
  var feedItemsHeight = 0;
  var feedWrapper = document.getElementById("swimsWrapper");
  $('#swimsWrapper .feed__item').each(function() {
    feedItemsHeight += $(this).outerHeight();
  });
  // Set max-height for smooth transition
  feedWrapper.style.maxHeight = feedItemsHeight + "px";
}

function renderLatestSwims(cleanSwimData) {
  const rawTemplate = document.getElementById("swimTemplate").innerHTML;
  const compiledTemplate = Handlebars.compile(rawTemplate);
  const ourGeneratedHTML = compiledTemplate(cleanSwimData);
  const swimsWrapper = document.getElementById("swimsWrapper");
  swimsWrapper.innerHTML = ourGeneratedHTML;
}

function renderMoreSwims(cleanSwimData) {
  const rawTemplate = document.getElementById("swimTemplate").innerHTML;
  const compiledTemplate = Handlebars.compile(rawTemplate);
  $('#swimsWrapper').append(compiledTemplate(cleanSwimData));
}


///////////////////////////////////////////
// Personal Records
///////////////////////////////////////////

var getRecordsData = function(token) {
  showLoadingOverlay();
  const xhr = new XMLHttpRequest();

  xhr.open('GET', apiUrl + 'achievements/personalrecord', true);

  xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
  xhr.setRequestHeader('Authorization', 'Bearer ' + token);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.onload = function () {
    if (xhr.status === 200) {
      hideLoadingOverlay();
      const recordsData = JSON.parse(xhr.response);
      cleanRecordsData(recordsData);
      $(".feed-body").collapse('show');
      return;
    }
    console.log("Error retrieving records information");
    return null;
  };
  xhr.send();
}

function formatRecordDate(date) {
  let m = moment(date);
  let swimYear = m.format('YYYY');
  let swimMonth = m.format('MMMM');
  let swimDay = m.format('DD');  
  let cleanRecordDate = (swimMonth + " " + swimDay + ", " + swimYear);
  date = cleanRecordDate;
  return date;
}

function formatRecordDuration(time) {
  let formattedRecordTime = moment.duration(time, "seconds").format("m:ss.SS");
  time = formattedRecordTime;  
  return time;
}

// function convertRecordDistance(time) {

// }

function cleanRecordsData(recordsData) {
  let cleanRecordsData = recordsData;
  const courses = cleanRecordsData.data.achievements.courseTypes;

  for (let i=0; i < courses.length; i++) {

    // delete courses[i].personalRecords.longest_swim;
    // delete courses[i].personalRecords.fastest_swim;

    const recordType = [courses[i].personalRecords.fastest_50, courses[i].personalRecords.fastest_100, courses[i].personalRecords.fastest_200, courses[i].personalRecords.fastest_400, courses[i].personalRecords.fastest_800, courses[i].personalRecords.fastest_1500, courses[i].personalRecords.fastest_swim];

    for (let i=0; i < recordType.length; i++) {
      if (recordType[i] !== undefined) {
        recordType[i].time = formatRecordDuration(recordType[i].time);
        recordType[i].date = formatRecordDate(recordType[i].date);
      }
    }
    // Longest Swim is not included in recordType Array, so we convert it here ...
    courses[i].personalRecords.longest_swim.date = formatRecordDate(courses[i].personalRecords.longest_swim.date);

    // Convert meters to yards
    if (courses[i].unit === 'y' ) {
      courses[i].personalRecords.longest_swim.time = courses[i].personalRecords.longest_swim.time * 1.09361; // Convert meters to yards
      courses[i].personalRecords.longest_swim.time = Math.round(courses[i].personalRecords.longest_swim.time);
    }

    // Add a comma to distance (time = distance on longest_swim)
    courses[i].personalRecords.longest_swim.time = courses[i].personalRecords.longest_swim.time.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  // Pass formatted data to Handlebars
  sortRecords(cleanRecordsData);
}

function formatRecordsData(recordsData) {

}

function formatRecordsDateTime(swimDateTime) {
  let m = moment(swimDateTime);
  let recordYear = m.format('YYYY');
  let recordMonth = m.format('MMMM');
  let recordDay = m.format('DD');
  let recordMonthDay = (recordMonth + " " + recordDay + ", " + recordYear);
  swimDateTime = recordMonthDay;
  return swimDateTime;
}

function sortRecords(cleanRecordsData) {
  let sortedRecords = cleanRecordsData;
  cleanRecordsData.data.achievements.courseTypes.courseRecord = false;
  for (var i = 0; i < cleanRecordsData.data.achievements.courseTypes.length; i++) {    
    var courseLength = cleanRecordsData.data.achievements.courseTypes[i].length;
    var courseUnit = cleanRecordsData.data.achievements.courseTypes[i].unit;    
    if (courseLength === 25 && courseUnit === 'y') {
      cleanRecordsData.data.achievements.courseTypes[i].courseRecord = true;      
    }
    if (courseLength === 25 && courseUnit === 'm') {
      cleanRecordsData.data.achievements.courseTypes[i].courseRecord = true;
    }
    if (courseLength === 50 && courseUnit === 'm') {
      cleanRecordsData.data.achievements.courseTypes[i].courseRecord = true;
    }
    createRecordsHtml(sortedRecords);
  }
}

function createRecordsHtml(sortedRecords) {
  var rawTemplate = document.getElementById("recordsTemplate").innerHTML;
  var compiledTemplate = Handlebars.compile(rawTemplate);
  var ourGeneratedHTML = compiledTemplate(sortedRecords)
  var recordsWrapper = document.getElementById("recordsWrapper");
  recordsWrapper.innerHTML = ourGeneratedHTML;
}


///////////////////////////////////////////
// Data Loading Spinner 
///////////////////////////////////////////

function showLoadingOverlay() {
  const originalScrollPosition = window.scrollY;
  // console.log("A " + window.scrollY);
  // console.log("B " + originalScrollPosition);
  hideLoadingOverlay(originalScrollPosition);
  document.body.className = "loading";
}

function hideLoadingOverlay(originalScrollPosition) {
  // console.log("C " + window.scrollY);
  // console.log("D " + originalScrollPosition);
  document.body.className = "";
}

function showButtonSpinner() {
  $("#loadSwimsSpinner").show();
  // const buttonSpinner = document.getElementById('loadSwimsSpinner');
  // buttonSpinner.style.display('inline-block');
}

function hideButtonSpinner() {
  $("#loadSwimsSpinner").hide();
  // const buttonSpinner = document.getElementById('loadSwimsSpinner');
  // buttonSpinner.style.display('none');
}
