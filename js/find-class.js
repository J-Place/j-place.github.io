
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

// Example usage

// let className = '';
// set classname in individual views or components
const rulesContainingClass = checkForClassInCSS(className);

if (rulesContainingClass.length > 0) {
  console.log(`CSS rules containing the class '${className}':`);
  rulesContainingClass.forEach(rule => console.log(rule));
} else {
  console.log(`No CSS rules found containing the class '${className}'`);
}