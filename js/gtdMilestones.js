
var gtdMilestones = null;


function hideLoadingSpinner() {
  const loadingSpinner = document.getElementById('loadingWrapper');
  loadingSpinner.classList.add('hide');
}

var getData = $.ajax({
  url: "https://j-place.github.io/milestones.json",
  type: "GET",
  success: function (response) {
    var data = JSON.parse(getData.responseText);
    var dataLocal = data.data;

    gtdMilestones = new List('gtdMilestones', options, dataLocal);

    gtdMilestones.filter(function(item) { 
      if (item.values().milestone === "50 miles") {
        return gtdMilestones.matchingItems.length && true;
      } else {
        return false;
      }
    });
    gtdMilestones.sort(
      'dateAchieved', {
        order: 'desc',
      }
    );    
    updateFilterSummary();
  },
  error: function (xhr) {
    console.log("Failed to load data.");
  },
});

// function getParticipants() {
//   const xhr = new XMLHttpRequest();
//   xhr.open('GET', `https://test.usms.org/apis/v1/gtd/milestones`, true);
//   xhr.withCredentials = true;
//   console.log("Status is " + xhr.status);
//   xhr.onload = function () {
//     console.log("Loading Data");
//     if (xhr.status === 200) {
//       const response = JSON.parse(xhr.responseText);
//       console.log(response.data);
//     } else {
//       showErrorModal('Error updating coaches');
//     }
//   };
//   xhr.send(null);
// }
// getParticipants();


var options = {
  page: 50,
  pagination: true,
  left: 0,
  right: 0,
  pagination: {
    innerWindow: 3,
    outerWindow: 1,
    paginationClass: "pagination",
  },
  valueNames: ['milestone', 'first', 'last', 'age', 'sex', 'clubAbbr', 'dateAchieved'],
}


function handleFilters() {
  var selectValueMilestone = document.getElementById('selectMilestone').value;
  if (!gtdMilestones) {
    console.error('gtdMilestones not defined');
    return;
  } else {
    gtdMilestones.filter(function(item) {
      if (item.values().milestone === selectValueMilestone) {
        // return true;
        return gtdMilestones.matchingItems.length && true;
      } else {
        return false;
      }
    });
  }
  updateFilterSummary();
}


function updateFilterSummary() {

  // Clear all items before drawing new
  var filterSummary = document.getElementById('filterSummary');
  var paginationCount = document.getElementById('paginationCount');
  var paginationMilestone = document.getElementById('paginationMilestone');
  filterSummary.innerHTML = '';
  filterCount.innerHTML = '';
  paginationCount.innerHTML = '';
  paginationMilestone.innerHTML = '';

  // Render summary items
  var selectItemMilestone = document.getElementById('selectMilestone');

  if (selectItemMilestone.value !== 'undefined') {

    var el = document.createElement('span');
    var elParent = document.getElementById('filterSummary');
    el.textContent = selectItemMilestone.value;
    elParent.append(el);

    var elPageMilestone = document.createElement('span');
    var elPageMilestoneParent = document.getElementById('paginationMilestone');
    elPageMilestone.textContent = selectItemMilestone.value;
    elPageMilestoneParent.append(elPageMilestone);

  } if (gtdMilestones.matchingItems.length > 0 ) {

    var elWrp = document.createElement('span');
    var elWrpParent = document.getElementById('filterCount');
    elWrp.textContent = gtdMilestones.matchingItems.length;
    elWrpParent.append(elWrp);

    var elPageCount = document.createElement('span');
    var elPageCountParent = document.getElementById('paginationCount');
    elPageCount.textContent = gtdMilestones.matchingItems.length;
    elPageCountParent.append(elPageCount);

  }
}


$(".select").change(function () {
  handleFilters();
});


$("#clearFilters").click(function(){
  $("select").each(function() { this.selectedIndex = 12 });
  gtdMilestones.filter();
  gtdMilestones.sort('dateAchieved', {order:'desc'});
  handleFilters();
});


(function () {
  hideLoadingSpinner();
})();
