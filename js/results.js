// function getEventResults() {
//   hideLoadingSpinner();
// }

function hideLoadingSpinner() {
  const loadingSpinner = document.getElementById('loadingWrapper');
  loadingSpinner.classList.add('hide');
}
hideLoadingSpinner();




var options = {
  page: 5,
  pagination: true,
  innerWindow: 1,
  left: 0,
  right: 0,
  paginationClass: "pagination",
  valueNames: [ 'firstname', 'lastname', 'sex', 'age', 'agegroup', 'club', 'lmsc', 'zone', 'miles' ],
};

var data = [
  {
    firstname: "Doug",
    lastname: "Allen",
    sex: "M",
    age: "M61",
    agegroup: "",
    club: "LVM",
    lmsc: "Southern Pacific",
    zone: "Southwest",
    miles: "12,506.70"
    },
    {
    firstname: "Melissa K",
    lastname: "Massey",
    sex: "F",
    age: "F39",
    agegroup: "",
    club: "GAJA",
    lmsc: "Georgia",
    zone: "Southeast",
    miles: "1,609.33"
    },
    {
    firstname: "Chris C",
    lastname: "Greene",
    sex: "M",
    age: "58",
    agegroup: "",
    club: "GAJA",
    lmsc: "Georgia",
    zone: "Southeast",
    miles: "1,533.52"
    },
    {
    firstname: "Melodee A",
    lastname: "Liegl",
    sex: "F",
    age: "53",
    agegroup: "",
    club: "WMAC",
    lmsc: "Wisconsin",
    zone: "",
    miles: "1,193.84"
    },
    {
    firstname: "Brian J",
    lastname: "McLaughlin",
    sex: "M",
    age: "65",
    agegroup: "",
    club: "NEM",
    lmsc: "New England",
    zone: "",
    miles: "1,147.26"
    },
    {
    firstname: "Patricia J",
    lastname: "Funk",
    sex: "F",
    age: "70",
    agegroup: "",
    club: "SWAG",
    lmsc: "Florida",
    zone: "Southeast",
    miles: "1,098.66"
    },
    {
    firstname: "Thomas L",
    lastname: "Schwartz",
    sex: "M",
    age: "60",
    agegroup: "",
    club: "SHAR",
    lmsc: "Florida",
    zone: "Southeast",
    miles: "1,072.26"
    },
    {
    firstname: "Cheryl M",
    lastname: "Reinke",
    sex: "F",
    age: "56",
    agegroup: "",
    club: "UC55",
    lmsc: "South Carolina",
    zone: "Southeast",
    miles: "1,003.05"
    },
    {
    firstname: "Carol L",
    lastname: "Schemanske",
    sex: "F",
    age: "67",
    agegroup: "",
    club: "MICH",
    lmsc: "Michigan",
    zone: "",
    miles: "945.83"
    },
    {
    firstname: "Eric",
    lastname: "Schall",
    sex: "M",
    age: "59",
    agegroup: "",
    club: "WBP",
    lmsc: "Delaware Valley",
    zone: "",
    miles: "935.40"
    },
    {
    firstname: "Charlotte J",
    lastname: "Brynn",
    sex: "F",
    age: "54",
    agegroup: "",
    club: "NEM",
    lmsc: "New England",
    zone: "",
    miles: "924.35"
    },
    {
    firstname: "Sharyl",
    lastname: "Griffith",
    sex: "F",
    age: "59",
    agegroup: "",
    club: "PCAT",
    lmsc: "North Texas",
    zone: "South Central",
    miles: "923.66"
    },
    {
    firstname: "Andy",
    lastname: "Seretan",
    sex: "M",
    age: "67",
    agegroup: "",
    club: "UC33",
    lmsc: "Southern Pacific",
    zone: "Southwest",
    miles: "880.29"
    },
    {
    firstname: "Eric",
    lastname: "Mulkey",
    sex: "M",
    age: "65",
    agegroup: "",
    club: "TNAQ",
    lmsc: "Southeastern",
    zone: "",
    miles: "850.57"
    },
    {
    firstname: "Utley",
    lastname: "Noble",
    sex: "M",
    age: "57",
    agegroup: "",
    club: "UC15",
    lmsc: "Southeastern",
    zone: "",
    miles: "798.69"
    },
    {
    firstname: "Daniel M",
    lastname: "Ritt",
    sex: "M",
    age: "66",
    agegroup: "",
    club: "UC32",
    lmsc: "Colorado",
    zone: "",
    miles: "795.48"
    },
    {
    firstname: "James M",
    lastname: "Wetzel",
    sex: "M",
    age: "63",
    agegroup: "",
    club: "VMST",
    lmsc: "Virginia",
    zone: "",
    miles: "763.57"
    },
    {
    firstname: "Sydne J",
    lastname: "Didier",
    sex: "F",
    age: "49",
    agegroup: "",
    club: "NEM",
    lmsc: "New England",
    zone: "",
    miles: "730.20"
    },
    {
    firstname: "Jim Mc",
    lastname: "Conica",
    sex: "M",
    age: "70",
    agegroup: "",
    club: "VCM",
    lmsc: "Southern Pacific",
    zone: "Southwest",
    miles: "726.66"
    },
    {
    firstname: "Joan P",
    lastname: "Craffey",
    sex: "F",
    age: "67",
    agegroup: "",
    club: "PBM",
    lmsc: "Florida Gold Coast",
    zone: "Southeast",
    miles: "712.53"
    },
    {
    firstname: "Nancy M",
    lastname: "Haynsworth",
    sex: "F",
    age: "63",
    agegroup: "",
    club: "SMRT",
    lmsc: "South Carolina",
    zone: "Southeast",
    miles: "695.23"
    },
    {
    firstname: "Timothy W",
    lastname: "Murphy",
    sex: "M",
    age: "51",
    agegroup: "",
    club: "GTX",
    lmsc: "South Texas",
    zone: "South Central",
    miles: "679.62"
    },
    {
    firstname: "James",
    lastname: "Ryan",
    sex: "M",
    age: "68",
    agegroup: "",
    club: "GSM",
    lmsc: "New Jersey",
    zone: "",
    miles: "675.85"
    },
    {
    firstname: "Mark S",
    lastname: "Rubacky",
    sex: "M",
    age: "51",
    agegroup: "",
    club: "NCMS",
    lmsc: "North Carolina",
    zone: "Southeast",
    miles: "671.93"
    },
    {
    firstname: "William L",
    lastname: "Specht",
    sex: "M",
    age: "62",
    agegroup: "",
    club: "SPM",
    lmsc: "Florida",
    zone: "Southeast",
    miles: "656.09"
    },
    {
    firstname: "Lauren C",
    lastname: "Grous",
    sex: "F",
    age: "36",
    agegroup: "",
    club: "MMAC",
    lmsc: "Arizona",
    zone: "Southwest",
    miles: "634.75"
    },
    {
    firstname: "Mike",
    lastname: "Bennett",
    sex: "M",
    age: "64",
    agegroup: "",
    club: "UC28",
    lmsc: "Missouri Valley",
    zone: "",
    miles: "633.13"
    },
    {
    firstname: "Stephen T",
    lastname: "Rouch",
    sex: "M",
    age: "40",
    agegroup: "",
    club: "INDY",
    lmsc: "Indiana",
    zone: "",
    miles: "631.51"
    },
    {
    firstname: "Lexie",
    lastname: "Kelly",
    sex: "F",
    age: "34",
    agegroup: "",
    club: "NOVA",
    lmsc: "Southern Pacific",
    zone: "Southwest",
    miles: "629.57"
    },
    {
    firstname: "Harriet M",
    lastname: "Wall",
    sex: "F",
    age: "78",
    agegroup: "",
    club: "MICH",
    lmsc: "Michigan",
    zone: "",
    miles: "627.07"
    },
    {
    firstname: "Karen L",
    lastname: "Einsidler",
    sex: "F",
    age: "64",
    agegroup: "",
    club: "SHAR",
    lmsc: "Florida",
    zone: "Southeast",
    miles: "623.53"
    },
    {
    firstname: "Andreas K",
    lastname: "Seibt",
    sex: "M",
    age: "62",
    agegroup: "",
    club: "IM",
    lmsc: "Illinois",
    zone: "",
    miles: "620.02"
    },
    {
    firstname: "Mike",
    lastname: "Casper",
    sex: "M",
    age: "78",
    agegroup: "",
    club: "GSMS",
    lmsc: "South Carolina",
    zone: "Southeast",
    miles: "618.41"
    },
    {
    firstname: "Stephen",
    lastname: "Rozow",
    sex: "M",
    age: "52",
    agegroup: "",
    club: "SDSM",
    lmsc: "San Diego-Imperial",
    zone: "Southwest",
    miles: "605.56"
    },
    {
    firstname: "Kurt F",
    lastname: "Dickson",
    sex: "M",
    age: "53",
    agegroup: "",
    club: "GRA",
    lmsc: "Southern Pacific",
    zone: "Southwest",
    miles: "600.49"
    },
    {
    firstname: "Darcy H",
    lastname: "LaFountain",
    sex: "F",
    age: "65",
    agegroup: "",
    club: "PBM",
    lmsc: "Florida Gold Coast",
    zone: "Southeast",
    miles: "594.96"
    },
    {
    firstname: "Adrian",
    lastname: "Torres",
    sex: "M",
    age: "43",
    agegroup: "",
    club: "ARIZ",
    lmsc: "Arizona",
    zone: "Southwest",
    miles: "594.45"
    },
    {
    firstname: "Shirley A Loftus",
    lastname: "Charley",
    sex: "F",
    age: "69",
    agegroup: "",
    club: "VMST",
    lmsc: "Virginia",
    zone: "",
    miles: "593.50"
    },
    {
    firstname: "Kenneth D",
    lastname: "Sweigart",
    sex: "M",
    age: "69",
    agegroup: "",
    club: "UC14",
    lmsc: "Florida",
    zone: "Southeast",
    miles: "591.38"
    },
    {
    firstname: "Marshall G",
    lastname: "Campbell",
    sex: "M",
    age: "55",
    agegroup: "",
    club: "RIDG",
    lmsc: "North Texas",
    zone: "South Central",
    miles: "587.86"
    },
    {
    firstname: "Patricia A",
    lastname: "Campbell",
    sex: "F",
    age: "56",
    agegroup: "",
    club: "RIDG",
    lmsc: "North Texas",
    zone: "South Central",
    miles: "582.90"
    },
    {
    firstname: "Kristi D",
    lastname: "Lee",
    sex: "F",
    age: "45",
    agegroup: "",
    club: "SAWS",
    lmsc: "Snake River",
    zone: "Northwest",
    miles: "580.70"
    },
    {
    firstname: "Donna L",
    lastname: "Taylor",
    sex: "F",
    age: "62",
    agegroup: "",
    club: "HUMM",
    lmsc: "Pacific",
    zone: "",
    miles: "579.97"
    },
    {
    firstname: "Michael",
    lastname: "Dean",
    sex: "M",
    age: "59",
    agegroup: "",
    club: "UC33",
    lmsc: "Southern Pacific",
    zone: "Southwest",
    miles: "577.00"
    },
    {
    firstname: "Allison L",
    lastname: "Jinks",
    sex: "F",
    age: "37",
    agegroup: "",
    club: "PCST",
    lmsc: "Southeastern",
    zone: "",
    miles: "576.45"
    },
    {
    firstname: "Janet K",
    lastname: "Renner",
    sex: "F",
    age: "59",
    agegroup: "",
    club: "MELO",
    lmsc: "Pacific",
    zone: "",
    miles: "570.17"
    },
    {
    firstname: "Heather M",
    lastname: "Frees",
    sex: "F",
    age: "37",
    agegroup: "",
    club: "LSM",
    lmsc: "North Texas",
    zone: "South Central",
    miles: "569.72"
    },
    {
    firstname: "Carl W",
    lastname: "Rieger",
    sex: "M",
    age: "64",
    agegroup: "",
    club: "UC33",
    lmsc: "Southern Pacific",
    zone: "Southwest",
    miles: "564.81"
    },
    {
    firstname: "Calvin E",
    lastname: "Schildknecht",
    sex: "M",
    age: "35",
    agegroup: "",
    club: "BASH",
    lmsc: "Ohio",
    zone: "",
    miles: "557.49"
    },
    {
    firstname: "Douglas",
    lastname: "Sayles",
    sex: "M",
    age: "53",
    agegroup: "",
    club: "NEM",
    lmsc: "New England",
    zone: "",
    miles: "554.14"
    },
    {
    firstname: "Brian",
    lastname: "Bergford",
    sex: "M",
    age: "38",
    agegroup: "",
    club: "CMS",
    lmsc: "Colorado",
    zone: "",
    miles: "553.40"
    },
    {
    firstname: "David H",
    lastname: "Lindsey",
    sex: "M",
    age: "70",
    agegroup: "",
    club: "MOVY",
    lmsc: "Missouri Valley",
    zone: "",
    miles: "552.80"
    },
    {
    firstname: "John",
    lastname: "Kuzmkowski",
    sex: "M",
    age: "66",
    agegroup: "",
    club: "UC11",
    lmsc: "Allegheny Mountain",
    zone: "",
    miles: "550.26"
    },
    {
    firstname: "Jack C",
    lastname: "Lee",
    sex: "M",
    age: "62",
    agegroup: "",
    club: "TXLA",
    lmsc: "South Texas",
    zone: "South Central",
    miles: "549.86"
    },
    {
    firstname: "Jim",
    lastname: "Clemmons",
    sex: "M",
    age: "70",
    agegroup: "",
    club: "SAWS",
    lmsc: "Snake River",
    zone: "Northwest",
    miles: "543.40"
    },
    {
    firstname: "Tracy N",
    lastname: "Sellard",
    sex: "F",
    age: "56",
    agegroup: "",
    club: "LTCO",
    lmsc: "Colorado",
    zone: "",
    miles: "542.49"
    },
    {
    firstname: "Susan",
    lastname: "Ingraham",
    sex: "F",
    age: "61",
    agegroup: "",
    club: "MOST",
    lmsc: "South Texas",
    zone: "South Central",
    miles: "541.26"
    },
    {
    firstname: "James N",
    lastname: "Hoke",
    sex: "M",
    age: "34",
    agegroup: "",
    club: "MINN",
    lmsc: "Minnesota",
    zone: "",
    miles: "537.30"
    },
    {
    firstname: "Heidi L",
    lastname: "Loecke",
    sex: "F",
    age: "49",
    agegroup: "",
    club: "MOVY",
    lmsc: "Missouri Valley",
    zone: "",
    miles: "525.83"
    },
    {
    firstname: "Cheryl A",
    lastname: "Murray",
    sex: "F",
    age: "68",
    agegroup: "",
    club: "NCMS",
    lmsc: "North Carolina",
    zone: "Southeast",
    miles: "523.61"
    },
    {
    firstname: "Kevin W",
    lastname: "Drake",
    sex: "M",
    age: "64",
    agegroup: "",
    club: "HIMA",
    lmsc: "",
    zone: "",
    miles: "523.57"
    },
    {
    firstname: "Christopher E",
    lastname: "Gibson",
    sex: "M",
    age: "64",
    agegroup: "",
    club: "PAA",
    lmsc: "",
    zone: "",
    miles: "522.59"
    },
    {
    firstname: "Rick",
    lastname: "Gould",
    sex: "M",
    age: "52",
    agegroup: "",
    club: "STAN",
    lmsc: "",
    zone: "",
    miles: "515.81"
    },
    {
    firstname: "Anicia",
    lastname: "Criscione",
    sex: "F",
    age: "47",
    agegroup: "",
    club: "OREG",
    lmsc: "Oregon",
    zone: "Northwest",
    miles: "515.08"
    },
    {
    firstname: "Sue",
    lastname: "Phillips",
    sex: "F",
    age: "56",
    agegroup: "",
    club: "OREG",
    lmsc: "Oregon",
    zone: "Northwest",
    miles: "508.01"
    },
    {
    firstname: "Lynn",
    lastname: "Ascione",
    sex: "F",
    age: "53",
    agegroup: "",
    club: "BERK",
    lmsc: "New Jersey",
    zone: "",
    miles: "507.17"
    },
    {
    firstname: "Larry",
    lastname: "Marshall",
    sex: "M",
    age: "69",
    agegroup: "",
    club: "MICH",
    lmsc: "Michigan",
    zone: "",
    miles: "502.06"
    },
    {
    firstname: "Paul (Tank) F",
    lastname: "McNamara",
    sex: "M",
    age: "57",
    agegroup: "",
    club: "OREG",
    lmsc: "Oregon",
    zone: "Northwest",
    miles: "494.51"
    },
    {
    firstname: "Kathryn E",
    lastname: "Vandam",
    sex: "F",
    age: "35",
    agegroup: "",
    club: "MINN",
    lmsc: "Minnesota",
    zone: "",
    miles: "492.88"
    },
    {
    firstname: "Marianne",
    lastname: "Countryman",
    sex: "F",
    age: "56",
    agegroup: "",
    club: "AWJ",
    lmsc: "",
    zone: "",
    miles: "491.70"
    },
    {
    firstname: "Charles R",
    lastname: "Herrick",
    sex: "M",
    age: "60",
    agegroup: "",
    club: "CONN",
    lmsc: "",
    zone: "",
    miles: "489.55"
    },
    {
    firstname: "James L",
    lastname: "Purdie",
    sex: "M",
    age: "68",
    agegroup: "",
    club: "NAM",
    lmsc: "",
    zone: "",
    miles: "486.82"
    },
    {
    firstname: "Teresa Tracy",
    lastname: "Knight",
    sex: "F",
    age: "48",
    agegroup: "",
    club: "INDY",
    lmsc: "Indiana",
    zone: "",
    miles: "482.67"
    },
    {
    firstname: "Patrick",
    lastname: "Allender",
    sex: "M",
    age: "62",
    agegroup: "",
    club: "OREG",
    lmsc: "Oregon",
    zone: "Northwest",
    miles: "471.14"
    },
    {
    firstname: "James M",
    lastname: "Carty",
    sex: "M",
    age: "60",
    agegroup: "",
    club: "IAMA",
    lmsc: "Iowa",
    zone: "",
    miles: "468.53"
    },
    {
    firstname: "Mark",
    lastname: "Belnap",
    sex: "M",
    age: "51",
    agegroup: "",
    club: "SDM",
    lmsc: "",
    zone: "",
    miles: "465.54"
    },
    {
    firstname: "Paige Y",
    lastname: "Kobayashi",
    sex: "F",
    age: "52",
    agegroup: "",
    club: "LAPS",
    lmsc: "",
    zone: "",
    miles: "449.58"
    },
    {
    firstname: "Marianne",
    lastname: "Thomas",
    sex: "F",
    age: "57",
    agegroup: "",
    club: "CTS",
    lmsc: "",
    zone: "",
    miles: "449.15"
    },
    {
    firstname: "Megan M",
    lastname: "Tosh",
    sex: "F",
    age: "35",
    agegroup: "",
    club: "OREG",
    lmsc: "Oregon",
    zone: "Northwest",
    miles: "447.82"
    },
    {
    firstname: "Bridgette A",
    lastname: "Hobart",
    sex: "F",
    age: "58",
    agegroup: "",
    club: "UC07",
    lmsc: "",
    zone: "",
    miles: "443.66"
    },
    {
    firstname: "Jim R",
    lastname: "Svoboda",
    sex: "M",
    age: "42",
    agegroup: "",
    club: "CFSC",
    lmsc: "",
    zone: "",
    miles: "443.55"
    },
    {
    firstname: "Stephen T O",
    lastname: "Neill",
    sex: "M",
    age: "63",
    agegroup: "",
    club: "SUNY",
    lmsc: "",
    zone: "",
    miles: "443.10"
    },
    {
    firstname: "Peggy",
    lastname: "Kratz",
    sex: "F",
    age: "60",
    agegroup: "",
    club: "MINN",
    lmsc: "Minnesota",
    zone: "",
    miles: "442.31"
    },
    {
    firstname: "Stephanie",
    lastname: "Heatley",
    sex: "F",
    age: "30",
    agegroup: "",
    club: "UC55",
    lmsc: "South Carolina",
    zone: "Southeast",
    miles: "440.07"
    },
    {
    firstname: "Hope Mao",
    lastname: "Oehler",
    sex: "F",
    age: "54",
    agegroup: "",
    club: "MARY",
    lmsc: "",
    zone: "",
    miles: "439.83"
    },
    {
    firstname: "Edward P",
    lastname: "Fiske",
    sex: "M",
    age: "56",
    agegroup: "",
    club: "NEM",
    lmsc: "New England",
    zone: "",
    miles: "435.15"
    },
    {
    firstname: "Charles G",
    lastname: "Mackall",
    sex: "M",
    age: "85",
    agegroup: "",
    club: "UC12",
    lmsc: "Virginia",
    zone: "",
    miles: "432.41"
    },
    {
    firstname: "Janine",
    lastname: "Serell",
    sex: "F",
    age: "59",
    agegroup: "",
    club: "PALM",
    lmsc: "South Carolina",
    zone: "Southeast",
    miles: "432.32"
    },
    {
    firstname: "Scott D",
    lastname: "Bargar",
    sex: "M",
    age: "64",
    agegroup: "",
    club: "CSMT",
    lmsc: "Ohio",
    zone: "",
    miles: "432.03"
    },
    {
    firstname: "Laura J",
    lastname: "Banks",
    sex: "F",
    age: "57",
    agegroup: "",
    club: "UC19",
    lmsc: "Michigan",
    zone: "",
    miles: "429.62"
    },
    {
    firstname: "Alice",
    lastname: "Ricci",
    sex: "F",
    age: "21",
    agegroup: "",
    club: "UC09",
    lmsc: "Maryland",
    zone: "",
    miles: "427.07"
    },
    {
    firstname: "Roberta F",
    lastname: "Green",
    sex: "F",
    age: "65",
    agegroup: "",
    club: "UC12",
    lmsc: "Virginia",
    zone: "",
    miles: "426.65"
    },
    {
    firstname: "Jean M",
    lastname: "Gallagher",
    sex: "F",
    age: "62",
    agegroup: "",
    club: "OSID",
    lmsc: "San Diego-Imperial",
    zone: "Southwest",
    miles: "425.01"
    },
    {
    firstname: "Valerie J",
    lastname: "Armento",
    sex: "F",
    age: "69",
    agegroup: "",
    club: "UC38",
    lmsc: "Pacific",
    zone: "",
    miles: "425.00"
    },
    {
    firstname: "Dale A",
    lastname: "LeClair",
    sex: "F",
    age: "51",
    agegroup: "",
    club: "HAFL",
    lmsc: "Florida Gold Coast",
    zone: "Southeast",
    miles: "424.76"
    },
    {
    firstname: "KENT W",
    lastname: "SMALL",
    sex: "M",
    age: "64",
    agegroup: "",
    club: "UC33",
    lmsc: "Southern Pacific",
    zone: "Southwest",
    miles: "420.81"
    },
    {
    firstname: "Judy L",
    lastname: "Paukert",
    sex: "F",
    age: "72",
    agegroup: "",
    club: "MOST",
    lmsc: "South Texas",
    zone: "South Central",
    miles: "420.44"
    },
    {
    firstname: "Elizabeth A",
    lastname: "Harrison",
    sex: "F",
    age: "46",
    agegroup: "",
    club: "OREG",
    lmsc: "Oregon",
    zone: "Northwest",
    miles: "419.91"
    },
    {
    firstname: "Bill",
    lastname: "Ireland",
    sex: "M",
    age: "61",
    agegroup: "",
    club: "SCAQ",
    lmsc: "Southern Pacific",
    zone: "Southwest",
    miles: "416.57"
    },
    {
    firstname: "Kenneth A Plough",
    lastname: "II",
    sex: "M",
    age: "67",
    agegroup: "",
    club: "UC14",
    lmsc: "Florida",
    zone: "Southeast",
    miles: "413.82"
    },
    {
    firstname: "Sharon",
    lastname: "Danzger",
    sex: "F",
    age: "55",
    agegroup: "",
    club: "SHAR",
    lmsc: "Florida",
    zone: "Southeast",
    miles: "413.27"
    },
    {
    firstname: "Michael W",
    lastname: "Rourke",
    sex: "M",
    age: "29",
    agegroup: "",
    club: "MOST",
    lmsc: "South Texas",
    zone: "South Central",
    miles: "410.35"
    },
    {
    firstname: "Chuck",
    lastname: "Beatty",
    sex: "M",
    age: "61",
    agegroup: "",
    club: "O*H*",
    lmsc: "",
    zone: "",
    miles: "409.25"
    },
    {
    firstname: "Stephen P",
    lastname: "Sponagle",
    sex: "M",
    age: "65",
    agegroup: "",
    club: "NOVA",
    lmsc: "Southern Pacific",
    zone: "Southwest",
    miles: "408.33"
    },
    {
    firstname: "Scott P",
    lastname: "Halliburton",
    sex: "M",
    age: "58",
    agegroup: "",
    club: "NWAM",
    lmsc: "Arkansas",
    zone: "South Central",
    miles: "408.26"
    },
    {
    firstname: "Jennifer L",
    lastname: "Bauman",
    sex: "F",
    age: "48",
    agegroup: "",
    club: "BERK",
    lmsc: "New Jersey",
    zone: "",
    miles: "408.12"
    },
    {
    firstname: "Sally J",
    lastname: "Marshall",
    sex: "F",
    age: "71",
    agegroup: "",
    club: "MTRC",
    lmsc: "Pacific",
    zone: "",
    miles: "407.76"
    },
    {
    firstname: "Susan Hansell",
    lastname: "Smuck",
    sex: "F",
    age: "64",
    agegroup: "",
    club: "VCM",
    lmsc: "Southern Pacific",
    zone: "Southwest",
    miles: "403.70"
    },
    {
    firstname: "Ross G",
    lastname: "Simmons",
    sex: "M",
    age: "57",
    agegroup: "",
    club: "UC44",
    lmsc: "San Diego-Imperial",
    zone: "Southwest",
    miles: "401.08"
    },
    {
    firstname: "Robin",
    lastname: "Walker",
    sex: "F",
    age: "65",
    agegroup: "",
    club: "INDY",
    lmsc: "Indiana",
    zone: "",
    miles: "400.88"
    },
    {
    firstname: "Mike",
    lastname: "Wilson",
    sex: "M",
    age: "54",
    agegroup: "",
    club: "TFAM",
    lmsc: "North Texas",
    zone: "South Central",
    miles: "399.23"
    },
    {
    firstname: "Donald D",
    lastname: "Gornto",
    sex: "M",
    age: "49",
    agegroup: "",
    club: "SPCO",
    lmsc: "Florida",
    zone: "Southeast",
    miles: "398.86"
    },
    {
    firstname: "Jason A",
    lastname: "Campbell",
    sex: "M",
    age: "47",
    agegroup: "",
    club: "O*H*",
    lmsc: "",
    zone: "",
    miles: "398.52"
    },
    {
    firstname: "Robert",
    lastname: "Gatto",
    sex: "M",
    age: "57",
    agegroup: "",
    club: "BERK",
    lmsc: "New Jersey",
    zone: "",
    miles: "398.11"
    },
    {
    firstname: "Robert A",
    lastname: "Webber",
    sex: "M",
    age: "64",
    agegroup: "",
    club: "YCNY",
    lmsc: "Niagara",
    zone: "",
    miles: "394.97"
    },
    {
    firstname: "Sarah R",
    lastname: "Swoch",
    sex: "F",
    age: "35",
    agegroup: "",
    club: "SPM",
    lmsc: "Florida",
    zone: "Southeast",
    miles: "393.97"
    },
    {
    firstname: "Craig A",
    lastname: "Shaffer",
    sex: "M",
    age: "74",
    agegroup: "",
    club: "ARIZ",
    lmsc: "Arizona",
    zone: "Southwest",
    miles: "392.78"
    },
    {
    firstname: "Mary E",
    lastname: "Titcomb",
    sex: "F",
    age: "67",
    agegroup: "",
    club: "FWYS",
    lmsc: "Indiana",
    zone: "",
    miles: "392.27"
    },
    {
    firstname: "Tesla E",
    lastname: "Profumo",
    sex: "F",
    age: "43",
    agegroup: "",
    club: "CRUZ",
    lmsc: "Pacific",
    zone: "",
    miles: "387.96"
    },
    {
    firstname: "Abigail A",
    lastname: "Fairman",
    sex: "F",
    age: "43",
    agegroup: "",
    club: "REDT",
    lmsc: "",
    zone: "",
    miles: "386.72"
    },
    {
    firstname: "Linda J",
    lastname: "Simons",
    sex: "F",
    age: "55",
    agegroup: "",
    club: "CTM",
    lmsc: "Southern Pacific",
    zone: "Southwest",
    miles: "386.63"
    },
    {
    firstname: "Karen K",
    lastname: "Zemlin",
    sex: "F",
    age: "53",
    agegroup: "",
    club: "MINN",
    lmsc: "Minnesota",
    zone: "",
    miles: "386.50"
    },
    {
    firstname: "Arnold",
    lastname: "Caylor",
    sex: "M",
    age: "67",
    agegroup: "",
    club: "ATMS",
    lmsc: "Southeastern",
    zone: "",
    miles: "386.43"
    },
    {
    firstname: "Melanie T",
    lastname: "Mumbauer",
    sex: "F",
    age: "68",
    agegroup: "",
    club: "PSCM",
    lmsc: "Arizona",
    zone: "Southwest",
    miles: "386.27"
    },
    {
    firstname: "Sharon B",
    lastname: "Steinmann",
    sex: "F",
    age: "62",
    agegroup: "",
    club: "SPM",
    lmsc: "Florida",
    zone: "Southeast",
    miles: "385.80"
    },
    {
    firstname: "Joelle Y",
    lastname: "Beard",
    sex: "F",
    age: "32",
    agegroup: "",
    club: "SLOW",
    lmsc: "Utah",
    zone: "",
    miles: "384.24"
    },
    {
    firstname: "Sue",
    lastname: "Cosper",
    sex: "F",
    age: "72",
    agegroup: "",
    club: "INDY",
    lmsc: "Indiana",
    zone: "",
    miles: "383.84"
    },
    {
    firstname: "J",
    lastname: "Cox",
    sex: "F",
    age: "52",
    agegroup: "",
    club: "MAM",
    lmsc: "Pacific",
    zone: "",
    miles: "382.96"
    },
    {
    firstname: "Wendy E",
    lastname: "Hoffman",
    sex: "F",
    age: "58",
    agegroup: "",
    club: "PSM",
    lmsc: "Pacific Northwest",
    zone: "Northwest",
    miles: "382.91"
    },
    {
    firstname: "Michael D",
    lastname: "Bergquist",
    sex: "M",
    age: "64",
    agegroup: "",
    club: "SHAR",
    lmsc: "Florida",
    zone: "Southeast",
    miles: "381.41"
    },
    {
    firstname: "Helene",
    lastname: "Nehrebecki",
    sex: "F",
    age: "40",
    agegroup: "",
    club: "DAM",
    lmsc: "Pacific",
    zone: "",
    miles: "378.36"
    },
    {
    firstname: "Peter B",
    lastname: "Turner",
    sex: "M",
    age: "61",
    agegroup: "",
    club: "SPCO",
    lmsc: "Florida",
    zone: "Southeast",
    miles: "377.76"
    },
    {
    firstname: "Dennis",
    lastname: "Bennett",
    sex: "M",
    age: "54",
    agegroup: "",
    club: "IAMA",
    lmsc: "Iowa",
    zone: "",
    miles: "377.67"
    },
    {
    firstname: "Meghan",
    lastname: "Kruse",
    sex: "F",
    age: "38",
    agegroup: "",
    club: "NCMS",
    lmsc: "North Carolina",
    zone: "Southeast",
    miles: "376.56"
    },
    {
    firstname: "Barry A",
    lastname: "Fasbender",
    sex: "M",
    age: "83",
    agegroup: "",
    club: "OREG",
    lmsc: "Oregon",
    zone: "Northwest",
    miles: "376.36"
    },
    {
    firstname: "John V",
    lastname: "Zeigler",
    sex: "M",
    age: "75",
    agegroup: "",
    club: "GAJA",
    lmsc: "Georgia",
    zone: "Southeast",
    miles: "375.54"
    },
    {
    firstname: "Peter D",
    lastname: "Langham",
    sex: "M",
    age: "69",
    agegroup: "",
    club: "GSM",
    lmsc: "New Jersey",
    zone: "",
    miles: "375.38"
    },
    {
    firstname: "Jean M",
    lastname: "Hofmann",
    sex: "F",
    age: "63",
    agegroup: "",
    club: "ARIZ",
    lmsc: "Arizona",
    zone: "Southwest",
    miles: "373.83"
    },
    {
    firstname: "Robert W",
    lastname: "Sussmeier",
    sex: "M",
    age: "30",
    agegroup: "",
    club: "LSM",
    lmsc: "North Texas",
    zone: "South Central",
    miles: "373.78"
    },
    {
    firstname: "Peter A",
    lastname: "Boers",
    sex: "M",
    age: "57",
    agegroup: "",
    club: "SFYH",
    lmsc: "",
    zone: "",
    miles: "372.88"
    },
    {
    firstname: "Mimi C",
    lastname: "Satter",
    sex: "F",
    age: "70",
    agegroup: "",
    club: "NIAG",
    lmsc: "",
    zone: "",
    miles: "369.25"
    },
    {
    firstname: "Craig A",
    lastname: "Fox",
    sex: "M",
    age: "65",
    agegroup: "",
    club: "DADS",
    lmsc: "",
    zone: "",
    miles: "365.10"
    },
    {
    firstname: "David",
    lastname: "Milburn",
    sex: "M",
    age: "59",
    agegroup: "",
    club: "MATT",
    lmsc: "",
    zone: "",
    miles: "364.87"
    },
    {
    firstname: "Dawn",
    lastname: "Clark",
    sex: "F",
    age: "56",
    agegroup: "",
    club: "SPM",
    lmsc: "Florida",
    zone: "Southeast",
    miles: "363.06"
    },
    {
    firstname: "Jennifer",
    lastname: "Almand",
    sex: "F",
    age: "62",
    agegroup: "",
    club: "AWJ",
    lmsc: "",
    zone: "",
    miles: "362.85"
    },
    {
    firstname: "Robin",
    lastname: "Batchelor",
    sex: "F",
    age: "63",
    agegroup: "",
    club: "KOWS",
    lmsc: "",
    zone: "",
    miles: "362.19"
    },
    {
    firstname: "Todd",
    lastname: "Marshall",
    sex: "M",
    age: "55",
    agegroup: "",
    club: "THT",
    lmsc: "",
    zone: "",
    miles: "361.11"
    },
    {
    firstname: "Hal M",
    lastname: "Ide",
    sex: "M",
    age: "66",
    agegroup: "",
    club: "UC40",
    lmsc: "",
    zone: "",
    miles: "356.30"
    },
    {
    firstname: "Robert E",
    lastname: "Breitel",
    sex: "M",
    age: "53",
    agegroup: "",
    club: "FINS",
    lmsc: "",
    zone: "",
    miles: "356.27"
    },
    {
    firstname: "Deborah S",
    lastname: "Kinnamon",
    sex: "F",
    age: "49",
    agegroup: "",
    club: "ACST",
    lmsc: "",
    zone: "",
    miles: "356.22"
    },
    {
    firstname: "Niki F",
    lastname: "Stokols",
    sex: "F",
    age: "63",
    agegroup: "",
    club: "CVMM",
    lmsc: "",
    zone: "",
    miles: "353.98"
    },
    {
    firstname: "Bob B",
    lastname: "Upshaw",
    sex: "M",
    age: "71",
    agegroup: "",
    club: "WCM",
    lmsc: "",
    zone: "",
    miles: "351.83"
    },
    {
    firstname: "Rosanna D",
    lastname: "Sikora",
    sex: "F",
    age: "65",
    agegroup: "",
    club: "ADMS",
    lmsc: "",
    zone: "",
    miles: "351.52"
    },
    {
    firstname: "Eric",
    lastname: "Hatch",
    sex: "M",
    age: "46",
    agegroup: "",
    club: "SNM",
    lmsc: "",
    zone: "",
    miles: "351.49"
    },
    {
    firstname: "Abigail R",
    lastname: "Bergman",
    sex: "F",
    age: "24",
    agegroup: "",
    club: "IM",
    lmsc: "Illinois",
    zone: "",
    miles: "351.17"
    },
    {
    firstname: "John S",
    lastname: "Spicer",
    sex: "M",
    age: "59",
    agegroup: "",
    club: "SDS",
    lmsc: "",
    zone: "",
    miles: "348.09"
    },
    {
    firstname: "Bob",
    lastname: "Welchlin",
    sex: "M",
    age: "63",
    agegroup: "",
    club: "MOVY",
    lmsc: "Missouri Valley",
    zone: "",
    miles: "347.78"
    },
    {
    firstname: "Jennifer A",
    lastname: "Balevic",
    sex: "F",
    age: "56",
    agegroup: "",
    club: "MACA",
    lmsc: "",
    zone: "",
    miles: "347.69"
    },
    {
    firstname: "Joe D",
    lastname: "Hutto",
    sex: "M",
    age: "69",
    agegroup: "",
    club: "GAJA",
    lmsc: "Georgia",
    zone: "Southeast",
    miles: "344.08"
    },
    {
    firstname: "Lynette",
    lastname: "Greco",
    sex: "F",
    age: "51",
    agegroup: "",
    club: "WSCM",
    lmsc: "",
    zone: "",
    miles: "343.86"
    },
    {
    firstname: "Jeff",
    lastname: "Helton",
    sex: "M",
    age: "64",
    agegroup: "",
    club: "UC25",
    lmsc: "",
    zone: "",
    miles: "343.33"
    },
    {
    firstname: "Ken",
    lastname: "Niemi",
    sex: "M",
    age: "65",
    agegroup: "",
    club: "SCYM",
    lmsc: "",
    zone: "",
    miles: "343.27"
    },
    {
    firstname: "Bruce W",
    lastname: "Rollins",
    sex: "M",
    age: "71",
    agegroup: "",
    club: "WMST",
    lmsc: "",
    zone: "",
    miles: "342.48"
    },
    {
    firstname: "Nim",
    lastname: "Meishar",
    sex: "M",
    age: "54",
    agegroup: "",
    club: "MOST",
    lmsc: "South Texas",
    zone: "South Central",
    miles: "341.82"
    },
    {
    firstname: "Stephen P",
    lastname: "Stedry",
    sex: "M",
    age: "69",
    agegroup: "",
    club: "ROSE",
    lmsc: "",
    zone: "",
    miles: "341.70"
    },
    {
    firstname: "Jennipher M",
    lastname: "Scoggins",
    sex: "F",
    age: "47",
    agegroup: "",
    club: "GCPS",
    lmsc: "",
    zone: "",
    miles: "340.40"
    },
    {
    firstname: "AnnMarie",
    lastname: "Morrisseau",
    sex: "F",
    age: "52",
    agegroup: "",
    club: "T2NM",
    lmsc: "",
    zone: "",
    miles: "339.06"
    },
    {
    firstname: "Kendra E",
    lastname: "Wilson",
    sex: "F",
    age: "39",
    agegroup: "",
    club: "ROSE",
    lmsc: "",
    zone: "",
    miles: "338.94"
    },
    {
    firstname: "Tamar",
    lastname: "Swan",
    sex: "F",
    age: "51",
    agegroup: "",
    club: "VCM",
    lmsc: "Southern Pacific",
    zone: "Southwest",
    miles: "337.77"
    },
    {
    firstname: "Mark A",
    lastname: "Knox",
    sex: "M",
    age: "65",
    agegroup: "",
    club: "UC25",
    lmsc: "",
    zone: "",
    miles: "336.89"
    },
    {
    firstname: "Meredith A",
    lastname: "Stakem",
    sex: "F",
    age: "39",
    agegroup: "",
    club: "DCAC",
    lmsc: "",
    zone: "",
    miles: "335.89"
    },
    {
    firstname: "David",
    lastname: "Thomas",
    sex: "M",
    age: "60",
    agegroup: "",
    club: "CTS",
    lmsc: "",
    zone: "",
    miles: "334.29"
    },
    {
    firstname: "Jodi L",
    lastname: "Barrish",
    sex: "F",
    age: "49",
    agegroup: "",
    club: "JAM",
    lmsc: "",
    zone: "",
    miles: "333.69"
    },
    {
    firstname: "David",
    lastname: "Watterson",
    sex: "M",
    age: "62",
    agegroup: "",
    club: "TPIT",
    lmsc: "",
    zone: "",
    miles: "333.58"
    },
    {
    firstname: "Benjamin A",
    lastname: "Reed",
    sex: "M",
    age: "45",
    agegroup: "",
    club: "UC26",
    lmsc: "",
    zone: "",
    miles: "333.49"
    },
    {
    firstname: "Joannie W",
    lastname: "Eastridge",
    sex: "F",
    age: "66",
    agegroup: "",
    club: "ARIZ",
    lmsc: "Arizona",
    zone: "Southwest",
    miles: "332.41"
    },
    {
    firstname: "Patricia D",
    lastname: "Knowles",
    sex: "F",
    age: "49",
    agegroup: "",
    club: "CRUZ",
    lmsc: "Pacific",
    zone: "",
    miles: "330.80"
    },
    {
    firstname: "Wendy K",
    lastname: "VanDeSompele",
    sex: "F",
    age: "54",
    agegroup: "",
    club: "PSM",
    lmsc: "Pacific Northwest",
    zone: "Northwest",
    miles: "330.68"
    },
    {
    firstname: "Jens",
    lastname: "Volker",
    sex: "M",
    age: "55",
    agegroup: "",
    club: "GSM",
    lmsc: "New Jersey",
    zone: "",
    miles: "330.46"
    },
    {
    firstname: "Larry T",
    lastname: "Harper",
    sex: "M",
    age: "66",
    agegroup: "",
    club: "CMS",
    lmsc: "Colorado",
    zone: "",
    miles: "330.45"
    },
    {
    firstname: "Gary W",
    lastname: "Kovacs",
    sex: "M",
    age: "40",
    agegroup: "",
    club: "MINN",
    lmsc: "Minnesota",
    zone: "",
    miles: "330.32"
    },
    {
    firstname: "Sean F",
    lastname: "Murphy",
    sex: "M",
    age: "38",
    agegroup: "",
    club: "WMAC",
    lmsc: "Wisconsin",
    zone: "",
    miles: "329.08"
    },
    {
    firstname: "Mark L",
    lastname: "Rogers",
    sex: "M",
    age: "55",
    agegroup: "",
    club: "AWJ",
    lmsc: "",
    zone: "",
    miles: "328.69"
    },
    {
    firstname: "Mary A",
    lastname: "DeLong",
    sex: "F",
    age: "54",
    agegroup: "",
    club: "CMS",
    lmsc: "Colorado",
    zone: "",
    miles: "328.44"
    },
    {
    firstname: "Bob",
    lastname: "Hoxsie",
    sex: "M",
    age: "62",
    agegroup: "",
    club: "KONA",
    lmsc: "",
    zone: "",
    miles: "328.00"
    },
    {
    firstname: "Bob",
    lastname: "Burrow",
    sex: "M",
    age: "57",
    agegroup: "",
    club: "NEM",
    lmsc: "New England",
    zone: "",
    miles: "326.08"
    },
    {
    firstname: "James A",
    lastname: "Allen",
    sex: "M",
    age: "57",
    agegroup: "",
    club: "UC11",
    lmsc: "Allegheny Mountain",
    zone: "",
    miles: "325.64"
    },
    {
    firstname: "Denise H",
    lastname: "Webb",
    sex: "F",
    age: "59",
    agegroup: "",
    club: "UHM",
    lmsc: "",
    zone: "",
    miles: "322.76"
    },
    {
    firstname: "William C",
    lastname: "Sax",
    sex: "M",
    age: "51",
    agegroup: "",
    club: "L4S",
    lmsc: "",
    zone: "",
    miles: "322.47"
    },
    {
    firstname: "Hal L",
    lastname: "Gilreath",
    sex: "M",
    age: "58",
    agegroup: "",
    club: "HLJ",
    lmsc: "",
    zone: "",
    miles: "322.46"
    },
    {
    firstname: "Rebecca L",
    lastname: "Jones",
    sex: "F",
    age: "52",
    agegroup: "",
    club: "NCMS",
    lmsc: "North Carolina",
    zone: "Southeast",
    miles: "322.28"
    },
    {
    firstname: "Lynda H",
    lastname: "Przedpelski",
    sex: "F",
    age: "56",
    agegroup: "",
    club: "SCYM",
    lmsc: "",
    zone: "",
    miles: "321.82"
    },
    {
    firstname: "Theodore",
    lastname: "Collins",
    sex: "M",
    age: "57",
    agegroup: "",
    club: "ARIZ",
    lmsc: "Arizona",
    zone: "Southwest",
    miles: "321.36"
    },
    {
    firstname: "Brent R",
    lastname: "Anderson",
    sex: "M",
    age: "58",
    agegroup: "",
    club: "MOST",
    lmsc: "South Texas",
    zone: "South Central",
    miles: "321.28"
    },
    {
    firstname: "Maxwell C",
    lastname: "Adams",
    sex: "M",
    age: "51",
    agegroup: "",
    club: "UC08",
    lmsc: "",
    zone: "",
    miles: "320.52"
    },
    {
    firstname: "Cheryl B",
    lastname: "Hubbard",
    sex: "F",
    age: "53",
    agegroup: "",
    club: "COOG",
    lmsc: "",
    zone: "",
    miles: "319.64"
    },
    {
    firstname: "John Anthony",
    lastname: "two",
    sex: "M",
    age: "20",
    agegroup: "",
    club: "UC14",
    lmsc: "Florida",
    zone: "Southeast",
    miles: "319.55"
    },
    {
    firstname: "John Jay",
    lastname: "Miller",
    sex: "M",
    age: "60",
    agegroup: "",
    club: "GRSC",
    lmsc: "",
    zone: "",
    miles: "318.82"
    },
    {
    firstname: "Peter B",
    lastname: "Lofquist",
    sex: "M",
    age: "59",
    agegroup: "",
    club: "MMAC",
    lmsc: "Arizona",
    zone: "Southwest",
    miles: "318.64"
    },
    {
    firstname: "Lee A",
    lastname: "Porisch",
    sex: "M",
    age: "65",
    agegroup: "",
    club: "MOST",
    lmsc: "South Texas",
    zone: "South Central",
    miles: "318.03"
    },
    {
    firstname: "James M",
    lastname: "Green",
    sex: "M",
    age: "76",
    agegroup: "",
    club: "NCMS",
    lmsc: "North Carolina",
    zone: "Southeast",
    miles: "310.63"
    },
    {
    firstname: "Debbie L",
    lastname: "Loux",
    sex: "F",
    age: "62",
    agegroup: "",
    club: "MACA",
    lmsc: "",
    zone: "",
    miles: "310.45"
    },
    {
    firstname: "Tom",
    lastname: "Hintz",
    sex: "M",
    age: "54",
    agegroup: "",
    club: "THT",
    lmsc: "",
    zone: "",
    miles: "309.87"
    },
    {
    firstname: "Karlene",
    lastname: "Denby",
    sex: "F",
    age: "67",
    agegroup: "",
    club: "COOG",
    lmsc: "",
    zone: "",
    miles: "309.05"
    },
    {
    firstname: "Patty",
    lastname: "Furukawa",
    sex: "F",
    age: "49",
    agegroup: "",
    club: "MVN",
    lmsc: "",
    zone: "",
    miles: "308.78"
    },
    {
    firstname: "Jordan A",
    lastname: "Leahey",
    sex: "F",
    age: "39",
    agegroup: "",
    club: "IM",
    lmsc: "Illinois",
    zone: "",
    miles: "308.45"
    },
    {
    firstname: "Ed",
    lastname: "Pritchard",
    sex: "M",
    age: "64",
    agegroup: "",
    club: "PBM",
    lmsc: "Florida Gold Coast",
    zone: "Southeast",
    miles: "308.19"
    },
    {
    firstname: "Kathy",
    lastname: "Godfrey",
    sex: "F",
    age: "60",
    agegroup: "",
    club: "SCYM",
    lmsc: "",
    zone: "",
    miles: "307.32"
    },
    {
    firstname: "John W",
    lastname: "Hackett",
    sex: "M",
    age: "70",
    agegroup: "",
    club: "IM",
    lmsc: "Illinois",
    zone: "",
    miles: "307.24"
    },
    {
    firstname: "Marie",
    lastname: "Marston",
    sex: "F",
    age: "62",
    agegroup: "",
    club: "UC33",
    lmsc: "Southern Pacific",
    zone: "Southwest",
    miles: "306.47"
    },
    {
    firstname: "Pam",
    lastname: "McClure",
    sex: "F",
    age: "57",
    agegroup: "",
    club: "GAJA",
    lmsc: "Georgia",
    zone: "Southeast",
    miles: "306.11"
    },
    {
    firstname: "Mark A",
    lastname: "Hartmann",
    sex: "M",
    age: "54",
    agegroup: "",
    club: "WMAC",
    lmsc: "Wisconsin",
    zone: "",
    miles: "304.49"
    },
    {
    firstname: "Mary Anne",
    lastname: "Savage",
    sex: "F",
    age: "60",
    agegroup: "",
    club: "NCMS",
    lmsc: "North Carolina",
    zone: "Southeast",
    miles: "303.29"
    },
    {
    firstname: "Ray",
    lastname: "Bruce",
    sex: "M",
    age: "55",
    agegroup: "",
    club: "MOST",
    lmsc: "South Texas",
    zone: "South Central",
    miles: "302.88"
    },
    {
    firstname: "Jennifer",
    lastname: "Downing",
    sex: "F",
    age: "42",
    agegroup: "",
    club: "NEM",
    lmsc: "New England",
    zone: "",
    miles: "302.86"
    },
    {
    firstname: "Irene S",
    lastname: "Fisher",
    sex: "F",
    age: "75",
    agegroup: "",
    club: "SCYM",
    lmsc: "",
    zone: "",
    miles: "302.56"
    },
    {
    firstname: "Amy B",
    lastname: "Wells",
    sex: "F",
    age: "48",
    agegroup: "",
    club: "MTM",
    lmsc: "",
    zone: "",
    miles: "301.75"
    },
    {
    firstname: "Robert J",
    lastname: "Barrish",
    sex: "M",
    age: "52",
    agegroup: "",
    club: "JAM",
    lmsc: "",
    zone: "",
    miles: "300.72"
    },
    {
    firstname: "Julie O",
    lastname: "Eakle",
    sex: "F",
    age: "60",
    agegroup: "",
    club: "MOST",
    lmsc: "South Texas",
    zone: "South Central",
    miles: "300.66"
    },
    {
    firstname: "Bill",
    lastname: "Durell",
    sex: "M",
    age: "70",
    agegroup: "",
    club: "UC30",
    lmsc: "",
    zone: "",
    miles: "299.76"
    },
    {
    firstname: "John",
    lastname: "Chalmers",
    sex: "M",
    age: "57",
    agegroup: "",
    club: "OREG",
    lmsc: "Oregon",
    zone: "Northwest",
    miles: "299.68"
    },
    {
    firstname: "Sandra E Frimerman",
    lastname: "Bergquist",
    sex: "F",
    age: "37",
    agegroup: "",
    club: "MINN",
    lmsc: "Minnesota",
    zone: "",
    miles: "299.01"
    },
    {
    firstname: "Susan",
    lastname: "Cushman",
    sex: "F",
    age: "58",
    agegroup: "",
    club: "LVM",
    lmsc: "Southern Pacific",
    zone: "Southwest",
    miles: "297.66"
    },
    {
    firstname: "Serafina",
    lastname: "Sumargo",
    sex: "F",
    age: "40",
    agegroup: "",
    club: "CONN",
    lmsc: "",
    zone: "",
    miles: "296.37"
    },
    {
    firstname: "Bruce M",
    lastname: "Johnson",
    sex: "M",
    age: "69",
    agegroup: "",
    club: "UC45",
    lmsc: "",
    zone: "",
    miles: "296.08"
    },
    {
    firstname: "Louise K",
    lastname: "Allen",
    sex: "F",
    age: "58",
    agegroup: "",
    club: "RGMS",
    lmsc: "",
    zone: "",
    miles: "294.52"
    },
    {
    firstname: "Jim",
    lastname: "Sauer",
    sex: "M",
    age: "63",
    agegroup: "",
    club: "TXLA",
    lmsc: "South Texas",
    zone: "South Central",
    miles: "294.49"
    },
    {
    firstname: "William M",
    lastname: "Duong",
    sex: "M",
    age: "31",
    agegroup: "",
    club: "RICE",
    lmsc: "",
    zone: "",
    miles: "294.32"
    },
    {
    firstname: "Kevin",
    lastname: "Waterson",
    sex: "M",
    age: "41",
    agegroup: "",
    club: "DAM",
    lmsc: "Pacific",
    zone: "",
    miles: "293.99"
    },
    {
    firstname: "Paul F",
    lastname: "Bousel",
    sex: "M",
    age: "67",
    agegroup: "",
    club: "UC10",
    lmsc: "",
    zone: "",
    miles: "293.66"
    },
    {
    firstname: "Donna P",
    lastname: "Schubkegel",
    sex: "F",
    age: "68",
    agegroup: "",
    club: "CTS",
    lmsc: "",
    zone: "",
    miles: "293.52"
    },
    {
    firstname: "Catherine W",
    lastname: "Taylor",
    sex: "F",
    age: "57",
    agegroup: "",
    club: "WCM",
    lmsc: "",
    zone: "",
    miles: "292.90"
    },
    {
    firstname: "Sara",
    lastname: "Levine",
    sex: "F",
    age: "62",
    agegroup: "",
    club: "UC09",
    lmsc: "Maryland",
    zone: "",
    miles: "292.74"
    },
    {
    firstname: "Donald M",
    lastname: "Walker",
    sex: "M",
    age: "62",
    agegroup: "",
    club: "MOST",
    lmsc: "South Texas",
    zone: "South Central",
    miles: "292.55"
    },
    {
    firstname: "Lisa L",
    lastname: "Watson",
    sex: "F",
    age: "66",
    agegroup: "",
    club: "GAJA",
    lmsc: "Georgia",
    zone: "Southeast",
    miles: "292.51"
    },
    {
    firstname: "Christophe M",
    lastname: "Crombez",
    sex: "M",
    age: "53",
    agegroup: "",
    club: "TSUN",
    lmsc: "",
    zone: "",
    miles: "292.13"
    },
    {
    firstname: "Stan R",
    lastname: "LeMaster",
    sex: "M",
    age: "73",
    agegroup: "",
    club: "IAMA",
    lmsc: "Iowa",
    zone: "",
    miles: "292.05"
    },
    {
    firstname: "Joan E",
    lastname: "Gamso",
    sex: "F",
    age: "63",
    agegroup: "",
    club: "UC14",
    lmsc: "Florida",
    zone: "Southeast",
    miles: "291.34"
    },
    {
    firstname: "N Clayton",
    lastname: "Tangen",
    sex: "M",
    age: "52",
    agegroup: "",
    club: "MTRM",
    lmsc: "",
    zone: "",
    miles: "291.18"
    },
    {
    firstname: "Lynda J",
    lastname: "Scott",
    sex: "F",
    age: "61",
    agegroup: "",
    club: "SCAQ",
    lmsc: "Southern Pacific",
    zone: "Southwest",
    miles: "290.91"
    },
    {
    firstname: "Matthew G",
    lastname: "Murphy",
    sex: "M",
    age: "58",
    agegroup: "",
    club: "GSM",
    lmsc: "New Jersey",
    zone: "",
    miles: "290.41"
    },
    {
    firstname: "Brad",
    lastname: "Guess",
    sex: "M",
    age: "51",
    agegroup: "",
    club: "O*H*",
    lmsc: "",
    zone: "",
    miles: "290.34"
    },
    {
    firstname: "Laura L",
    lastname: "Painter",
    sex: "F",
    age: "58",
    agegroup: "",
    club: "WLOO",
    lmsc: "",
    zone: "",
    miles: "290.19"
    },
    {
    firstname: "Thomas A",
    lastname: "Hodgson",
    sex: "M",
    age: "71",
    agegroup: "",
    club: "MINN",
    lmsc: "Minnesota",
    zone: "",
    miles: "289.90"
    },
    {
    firstname: "Kirsten L",
    lastname: "Derr",
    sex: "F",
    age: "56",
    agegroup: "",
    club: "CMS",
    lmsc: "Colorado",
    zone: "",
    miles: "289.27"
    },
    {
    firstname: "Gerry",
    lastname: "Chojnowski",
    sex: "M",
    age: "71",
    agegroup: "",
    club: "SFYH",
    lmsc: "",
    zone: "",
    miles: "288.87"
    },
    {
    firstname: "Nathan P",
    lastname: "Dean",
    sex: "M",
    age: "45",
    agegroup: "",
    club: "L4S",
    lmsc: "",
    zone: "",
    miles: "288.45"
    },
    {
    firstname: "Pascal",
    lastname: "Borderies",
    sex: "M",
    age: "61",
    agegroup: "",
    club: "UC06",
    lmsc: "",
    zone: "",
    miles: "288.03"
    },
    {
    firstname: "James T",
    lastname: "Breen",
    sex: "M",
    age: "59",
    agegroup: "",
    club: "AWJ",
    lmsc: "",
    zone: "",
    miles: "286.55"
    },
    {
    firstname: "Elizabeth H",
    lastname: "Boscacci",
    sex: "F",
    age: "64",
    agegroup: "",
    club: "SBM",
    lmsc: "",
    zone: "",
    miles: "286.36"
    },
    {
    firstname: "Michael B",
    lastname: "Doyle",
    sex: "M",
    age: "56",
    agegroup: "",
    club: "LSM",
    lmsc: "North Texas",
    zone: "South Central",
    miles: "284.73"
    },
    {
    firstname: "DeEtte A",
    lastname: "Sauer",
    sex: "F",
    age: "79",
    agegroup: "",
    club: "MOST",
    lmsc: "South Texas",
    zone: "South Central",
    miles: "284.19"
    },
    {
    firstname: "Sara E",
    lastname: "Holman",
    sex: "F",
    age: "34",
    agegroup: "",
    club: "CMS",
    lmsc: "Colorado",
    zone: "",
    miles: "283.60"
    },
    {
    firstname: "Ed M",
    lastname: "Tsuzuki",
    sex: "M",
    age: "62",
    agegroup: "",
    club: "SCYM",
    lmsc: "",
    zone: "",
    miles: "283.45"
    },
    {
    firstname: "Jill M",
    lastname: "Wright",
    sex: "F",
    age: "69",
    agegroup: "",
    club: "SAWS",
    lmsc: "Snake River",
    zone: "Northwest",
    miles: "282.33"
    },
    {
    firstname: "Stacy L",
    lastname: "Fox",
    sex: "F",
    age: "57",
    agegroup: "",
    club: "GAJA",
    lmsc: "Georgia",
    zone: "Southeast",
    miles: "281.46"
    },
    {
    firstname: "Susan",
    lastname: "Kirk",
    sex: "F",
    age: "60",
    agegroup: "",
    club: "BERK",
    lmsc: "New Jersey",
    zone: "",
    miles: "279.82"
    },
    {
    firstname: "Duff",
    lastname: "Murphy",
    sex: "M",
    age: "66",
    agegroup: "",
    club: "CTM",
    lmsc: "Southern Pacific",
    zone: "Southwest",
    miles: "279.48"
    },
    {
    firstname: "Kelly A",
    lastname: "Riedinger",
    sex: "F",
    age: "41",
    agegroup: "",
    club: "NASH",
    lmsc: "",
    zone: "",
    miles: "278.30"
    },
    {
    firstname: "Stacy F",
    lastname: "Fredericksen",
    sex: "F",
    age: "62",
    agegroup: "",
    club: "MELO",
    lmsc: "Pacific",
    zone: "",
    miles: "278.01"
    },
    {
    firstname: "Nikki",
    lastname: "Takarabe",
    sex: "F",
    age: "54",
    agegroup: "",
    club: "CTM",
    lmsc: "Southern Pacific",
    zone: "Southwest",
    miles: "277.52"
    },
    {
    firstname: "Alex",
    lastname: "Goldstein",
    sex: "M",
    age: "52",
    agegroup: "",
    club: "PSM",
    lmsc: "Pacific Northwest",
    zone: "Northwest",
    miles: "277.40"
    },
    {
    firstname: "Steve M",
    lastname: "Conover",
    sex: "M",
    age: "71",
    agegroup: "",
    club: "UC17",
    lmsc: "",
    zone: "",
    miles: "276.90"
    },
    {
    firstname: "Hope E",
    lastname: "Knauer",
    sex: "F",
    age: "63",
    agegroup: "",
    club: "UC21",
    lmsc: "",
    zone: "",
    miles: "276.83"
    },
    {
    firstname: "Cindy",
    lastname: "Watson",
    sex: "F",
    age: "54",
    agegroup: "",
    club: "KMAN",
    lmsc: "",
    zone: "",
    miles: "275.48"
    },
    {
    firstname: "Steven L",
    lastname: "Unruh",
    sex: "M",
    age: "54",
    agegroup: "",
    club: "NITR",
    lmsc: "",
    zone: "",
    miles: "274.39"
    },
    {
    firstname: "Heidi",
    lastname: "Natkin",
    sex: "F",
    age: "46",
    agegroup: "",
    club: "AWJ",
    lmsc: "",
    zone: "",
    miles: "274.13"
    },
    {
    firstname: "Jim C",
    lastname: "Stafford",
    sex: "M",
    age: "58",
    agegroup: "",
    club: "MARY",
    lmsc: "",
    zone: "",
    miles: "274.06"
    },
    {
    firstname: "Stan R",
    lastname: "Marion",
    sex: "M",
    age: "60",
    agegroup: "",
    club: "GOLD",
    lmsc: "",
    zone: "",
    miles: "273.75"
    },
    {
    firstname: "Lisa M",
    lastname: "Parchment",
    sex: "F",
    age: "61",
    agegroup: "",
    club: "OLD1",
    lmsc: "",
    zone: "",
    miles: "273.61"
    },
    {
    firstname: "Courtney",
    lastname: "Hoffman",
    sex: "F",
    age: "45",
    agegroup: "",
    club: "GAJA",
    lmsc: "Georgia",
    zone: "Southeast",
    miles: "273.46"
    },
    {
    firstname: "Mark D",
    lastname: "Frazier",
    sex: "M",
    age: "61",
    agegroup: "",
    club: "VACA",
    lmsc: "",
    zone: "",
    miles: "273.43"
    },
    {
    firstname: "Ingrid",
    lastname: "Bon",
    sex: "F",
    age: "50",
    agegroup: "",
    club: "WSC",
    lmsc: "",
    zone: "",
    miles: "273.33"
    },
    {
    firstname: "Suzy M",
    lastname: "Morgan",
    sex: "F",
    age: "55",
    agegroup: "",
    club: "L4S",
    lmsc: "",
    zone: "",
    miles: "272.74"
    },
    {
    firstname: "Lauren Au",
    lastname: "Brinkmeyer",
    sex: "F",
    age: "36",
    agegroup: "",
    club: "CALM",
    lmsc: "",
    zone: "",
    miles: "272.19"
    },
    {
    firstname: "Amy A",
    lastname: "Parratto",
    sex: "F",
    age: "60",
    agegroup: "",
    club: "MINN",
    lmsc: "Minnesota",
    zone: "",
    miles: "272.18"
    },
    {
    firstname: "Ann M",
    lastname: "Drewes",
    sex: "F",
    age: "46",
    agegroup: "",
    club: "O2",
    lmsc: "",
    zone: "",
    miles: "271.95"
    },
    {
    firstname: "Mary",
    lastname: "Stella",
    sex: "F",
    age: "44",
    agegroup: "",
    club: "UC08",
    lmsc: "",
    zone: "",
    miles: "271.74"
    },
    {
    firstname: "Benjamin Van der",
    lastname: "Wel",
    sex: "M",
    age: "55",
    agegroup: "",
    club: "PALM",
    lmsc: "South Carolina",
    zone: "Southeast",
    miles: "271.09"
    },
    {
    firstname: "Steven C",
    lastname: "Clancy",
    sex: "M",
    age: "65",
    agegroup: "",
    club: "MACA",
    lmsc: "",
    zone: "",
    miles: "270.60"
    },
    {
    firstname: "Tom",
    lastname: "Morrisey",
    sex: "M",
    age: "57",
    agegroup: "",
    club: "UC06",
    lmsc: "",
    zone: "",
    miles: "270.40"
    },
    {
    firstname: "Peter",
    lastname: "Tsugawa",
    sex: "M",
    age: "62",
    agegroup: "",
    club: "MEMO",
    lmsc: "",
    zone: "",
    miles: "269.85"
    },
    {
    firstname: "Melanie B",
    lastname: "Sellers",
    sex: "F",
    age: "68",
    agegroup: "",
    club: "OLD1",
    lmsc: "",
    zone: "",
    miles: "269.52"
    },
    {
    firstname: "Michael T",
    lastname: "Hure",
    sex: "M",
    age: "57",
    agegroup: "",
    club: "SLOM",
    lmsc: "",
    zone: "",
    miles: "269.39"
    },
    {
    firstname: "Cynthia J",
    lastname: "Myer",
    sex: "F",
    age: "67",
    agegroup: "",
    club: "O2",
    lmsc: "",
    zone: "",
    miles: "268.79"
    },
    {
    firstname: "Paul A",
    lastname: "Grecco",
    sex: "M",
    age: "59",
    agegroup: "",
    club: "GMUP",
    lmsc: "",
    zone: "",
    miles: "267.96"
    },
    {
    firstname: "Paula M",
    lastname: "Texel",
    sex: "F",
    age: "50",
    agegroup: "",
    club: "SPM",
    lmsc: "Florida",
    zone: "Southeast",
    miles: "267.36"
    },
    {
    firstname: "Isabel",
    lastname: "Zippel",
    sex: "F",
    age: "62",
    agegroup: "",
    club: "MVN",
    lmsc: "",
    zone: "",
    miles: "267.05"
    },
    {
    firstname: "Stan",
    lastname: "Cox",
    sex: "M",
    age: "65",
    agegroup: "",
    club: "NCMS",
    lmsc: "North Carolina",
    zone: "Southeast",
    miles: "266.65"
    },
    {
    firstname: "Larry B",
    lastname: "Krauser",
    sex: "M",
    age: "67",
    agegroup: "",
    club: "SCM",
    lmsc: "",
    zone: "",
    miles: "266.31"
    },
    {
    firstname: "Clifton P",
    lastname: "Titcomb",
    sex: "M",
    age: "69",
    agegroup: "",
    club: "FWYS",
    lmsc: "Indiana",
    zone: "",
    miles: "266.28"
    },
    {
    firstname: "Stephen W",
    lastname: "Justinger",
    sex: "M",
    age: "68",
    agegroup: "",
    club: "WMAC",
    lmsc: "Wisconsin",
    zone: "",
    miles: "266.07"
    },
    {
    firstname: "Elizabeth R",
    lastname: "Gieseking",
    sex: "F",
    age: "54",
    agegroup: "",
    club: "GAJA",
    lmsc: "Georgia",
    zone: "Southeast",
    miles: "266.00"
    },
    {
    firstname: "Kristina M",
    lastname: "Maroudis",
    sex: "F",
    age: "45",
    agegroup: "",
    club: "SDSM",
    lmsc: "San Diego-Imperial",
    zone: "Southwest",
    miles: "265.97"
    },
    {
    firstname: "Stephanie N",
    lastname: "Lemmons",
    sex: "F",
    age: "29",
    agegroup: "",
    club: "GAJA",
    lmsc: "Georgia",
    zone: "Southeast",
    miles: "265.96"
    },
    {
    firstname: "Barney",
    lastname: "Heller",
    sex: "M",
    age: "66",
    agegroup: "",
    club: "1776",
    lmsc: "",
    zone: "",
    miles: "265.53"
    },
    {
    firstname: "Maddie",
    lastname: "Diedo",
    sex: "F",
    age: "62",
    agegroup: "",
    club: "MICH",
    lmsc: "Michigan",
    zone: "",
    miles: "264.60"
    },
    {
    firstname: "Paula M",
    lastname: "Cunio",
    sex: "F",
    age: "59",
    agegroup: "",
    club: "FACT",
    lmsc: "",
    zone: "",
    miles: "264.55"
    },
    {
    firstname: "Linda",
    lastname: "Visser",
    sex: "F",
    age: "50",
    agegroup: "",
    club: "COOG",
    lmsc: "",
    zone: "",
    miles: "264.42"
    },
    {
    firstname: "Mary",
    lastname: "Andersen",
    sex: "F",
    age: "61",
    agegroup: "",
    club: "UC16",
    lmsc: "",
    zone: "",
    miles: "264.26"
    },
    {
    firstname: "Caitlin L",
    lastname: "Clark",
    sex: "F",
    age: "43",
    agegroup: "",
    club: "UC25",
    lmsc: "",
    zone: "",
    miles: "262.78"
    },
    {
    firstname: "Melissa R",
    lastname: "McCartney",
    sex: "F",
    age: "42",
    agegroup: "",
    club: "EA",
    lmsc: "",
    zone: "",
    miles: "262.25"
    },
    {
    firstname: "Diana C",
    lastname: "Sosnowski",
    sex: "F",
    age: "53",
    agegroup: "",
    club: "1776",
    lmsc: "",
    zone: "",
    miles: "261.85"
    }
];

// console.log(data[1].age);

var resultsGtd = new List('resultsGtd', options, data );
    
resultsGtd.sort('miles', {
  order:'desc',
});



function formatAgeGroup(age, agegroup) {
  if (age > 64 && age < 70) {
    agegroup = '65-69';
    console.log(agegroup);
    return agegroup;
  } else if (age > 59 && age < 65) {
    agegroup = '60-64';
    console.log(agegroup);
    return agegroup;
  } else if (age > 54 && age < 59) {
    agegroup = '55-59';
    console.log(agegroup);
    return agegroup;
  } else if (age > 49 && age < 55) {
    agegroup = '50-54';
    console.log(agegroup);
    return agegroup;
  } else if (age > 44 && age < 50) {
    agegroup = '45-49';
    console.log(agegroup);
    return agegroup;
  }
}

// console.log(data[0].agegroup + data[0].age);

function formatTotal(total) {
  // console.log(total);
}

function cleanData(data) {
  let cleanData = data;
  for (var i = 0; i < cleanData.length; i++) {
    cleanData[i].agegroup = formatAgeGroup(data[i].age, data[i].agegroup);
  }
  // formatTotal(cleanData);
};

cleanData(data);


// var resultsGtdAge = new List('age', { 
//   valueNames: ['age']
// });









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
  document.getElementById('searchGtd').value = '';
  $("select").each(function() { this.selectedIndex = 0 });
})



