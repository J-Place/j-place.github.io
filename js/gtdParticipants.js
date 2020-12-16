// function getEventResults() {
//   hideLoadingSpinner();
// }

function hideLoadingSpinner() {
  const loadingSpinner = document.getElementById('loadingWrapper');
  loadingSpinner.classList.add('hide');
}
hideLoadingSpinner();


// function getEventResults() {
//   // showLoadingOverlay();
//   const xhr = new XMLHttpRequest();
//   xhr.open('GET', 'https://test.usms.org/apis/v1/gtd/participants', true);
//   xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
//   xhr.onload = function () {
//     if (xhr.status === 200) {
//       const checkApi = JSON.parse(xhr.response);
//       return;
//     }
//     console.log(checkApi);
//     return null;
//   };
//   xhr.send();
// }
// getEventResults();


// function getEventResults() {
//   const xhr = new XMLHttpRequest();
//   // xhr.open('GET', `/apis/v1/gtd/participants`, true);
//   xhr.open('GET', `https://test.usms.org/apis/v1/gtd/participants`, true);
//   xhr.withCredentials = true;
//   xhr.onload = function () {
//     if (xhr.status === 200) {
//       const response = JSON.parse(xhr.response);
//     }
//     console.log(response);
//   };
//   xhr.send();
// }
// getEventResults();


function hideLoadingSpinner() {
  const loadingSpinner = document.getElementById('loadingWrapper');
  loadingSpinner.classList.add('hide');
}

var getData = $.ajax({
  url: "https://j-place.github.io/participants.json",
  type: "GET",
  success: function (response) {
    var data = JSON.parse(getData.responseText);
    var dataLocal = data.data;
    // for (var i = 0; i < dataLocal.length; i++) {
    //   let milestone = dataLocal[i].milestone;
    //   let milestoneFixed = milestone.slice(0, -6);
    //   dataLocal[i].milestone = milestoneFixed;
    // }

    console.log(dataLocal[0].name);

    gtdParticipants = new List('gtdParticipants', options, dataLocal);

    gtdParticipants.filter(function(item) { 
      if (item.values() !== undefined) {
        return gtdParticipants.matchingItems.length && true;
      } else {
        return false;
      }
    });
    gtdParticipants.sort(
      'miles', {
        order: 'desc',
      }
    );    
    updateFilterSummary();
  },
  error: function (xhr) {
    console.log("Failed to load data.");
  },
});


var options = {
  page: 99,
  pagination: true,
  innerWindow: 1,
  left: 0,
  right: 0,
  paginationClass: "pagination",
  valueNames: [ 'first', 'last', 'miles', 'sex', 'ageGroup', 'age', 'clubAbbr', 'lmsc', 'zone' ],
};

// function formatMiles(miles) {  
//   miles = miles.toFixed(2);
//   return miles;
// }

// function cleanData(dataLocal) {
//   for (var i = 0; i < newData.length; i++) {
//     newData[i].miles = formatMiles(dataLocal[i].miles);
//   }
// };
// let newData = dataLocal; // Use local data object until api access is fixed
// cleanData(dataLocal);


// // Initialize List.js
// var gtdParticipants = new List('gtdParticipants', options, newData );

// // List sort defaults
// gtdParticipants.sort(
//   'miles', {
//   order:'desc',
//   }
// );


let searchNameInput = document.getElementById('searchName');
let searchAgeInput = document.getElementById('searchAge');
let searchClubInput = document.getElementById('searchClub');


function handleSearch() {
  console.log("Handling Search");
  var searchNameInput = document.getElementById('searchName');
  var searchNameValue = document.getElementById('searchName').value;
  var isEmptyName = searchNameInput.value === '';
  if (isEmptyName === false) {
    gtdParticipants.search(searchNameValue, ['first', 'last', 'age', 'clubAbbr']);
    // handleFilters();
    // updateSearchSummary();
  }
  updateSearchSummary();
  handleFilters();
}
searchNameInput.onkeyup = handleSearch;


function updateSearchSummary() {
  console.log("Updating Search Summary");
  var searchSummary = document.getElementById('searchSummary');
  searchSummary.innerHTML = '';
  var searchNameInput = document.getElementById('searchName');
  var isEmptyName = searchNameInput.value === '';
  if (isEmptyName === false ) {
      var el = document.createElement('p');
      var elParent = document.getElementById('searchSummary');
      el.className = "search__summary--item search__summary--item-name";
      el.id = searchNameInput.parentElement.classList.value;
      el.textContent = searchNameInput.value;
      elParent.append(el);
  }
  searchSummaryBtn();
}


function searchSummaryBtn() {  
  console.log("Creating Search Summary Button");
  var searchNameInput = document.getElementById('searchName');
  $("#name").click(function(){
    console.log("Removing Search Summary Button");
    searchNameInput.value = '';
    handleSearch();
    handleFilters();
    // var summaryItemName = document.getElementById("name");    
    // summaryItemName.remove();
    gtdParticipants.search();
  });
}








function updateFilterSummary() {
  // Clear all items before drawing new
  var filterSummary = document.getElementById('filterSummary');
  filterSummary.innerHTML = '';

  // Loop thru applied filters and render summary "buttons"
  var selectItemSex = document.getElementById('selectSex');
  var selectItemAgeGroup = document.getElementById('selectAgeGroup');
  var selectItemLmsc = document.getElementById('selectLmsc');
  var selectItemZone = document.getElementById('selectZone');
  var filterItems = [selectItemSex, selectItemAgeGroup, selectItemLmsc, selectItemZone];
  for (i = 0; i < filterItems.length; i++) {
    if (filterItems[i].value !== 'All') {
      var el = document.createElement('p');
      var elParent = document.getElementById('filterSummary');
      el.className = "filters__summary--item filters__summary--item-" + filterItems[i].parentElement.classList.value;
      el.id = filterItems[i].parentElement.classList.value;
      el.textContent = filterItems[i].value;
      elParent.append(el);
    }    
  }
  // Remove filter summary "buttons"
  $("#sex").click(function(){
    document.getElementById("selectSex").selectedIndex = 0;
    handleFilters();
  });
  $("#ageGroup").click(function(){
    document.getElementById("selectAgeGroup").selectedIndex = 0;
    handleFilters();
  });
  $("#lmsc").click(function(){
    document.getElementById("selectLmsc").selectedIndex = 0;
    handleFilters();
  });
  $("#zone").click(function(){
    document.getElementById("selectZone").selectedIndex = 0;
    handleFilters();
  });
}

function handleFilters(e) {
  var selectValueLmsc = document.getElementById('selectLmsc').value;
  var selectValueAgeGroup = document.getElementById('selectAgeGroup').value;
  var selectValueSex = document.getElementById('selectSex').value;
  var selectValueZone = document.getElementById('selectZone').value;
  // One Value Defs
  if (selectValueSex !== "All" && selectValueAgeGroup === "All" && selectValueLmsc === "All" && selectValueZone === "All" ) {
    gtdParticipants.filter(function(item) {
      return item.values().sex === selectValueSex;
    });
  } else if (selectValueSex === "All" && selectValueAgeGroup !== "All" && selectValueLmsc === "All" && selectValueZone === "All" ) {
    gtdParticipants.filter(function(item) {
      return item.values().ageGroup === selectValueAgeGroup;
    });
  } else if (selectValueSex === "All" && selectValueAgeGroup === "All" && selectValueLmsc !== "All" && selectValueZone === "All" ) {
    gtdParticipants.filter(function(item) {
      return item.values().lmsc === selectValueLmsc;
    });
  } else if (selectValueSex === "All" && selectValueAgeGroup === "All" && selectValueLmsc === "All" && selectValueZone !== "All" ) {
    gtdParticipants.filter(function(item) {
      return item.values().zone === selectValueZone;
    });
  // Two Value Defs
  } else if (selectValueSex !== "All" && selectValueAgeGroup !== "All" && selectValueLmsc === "All" && selectValueZone === "All" ) {
    gtdParticipants.filter(function(item) {
      return item.values().sex === selectValueSex && item.values().ageGroup === selectValueAgeGroup;
    });
  } else if (selectValueSex !== "All" && selectValueAgeGroup === "All" && selectValueLmsc !== "All" && selectValueZone === "All" ) {
    gtdParticipants.filter(function(item) {
      return item.values().sex === selectValueSex && item.values().lmsc === selectValueLmsc;
    });
  } else if (selectValueSex !== "All" && selectValueAgeGroup === "All" && selectValueLmsc === "All" && selectValueZone !== "All" ) {
    gtdParticipants.filter(function(item) {
      return item.values().sex === selectValueSex && item.values().zone === selectValueZone;
    });
  } else if (selectValueSex === "All" && selectValueAgeGroup !== "All" && selectValueLmsc !== "All" && selectValueZone === "All" ) {
    gtdParticipants.filter(function(item) {
      return item.values().ageGroup === selectValueAgeGroup && item.values().lmsc === selectValueLmsc;
    });
  } else if (selectValueSex === "All" && selectValueAgeGroup !== "All" && selectValueLmsc === "All" && selectValueZone !== "All" ) {
    gtdParticipants.filter(function(item) {
      return item.values().ageGroup === selectValueAgeGroup && item.values().zone === selectValueZone;
    });
  } else if (selectValueSex === "All" && selectValueAgeGroup === "All" && selectValueLmsc !== "All" && selectValueZone !== "All" ) {
    gtdParticipants.filter(function(item) {
      return item.values().lmsc === selectValueLmsc && item.values().zone === selectValueZone;
    });
// Three Value Defs
  } else if (selectValueSex !== "All" && selectValueAgeGroup !== "All" && selectValueLmsc !== "All" && selectValueZone === "All" ) {
    gtdParticipants.filter(function(item) {
      return item.values().sex === selectValueSex && item.values().ageGroup === selectValueAgeGroup && item.values().lmsc === selectValueLmsc;
    });
  } else if (selectValueSex !== "All" && selectValueAgeGroup !== "All" && selectValueLmsc === "All" && selectValueZone !== "All" ) {
    gtdParticipants.filter(function(item) {
      return item.values().sex === selectValueSex && item.values().ageGroup === selectValueAgeGroup && item.values().zone === selectValueZone;
    });
  } else if (selectValueSex !== "All" && selectValueAgeGroup === "All" && selectValueLmsc !== "All" && selectValueZone !== "All" ) {
    gtdParticipants.filter(function(item) {
      return item.values().sex === selectValueSex && item.values().lmsc === selectValueLmsc && item.values().zone === selectValueZone;
    });
  } else if (selectValueSex === "All" && selectValueAgeGroup !== "All" && selectValueLmsc !== "All" && selectValueZone !== "All" ) {
    gtdParticipants.filter(function(item) {
      return item.values().ageGroup === selectValueAgeGroup && item.values().lmsc === selectValueLmsc && item.values().zone === selectValueZone;
    });
// Four Value Defs
  } else if (selectValueSex !== "All" && selectValueAgeGroup !== "All" && selectValueLmsc !== "All" && selectValueZone !== "All" ) {
    gtdParticipants.filter(function(item) {
      return item.values().sex === selectValueSex && item.values().ageGroup === selectValueAgeGroup && item.values().lmsc === selectValueLmsc && item.values().zone === selectValueZone;
    });
  } else {
    gtdParticipants.filter();
  }
  updateFilterSummary();
}

$(".select").change(function(){
  handleFilters();
});

$("#clearFilters").click(function(){
  searchName.value = '';
  $("select").each(function() { this.selectedIndex = 0 });
  gtdParticipants.filter();
  gtdParticipants.search();
  gtdParticipants.sort('miles', {order:'desc'});
  handleSearch();
  // updateSearchSummary();
  handleFilters();
  // updateFilterSummary();
});