
function getEventResults(createTable) {
  const xhr = new XMLHttpRequest();  
  xhr.open('GET', 'https://763a048a-2a06-44c5-a12f-f004327581ab.mock.pstmn.io/get', true);
  xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
  xhr.onload = function () {
    if (xhr.status === 200) {
        const data = JSON.parse(xhr.response);
        createTable(data);
        hideLoadingSpinner();
    return;
    }
    return null;
  };
  xhr.send();
}

function hideLoadingSpinner() {
  const loadingSpinner = document.getElementById('loadingWrapper');
  loadingSpinner.classList.add('hide');
}

function createTable() { 
  getEventResults(function(data) {

    // Show 5 Results
    // for (let i = 0; i < 5; i++) {
    //   console.log(data[i]);
    // }

    // Show All Results
    for (var i in data) {
      console.log(data[i]);
    }

    var options = {
      page: 9,
      pagination: true,
      valueNames: [ 'Name', 'Age', 'Club', 'Miles' ]
    };
    
    var resultsGtd = new List('resultsGtd', options, data );
    
    resultsGtd.sort('Miles', {
      order:'desc',
    });

  });
}
createTable();

