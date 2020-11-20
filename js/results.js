
function getEventResults() {
    const xhr = new XMLHttpRequest();  
    xhr.open('GET', 'https://763a048a-2a06-44c5-a12f-f004327581ab.mock.pstmn.io/get', true);
    xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.response);
            const data = response;
            // console.log(data);
            createHtml(data);
        return;
        }
        return null;
    };
    xhr.send();
}
getEventResults();

function createHtml(newData) {
    // var newDataName = newData.name;
    console.log(newData);
}
createHtml();

var options = {
    valueNames: [ 'name', 'age', 'club', 'total' ]
};

var values = [
    {
      name: 'Jay Place',
      age: 48,
      club: 'SRQM',
      total: "13,132"
    },
    {
      name: 'Tom Jones',
      age: 80,
      club: 'SHARK',
      total: "1,000"
    },
    {
        name: 'Daniel Pauling',
        age: 40,
        club: 'SHARK',
        total: "199,999"
    }
];

var resultsGtd = new List('resultsGtd', options, values);

resultsGtd.sort("total", {
    order: "asc"
})
