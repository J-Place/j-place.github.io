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
    gtdMilestones.sort(
      'milestone', {
        order: 'asc',
      }
    );
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
  }
  // if (selectValueMilestone !== "All") {
  //     gtdMilestones.filter('milestone', selectValueMilestone );
  // } else {
  //     gtdMilestones.filter();
  // }
  // gtdMilestones.sort(milestone, {
  //   order: 'desc'
  // })

  gtdMilestones.filter(function(item) {
      if (item.values().milestone > selectValueMilestone) {
        console.log("True");
        return true;
      } else {
        console.log("False");
        return false;
      }
  });
}

$(".select").change(function () {
  handleFilters();
});

(function () {
  hideLoadingSpinner();
})();