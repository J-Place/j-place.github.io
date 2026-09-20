const fs   = require('fs');
const path = require('path');

// ── Pool location helpers ─────────────────────────────────────────────────────

const _stateNameToAbbr = {
  'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA',
  'Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA',
  'Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA',
  'Kansas':'KS','Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD',
  'Massachusetts':'MA','Michigan':'MI','Minnesota':'MN','Mississippi':'MS',
  'Missouri':'MO','Montana':'MT','Nebraska':'NE','Nevada':'NV',
  'New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM','New York':'NY',
  'North Carolina':'NC','North Dakota':'ND','Ohio':'OH','Oklahoma':'OK',
  'Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC',
  'South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT',
  'Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI',
  'Wyoming':'WY','District of Columbia':'DC'
};

function _normState(s) {
  if (!s) return '';
  s = s.trim();
  return s.length === 2 ? s.toUpperCase() : (_stateNameToAbbr[s] || s);
}

function _deriveLmsc(state, lat, lng) {
  const single = {
    AK:'Alaska', AL:'Southeastern', AR:'Arkansas', AZ:'Arizona',
    CO:'Colorado', CT:'Connecticut', DC:'Potomac Valley', DE:'Delaware Valley',
    GA:'Georgia', HI:'Hawaii', IA:'Iowa', ID:'Snake River',
    IL:'Illinois', IN:'Indiana', KS:'Missouri Valley', KY:'Kentucky',
    LA:'Gulf', MA:'New England', MD:'Maryland', ME:'New England',
    MI:'Michigan', MN:'Minnesota', MO:'Ozark', MS:'Gulf',
    MT:'Montana', NC:'North Carolina', ND:'North Dakota', NE:'Nebraska',
    NH:'New England', NM:'New Mexico', NV:'Southern Pacific', OH:'Ohio',
    OK:'Oklahoma', OR:'Oregon', RI:'New England', SC:'South Carolina',
    SD:'South Dakota', TN:'Southeastern', UT:'Utah', VT:'New England',
    WI:'Wisconsin', WV:'Virginia', WY:'Snake River'
  };
  if (single[state]) return single[state];
  lat = parseFloat(lat); lng = parseFloat(lng);
  switch (state) {
    case 'FL': return lat < 27.0 ? 'Florida Gold Coast' : 'Florida';
    case 'CA':
      if (lat < 33.7) return 'San Diego-Imperial';
      if (lat > 36.5) return 'Pacific';
      return 'Southern Pacific';
    case 'TX': return lat > 31.0 ? 'North Texas' : 'South Texas';
    case 'NY':
      if (lng < -77.5) return 'Niagara';
      if (lat < 42.0) return 'Metropolitan';
      return 'Adirondack';
    case 'NJ': return lat > 40.2 ? 'Metropolitan' : 'New Jersey';
    case 'PA':
      if (lat > 41.2 && lng < -80.2) return 'Lake Erie';
      return lng < -78.0 ? 'Allegheny Mountain' : 'Delaware Valley';
    case 'VA': return lat > 37.5 ? 'Potomac Valley' : 'Virginia';
    case 'WA': return lng > -119.5 ? 'Inland Northwest' : 'Pacific Northwest';
    default: return null;
  }
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addWatchTarget("src/_data/");

  // Build swimmer registry from all swimmer-*.json files in _data/.
  // Using addGlobalData (called fresh each build) instead of a _data/swimmers.js
  // module (which Node caches between hot-reloads, causing stale registry).
  eleventyConfig.addGlobalData('swimmers', function () {
    const dir = path.join(__dirname, 'src/_data');
    const registry = {};
    fs.readdirSync(dir)
      .filter(f => /^swimmer-.+\.json$/.test(f))
      .forEach(f => {
        const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
        if (data && data.usmsId) registry[data.usmsId] = data;
      });
    return registry;
  });

  // Copy public/ to _site/public/ untouched
  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.addWatchTarget("public/");

  // Also copy public subdirectory CSS folders to root so legacy
  // Sergey pages with root-relative /xxx/css/ paths resolve correctly
  eleventyConfig.addPassthroughCopy({ "public/css": "css" });
  eleventyConfig.addPassthroughCopy({ "public/search/css": "search/css" });
  eleventyConfig.addPassthroughCopy({ "public/event/css": "event/css" });
  eleventyConfig.addPassthroughCopy({ "public/lanemate/css": "lanemate/css" });
  eleventyConfig.addPassthroughCopy({ "public/lanemate/css-components": "lanemate/css-components" });
  eleventyConfig.addPassthroughCopy({ "public/registration/css": "registration/css" });
  eleventyConfig.addPassthroughCopy({ "public/swimmer/css": "swimmer/css" });
  eleventyConfig.addPassthroughCopy({ "public/forum-comments/css": "forum-comments/css" });

  // Course type abbreviation for small list view
  const courseTypeMap = { "OPEN WATER": "OW", "SHORT COURSE YARDS": "SCY", "SHORT COURSE METERS": "SCM", "LONG COURSE METERS": "LCM" };
  eleventyConfig.addFilter("courseTypeAbbr", val => courseTypeMap[val.toUpperCase()] || val);

  // Serialize a value to a JSON string (for data-* attributes)
  eleventyConfig.addFilter("json", value => JSON.stringify(value));

  // Return deduplicated course Tag values from a courses array
  eleventyConfig.addFilter("uniqueCourseTags", courses =>
    [...new Set((courses || []).map(c => c.Tag))]
  );

  // Serialize locations array to JSON for the pool-lookup JS data blob
  eleventyConfig.addFilter("poolLocationsJson", locations =>
    JSON.stringify((locations || []).map(loc => {
      const state = _normState(loc.State);
      return {
        id:      loc.Id,
        name:    loc.Name,
        address: loc.Address,
        city:    loc.City,
        state:   state,
        zip:     loc.ZipCode,
        lat:     loc.Lat,
        lng:     loc.Lng,
        lmsc:    _deriveLmsc(state, loc.Lat, loc.Lng),
        courses: (loc.Courses || []).map(c => ({
        tag:           c.Tag,
        pool:          c.PoolName || c.Name,
        length:        c.Length,
        type:          c.SubType,
        lanes:         c.Lanes,
        bulkhead:      c.Bulkhead,
        touchpads:     c.Touchpads,
        certified:     c.Certified,
        certifiedDate: c.CertifiedDate,
        measured:      c.Measured,
        measuredDate:  c.MeasuredDate
      }))
    };
  }))
  );

  // Slim course objects down to only the fields shown in the pool detail modal
  eleventyConfig.addFilter("slimCourses", courses =>
    (courses || []).map(c => ({
      tag:       c.Tag,
      pool:      c.PoolName || c.Name,
      length:    c.Length,
      type:      c.SubType,
      lanes:     c.Lanes,
      bulkhead:  c.Bulkhead,
      touchpads:     c.Touchpads,
      certified:     c.Certified,
      certifiedDate: c.CertifiedDate,
      measured:      c.Measured,
      measuredDate:  c.MeasuredDate
    }))
  );

  // Format a number as a price with always-two decimal places: 110 → "110.00"
  eleventyConfig.addFilter("price", val => parseFloat(val || 0).toFixed(2));

  // Limit an array to n items
  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));

  // Drop virtual events — hidden by default until "Show Virtual Events" is checked
  eleventyConfig.addFilter("rejectVirtual", arr => (arr || []).filter(item => !item.virtual));

  // Production's real footer column grouping (parsed from the live DOM — it
  // balances total link count per column, not section count, so it can't be
  // derived generically). Any section not listed here (e.g. a new one added
  // upstream) is appended round-robin so a future data refresh doesn't drop it.
  const footerColumnLayout = [
    ["About USMS"],
    ["Join", "Pool and Open Water Events"],
    ["Club Central", "Coach Central", "ALTS Central"],
    ["Fitness and Training", "Governance", "Volunteers"]
  ];
  eleventyConfig.addFilter("footerColumns", items => {
    const byTitle = {};
    (items || []).forEach(s => { byTitle[s.Title] = s; });
    const columns = footerColumnLayout.map(titles => titles.map(t => byTitle[t]).filter(Boolean));
    const known = new Set(footerColumnLayout.flat());
    (items || []).forEach((s, i) => {
      if (!known.has(s.Title)) columns[i % columns.length].push(s);
    });
    return columns;
  });

  // Resolve a footer link's production URL to a local mockup page, or "#0" if we
  // don't have one. A couple of entries are matched by title instead of URL where
  // the production target doesn't correspond to how this mockup is organized.
  const footerHrefsByUrl = {
    "/about/swimmer-magazine":                  "/about/swimmer-magazine/index.html",
    "/events":                                  "/events/index.html",
    "/join-usms/join-or-renew":                 "/join-usms/join-or-renew/index.html",
    "/club-central":                            "/club-central/index.html",
    "/club-central/club-login":                 "/club-central/club-login.html",
    "/fitness-and-training/articles-and-videos": "/fitness-and-training/articles-and-videos/index.html"
  };
  const footerHrefsByTitle = {
    "Club Finder": "/clubs/index.html"
  };
  eleventyConfig.addFilter("footerHref", (url, title) => {
    if (footerHrefsByTitle[title]) return footerHrefsByTitle[title];
    return footerHrefsByUrl[(url || "").replace(/\/$/, "")] || "#0";
  });

  // Find a club by its production URL slug (e.g. "/clubs/sarasota-y-sharks-536")
  eleventyConfig.addFilter("findClub", (clubs, slug) =>
    (clubs || []).find(c => c.url === slug) || null
  );

  // Escape a string and convert line breaks to <br> tags
  eleventyConfig.addFilter("nl2br", value =>
    String(value || "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
      .replace(/\r\n|\r|\n/g, "<br>")
  );

  // Serialize club locations to the [{lat, lng, icon}] shape club-detail-map.js expects
  eleventyConfig.addFilter("clubMapLocationsJson", (locations, isMember) =>
    JSON.stringify((locations || []).map(loc => ({
      lat:  parseFloat(loc.lat),
      lng:  parseFloat(loc.long),
      icon: isMember ? "/img/marker_orange.webp" : "/img/marker_blue.webp"
    })))
  );

  // Copy src/js to _site/js
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });

  // Copy src/css to _site/css
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });

  eleventyConfig.addPassthroughCopy({ "src/img": "img" });

  // Vendored production CSS/JS (see scripts/vendor-refresh.js + CLAUDE.md's
  // vendoring policy) — same /vendor/css|js/... URL shape scripts/snapshot.js
  // already uses for its own, separate immutable-snapshot vendoring.
  eleventyConfig.addPassthroughCopy({ "src/vendor": "vendor" });

  // Visual-regression dashboard: publish the latest report + baseline screenshots
  eleventyConfig.addPassthroughCopy({ "reports/visual-regression": "reports/visual-regression" });
  eleventyConfig.addWatchTarget("reports/visual-regression");

  // Production-monitor dashboard: same pattern, published by
  // scripts/publish-production-monitor-report.js
  eleventyConfig.addPassthroughCopy({ "reports/production-monitor": "reports/production-monitor" });
  eleventyConfig.addWatchTarget("reports/production-monitor");
  eleventyConfig.addPassthroughCopy({
    "tests/usms-visual-regression-screenshots/screenshots.spec.js-snapshots/*.png": "visual-regression-baselines"
  });
  eleventyConfig.addPassthroughCopy({
    "tests/usms-visual-regression-screenshots/manual-baselines/*.png": "visual-regression-baselines/manual"
  });
  eleventyConfig.addWatchTarget("tests/usms-visual-regression-screenshots");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  }
}
