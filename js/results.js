
function getEventResults(createHtml) {
  const xhr = new XMLHttpRequest();  
  xhr.open('GET', 'https://763a048a-2a06-44c5-a12f-f004327581ab.mock.pstmn.io/get', true);
  xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
  xhr.onload = function () {
    if (xhr.status === 200) {
        const data = JSON.parse(xhr.response);
        var options = {
          page: 100,
          pagination: true,
          valueNames: [ 'Name', 'Age', 'Club', 'Total' ]
        };    
        var resultsGtd = new List('resultsGtd', options, data);
        resultsGtd.sort('total', {
          order:'desc',
        });
        // createHtml(data);
    return;
    }
    return null;
  };
  xhr.send();
}




// var values = [
//   {
//     name: 'Jay Place',
//     age: 48,
//     club: 'SRQM',
//     total: "13,132"
//   },
//   {
//     name: 'Tom Jones',
//     age: 80,
//     club: 'SHARK',
//     total: "1,000"
//   },
//   {
//     name: 'Daniel Pauling',
//     age: 40,
//     club: 'SHARK',
//     total: "199,999"
//   },
//   {
//     name: 'Bobby Boucher',
//     age: 55,
//     club: 'SHARK',
//     total: '9,000'
//   },
//   {
//     name: 'Tom Brady',
//     age: 43,
//     club: 'SRQM',
//     total: '19,000'
//   },
//   {
//     name: 'Sunny Garcia',
//     age: 49,
//     club: 'SRQM',
//     total: '23,000'
//   },
//   {
//     name: 'Cooper Place',
//     age: 17,
//     club: 'SRQM',
//     total: '6,000'
//   },
//   {
//     name: 'Morgan Place',
//     age: 11,
//     club: 'SRQM',
//     total: '999,999'
//   },
//   {
//     name: 'Dan Mullen',
//     age: 46,
//     club: 'SHARK',
//     total: '12,000'
//   }
// ];

// var resultsGtd = new List('resultsGtd', options, values );


// function createHtml() { 
//   getEventResults(function(data) {
//     // Show 5 Results
//     for (let i = 0; i < 5; i++) {
//       console.log(data[i]);
//     }
//     // Show All Results
//     // for (var i in data) {
//       // console.log(data[i]);
//     // }
//   });
// }
// createHtml();

