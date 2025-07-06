  (function () {
    const table = document.getElementById('meetResultsTable');
    if (!table) {
      console.error('Table not found');
      return;
    }

    const headers = Array.from(table.querySelectorAll('thead th')).map(th =>
      th.innerText.trim()
    );

    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const jsonData = rows.map(row => {
      const cells = row.querySelectorAll('td');
      const rowData = {};

      cells.forEach((cell, i) => {
        let key = headers[i];
        let value = cell.innerText.trim();

        // Special case for Time column which contains an <a>
        if (key === 'Time') {
          const link = cell.querySelector('a');
          if (link) {
            rowData['Time'] = link.innerText.trim();
            rowData['TimeLink'] = link.href;
          } else {
            rowData['Time'] = value;
          }
        } else {
          rowData[key] = value;
        }
      });

      return rowData;
    });

    console.log(jsonData);
    // If you want to copy it easily:
    copy(jsonData); // You can paste this into a text editor.
  })();
