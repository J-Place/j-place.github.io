/**
 * build-css.js
 *
 * Compiles production CSS bundles from source files in production/src/App/
 * following the same bundle manifests defined in production sitecorePages index.js files.
 *
 * Output: src/css/prod/[bundle].min.css
 *
 * Usage: node scripts/build-css.js [bundle]
 *   node scripts/build-css.js          # build all bundles
 *   node scripts/build-css.js common   # build only common bundle
 */

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const postcssConfig = require('../postcss.config');

const PROD_APP = path.resolve(__dirname, '../production/src/App');
const OUT_DIR = path.resolve(__dirname, '../src/css/prod');

// CSS bundle manifests — extracted from production/src/App/sitecorePages/*/index.js
// Each array mirrors the require() order in the corresponding index.js
const bundles = {
  common: [
    'views/Common/Breadcrumb.css',
    'views/Common/Checkbox.css',
    'views/Common/ErrorModal.css',
    'views/Common/Html.css',
    'views/Common/Image.css',
    'views/Common/Loading.css',
    'views/Common/Modal.css',
    'views/Common/Radio.css',
    'views/Common/Select.css',
    'views/layout/MainLayout.css',
    'assets/styles/style.css',
    'pages/Home.css',
    'pages/Renew.css',
    'pages/Login.css',
    'views/Article/Author.css',
    'views/Article/AboutAuthor.css',
    'views/Article/Categories.css',
    'views/Article/Photos.css',
    'views/Article/Tags.css',
    'views/Accordion/Accordion.css',
    'views/Club/ClubFinder.css',
    'pages/Event.css',
    'views/PageContent/CallToAction.css',
    'views/PageContent/GetInTouch.css',
    'views/PageContent/LatestContent.css',
    'views/PageContent/LatestContentArticle.css',
    'views/PageContent/LatestContentEvent.css',
    'views/PageContent/LatestContentPromotion.css',
    'views/PageContent/LatestContentVideo.css',
    'views/PageContent/RelatedContent.css',
    'views/PageContent/Sponsors.css',
    'views/Forms/ContactInformation.css',
    'views/Forms/SignUp.css',
    'views/Forms/LoginForm.css',
    'views/Forms/Input.css',
    'views/Forms/SitecoreForms.css',
    'views/Media/HeroImage.css',
    'views/Media/YoutubeVideo.css',
    'views/Navigation/Footer.css',
    'views/Navigation/FooterMenu.css',
    'views/Navigation/Navigation.css',
    'views/Navigation/MegaMainMenu.css',
    'views/Navigation/LoginMenu.css',
    'views/Navigation/MegaMenuOverlay.css',
    'views/Navigation/MobileMenu.css',
    'views/Navigation/MobileMenuOverlay.css',
    'views/Navigation/MobileMenuOverlayItem.css',
    'views/Navigation/Search.css',
    'views/Social/Subscribe.css',
    'views/Social/SocialShare.css',
    'views/Social/SocialShareIcons.css',
    'views/Accounts/MyAccount.css',
    'views/Media/Carousel.css',
    'views/Media/ImageSlider.css',
    'views/PageContent/Personalize.css',
    'views/PageContent/Date.css',
    'views/PageContent/Location.css',
  ],

  clubs: [
    'pages/Club.css',
    'views/PageContent/CallToAction.css',
    'views/Forms/LoginForm.css',
    'views/Forms/ContactInformation.css',
  ],

  clubFinder: [
    'pages/Club.css',
    'views/Forms/LoginForm.css',
    'views/Forms/Liability.css',
    'views/Forms/ContactInformation.css',
    'views/Forms/ClubFilterForm2.css',
  ],

  events: [
    'views/Forms/ClubFilterForm.css',
  ],

  registration: [
    'pages/Login.css',
    'pages/Renew.css',
  ],

  results: [
    'views/Forms/ClubFilterForm.css',
    'views/Event/EventsFilterForm.css',
  ],

  sanctions: [
    'views/Sanctions/sanctionsEvents.css',
    'views/Sanctions/sanctionsAddEvent.css',
    'views/Sanctions/sanctionsEditEvent.css',
    'views/Sanctions/sanctionsLogin.css',
    'views/Sanctions/SanctionSubmit/sanctionSubmit.css',
    'views/Sanctions/SectionEntryInformation/sectionEntryInformation.css',
    'views/Sanctions/SectionLocation/sectionLocation.css',
    'views/Sanctions/SectionMeetAnnouncement/sectionMeetAnnouncement.css',
    'views/Sanctions/ContentFreeze/modal.css',
  ],

  mastersAddons: [
    'views/Masters/AddOns/AddOns.css',
    'views/Masters/AddOns/MastersAddOns.css',
    'views/Masters/AddOns/Payment.css',
    'views/Forms/AddOn.css',
    'views/Forms/CoachAddon.css',
  ],

  workouts: [
    'views/Workout/ListControl.css',
    'views/Workout/Workout.css',
    'views/Workout/WorkoutDetail.css',
    'views/Workout/WorkoutSearch.css',
  ],
};

async function buildBundle(name, files) {
  if (files.length === 0) {
    console.log(`  [${name}] no CSS files, skipping`);
    return;
  }

  const missing = files.filter(f => !fs.existsSync(path.join(PROD_APP, f)));
  if (missing.length > 0) {
    console.warn(`  [${name}] missing files:\n    ${missing.join('\n    ')}`);
  }

  const outFile = path.join(OUT_DIR, `${name}.min.css`);
  const compiled = [];

  for (const file of files) {
    const fullPath = path.join(PROD_APP, file);
    if (!fs.existsSync(fullPath)) continue;

    const css = fs.readFileSync(fullPath, 'utf8');
    try {
      const result = await postcss(postcssConfig.plugins).process(css, {
        from: fullPath, // resolve @import relative to each file's actual location
        to: outFile,
        map: false,
      });
      compiled.push(`/* === ${file} === */\n${result.css}`);
    } catch (err) {
      console.error(`  [${name}] PostCSS error in ${file}: ${err.message}`);
    }
  }

  fs.writeFileSync(outFile, compiled.join('\n\n'));
  console.log(`  [${name}] → src/css/prod/${name}.min.css (${compiled.length} files)`);
}

async function main() {
  const target = process.argv[2];
  const toBuild = target
    ? { [target]: bundles[target] }
    : bundles;

  if (target && !bundles[target]) {
    console.error(`Unknown bundle: ${target}`);
    console.error(`Available: ${Object.keys(bundles).join(', ')}`);
    process.exit(1);
  }

  console.log(`Building ${Object.keys(toBuild).length} CSS bundle(s) from production source...\n`);

  for (const [name, files] of Object.entries(toBuild)) {
    await buildBundle(name, files);
  }

  console.log('\nDone.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
