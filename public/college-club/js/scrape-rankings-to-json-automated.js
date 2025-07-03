// Function to fetch HTML content from a URL
const fetchHTML = async (url) => {
    try {
    const response = await fetch(url);
    const html = await response.text();
    return html;
    } catch (error) {
    console.error('Error fetching the URL:', error);
    }
};

// Function to extract table data and <h1> text from HTML
const extractData = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract <h1> text
    const h1Text = doc.querySelector('h1') ? doc.querySelector('h1').textContent.trim() : 'No Title';

    // Extract tables
    const tables = doc.querySelectorAll('table');
    const tableData = [];

    // Loop through each table
    tables.forEach((table) => {
    const rows = [];
    const rowElements = table.querySelectorAll('tr');
    
    // Loop through each row of the table
    rowElements.forEach((row) => {
        const cells = [];
        const cellElements = row.querySelectorAll('td, th');
        
        // Loop through each cell and get the text
        cellElements.forEach((cell) => {
        cells.push(cell.textContent.trim());
        });

        if (cells.length > 0) {
        rows.push(cells);
        }
    });
    
    if (rows.length > 0) {
        tableData.push(rows);
    }
    });

    return { h1Text, tableData };
};

// Function to generate HTML table from JSON data
const generateHTMLTable = (json) => {
    let htmlTable = '<table>';
    
    json.forEach((row) => {
    htmlTable += '<tr>';
    
    row.forEach((cell) => {
        htmlTable += `<td>${cell}</td>`;
    });
    
    htmlTable += '</tr>';
    });

    htmlTable += '</table>';
    return htmlTable;
};

// Function to fetch and convert table data to HTML from a single URL
const fetchAndConvertToHTML = async (url) => {
    try {
    // Fetch the HTML of the page
    const html = await fetchHTML(url);
    
    // Extract the <h1> text and table data from the HTML
    const { h1Text, tableData } = extractData(html);

    // Generate HTML table(s) from the extracted data
    const htmlTables = tableData.map(generateHTMLTable).join('<br/><br/>');
    
    // Combine <h1> and tables into one string (for output)
    return `<h2>${h1Text}</h2>${htmlTables}`;
    } catch (error) {
    console.error('Error fetching or processing the URL:', error.message);
    }
};

// Function to handle multiple URLs
const processMultipleURLs = async (urls) => {
    const allTables = [];

    // Process each URL
    for (const url of urls) {
    const tables = await fetchAndConvertToHTML(url);
    allTables.push({ url, tables });
    }

    // Combine all tables into a single output string
    const combinedHTML = allTables.map((entry) => {
    return `<h2>Tables from: ${entry.url}</h2><br/>${entry.tables}`;
    }).join('<br/><br/>');

    // Insert combined HTML into the webpage
    document.getElementById('output').innerHTML = combinedHTML;
};

// Example usage with an array of URLs
const urls = [
    'https://www.swimphone.com/rankings/?season=2024&s=Free&d=50&g=M',
    'https://www.swimphone.com/rankings/?season=2024&s=Free&d=100&g=M',
    'https://www.swimphone.com/rankings/?season=2024&s=Free&d=200&g=M'
];

// Start processing URLs after the page loads
window.onload = () => {
    processMultipleURLs(urls);
};