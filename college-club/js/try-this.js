const urls = [
  'https://www.swimphone.com/rankings/?season=2018&s=Free&d=50&g=F',
  'https://www.swimphone.com/rankings/?season=2018&s=Free&d=100&g=F',
  'https://www.swimphone.com/rankings/?season=2018&s=Free&d=200&g=F'
];

async function fetchAndRenderTables(urlList) {
  for (const url of urlList) {
    try {
      const response = await fetch(url);
      const htmlText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');

      const h1 = doc.querySelector('h1');
      const table = doc.querySelector('#meetResultsTable');

      if (h1 && table) {
        const tableClone = table.cloneNode(true);

        // Remove all inline styles recursively
        const removeInlineStyles = (element) => {
          if (element.nodeType === 1) {
            element.removeAttribute('style');
            for (let child of element.children) {
              removeInlineStyles(child);
            }
          }
        };
        removeInlineStyles(tableClone);

        // Insert H1 text as a new <thead> row
        const thead = tableClone.querySelector('thead') || document.createElement('thead');
        const headingRow = document.createElement('tr');
        const headingCell = document.createElement('th');
        headingCell.textContent = h1.textContent;
        headingCell.colSpan = tableClone.querySelector('tr')?.children.length || 1;
        headingRow.appendChild(headingCell);
        thead.insertBefore(headingRow, thead.firstChild);
        tableClone.insertBefore(thead, tableClone.firstChild);

        // Append to current page
        document.body.appendChild(tableClone);
      } else {
        console.warn(`Missing h1 or table on: ${url}`);
      }
    } catch (err) {
      console.error(`Failed to fetch or parse: ${url}`, err);
    }
  }
}

fetchAndRenderTables(urls);
