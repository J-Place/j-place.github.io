
// function getEventResults(createTable) {
//   const xhr = new XMLHttpRequest();  
//   xhr.open('GET', 'https://763a048a-2a06-44c5-a12f-f004327581ab.mock.pstmn.io/get', true);
//   xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
//   xhr.onload = function () {
//     if (xhr.status === 200) {
//         const data = JSON.parse(xhr.response);
//         createTable(data);
//         hideLoadingSpinner();
//     return;
//     }
//     return null;
//   };
//   xhr.send();
// }

function getEventResults() {
  hideLoadingSpinner();
}

function hideLoadingSpinner() {
  const loadingSpinner = document.getElementById('loadingWrapper');
  loadingSpinner.classList.add('hide');
}

function createTable() { 
  // alert("Yes");
  getEventResults(function() {



  
        // Show 5 Results
    // for (let i = 0; i < 5; i++) {
    //   console.log(data[i]);
    // }

    // Show All Results
    for (var i in data) {
      console.log(data[i]);
    }


  });
}
createTable();

var options = {
  page: 9,
  pagination: true,
  valueNames: [ 'name-first', 'name-last', 'sex', 'age', 'total', 'age-group', 'club', 'lmsc', 'zone' ]
};

var data = [
  {
  'name-first': 'Jay',
  'name-last': 'Place',
  sex: 'M',
  age: 48,
  total: '13,132',
  'age-group': '45-49',
  club: 'SRQM',
  lmsc: 'Florida',
  zone: 'Southeast'
  },
  {
  'name-first': 'Jay',
  'name-last': 'Place',
  sex: 'M',
  age: 48,
  total: '13,132',
  'age-group': '45-49',
  club: 'SRQM',
  lmsc: 'Florida',
  zone: 'Great Lakes'
  },
  {
  'name-first': 'Jay',
  'name-last': 'Place',
  sex: 'M',
  age: 48,
  total: '13,132',
  'age-group': '45-49',
  club: 'SRQM',
  lmsc: 'Florida',
  zone: 'Great Lakes'
  },
  {
  'name-first': 'Jay',
  'name-last': 'Place',
  sex: 'M',
  age: 58,
  total: '13,132',
  'age-group': '55-59',
  club: 'SRQM',
  lmsc: 'Texas',
  zone: 'Breadbasket'
  },
  {
  'name-first': 'Jay',
  'name-last': 'Place',
  sex: 'M',
  age: 48,
  total: '13,132',
  'age-group': '45-49',
  club: 'SRQM',
  lmsc: 'Florida',
  zone: 'Southeast'
  },
  {
  'name-first': 'Morgan',
  'name-last': 'Place',
  sex: 'F',
  age: 11,
  total: '13,132',
  'age-group': '10-14',
  club: 'SRQM',
  lmsc: 'Florida',
  zone: 'Southeast'
  }
];

var resultsGtd = new List('resultsGtd', options, data );
    
resultsGtd.sort('total', {
  order:'desc',
});



// let selectZone = document.getElementById('selectZone');


// $("#selectZone").change(function() {
//   var selection = this.value;
//   if (selection == "All") {
//     resultsGtd.filter();
//   } else {
//     resultsGtd.filter(function(item) {
//       return(item.values().zone == selection);
//     });  
//   }
// });


let selectZone = document.getElementById('selectZone');

selectZone.onchange = handleSelectZone;

function handleSelectZone(e) {
  var selection = this.value;
  if (selection == "All") {
    resultsGtd.filter();
  } else {
    resultsGtd.filter(function(item) {
      return(item.values().zone == selection);
    });  
  }
}