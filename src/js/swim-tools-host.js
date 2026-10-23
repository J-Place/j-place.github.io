// Mounts the Swim Tools app's views on this site's host pages
// (data-usms-component="SwimTools"), with what Sitecore will know in
// production and this prototype knows from its personas:
//   - who's visiting: the same ?user= → sessionStorage.activeUser → page
//     default order as current-user.js and swim-tools-v2.js, so the log
//     lands under v2's own key (swimTools.log.<persona>)
//   - where data comes from: the static copy synced into /data/swim-tools/
//     (the app's static adapter), or, with ?swimtools=api, the app's own
//     server on localhost:3000 (next dev in ~/dev/usms/swim-tools), kept for
//     the tab in sessionStorage like the other pins
(function () {
  'use strict';

  var LOGIN_URL = '/account/myusmslogin';
  var API_URL = 'http://localhost:3000';

  function users() {
    var el = document.getElementById('site-users-data');
    try { return JSON.parse(el.textContent).users; } catch { return {}; }
  }

  function persona(all, fallback) {
    var id = null;
    try {
      id = new URLSearchParams(location.search).get('user') || sessionStorage.getItem('activeUser');
    } catch {}
    return id && all[id] ? id : fallback;
  }

  function adapter() {
    var pinned = new URLSearchParams(location.search).get('swimtools');
    try {
      if (pinned) sessionStorage.setItem('swimToolsAdapter', pinned);
      return sessionStorage.getItem('swimToolsAdapter') || 'static';
    } catch {
      return pinned || 'static';
    }
  }

  // The prototype's persona facts as Swim Tools' visitor status
  function status(user) {
    if (!user || user.loggedIn !== true) return 'anonymous';
    return user.swimmerId ? 'member' : 'nonmember';
  }

  function mountAll() {
    if (!window.SwimTools) return;
    var all = users();
    document.querySelectorAll('[data-usms-component="SwimTools"]:not([data-props])').forEach(function (el) {
      var id = persona(all, el.dataset.defaultPersona);
      var visitor = { status: status(all[id]), persona: id };
      var data = adapter() === 'api'
        ? { adapter: 'api', apiUrl: API_URL, persona: id }
        : { adapter: 'static', dataUrl: '/data/swim-tools', visitor: visitor, loginUrl: LOGIN_URL };
      window.SwimTools.mount(el, { view: el.dataset.view, data: data });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountAll);
  else mountAll();
})();
