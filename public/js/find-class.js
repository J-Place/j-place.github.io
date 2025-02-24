
function checkForClassInCSS(className) {
  const classSelector = `.${className}`;
  const styles = [];

  // Get all <style> elements
  const styleSheets = [...document.styleSheets];
  
  styleSheets.forEach(sheet => {
    try {
      // Some style sheets may be restricted (due to CORS or other issues)
      const rules = sheet.cssRules || sheet.rules;
      if (rules) {
        for (let rule of rules) {
          if (rule.selectorText && rule.selectorText.includes(classSelector)) {
            styles.push(rule.cssText);
          }
        }
      }
    } catch (e) {
      console.error('Error accessing CSS rules:', e);
    }
  });

  return styles;
}

const rulesContainingClass = checkForClassInCSS(className);

if (rulesContainingClass.length > 0) {
  console.log(`CSS rules containing the class '${className}':`);
  rulesContainingClass.forEach(rule => console.log(rule));
} else {
  console.log(`No CSS rules found containing the class '${className}'`);
}

// Add this in the view and set classname as variable

// <script>
//  let className = 'renew__form-container';
// </script>
// <script src="/js/find-class.js"></script>