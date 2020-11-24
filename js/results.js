function getEventResults() {
  hideLoadingSpinner();
}

function hideLoadingSpinner() {
  const loadingSpinner = document.getElementById('loadingWrapper');
  loadingSpinner.classList.add('hide');
}







function createTable() { 
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
  page: 5,
  pagination: true,
  valueNames: [ 'name-first', 'name-last', 'sex', 'age', 'total', 'age-group', 'club', 'lmsc', 'zone' ]
};

var data = [
  {
  'name-first': 'Jim',
  'name-last': 'Jones',
  sex: 'M',
  age: 48,
  total: "187.09",
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
  total: "769.55",
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
  total: "593.43",
  'age-group': '45-49',
  club: 'SRQM',
  lmsc: 'Florida',
  zone: 'Great Lakes'
  },
  {
  'name-first': 'Kyle',
  'name-last': 'Trask',
  sex: 'M',
  age: 21,
  total: "1932.12",
  'age-group': '20-24',
  club: 'TXMS',
  lmsc: 'Texas',
  zone: 'South Central'
  },
    {
  'name-first': 'Jay',
  'name-last': 'Place',
  sex: 'M',
  age: 58,
  total: "932.88",
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
  total: "1132.50",
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
  total: "23132.20",
  'age-group': '45-49',
  club: 'SRQM',
  lmsc: 'Florida',
  zone: 'Southeast'
  },
  {
  'name-first': 'Mike',
  'name-last': 'Tyson',
  sex: 'M',
  age: 48,
  total: "3198.07",
  'age-group': '45-49',
  club: 'SRQM',
  lmsc: 'Florida',
  zone: 'Southeast'
  },
  {
  'name-first': 'Paul',
  'name-last': 'Blart',
  sex: 'M',
  age: 48,
  total: "13132.72",
  'age-group': '45-49',
  club: 'SRQM',
  lmsc: 'Florida',
  zone: 'Southwest'
  },
  {
  'name-first': 'Jay',
  'name-last': 'Place',
  sex: 'M',
  age: 48,
  total: "1623.32",
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
  total: "199.25",
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



selectZone.onchange = handleSelectZone;

function handleSelectZone(e) {
  var selectedZone = document.getElementById('selectZone').value;
  if (selectedZone == "All") {
    resultsGtd.filter();
  } else {
    resultsGtd.filter(function(item) {
      return(item.values().zone == selectedZone);
    });  
  }
}

selectSex.onchange = handleSelectSex;

function handleSelectSex(e) {
  var selectedSex = document.getElementById('selectSex').value;
  if (selectedSex == "All") {
    resultsGtd.filter();
  } else {
    resultsGtd.filter(function(item) {
      return(item.values().sex == selectedSex);
    });  
  }
}