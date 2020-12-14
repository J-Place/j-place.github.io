
function hideLoadingSpinner() {
  const loadingSpinner = document.getElementById('loadingWrapper');
  loadingSpinner.classList.add('hide');
}
hideLoadingSpinner();

// var dataLocal = [];


var getData = $.ajax({
    url: "https://j-place.github.io/milestones.json",
    type: "GET",
    success: function(response) {
      var data = JSON.parse(getData.responseText);
      console.log(data.data[0].milestone);
      dataLocal = data.data;      
      console.log(dataLocal[0].milestone);
      // renderList();
      // test();
    },
    error: function(xhr) {
      console.log("Failed to load data.");
    },
});

// function formatMiles(milestone) {  
//   milestone = milestone.toFixed(2);
//   return milestone;
// }

// function cleanData(dataCleaned) {
//   for (var i = 0; i < newData.length; i++) {
//     newData[i].milestone = formatMiles(dataCleaned[i].milestone);
//   }
// };
// let newData = dataCleaned; // Use local data object until api access is fixed
// cleanData(dataCleaned);

function renderList() {

  console.log(dataLocal);

  var options = {
    page: 99,
    pagination: true,
    innerWindow: 1,
    left: 0,
    right: 0,
    paginationClass: "pagination",
    valueNames: [ 'milestone', 'first', 'last', 'age', 'sex', 'clubAbbr', 'dateAchieved' ],
  }

  var gtdMilestones = new List('gtdMilestones', options, dataLocal );

  gtdMilestones.sort(
    'milestone', {
    order:'asc',
    }
  );
}
renderList(dataLocal);


// let newData = dataLocal; // Use local data object until api access is fixed
// cleanData(dataLocal);
// console.log(newData);  

  // function updateFilterSummary() {
  //   // Clear all items before drawing new
  //   var filterSummary = document.getElementById('filterSummary');
  //   filterSummary.innerHTML = '';
  
  //   // Loop thru applied filters and render summary "buttons"
  //   var selectItemSex = document.getElementById('selectSex');
  //   var selectItemAgeGroup = document.getElementById('selectAgeGroup');
  //   var selectItemLmsc = document.getElementById('selectLmsc');
  //   var selectItemZone = document.getElementById('selectZone');
  //   var filterItems = [selectItemSex, selectItemAgeGroup, selectItemLmsc, selectItemZone];
  //   for (i = 0; i < filterItems.length; i++) {
  //     if (filterItems[i].value !== 'All') {
  //       var el = document.createElement('p');
  //       var elParent = document.getElementById('filterSummary');
  //       el.className = "filters__summary--item filters__summary--item-" + filterItems[i].parentElement.classList.value;
  //       el.id = filterItems[i].parentElement.classList.value;
  //       el.textContent = filterItems[i].value;
  //       elParent.append(el);
  //     }    
  //   }
  // }


  function handleFilters() {
    
    var selectValueMilestone = document.getElementById('selectMilestone').value;
    console.log(selectValueMilestone);


    // console.log(dataLocal);

    // if (selectValueMilestone !== "All") {
    //     // console.log(selectValueMilestone);
    //     // gtdMilestones.filter(function(item) {
    //     //     return item.values().milestone === selectValueMilestone;
    //     // });
    //     gtdMilestones.filter('milestone', selectValueMilestone );
    // } else {
    //     gtdMilestones.filter();
    // }

  }
  
  
  $(".select").change(function(){
    // console.log("Handling filters ...");
    handleFilters();
  });