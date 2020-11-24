// function getEventResults() {
//   hideLoadingSpinner();
// }

function hideLoadingSpinner() {
  const loadingSpinner = document.getElementById('loadingWrapper');
  loadingSpinner.classList.add('hide');
}
hideLoadingSpinner();






// function createTable() { 
//   getEventResults(function() {
  
//       // Show 5 Results
//     // for (let i = 0; i < 5; i++) {
//     //   console.log(data[i]);
//     // }

//     // Show All Results
//     for (var i in data) {
//       console.log(data[i]);
//     }

//   });
// }
// createTable();







var options = {
  page: 5,
  pagination: true,
  valueNames: [ 'namefirst', 'namelast', 'sex', 'age', 'total', 'agegroup', 'club', 'lmsc', 'zone' ]
};

var data = [
  {
  namefirst: 'Jim',
  namelast: 'Jones',
  sex: 'M',
  age: 48,
  total: "187.09",
  agegroup: '45-49',
  club: 'SRQM',
  lmsc: 'Florida',
  zone: 'Southeast'
  },
  {
  namefirst: 'Jay',
  namelast: 'Place',
  sex: 'M',
  age: 48,
  total: "769.55",
  agegroup: '45-49',
  club: 'SRQM',
  lmsc: 'Florida',
  zone: 'Great Lakes'
  },
  {
  namefirst: 'Jay',
  namelast: 'Place',
  sex: 'M',
  age: 48,
  total: "593.43",
  agegroup: '45-49',
  club: 'SRQM',
  lmsc: 'Florida',
  zone: 'Great Lakes'
  },
  {
  namefirst: 'Kyle',
  namelast: 'Trask',
  sex: 'M',
  age: 21,
  total: "1932.12",
  agegroup: '20-24',
  club: 'TXMS',
  lmsc: 'Texas',
  zone: 'South Central'
  },
    {
  namefirst: 'Jay',
  namelast: 'Place',
  sex: 'M',
  age: 58,
  total: "932.88",
  agegroup: '55-59',
  club: 'SRQM',
  lmsc: 'Texas',
  zone: 'Breadbasket'
  },
  {
  namefirst: 'Jay',
  namelast: 'Place',
  sex: 'M',
  age: 48,
  total: "1132.50",
  agegroup: '45-49',
  club: 'SRQM',
  lmsc: 'Florida',
  zone: 'Southeast'
  },
  {
  namefirst: 'Jay',
  namelast: 'Place',
  sex: 'M',
  age: 48,
  total: "23132.20",
  agegroup: '45-49',
  club: 'SRQM',
  lmsc: 'Florida',
  zone: 'Southeast'
  },
  {
  namefirst: 'Mike',
  namelast: 'Tyson',
  sex: 'M',
  age: 48,
  total: "3198.07",
  agegroup: '45-49',
  club: 'SRQM',
  lmsc: 'Florida',
  zone: 'Southeast'
  },
  {
  namefirst: 'Paul',
  namelast: 'Blart',
  sex: 'M',
  age: 48,
  total: "13132.72",
  agegroup: '45-49',
  club: 'SRQM',
  lmsc: 'Florida',
  zone: 'Southwest'
  },
  {
  namefirst: 'Jay',
  namelast: 'Place',
  sex: 'M',
  age: 48,
  total: "1623.32",
  agegroup: '45-49',
  club: 'SRQM',
  lmsc: 'Florida',
  zone: 'Southeast'
  },
  {
  namefirst: 'Morgan',
  namelast: 'Place',
  sex: 'F',
  age: 11,
  total: "199.25",
  agegroup: '18-24',
  club: 'SRQM',
  lmsc: 'Florida',
  zone: 'Southeast'
  },
  {
    namefirst: 'Onshalee',
    namelast: 'Promchitmart',
    sex: 'F',
    age: 28,
    total: "39999.25",
    agegroup: '25-29',
    club: 'SHARK',
    lmsc: 'San Diego-Imperial',
    zone: 'Southeast'
    }
  
];

var resultsGtd = new List('resultsGtd', options, data );
    
resultsGtd.sort('total', {
  order:'desc',
});




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
selectSex.onchange = handleSelectSex;


function handleSelectAgeGroup(e) {
  var selectedAgeGroup = document.getElementById('selectAgeGroup').value;
  if (selectedAgeGroup == "All") {
    resultsGtd.filter();
  } else {
    resultsGtd.filter(function(item) {
      return(item.values().agegroup == selectedAgeGroup);
    });  
  }
}
selectAgeGroup.onchange = handleSelectAgeGroup;


function handleSelectLmsc(e) {
  var selectedLmsc = document.getElementById('selectLmsc').value;
  if (selectedLmsc == "All") {
    resultsGtd.filter();
  } else {
    resultsGtd.filter(function(item) {
      return(item.values().lmsc == selectedLmsc);
    });  
  }
}
selectLmsc.onchange = handleSelectLmsc;


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
selectZone.onchange = handleSelectZone;


$("#clearFilters").click(function(){
  resultsGtd.filter();
  $("select").each(function() { this.selectedIndex = 0 });
})
