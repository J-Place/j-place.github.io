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
      }
    });
    gtdMilestones.sort(
      'last', {
        order: 'asc',
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
  filterSummary.innerHTML = '';
  filterCount.innerHTML = '';
  var selectItemMilestone = document.getElementById('selectMilestone');
  if (selectItemMilestone.value !== 'undefined') {
    var el = document.createElement('p');
    var elParent = document.getElementById('filterSummary');
    el.textContent = selectItemMilestone.value;
    elParent.append(el);
  } if (gtdMilestones.matchingItems.length > 0 ) {
    var elWrp = document.createElement('p');
    var elWrpParent = document.getElementById('filterCount');
    elWrp.textContent = gtdMilestones.matchingItems.length - 1;
    elWrpParent.append(elWrp);
  }
}


$(".select").change(function () {
  handleFilters();
});

let searchNameInput = document.getElementById('searchName');

$("#clearFilters").click(function(){
  $("select").each(function() { this.selectedIndex = 0 });
  gtdMilestones.filter();
  gtdMilestones.sort('last', {order:'asc'});
  handleFilters();
});


(function () {
  hideLoadingSpinner();
})();
