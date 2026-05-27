(function () {
  'use strict';

  var maxWait = 8000;
  var interval = 150;
  var elapsed  = 0;

  var timer = setInterval(function () {
    var card = document.querySelector(
      '.location-column [data-name="Selby Aquatic Center"]'
    );
    if (card) {
      clearInterval(timer);
      var btn = card.querySelector('.btn-detail');
      if (btn) btn.click();
    }
    elapsed += interval;
    if (elapsed >= maxWait) clearInterval(timer);
  }, interval);

}());
