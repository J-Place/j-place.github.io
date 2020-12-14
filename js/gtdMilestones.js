// function getEventResults() {
//   hideLoadingSpinner();
// }

function hideLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingWrapper');
    loadingSpinner.classList.add('hide');
  }
  hideLoadingSpinner();

  
  
  var options = {
    page: 99,
    pagination: true,
    innerWindow: 1,
    left: 0,
    right: 0,
    paginationClass: "pagination",
    valueNames: [ 'milestone', 'first', 'last', 'age', 'sex', 'clubAbbr', 'dateAchieved' ],
  };


//   var dataLocal = [data];
  
  
  var getMilestones = $.ajax({
      url: "https://j-place.github.io/milestones.json",
      type: "GET",
      success: function(response) {
        var data = JSON.parse(getMilestones.responseText);
        console.log(data.data[0]);
        console.log(data.data[0].milestone);
        var newData = data.data;
    //   handleFilters(newData);
          loadData(data.data);
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
          order:'asc',
          }
      );
    
  // function formatMiles(miles) {  
  //   miles = miles.toFixed(2);
  //   return miles;
  // }

    // function cleanData(data) {
    //     for (var i = 0; i < data.length; i++) {
    //             // console.log(data);
    //             // newData[i].miles = formatMiles(data[i].miles);
    //     }
    // };
      // let newData = data; // Use local data object until api access is fixed
    //   cleanData(data);
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



  function handleFilters() {

    // var selectValueMilestone = document.getElementById('selectMilestone').value;
  
    

    // gtdMilestones.sort(age, {
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
    handleFilters();
  });
  

}