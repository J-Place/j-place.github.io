
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
      // console.log(data.data[0]);
      // console.log(data.data[0].milestone);
      var dataLocal = data.data;
      // handleFilters(dataLocal);
      // cleanData(dataLocal);
      gtdMilestones = new List('gtdMilestones', options, dataLocal );
      gtdMilestones.sort(
        'milestone', {
        order:'asc',
        }
      );
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



var options = {
  page: 99,
  pagination: true,
  innerWindow: 1,
  left: 0,
  right: 0,
  paginationClass: "pagination",
  valueNames: [ 'milestone', 'first', 'last', 'age', 'sex', 'clubAbbr', 'dateAchieved' ],
}


// function loadData(data) {

  // console.log(data[0].milestone);
  
  // function formatMiles(miles) {  
  //   miles = miles.toFixed(2);
  //   return miles;
  // }

  // function cleanData(data) {
  //     for (var i = 0; i < data.length; i++) {
  //             // console.log(data);
  //             // dataLocal[i].miles = formatMiles(data[i].miles);
  //     }
  // };
    // let dataLocal = data;
  //   cleanData(data);
        
  // return data;

// }
// loadData();


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


  function handleFilters(e) {
    
    var selectValueMilestone = document.getElementById('selectMilestone').value;
    console.log(selectValueMilestone);

    // gtdMilestones.sort(milestone, {
    //     order: 'desc'
    // })

    // gtdMilestones.filter(function(item) {
    //     if (item.values().milestone > selectValueMilestone) {
    //         console.log("YES!!!!!");
    //        return true;
    //     } else {
    //        return false;
    //     }
    // });

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