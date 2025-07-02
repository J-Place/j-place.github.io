(() => {
  const rows = Array.from(document.querySelectorAll("table tr"));
  const tableData = rows.map(row => {
    const cells = row.querySelectorAll("th, td");
    return Array.from(cells).map(cell => cell.innerText.trim());
  });
  console.log(JSON.stringify(tableData, null, 2));
})();