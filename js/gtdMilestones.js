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



var options = {
  page: 99,
  pagination: true,
  innerWindow: 1,
  left: 0,
  right: 0,
  paginationClass: "pagination",
  valueNames: [ 'milestone', 'first', 'last', 'age', 'sex', 'clubAbbr', 'dateAchieved' ],
};


var getMilestones = $.ajax({
    url: "https://j-place.github.io/milestones.json",
    type: "GET",
    success: function(response) {
      var data = JSON.parse(getMilestones.responseText);
      var newData = data.data;
    //   createHtml(data);
    //   formatMiles(data);
    //   formatAvg(data);
        // cleanData(data);
        loadData(newData);
    },
    error: function(xhr) {
      console.log("Failed to load data.");
    }
})

function loadData(data) {
    console.log(data[0].milestone);
    var gtdMilestones = new List('gtdMilestones', options, data );

    // List sort defaults
    gtdMilestones.sort(
        'milestone', {
        order:'desc',
        }
    );
  
// function formatMiles(miles) {  
//   miles = miles.toFixed(2);
//   return miles;
// }
    function cleanData(data) {
        for (var i = 0; i < data.length; i++) {
            // console.log(data);
            // newData[i].miles = formatMiles(data[i].miles);
    }
    };
    // let newData = data; // Use local data object until api access is fixed
    cleanData(data);
}





// let searchNameInput = document.getElementById('searchName');
// let searchAgeInput = document.getElementById('searchAge');
// let searchClubInput = document.getElementById('searchClub');


// function handleSearch() {
//   console.log("Handling Search");
//   var searchNameInput = document.getElementById('searchName');
//   var searchNameValue = document.getElementById('searchName').value;
//   var isEmptyName = searchNameInput.value === '';
//   if (isEmptyName === false) {
//     gtdMilestones.search(searchNameValue, ['first', 'last', 'age', 'clubAbbr']);
//     // handleFilters();
//     // updateSearchSummary();
//   }
//   updateSearchSummary();
//   handleFilters();
// }
// searchNameInput.onkeyup = handleSearch;


// function updateSearchSummary() {
//   console.log("Updating Search Summary");
//   var searchSummary = document.getElementById('searchSummary');
//   searchSummary.innerHTML = '';
//   var searchNameInput = document.getElementById('searchName');
//   var isEmptyName = searchNameInput.value === '';
//   if (isEmptyName === false ) {
//       var el = document.createElement('p');
//       var elParent = document.getElementById('searchSummary');
//       el.className = "search__summary--item search__summary--item-name";
//       el.id = searchNameInput.parentElement.classList.value;
//       el.textContent = searchNameInput.value;
//       elParent.append(el);
//   }
//   searchSummaryBtn();
// }


// function searchSummaryBtn() {  
//   console.log("Creating Search Summary Button");
//   var searchNameInput = document.getElementById('searchName');
//   $("#name").click(function(){
//     console.log("Removing Search Summary Button");
//     searchNameInput.value = '';
//     handleSearch();
//     handleFilters();
//     // var summaryItemName = document.getElementById("name");    
//     // summaryItemName.remove();
//     gtdMilestones.search();
//   });
// }








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
//   $("#sex").click(function(){
//     document.getElementById("selectSex").selectedIndex = 0;
//     handleFilters();
//   });
}

function handleFilters(e) {
  var selectValueLmsc = document.getElementById('selectLmsc').value;
// One Value Defs
  if (selectValueSex !== "All" && selectValueAgeGroup === "All" && selectValueLmsc === "All" && selectValueZone === "All" ) {
    gtdMilestones.filter(function(item) {
      return item.values().sex === selectValueSex;
    });
  } else {
    gtdMilestones.filter();
  }
  updateFilterSummary();
}


$(".select").change(function(){
  handleFilters();
});

// $("#clearFilters").click(function(){
//   searchName.value = '';
//   $("select").each(function() { this.selectedIndex = 0 });
//   gtdMilestones.filter();
//   gtdMilestones.search();
//   gtdMilestones.sort('miles', {order:'desc'});
//   handleSearch();
//   // updateSearchSummary();
//   handleFilters();
//   // updateFilterSummary();
// });