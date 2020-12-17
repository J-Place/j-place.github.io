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
    gtdParticipants = new List('gtdParticipants', options, dataLocal);
    gtdParticipants.filter(function(item) { 
      if (item.values() !== undefined) {
        // console.log(gtdParticipants.visibleItems.length);
        console.log(gtdParticipants);
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
  page: 25,
  pagination: true,
  // left: 0,
  // right: 0,
  pagination: {
    left: 1,
    right: 1,
    innerWindow: 2,
    outerWindow: 2,
    paginationClass: "pagination",
  },
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


let searchNameInput = document.getElementById('searchName');
let searchAgeInput = document.getElementById('searchAge');
let searchClubInput = document.getElementById('searchClub');


function handleSearch() {
  var searchNameInput = document.getElementById('searchName');
  var searchNameValue = document.getElementById('searchName').value;
  var isEmptyName = searchNameInput.value === '';
  if (isEmptyName === false) {
    gtdParticipants.search(searchNameValue, ['first', 'last', 'age', 'clubAbbr']);
  }
  updateSearchSummary();
  handleFilters();
}
searchNameInput.onkeyup = handleSearch;


function updateSearchSummary() {

  // Clear all items before drawing new
  var searchSummary = document.getElementById('searchSummary');
  searchSummary.innerHTML = '';

  // Loop thru and render summary items
  var searchNameInput = document.getElementById('searchName');
  var isEmptyName = searchNameInput.value === '';

  if (isEmptyName === false ) {
  // if (searchNameInput.value !== '' || searchNameInput.value !== undefined)
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
  var searchNameInput = document.getElementById('searchName');
  $("#name").click(function(){
    searchNameInput.value = '';
    handleSearch();
    handleFilters();
    gtdParticipants.search();
  });
}

function updateFilterSummary() {

  // Clear all items before drawing new
  var filterCount = document.getElementById('filterCount');
  var filterSummary = document.getElementById('filterSummary');
  var paginationCount = document.getElementById('paginationCount');
  // var paginationMilestone = document.getElementById('paginationMilestone');

  filterCount.innerHTML = '';
  filterSummary.innerHTML = '';
  paginationCount.innerHTML = '';


  // Render page counts
  var elFilterCount = document.createElement('span');
  var elFilterCountParent = document.getElementById('filterCount');
  elFilterCount.textContent = gtdParticipants.matchingItems.length;
  elFilterCountParent.append(elFilterCount);
  
  var elPageCount = document.createElement('span');
  var elPageCountParent = document.getElementById('paginationCount');
  elPageCount.textContent = gtdParticipants.matchingItems.length;
  elPageCountParent.append(elPageCount);

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
  handleFilters();
});