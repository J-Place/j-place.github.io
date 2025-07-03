
    'https://www.swimphone.com/rankings/?season=2024&s=Free&d=50&g=M',
    'https://www.swimphone.com/rankings/?season=2024&s=Free&d=100&g=M',
    'https://www.swimphone.com/rankings/?season=2024&s=Free&d=200&g=M'

    const urls = [
    'https://www.swimphone.com/rankings/?season=2024&s=Free&d=50&g=M',
    'https://www.swimphone.com/rankings/?season=2024&s=Free&d=100&g=M',
    'https://www.swimphone.com/rankings/?season=2024&s=Free&d=200&g=M'
  // Add your URLs here
];

async function fetchAndCopyTables() {
  const container = document.getElementById('table-container'); // The parent div to append new tables

  for (const url of urls) {
    try {
      // Fetch HTML content of the URL
      const response = await fetch(url);
      const html = await response.text();

      // Create a DOM parser to parse the HTML string
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract the h1 text and the table with id 'meetResultsTable'
      const h1Text = doc.querySelector('h1')?.innerText;
      const table = doc.querySelector('#meetResultsTable');

      if (h1Text && table) {
        // Create a new table element on the current page
        const newTableContainer = document.createElement('div');
        newTableContainer.classList.add('table-container');
        
        // Create a new header row for the table
        const tableHeader = document.createElement('h2');
        tableHeader.innerText = h1Text;
        newTableContainer.appendChild(tableHeader);

        // Clone the table and append to the new container
        const clonedTable = table.cloneNode(true);
        newTableContainer.appendChild(clonedTable);

        // Append the new table container to the main container
        container.appendChild(newTableContainer);
      } else {
        console.warn(`Table or h1 not found on ${url}`);
      }
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  }
}

// Call the function to fetch and display the tables
fetchAndCopyTables();