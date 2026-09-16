document.addEventListener('DOMContentLoaded', function () {
  var comparisonChart = document.getElementById('membershipComparison');
  var comparisonBtn = document.getElementById('compareDetailsBtn');

  comparisonBtn.addEventListener('click', function () {
    if (comparisonChart.classList.contains('show')) {
      comparisonChart.classList.remove('show');
      comparisonBtn.classList.remove('open');
    } else {
      comparisonChart.classList.add('show');
      comparisonBtn.classList.add('open');
    }
  });

  if (window.jQuery) {
    window.jQuery('[data-toggle="popover"]').popover();
  }
});
