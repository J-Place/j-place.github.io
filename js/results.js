
function getEventResults(createHtml) {
  const xhr = new XMLHttpRequest();  
  xhr.open('GET', 'https://763a048a-2a06-44c5-a12f-f004327581ab.mock.pstmn.io/get', true);
  xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
  xhr.onload = function () {
      if (xhr.status === 200) {
          const data = JSON.parse(xhr.response);
          createHtml(data);
      return;
      }
      return null;
  };
  xhr.send();
}

// var options = {
//   page: 3,
//   pagination: true,
//   valueNames: [ 'name', 'age', 'club', 'total' ]
// };

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
//   }
// ];


// var resultsGtd = new List('resultsGtd', options, values );

// resultsGtd.sort('total', {
//   order:'asc',
// })

function renderList(data) {


  console.log(data[0]);


  var options = {
    page: 100,
    pagination: true,
    valueNames: [ 'name', 'age', 'club', 'total' ]
  };

  values = data[0];

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
  //   }
  // ];

  var resultsGtd = new List('resultsGtd', options, values );

  resultsGtd.sort('total', {
    order:'asc',
  });

}





function createHtml() { 
  getEventResults(function(data) {

    // console.log(data[100]);

    // for (let i = 0; i < 5; i++) {
    //   console.log(data[i]);
    // }

    // for (var i in data) {
      // console.log(data[i]);
    // }

    renderList(data);
    
  });

}
createHtml();

