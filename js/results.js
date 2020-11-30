// function getEventResults() {
//   hideLoadingSpinner();
// }

function hideLoadingSpinner() {
  const loadingSpinner = document.getElementById('loadingWrapper');
  loadingSpinner.classList.add('hide');
}
hideLoadingSpinner();


function getEventResults() {
  // showLoadingOverlay();
  const xhr = new XMLHttpRequest();

  xhr.open('GET', 'https://test.usms.org/apis/v1/gtd/participants', true);
  xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
  xhr.onload = function () {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.data);
      return;
    }
    console.log(response);
    return null;
  };
  xhr.send();
}

getEventResults();



var options = {
  // searchColumns: 'club',
  page: 99,
  pagination: true,
  innerWindow: 1,
  left: 0,
  right: 0,
  paginationClass: "pagination",
  valueNames: [ 'firstname', 'lastname', 'sex', 'age', 'agegroup', 'club', 'lmsc', 'zone', 'miles' ],
};

function formatMiles(miles) {  
  miles = miles.toFixed(2);
  return miles;
}



// Calculate Age Groups based on Age
function formatAgeGroup(age, agegroup) {
  if (age > 69 && age < 75) {
    agegroup = '70-74';
    return agegroup;
  } else if (age > 64 && age < 70) {
    agegroup = '65-69';
    return agegroup;
  } else if (age > 59 && age < 65) {
    agegroup = '60-64';
    return agegroup;
  } else if (age > 54 && age < 60) {
    agegroup = '55-59';
    return agegroup;
  } else if (age > 49 && age < 55) {
    agegroup = '50-54';
    return agegroup;
  } else if (age > 44 && age < 50) {
    agegroup = '45-49';
    return agegroup;
  } else if (age > 39 && age < 45) {
    agegroup = '40-44';
    return agegroup;
  } else if (age > 34 && age < 40) {
    agegroup = '35-39';
    return agegroup;
  } else if (age > 29 && age < 35) {
    agegroup = '30-34';
    return agegroup;
  } else if (age > 24 && age < 30) {
    agegroup = '25-29';
    return agegroup;
  } else if (age > 17 && age < 25) {
    agegroup = '18-24';
    return agegroup;
  }
}



function cleanData(data) {
  for (var i = 0; i < newData.length; i++) {
    newData[i].miles = formatMiles(data[i].miles);
    newData[i].agegroup = formatAgeGroup(data[i].age, data[i].agegroup);
  }
};
let newData = data;
cleanData(data);


// Initialize List
var resultsGtd = new List('resultsGtd', options, newData );

resultsGtd.sort(
  'miles', {
  order:'desc',
  }
);


// resultsGtd.search(
  // [
  // 'age', {searchColumn:'age'},
  // 'club', {searchColumne: 'club'}
// ]
// );



// var searchName = document.getElementById('searchName');
// var searchAge = document.getElementById('searchAge');
// var searchClub = document.getElementById('searchClub');

// function handleAllInputs(e) {
//   var allInputValues = ['searchName', 'searchClub'];
//   resultsGtd.search(allInputValues, )
//   return allInputValues;
// }
// allInputs.onblur = handleAllInputs;



function handleNameSearch(e) {
  var searchNameValue = document.getElementById('searchName').value;
  resultsGtd.search(searchNameValue, ['lastname', 'firstname']);
  return searchNameValue;
}
searchName.onkeyup = handleNameSearch;



function handleSearchAge(e) {
  var searchAgeValue = document.getElementById('searchAge').value;
  resultsGtd.search(searchAgeValue, ['age']);
  return searchAgeValue;
}
searchAge.onkeyup = handleSearchAge;



function handleSearchClub(e) {
  var searchClubValue = document.getElementById('searchClub').value;
  resultsGtd.search(searchClubValue, ['club']);
  return searchClubValue;
}
searchClub.onkeyup = handleSearchClub;



function handleSelectSex(e) {
  var filterSummaryItem = document.querySelector(".filter-summary-item--sex");
  var filterSummaryItemValue = document.querySelector(".filter-summary-item-value--sex");
  var selectValueSex = document.getElementById('selectSex').value; 

  if (selectValueSex == "All") {
    resultsGtd.filter();
  } else {
    resultsGtd.filter(function(item) {      
        return(item.values().sex == selectValueSex);
    });
    filterSummaryItemValue.textContent = selectValueSex;
    filterSummaryItem.classList.remove('hide');
  }
}
selectSex.onchange = handleSelectSex;



function handleSelectAgeGroup(e) {

  var filterSummaryItemAgeGroup = document.querySelector(".filter-summary-item--agegroup");
  var filterSummaryItemAgeGroupValue = document.querySelector(".filter-summary-item-value--agegroup");
  var selectAgeGroupValue = document.getElementById('selectAgeGroup').value;
  // var selectSexValue = document.getElementById('selectSex').value;
  
  if (selectAgeGroupValue == "All") {    
    resultsGtd.filter();
  } else {
    resultsGtd.filter(
      function(item) {
      return item.values().agegroup == selectAgeGroupValue;
    });

    filterSummaryItemAgeGroupValue.textContent = selectAgeGroupValue;
    filterSummaryItemAgeGroup.classList.remove('hide');
  }
}

// selectAgeGroup.onchange = handleSelectAgeGroup;

// handleBioSelects =  [handleSelectSex, handleSelectAgeGroup]
// handleAdminSelects = [handleSelectLmsc, handleSelectZone]

// selectAgeGroup.onchange = handleBioSelects;



function handleSelectLmsc(e) {
  var selectedLmsc = document.getElementById('selectLmsc').value;
  if (selectedLmsc == "All") {
    resultsGtd.filter();
  } else {
    resultsGtd.filter(function(item) {
      return(item.values().lmsc == selectedLmsc);
    });  
  }
}
selectLmsc.onchange = handleSelectLmsc;



function handleSelectZone(e) {
  var selectedZone = document.getElementById('selectZone').value;
  if (selectedZone == "All") {
    resultsGtd.filter();
  } else {
    resultsGtd.filter(function(item) {
      return(item.values().zone == selectedZone);
    });  
  }
}
selectZone.onchange = handleSelectZone;



$("#filterSummaryItemSex").click(function() {
  var filterSummarySex = document.querySelector(".filter-summary-item--sex");
  filterSummarySex.classList.add('hide');
  var selectSex = document.getElementById('selectSex');
  selectSex.value = 'All';
  resultsGtd.filter();
});



$("#filterSummaryItemAgeGroup").click(function() {
  var filterSummaryAgeGroup = document.querySelector(".filter-summary-item--agegroup");
  filterSummaryAgeGroup.classList.add('hide');
  var selectAgeGroup = document.getElementById('selectAgeGroup');
  selectAgeGroup.value = 'All';
  resultsGtd.filter();
});


$("#clearFilters").click(function(){
  var filterSummarySex = document.querySelector(".filter-summary-item--sex");
  var filterSummaryAgeGroup = document.querySelector(".filter-summary-item--agegroup");
  filterSummarySex.classList.add('hide');
  filterSummaryAgeGroup.classList.add('hide');
  searchName.value = '';
  searchAge.value = '';
  $("select").each(function() { this.selectedIndex = 0 });
  resultsGtd.filter();
  resultsGtd.search();
  resultsGtd.sort(
    'miles', {
    order:'desc',
    }
  );
});



