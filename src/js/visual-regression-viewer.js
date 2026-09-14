// src/js/visual-regression-viewer.js
// Reads ?src= and ?viewport= from the URL and renders the requested baseline
// screenshot at a width appropriate for its viewport (Desktop: 100%, Mobile: 410px).
(function () {
  var params = new URLSearchParams(window.location.search);
  var src = params.get('src');
  var viewport = params.get('viewport') || 'Desktop';

  var img = document.getElementById('vrgv-img');
  if (!src || !img) return;

  img.src = src;
  img.classList.add(viewport === 'Mobile' ? 'vrgv__img--mobile' : 'vrgv__img--desktop');
  document.title = src.split('/').pop() + ' — Visual Regression Screenshot Viewer';
})();
