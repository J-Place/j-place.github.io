function hideLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingWrapper');
    loadingSpinner.classList.add('hide');
}
hideLoadingSpinner();





// var dataLmsc = [
//     {
//         id : "4",
//         name : "Breadbasket",
//         swimmers : 139,
//         miles : 5132635,
//         miles : 41429600,
//         average : 36925.43165467626,
//         lmscs : [
//             {
//                 name : "Missouri Valley",
//                 id : "28",
//                 swimmers : 16,
//                 miles : 1002040.25,
//                 yards : 4590840,
//                 average : 62627.515625,
//                 clubs : [
//                     {
//                         abbreviation : "MOVY",
//                         id : "280-001",
//                         name : "MOVY Masters",
//                         swimmers : 15,
//                         yards : 4590840,
//                         miles : 1002040.25,
//                         average : 66802.68333333333,
//                         members : [
//                             {
//                                 id : "01NZS",
//                                 firstName : "Shayne",
//                                 lastName : "Malone",
//                                 age : "62",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "05F8P",
//                                 firstName : "Heidi",
//                                 lastName : "Loecke",
//                                 age : "49",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0AU58",
//                                 firstName : "Mark",
//                                 lastName : "Schuh",
//                                 age : "46",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "0AYS5",
//                                 firstName : "James",
//                                 lastName : "Carpenter",
//                                 age : "59",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "090EE",
//                                 firstName : "Timothy",
//                                 lastName : "Batchman",
//                                 age : "56",
//                                 miles : 340,
//                                 yards : 598400
//                             },
//                             {
//                                 id : "RJM13",
//                                 firstName : "Russell",
//                                 lastName : "Mulholland",
//                                 age : "72",
//                                 miles : 25,
//                                 yards : 44000
//                             },
//                             {
//                                 id : "0487Y",
//                                 firstName : "David",
//                                 lastName : "Lindsey",
//                                 age : "70",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01NRN",
//                                 firstName : "Chip",
//                                 lastName : "Glidden",
//                                 age : "70",
//                                 miles : 450,
//                                 yards : 792000
//                             },
//                             {
//                                 id : "01NSN",
//                                 firstName : "Anthony",
//                                 lastName : "Thompson",
//                                 age : "56",
//                                 miles : 210,
//                                 yards : 369600
//                             },
//                             {
//                                 id : "0878T",
//                                 firstName : "Richard",
//                                 lastName : "Hynick",
//                                 age : "70",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "01NTR",
//                                 firstName : "Lisa",
//                                 lastName : "Mische-Lawson",
//                                 age : "49",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "01NTW",
//                                 firstName : "Bill",
//                                 lastName : "Sherman",
//                                 age : "62",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01NUC",
//                                 firstName : "Thomas B",
//                                 lastName : "Herrick",
//                                 age : "61",
//                                 miles : 1000000,
//                                 yards : 1000000
//                             },
//                             {
//                                 id : "0721T",
//                                 firstName : "Amy",
//                                 lastName : "Hearst",
//                                 age : "49",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01NYD",
//                                 firstName : "Bob",
//                                 lastName : "Welchlin",
//                                 age : "63",
//                                 miles : 365.25,
//                                 yards : 642840
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CMSC",
//                         id : "280-010",
//                         name : "Chilli Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "P358U",
//                                 firstName : "William ",
//                                 lastName : "Cummings",
//                                 age : "35",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Colorado",
//                 id : "32",
//                 swimmers : 40,
//                 miles : 1117971,
//                 yards : 11620960,
//                 average : 27949.275,
//                 clubs : [
//                     {
//                         abbreviation : "CMS",
//                         id : "320-001",
//                         name : "Colorado Masters Swimming",
//                         swimmers : 36,
//                         yards : 9616320,
//                         miles : 1116832,
//                         average : 31023.11111111111,
//                         members : [
//                             {
//                                 id : "034HF",
//                                 firstName : "Ursula",
//                                 lastName : "Hester",
//                                 age : "49",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "05UV9",
//                                 firstName : "Sara",
//                                 lastName : "Holman",
//                                 age : "34",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "06SSY",
//                                 firstName : "Alexandra",
//                                 lastName : "Barber-Taylor",
//                                 age : "36",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "0A8PK",
//                                 firstName : "Amy",
//                                 lastName : "Fesler",
//                                 age : "41",
//                                 miles : 180,
//                                 yards : 316800
//                             },
//                             {
//                                 id : "06T2E",
//                                 firstName : "Joel",
//                                 lastName : "Kostyrka",
//                                 age : "59",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "031BW",
//                                 firstName : "Kristin",
//                                 lastName : "Greenleaf",
//                                 age : "42",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "06T2M",
//                                 firstName : "Antoinette",
//                                 lastName : "Townley",
//                                 age : "60",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06FMC",
//                                 firstName : "Lisa",
//                                 lastName : "Whittmore",
//                                 age : "62",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "07S14",
//                                 firstName : "Tea",
//                                 lastName : "Chand",
//                                 age : "53",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "031MP",
//                                 firstName : "Janice",
//                                 lastName : "Dau",
//                                 age : "58",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "080B5",
//                                 firstName : "Tom",
//                                 lastName : "Toomey",
//                                 age : "59",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "01K9H",
//                                 firstName : "Thomas",
//                                 lastName : "Schoenewald",
//                                 age : "66",
//                                 miles : 112000,
//                                 yards : 112000
//                             },
//                             {
//                                 id : "031YA",
//                                 firstName : "Heather",
//                                 lastName : "Paul",
//                                 age : "46",
//                                 miles : 125,
//                                 yards : 220000
//                             },
//                             {
//                                 id : "032EP",
//                                 firstName : "Stephen",
//                                 lastName : "Humphrey",
//                                 age : "62",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "08354",
//                                 firstName : "Brian",
//                                 lastName : "Bergford",
//                                 age : "38",
//                                 miles : 1000000,
//                                 yards : 1000000
//                             },
//                             {
//                                 id : "03316",
//                                 firstName : "Kirsten",
//                                 lastName : "Derr",
//                                 age : "56",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "030EC",
//                                 firstName : "Kathy",
//                                 lastName : "Francis",
//                                 age : "61",
//                                 miles : 180,
//                                 yards : 316800
//                             },
//                             {
//                                 id : "06RST",
//                                 firstName : "Clay",
//                                 lastName : "Daughtrey",
//                                 age : "53",
//                                 miles : 175,
//                                 yards : 308000
//                             },
//                             {
//                                 id : "07JSF",
//                                 firstName : "James",
//                                 lastName : "Fesler",
//                                 age : "55",
//                                 miles : 175,
//                                 yards : 308000
//                             },
//                             {
//                                 id : "076M1",
//                                 firstName : "Melissa",
//                                 lastName : "Sundberg",
//                                 age : "30",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0454D",
//                                 firstName : "Heather",
//                                 lastName : "Melrose",
//                                 age : "47",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02N9S",
//                                 firstName : "Jeffrey",
//                                 lastName : "Morrison",
//                                 age : "65",
//                                 miles : 140,
//                                 yards : 246400
//                             },
//                             {
//                                 id : "030KK",
//                                 firstName : "Marcia",
//                                 lastName : "Anziano",
//                                 age : "75",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "030MA",
//                                 firstName : "Aimee",
//                                 lastName : "Bennett",
//                                 age : "63",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "0ATX4",
//                                 firstName : "Christopher",
//                                 lastName : "Whitehead",
//                                 age : "28",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "2GHE9",
//                                 firstName : "Shauna",
//                                 lastName : "Ratcliff",
//                                 age : "32",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "030PV",
//                                 firstName : "Susan",
//                                 lastName : "Nolte",
//                                 age : "59",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "081RN",
//                                 firstName : "Mary",
//                                 lastName : "DeLong",
//                                 age : "53",
//                                 miles : 450,
//                                 yards : 792000
//                             },
//                             {
//                                 id : "030PW",
//                                 firstName : "Christopher",
//                                 lastName : "Nolte",
//                                 age : "63",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "030ZW",
//                                 firstName : "Erin",
//                                 lastName : "Framke",
//                                 age : "47",
//                                 miles : 75,
//                                 yards : 132000
//                             },
//                             {
//                                 id : "07HWK",
//                                 firstName : "Barbara",
//                                 lastName : "Hall",
//                                 age : "69",
//                                 miles : 52,
//                                 yards : 91520
//                             },
//                             {
//                                 id : "M6ZML",
//                                 firstName : "George",
//                                 lastName : "Allison",
//                                 age : "75",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "07511",
//                                 firstName : "Rebecca",
//                                 lastName : "Bryan",
//                                 age : "47",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "067R5",
//                                 firstName : "Anna",
//                                 lastName : "Beelaert",
//                                 age : "46",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01MZJ",
//                                 firstName : "Ryan",
//                                 lastName : "Moore",
//                                 age : "51",
//                                 miles : 180,
//                                 yards : 316800
//                             },
//                             {
//                                 id : "0APE5",
//                                 firstName : "Shaundra",
//                                 lastName : "Ray",
//                                 age : "52",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "LTCO",
//                         id : "320-009",
//                         name : "Life Time Swim Colorado",
//                         swimmers : 1,
//                         yards : 992640,
//                         miles : 564,
//                         average : 564,
//                         members : [
//                             {
//                                 id : "07280",
//                                 firstName : "Tracy",
//                                 lastName : "Sellard",
//                                 age : "56",
//                                 miles : 564,
//                                 yards : 992640
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "BRGH",
//                         id : "320-034",
//                         name : "Brighton Masters",
//                         swimmers : 2,
//                         yards : 132000,
//                         miles : 75,
//                         average : 37.5,
//                         members : [
//                             {
//                                 id : "06SH4",
//                                 firstName : "Lauren",
//                                 lastName : "Hyde",
//                                 age : "61",
//                                 miles : 75,
//                                 yards : 132000
//                             },
//                             {
//                                 id : "34B6J",
//                                 firstName : "Olena",
//                                 lastName : "Ruth",
//                                 age : "41",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "DAWGS",
//                         id : "320-031",
//                         name : "Lakewood Dawgs",
//                         swimmers : 1,
//                         yards : 880000,
//                         miles : 500,
//                         average : 500,
//                         members : [
//                             {
//                                 id : "04048",
//                                 firstName : "Sophia",
//                                 lastName : "Cordero",
//                                 age : "35",
//                                 miles : 500,
//                                 yards : 880000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "South Dakota",
//                 id : "54",
//                 swimmers : 4,
//                 miles : 1000,
//                 yards : 1760000,
//                 average : 250,
//                 clubs : [
//                     {
//                         abbreviation : "SDPM",
//                         id : "540-003",
//                         name : "South Dakota Prairie Masters",
//                         swimmers : 4,
//                         yards : 1760000,
//                         miles : 1000,
//                         average : 250,
//                         members : [
//                             {
//                                 id : "024YY",
//                                 firstName : "Katherine",
//                                 lastName : "Olson",
//                                 age : "43",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "06TMZ",
//                                 firstName : "Steve",
//                                 lastName : "Johnson",
//                                 age : "66",
//                                 miles : 350,
//                                 yards : 616000
//                             },
//                             {
//                                 id : "01HZM",
//                                 firstName : "Jenny",
//                                 lastName : "Hodges",
//                                 age : "46",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "PKP27",
//                                 firstName : "Paula",
//                                 lastName : "Pardy",
//                                 age : "52",
//                                 miles : 300,
//                                 yards : 528000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Minnesota",
//                 id : "30",
//                 swimmers : 48,
//                 miles : 3007287.75,
//                 yards : 15826440,
//                 average : 62651.828125,
//                 clubs : [
//                     {
//                         abbreviation : "WMNS",
//                         id : "300-048",
//                         name : "Winona Masters Swimmers",
//                         swimmers : 4,
//                         yards : 633600,
//                         miles : 360,
//                         average : 90,
//                         members : [
//                             {
//                                 id : "0ACE8",
//                                 firstName : "Bob",
//                                 lastName : "Quinlan",
//                                 age : "60",
//                                 miles : 260,
//                                 yards : 457600
//                             },
//                             {
//                                 id : "0251D",
//                                 firstName : "Glen",
//                                 lastName : "Dornfeld",
//                                 age : "64",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0AW3H",
//                                 firstName : "Robert",
//                                 lastName : "Gordon",
//                                 age : "62",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "071DG",
//                                 firstName : "Lisa",
//                                 lastName : "Ramsey",
//                                 age : "48",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MINN",
//                         id : "300-001",
//                         name : "Minnesota Masters Swim Club",
//                         swimmers : 40,
//                         yards : 14312840,
//                         miles : 3006427.75,
//                         average : 75160.69375,
//                         members : [
//                             {
//                                 id : "061U1",
//                                 firstName : "Amy",
//                                 lastName : "Parratto",
//                                 age : "60",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07RGJ",
//                                 firstName : "Megan",
//                                 lastName : "Hughes",
//                                 age : "46",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "09X8Z",
//                                 firstName : "James",
//                                 lastName : "Hoke",
//                                 age : "34",
//                                 miles : 1000000,
//                                 yards : 1000000
//                             },
//                             {
//                                 id : "02508",
//                                 firstName : "Joseph",
//                                 lastName : "Benacci",
//                                 age : "58",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "04TAE",
//                                 firstName : "Sandra",
//                                 lastName : "Frimerman-Bergquist",
//                                 age : "37",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07XNF",
//                                 firstName : "Rick",
//                                 lastName : "Lindblom",
//                                 age : "60",
//                                 miles : 60,
//                                 yards : 105600
//                             },
//                             {
//                                 id : "04TBE",
//                                 firstName : "Michael",
//                                 lastName : "Rothweiler",
//                                 age : "72",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0AYSH",
//                                 firstName : "Susan",
//                                 lastName : "Mohn",
//                                 age : "56",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "09Y52",
//                                 firstName : "Carolyn",
//                                 lastName : "Fittipaldi",
//                                 age : "27",
//                                 miles : 1000000,
//                                 yards : 1000000
//                             },
//                             {
//                                 id : "001NR",
//                                 firstName : "Gary",
//                                 lastName : "Kovacs",
//                                 age : "40",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "024E1",
//                                 firstName : "Sarah",
//                                 lastName : "Hromada",
//                                 age : "59",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "0257A",
//                                 firstName : "Dale",
//                                 lastName : "Sulzle",
//                                 age : "59",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "024HK",
//                                 firstName : "Katie",
//                                 lastName : "Melmer",
//                                 age : "51",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0A3YY",
//                                 firstName : "Jeremy",
//                                 lastName : "Busch",
//                                 age : "42",
//                                 miles : 366.5,
//                                 yards : 645040
//                             },
//                             {
//                                 id : "0745C",
//                                 firstName : "Kathryn",
//                                 lastName : "Vandam",
//                                 age : "35",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "025C1",
//                                 firstName : "Carrie",
//                                 lastName : "Stolar",
//                                 age : "53",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "07JAX",
//                                 firstName : "Amanda",
//                                 lastName : "Sharp",
//                                 age : "43",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06BBA",
//                                 firstName : "Craig",
//                                 lastName : "Collins",
//                                 age : "61",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "024HZ",
//                                 firstName : "Peggy",
//                                 lastName : "Kratz",
//                                 age : "60",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "093AS",
//                                 firstName : "Nathan",
//                                 lastName : "Overby",
//                                 age : "40",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "024JH",
//                                 firstName : "Pamela",
//                                 lastName : "Ogden",
//                                 age : "63",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "025SU",
//                                 firstName : "Larry",
//                                 lastName : "Kraft",
//                                 age : "54",
//                                 miles : 225,
//                                 yards : 396000
//                             },
//                             {
//                                 id : "06BGW",
//                                 firstName : "Shannon",
//                                 lastName : "Swartz",
//                                 age : "69",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "024MK",
//                                 firstName : "Maureen",
//                                 lastName : "Mook",
//                                 age : "53",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "09477",
//                                 firstName : "Jose",
//                                 lastName : "Rosales Yepez",
//                                 age : "34",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "024NY",
//                                 firstName : "Randy",
//                                 lastName : "Schlichting",
//                                 age : "55",
//                                 miles : 750,
//                                 yards : 1320000
//                             },
//                             {
//                                 id : "KAREN",
//                                 firstName : "Karen",
//                                 lastName : "Zemlin",
//                                 age : "52",
//                                 miles : 1000000,
//                                 yards : 1000000
//                             },
//                             {
//                                 id : "0AJHP",
//                                 firstName : "Bonnie",
//                                 lastName : "Carlson-Green",
//                                 age : "58",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "07P4W",
//                                 firstName : "Laura",
//                                 lastName : "Kueny",
//                                 age : "57",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "ABZYH",
//                                 firstName : "Russell",
//                                 lastName : "Sons",
//                                 age : "49",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "083W9",
//                                 firstName : "Tracy",
//                                 lastName : "Pechmann",
//                                 age : "58",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0B4WP",
//                                 firstName : "Thomas",
//                                 lastName : "Hodgson",
//                                 age : "71",
//                                 miles : 365.25,
//                                 yards : 642840
//                             },
//                             {
//                                 id : "024SR",
//                                 firstName : "Marc",
//                                 lastName : "Anderson",
//                                 age : "71",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "05UDK",
//                                 firstName : "Todd",
//                                 lastName : "Miller",
//                                 age : "57",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "024U2",
//                                 firstName : "Nicki",
//                                 lastName : "Phillips",
//                                 age : "50",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "0910W",
//                                 firstName : "Karen",
//                                 lastName : "Urevig",
//                                 age : "52",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "024XD",
//                                 firstName : "Kip",
//                                 lastName : "Kirkpatrick",
//                                 age : "48",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0AU4K",
//                                 firstName : "Katherine",
//                                 lastName : "Kaiser",
//                                 age : "29",
//                                 miles : 366,
//                                 yards : 644160
//                             },
//                             {
//                                 id : "05Z5A",
//                                 firstName : "Joseph",
//                                 lastName : "Anderson",
//                                 age : "35",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "08229",
//                                 firstName : "David",
//                                 lastName : "Kough",
//                                 age : "57",
//                                 miles : 415,
//                                 yards : 730400
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "ISMT",
//                         id : "300-043",
//                         name : "I Swim Masters Team",
//                         swimmers : 2,
//                         yards : 440000,
//                         miles : 250,
//                         average : 125,
//                         members : [
//                             {
//                                 id : "095MR",
//                                 firstName : "Richard",
//                                 lastName : "Brown",
//                                 age : "55",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "082DW",
//                                 firstName : "Paul",
//                                 lastName : "Worwa",
//                                 age : "63",
//                                 miles : 250,
//                                 yards : 440000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "HAST",
//                         id : "300-033",
//                         name : "Hastings Area Swim Team",
//                         swimmers : 1,
//                         yards : 88000,
//                         miles : 50,
//                         average : 50,
//                         members : [
//                             {
//                                 id : "J3SGJ",
//                                 firstName : "Sally",
//                                 lastName : "Martin",
//                                 age : "62",
//                                 miles : 50,
//                                 yards : 88000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "NORT",
//                         id : "300-011",
//                         name : "Nort'landers Swim Club",
//                         swimmers : 1,
//                         yards : 352000,
//                         miles : 200,
//                         average : 200,
//                         members : [
//                             {
//                                 id : "025M3",
//                                 firstName : "Aaron",
//                                 lastName : "Kelson",
//                                 age : "60",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "North Dakota",
//                 id : "52",
//                 swimmers : 1,
//                 miles : 250,
//                 yards : 440000,
//                 average : 250,
//                 clubs : [
//                     {
//                         abbreviation : "DKTA",
//                         id : "520-001",
//                         name : "Dakota Masters",
//                         swimmers : 1,
//                         yards : 440000,
//                         miles : 250,
//                         average : 250,
//                         members : [
//                             {
//                                 id : "R0B1N",
//                                 firstName : "Robin",
//                                 lastName : "Tracy",
//                                 age : "56",
//                                 miles : 250,
//                                 yards : 440000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Nebraska",
//                 id : "29",
//                 swimmers : 9,
//                 miles : 1800,
//                 yards : 3168000,
//                 average : 200,
//                 clubs : [
//                     {
//                         abbreviation : "OMAH",
//                         id : "290-002",
//                         name : "Omaha Masters Swim Club",
//                         swimmers : 7,
//                         yards : 2728000,
//                         miles : 1550,
//                         average : 221.42857142857142,
//                         members : [
//                             {
//                                 id : "01JAU",
//                                 firstName : "Terry",
//                                 lastName : "Koopman",
//                                 age : "64",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "01JB1",
//                                 firstName : "Patrice",
//                                 lastName : "Zalesky",
//                                 age : "61",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "05FDT",
//                                 firstName : "Gary",
//                                 lastName : "Krysl",
//                                 age : "58",
//                                 miles : 225,
//                                 yards : 396000
//                             },
//                             {
//                                 id : "01JF2",
//                                 firstName : "Lynn",
//                                 lastName : "Ingraham",
//                                 age : "60",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "08BFJ",
//                                 firstName : "Colleen",
//                                 lastName : "Fredrickson",
//                                 age : "55",
//                                 miles : 275,
//                                 yards : 484000
//                             },
//                             {
//                                 id : "06ADK",
//                                 firstName : "Sharessa",
//                                 lastName : "Gutierrez",
//                                 age : "39",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "01JAK",
//                                 firstName : "Brigitte",
//                                 lastName : "Otto",
//                                 age : "65",
//                                 miles : 150,
//                                 yards : 264000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "LMAO",
//                         id : "290-013",
//                         name : "Lincoln Masters and Others",
//                         swimmers : 1,
//                         yards : 440000,
//                         miles : 250,
//                         average : 250,
//                         members : [
//                             {
//                                 id : "01JC7",
//                                 firstName : "Richard",
//                                 lastName : "Sutton",
//                                 age : "72",
//                                 miles : 250,
//                                 yards : 440000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "BTAC",
//                         id : "290-023",
//                         name : "Brownell Talbot Aquatic Club - Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "01JD4",
//                                 firstName : "Kathy",
//                                 lastName : "Lydiatt",
//                                 age : "52",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Ozark",
//                 id : "22",
//                 swimmers : 7,
//                 miles : 1170,
//                 yards : 2059200,
//                 average : 167.14285714285714,
//                 clubs : [
//                     {
//                         abbreviation : "SLAM",
//                         id : "220-001",
//                         name : "St. Louis Area Masters",
//                         swimmers : 7,
//                         yards : 2059200,
//                         miles : 1170,
//                         average : 167.14285714285714,
//                         members : [
//                             {
//                                 id : "098BU",
//                                 firstName : "Doug",
//                                 lastName : "Whitlock",
//                                 age : "51",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01NBB",
//                                 firstName : "Ruth",
//                                 lastName : "Hentschke",
//                                 age : "67",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "02UN9",
//                                 firstName : "Mary",
//                                 lastName : "Pohlmann",
//                                 age : "75",
//                                 miles : 320,
//                                 yards : 563200
//                             },
//                             {
//                                 id : "0481H",
//                                 firstName : "Ella",
//                                 lastName : "Rothgangel",
//                                 age : "45",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "01NF9",
//                                 firstName : "Paul",
//                                 lastName : "Duchild",
//                                 age : "51",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "02V0U",
//                                 firstName : "Susan",
//                                 lastName : "Aud",
//                                 age : "65",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "060ZE",
//                                 firstName : "Christopher",
//                                 lastName : "Morehouse",
//                                 age : "49",
//                                 miles : 50,
//                                 yards : 88000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Iowa",
//                 id : "40",
//                 swimmers : 14,
//                 miles : 1116,
//                 yards : 1964160,
//                 average : 79.71428571428571,
//                 clubs : [
//                     {
//                         abbreviation : "IAMA",
//                         id : "400-001",
//                         name : "Iowa Masters",
//                         swimmers : 13,
//                         yards : 1964160,
//                         miles : 1116,
//                         average : 85.84615384615384,
//                         members : [
//                             {
//                                 id : "06KX0",
//                                 firstName : "Katie",
//                                 lastName : "Lanius",
//                                 age : "39",
//                                 miles : 366,
//                                 yards : 644160
//                             },
//                             {
//                                 id : "R2PNP",
//                                 firstName : "Diana",
//                                 lastName : "Kealy-Lincoln",
//                                 age : "63",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "09T70",
//                                 firstName : "Stephen",
//                                 lastName : "Bird",
//                                 age : "47",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "0668V",
//                                 firstName : "John",
//                                 lastName : "Hill",
//                                 age : "57",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07VXM",
//                                 firstName : "Stan",
//                                 lastName : "LeMaster",
//                                 age : "73",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "EAEBC",
//                                 firstName : "Lauren",
//                                 lastName : "Jensen",
//                                 age : "32",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "K24ZP",
//                                 firstName : "Clay",
//                                 lastName : "Miller",
//                                 age : "40",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "05U78",
//                                 firstName : "David",
//                                 lastName : "Gehring",
//                                 age : "54",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "074D4",
//                                 firstName : "Dennis",
//                                 lastName : "Bennett",
//                                 age : "54",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "086MG",
//                                 firstName : "Mark",
//                                 lastName : "Bobbin",
//                                 age : "60",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "074HZ",
//                                 firstName : "Julie",
//                                 lastName : "Hoffmann",
//                                 age : "44",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "05R54",
//                                 firstName : "Jody",
//                                 lastName : "Rausch",
//                                 age : "51",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "087TS",
//                                 firstName : "Marcus",
//                                 lastName : "Williams",
//                                 age : "31",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "DST",
//                         id : "400-024",
//                         name : "Decorah Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "01MTY",
//                                 firstName : "Brian",
//                                 lastName : "Jones",
//                                 age : "62",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         id : "1",
//         name : "Colonies",
//         swimmers : 351,
//         miles : 7228328.25,
//         yards : 110917288,
//         average : 20593.527777777777,
//         lmscs : [
//             {
//                 name : "Adirondack",
//                 id : "3",
//                 swimmers : 7,
//                 miles : 890,
//                 yards : 1566400,
//                 average : 127.14285714285714,
//                 clubs : [
//                     {
//                         abbreviation : "ADMS",
//                         id : "030-001",
//                         name : "Adirondack Masters",
//                         swimmers : 7,
//                         yards : 1566400,
//                         miles : 890,
//                         average : 127.14285714285714,
//                         members : [
//                             {
//                                 id : "07HYN",
//                                 firstName : "Jim",
//                                 lastName : "Butler",
//                                 age : "42",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0A44H",
//                                 firstName : "Meisha",
//                                 lastName : "Rosenberg",
//                                 age : "50",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "0AZA6",
//                                 firstName : "Eugenia",
//                                 lastName : "Rutherford",
//                                 age : "69",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "01M7X",
//                                 firstName : "Therese",
//                                 lastName : "Gigliotti",
//                                 age : "57",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01M9S",
//                                 firstName : "June",
//                                 lastName : "Vyse Gravener",
//                                 age : "89",
//                                 miles : 75,
//                                 yards : 132000
//                             },
//                             {
//                                 id : "0B092",
//                                 firstName : "Blake",
//                                 lastName : "Hargis",
//                                 age : "46",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "0366R",
//                                 firstName : "Rosanna",
//                                 lastName : "Sikora",
//                                 age : "65",
//                                 miles : 365,
//                                 yards : 642400
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "New Jersey",
//                 id : "7",
//                 swimmers : 92,
//                 miles : 4465000,
//                 yards : 30850000,
//                 average : 48532.608695652176,
//                 clubs : [
//                     {
//                         abbreviation : "SCYM",
//                         id : "070-030",
//                         name : "Somerset County YMCA Masters",
//                         swimmers : 12,
//                         yards : 3020000,
//                         miles : 601375,
//                         average : 50114.583333333336,
//                         members : [
//                             {
//                                 id : "01Y6M",
//                                 firstName : "Ed",
//                                 lastName : "Tsuzuki",
//                                 age : "62",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "095Y1",
//                                 firstName : "Anne",
//                                 lastName : "Murphy",
//                                 age : "57",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07H54",
//                                 firstName : "Adele",
//                                 lastName : "Morgan",
//                                 age : "54",
//                                 miles : 75,
//                                 yards : 132000
//                             },
//                             {
//                                 id : "0A3PZ",
//                                 firstName : "Jane",
//                                 lastName : "Ikeda",
//                                 age : "59",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "0B8GU",
//                                 firstName : "Cara",
//                                 lastName : "Cannilla",
//                                 age : "24",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "033N3",
//                                 firstName : "Thomas",
//                                 lastName : "MacNabb",
//                                 age : "55",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "015FX",
//                                 firstName : "Angelica",
//                                 lastName : "Oliveira",
//                                 age : "41",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "02UXW",
//                                 firstName : "Kari",
//                                 lastName : "VanderVeen",
//                                 age : "54",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "09PPM",
//                                 firstName : "Randy",
//                                 lastName : "Bugianesi",
//                                 age : "52",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "02XPZ",
//                                 firstName : "Ashley",
//                                 lastName : "Pertsemlidis",
//                                 age : "49",
//                                 miles : 600000,
//                                 yards : 600000
//                             },
//                             {
//                                 id : "9U3GG",
//                                 firstName : "Mary",
//                                 lastName : "Breslin",
//                                 age : "61",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "05GRH",
//                                 firstName : "Kathy",
//                                 lastName : "Godfrey",
//                                 age : "60",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "GSM",
//                         id : "070-005",
//                         name : "Garden State Masters",
//                         swimmers : 24,
//                         yards : 9504000,
//                         miles : 5400,
//                         average : 225,
//                         members : [
//                             {
//                                 id : "04NFX",
//                                 firstName : "Steve",
//                                 lastName : "Glassman",
//                                 age : "72",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "07K52",
//                                 firstName : "Matthew",
//                                 lastName : "Murphy",
//                                 age : "58",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "07U2F",
//                                 firstName : "Peter",
//                                 lastName : "Langham",
//                                 age : "69",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "01Y70",
//                                 firstName : "Kathryn",
//                                 lastName : "Kelly",
//                                 age : "71",
//                                 miles : 225,
//                                 yards : 396000
//                             },
//                             {
//                                 id : "04NH6",
//                                 firstName : "Larry",
//                                 lastName : "Van Horn",
//                                 age : "66",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "04NJN",
//                                 firstName : "William",
//                                 lastName : "Haas",
//                                 age : "85",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01Y2N",
//                                 firstName : "Gerri",
//                                 lastName : "Callahan",
//                                 age : "62",
//                                 miles : 175,
//                                 yards : 308000
//                             },
//                             {
//                                 id : "0689E",
//                                 firstName : "Richard",
//                                 lastName : "Schubert",
//                                 age : "68",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "01Y34",
//                                 firstName : "Bob",
//                                 lastName : "Hopkins",
//                                 age : "78",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "01Y9H",
//                                 firstName : "Curtis",
//                                 lastName : "Miller",
//                                 age : "60",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "06BC4",
//                                 firstName : "Carol",
//                                 lastName : "Martyniuk",
//                                 age : "68",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "021YD",
//                                 firstName : "James",
//                                 lastName : "Ryan",
//                                 age : "68",
//                                 miles : 516,
//                                 yards : 908160
//                             },
//                             {
//                                 id : "01Y40",
//                                 firstName : "Rick",
//                                 lastName : "Schluter",
//                                 age : "63",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01Y49",
//                                 firstName : "Richard",
//                                 lastName : "Carlson",
//                                 age : "67",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "01YB2",
//                                 firstName : "Ken",
//                                 lastName : "Niemi",
//                                 age : "65",
//                                 miles : 549,
//                                 yards : 966240
//                             },
//                             {
//                                 id : "06GSB",
//                                 firstName : "Jose",
//                                 lastName : "Faria",
//                                 age : "54",
//                                 miles : 260,
//                                 yards : 457600
//                             },
//                             {
//                                 id : "01Y4F",
//                                 firstName : "Sandra",
//                                 lastName : "Carosi",
//                                 age : "54",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01YDG",
//                                 firstName : "Joel",
//                                 lastName : "Stein",
//                                 age : "70",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "01Y4U",
//                                 firstName : "Jens",
//                                 lastName : "Volker",
//                                 age : "55",
//                                 miles : 550,
//                                 yards : 968000
//                             },
//                             {
//                                 id : "02Y55",
//                                 firstName : "Ilse",
//                                 lastName : "Wolfe",
//                                 age : "56",
//                                 miles : 225,
//                                 yards : 396000
//                             },
//                             {
//                                 id : "0AX2J",
//                                 firstName : "John",
//                                 lastName : "Sheppard",
//                                 age : "73",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "01YE4",
//                                 firstName : "Frank",
//                                 lastName : "McElroy",
//                                 age : "72",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "064H3",
//                                 firstName : "Paula",
//                                 lastName : "Pyrcz",
//                                 age : "75",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01Y0Y",
//                                 firstName : "John",
//                                 lastName : "Hunt",
//                                 age : "77",
//                                 miles : 250,
//                                 yards : 440000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "BERK",
//                         id : "070-002",
//                         name : "Berkeley (NJ) Aquatic Masters",
//                         swimmers : 32,
//                         yards : 6493840,
//                         miles : 1552809,
//                         average : 48525.28125,
//                         members : [
//                             {
//                                 id : "01YRD",
//                                 firstName : "Sarah",
//                                 lastName : "Sangree",
//                                 age : "63",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "05HTS",
//                                 firstName : "Todd",
//                                 lastName : "Schaper",
//                                 age : "56",
//                                 miles : 69,
//                                 yards : 121440
//                             },
//                             {
//                                 id : "MJE1G",
//                                 firstName : "Christopher",
//                                 lastName : "Townsend",
//                                 age : "47",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "05NVG",
//                                 firstName : "Denis",
//                                 lastName : "Kallish",
//                                 age : "62",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "01Y7Z",
//                                 firstName : "Sally",
//                                 lastName : "Kleeman",
//                                 age : "67",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0AH4J",
//                                 firstName : "Rebekah",
//                                 lastName : "Cocola",
//                                 age : "32",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07US1",
//                                 firstName : "Robert",
//                                 lastName : "Gatto",
//                                 age : "57",
//                                 miles : 700,
//                                 yards : 1232000
//                             },
//                             {
//                                 id : "05VMS",
//                                 firstName : "Mary",
//                                 lastName : "Hesselgrave",
//                                 age : "77",
//                                 miles : 75,
//                                 yards : 132000
//                             },
//                             {
//                                 id : "01Y8X",
//                                 firstName : "Bill",
//                                 lastName : "Reichle",
//                                 age : "72",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "0ADGS",
//                                 firstName : "Keith",
//                                 lastName : "Christoffers",
//                                 age : "46",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01YTF",
//                                 firstName : "Erik",
//                                 lastName : "Werfel",
//                                 age : "57",
//                                 miles : 75,
//                                 yards : 132000
//                             },
//                             {
//                                 id : "01Y8Y",
//                                 firstName : "Beth",
//                                 lastName : "Maloney",
//                                 age : "70",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "01YV3",
//                                 firstName : "Deirdre",
//                                 lastName : "Omara",
//                                 age : "50",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0B9CE",
//                                 firstName : "Dawn",
//                                 lastName : "Dellaratta-Duffy",
//                                 age : "51",
//                                 miles : 350,
//                                 yards : 616000
//                             },
//                             {
//                                 id : "023EK",
//                                 firstName : "Greg",
//                                 lastName : "Magdanz",
//                                 age : "57",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01YA1",
//                                 firstName : "Susan",
//                                 lastName : "Kirk",
//                                 age : "60",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "07KGX",
//                                 firstName : "Joe",
//                                 lastName : "Dutton",
//                                 age : "49",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01YX5",
//                                 firstName : "Jennifer",
//                                 lastName : "Bauman",
//                                 age : "48",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "02XU2",
//                                 firstName : "Marie",
//                                 lastName : "Vellucci",
//                                 age : "71",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06RYG",
//                                 firstName : "Matthew",
//                                 lastName : "Gann",
//                                 age : "52",
//                                 miles : 300000,
//                                 yards : 300000
//                             },
//                             {
//                                 id : "01YXZ",
//                                 firstName : "Lan",
//                                 lastName : "Ge",
//                                 age : "58",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01YDY",
//                                 firstName : "Steven",
//                                 lastName : "Levine",
//                                 age : "68",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01YYE",
//                                 firstName : "Lynn",
//                                 lastName : "Ascione",
//                                 age : "53",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01Y50",
//                                 firstName : "Gail",
//                                 lastName : "Seelig",
//                                 age : "70",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06K5E",
//                                 firstName : "Tom",
//                                 lastName : "Sartorio",
//                                 age : "54",
//                                 miles : 140,
//                                 yards : 246400
//                             },
//                             {
//                                 id : "01Y62",
//                                 firstName : "Lorna",
//                                 lastName : "Cialdella-Morehead",
//                                 age : "56",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02YZ2",
//                                 firstName : "Julie",
//                                 lastName : "Schoenlank",
//                                 age : "40",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0A3A8",
//                                 firstName : "Robert",
//                                 lastName : "Schott",
//                                 age : "62",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "09J20",
//                                 firstName : "Eric",
//                                 lastName : "Materniak",
//                                 age : "29",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01Y64",
//                                 firstName : "Aaron",
//                                 lastName : "Moore",
//                                 age : "55",
//                                 miles : 500000,
//                                 yards : 500000
//                             },
//                             {
//                                 id : "01YN7",
//                                 firstName : "Kimberly",
//                                 lastName : "Plewa",
//                                 age : "37",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07099",
//                                 firstName : "Lynda",
//                                 lastName : "Przedpelski",
//                                 age : "56",
//                                 miles : 750000,
//                                 yards : 750000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "RBAY",
//                         id : "070-015",
//                         name : "Raritan Bay Area YMCA",
//                         swimmers : 9,
//                         yards : 2877600,
//                         miles : 1635,
//                         average : 181.66666666666666,
//                         members : [
//                             {
//                                 id : "0B46Y",
//                                 firstName : "Dorothy",
//                                 lastName : "Schilling",
//                                 age : "70",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "8SCN4",
//                                 firstName : "Larry",
//                                 lastName : "Cohen",
//                                 age : "64",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "GCKCA",
//                                 firstName : "Mark",
//                                 lastName : "Weinstein",
//                                 age : "64",
//                                 miles : 125,
//                                 yards : 220000
//                             },
//                             {
//                                 id : "073MV",
//                                 firstName : "Meredith",
//                                 lastName : "Lyndon",
//                                 age : "64",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "01YSV",
//                                 firstName : "Michael",
//                                 lastName : "Lavitt",
//                                 age : "62",
//                                 miles : 230,
//                                 yards : 404800
//                             },
//                             {
//                                 id : "01YW7",
//                                 firstName : "Sue",
//                                 lastName : "Freeman-Patterson",
//                                 age : "69",
//                                 miles : 180,
//                                 yards : 316800
//                             },
//                             {
//                                 id : "07WGY",
//                                 firstName : "Atsushi",
//                                 lastName : "Hamanaka",
//                                 age : "61",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "0A7D6",
//                                 firstName : "Elliott",
//                                 lastName : "Lehrer",
//                                 age : "65",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "0AB7C",
//                                 firstName : "Francis",
//                                 lastName : "Norek",
//                                 age : "64",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "JAM",
//                         id : "070-004",
//                         name : "Jersey Area Masters",
//                         swimmers : 6,
//                         yards : 4713600,
//                         miles : 1002110,
//                         average : 167018.33333333334,
//                         members : [
//                             {
//                                 id : "01Y1P",
//                                 firstName : "Robert",
//                                 lastName : "Barrish",
//                                 age : "52",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "01YRM",
//                                 firstName : "Leigh",
//                                 lastName : "Segal",
//                                 age : "55",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "01Y1R",
//                                 firstName : "Jodi",
//                                 lastName : "Barrish",
//                                 age : "49",
//                                 miles : 660,
//                                 yards : 1161600
//                             },
//                             {
//                                 id : "08115",
//                                 firstName : "Mark",
//                                 lastName : "Corl",
//                                 age : "61",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "07Z0A",
//                                 firstName : "Ruth",
//                                 lastName : "Gilgenbach",
//                                 age : "36",
//                                 miles : 1000000,
//                                 yards : 1000000
//                             },
//                             {
//                                 id : "073DN",
//                                 firstName : "Norman",
//                                 lastName : "Sorkin",
//                                 age : "64",
//                                 miles : 250,
//                                 yards : 440000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "LTMM",
//                         id : "070-018",
//                         name : "Life Time Swim New Jersey",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "0A3K6",
//                                 firstName : "Gulnaz",
//                                 lastName : "Aksu",
//                                 age : "43",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "PAA",
//                         id : "070-019",
//                         name : "Peddie Aquatic Association",
//                         swimmers : 4,
//                         yards : 2824160,
//                         miles : 1300866,
//                         average : 325216.5,
//                         members : [
//                             {
//                                 id : "088Z2",
//                                 firstName : "Arun",
//                                 lastName : "Rao",
//                                 age : "49",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "07KBM",
//                                 firstName : "Christopher",
//                                 lastName : "Gibson",
//                                 age : "64",
//                                 miles : 1300000,
//                                 yards : 1300000
//                             },
//                             {
//                                 id : "0AS9F",
//                                 firstName : "John",
//                                 lastName : "Cox",
//                                 age : "37",
//                                 miles : 366,
//                                 yards : 644160
//                             },
//                             {
//                                 id : "07W0T",
//                                 firstName : "Aaron",
//                                 lastName : "Smith",
//                                 age : "39",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "NJLHY",
//                         id : "070-047",
//                         name : "Lakeland Hills YMCA",
//                         swimmers : 1,
//                         yards : 387200,
//                         miles : 220,
//                         average : 220,
//                         members : [
//                             {
//                                 id : "01Y30",
//                                 firstName : "Mark",
//                                 lastName : "Hoffman",
//                                 age : "59",
//                                 miles : 220,
//                                 yards : 387200
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "RMT",
//                         id : "070-046",
//                         name : "Rutherford Masters Team",
//                         swimmers : 1,
//                         yards : 440000,
//                         miles : 250,
//                         average : 250,
//                         members : [
//                             {
//                                 id : "06XVA",
//                                 firstName : "Michael",
//                                 lastName : "Gemelli",
//                                 age : "50",
//                                 miles : 250,
//                                 yards : 440000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "RBY",
//                         id : "070-039",
//                         name : "YMCA of Greater Monmouth County",
//                         swimmers : 1,
//                         yards : 589600,
//                         miles : 335,
//                         average : 335,
//                         members : [
//                             {
//                                 id : "01YG3",
//                                 firstName : "Catherine",
//                                 lastName : "Maloney Falicon",
//                                 age : "70",
//                                 miles : 335,
//                                 yards : 589600
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "DRMS",
//                         id : "070-006",
//                         name : "Drew Masters Swimming",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "0885T",
//                                 firstName : "Irene",
//                                 lastName : "Fisher",
//                                 age : "75",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Niagara",
//                 id : "4",
//                 swimmers : 17,
//                 miles : 3240,
//                 yards : 5702400,
//                 average : 190.58823529411765,
//                 clubs : [
//                     {
//                         abbreviation : "YCNY",
//                         id : "040-028",
//                         name : "Central New York YMCA",
//                         swimmers : 7,
//                         yards : 3203200,
//                         miles : 1820,
//                         average : 260,
//                         members : [
//                             {
//                                 id : "0B7E8",
//                                 firstName : "Patricia",
//                                 lastName : "King",
//                                 age : "63",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "MJEHM",
//                                 firstName : "Zoey",
//                                 lastName : "Zhu",
//                                 age : "46",
//                                 miles : 25,
//                                 yards : 44000
//                             },
//                             {
//                                 id : "08CCG",
//                                 firstName : "Kate",
//                                 lastName : "Auwaerter",
//                                 age : "54",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "01X1W",
//                                 firstName : "Bill",
//                                 lastName : "Walter",
//                                 age : "67",
//                                 miles : 230,
//                                 yards : 404800
//                             },
//                             {
//                                 id : "01X36",
//                                 firstName : "Robert",
//                                 lastName : "Webber",
//                                 age : "64",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "09VTX",
//                                 firstName : "Keone",
//                                 lastName : "Weigl",
//                                 age : "58",
//                                 miles : 600,
//                                 yards : 1056000
//                             },
//                             {
//                                 id : "09WCT",
//                                 firstName : "Mary Ellen",
//                                 lastName : "Speicher",
//                                 age : "64",
//                                 miles : 400,
//                                 yards : 704000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "NIAG",
//                         id : "040-001",
//                         name : "Niagara District Masters",
//                         swimmers : 5,
//                         yards : 1355200,
//                         miles : 770,
//                         average : 154,
//                         members : [
//                             {
//                                 id : "075JU",
//                                 firstName : "Diane",
//                                 lastName : "Hagemann",
//                                 age : "55",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "06RM4",
//                                 firstName : "Mimi",
//                                 lastName : "Satter",
//                                 age : "70",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "01X2B",
//                                 firstName : "Lance",
//                                 lastName : "Evans",
//                                 age : "59",
//                                 miles : 60,
//                                 yards : 105600
//                             },
//                             {
//                                 id : "01XKE",
//                                 firstName : "Mike",
//                                 lastName : "Burgess",
//                                 age : "56",
//                                 miles : 110,
//                                 yards : 193600
//                             },
//                             {
//                                 id : "01XY6",
//                                 firstName : "Kevin",
//                                 lastName : "Shea",
//                                 age : "63",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "BUMS",
//                         id : "040-003",
//                         name : "Binghamton Univ Masters",
//                         swimmers : 3,
//                         yards : 528000,
//                         miles : 300,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "02ZMJ",
//                                 firstName : "Jack",
//                                 lastName : "Cothren",
//                                 age : "71",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "09BRA",
//                                 firstName : "Robert",
//                                 lastName : "Hopkins",
//                                 age : "64",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "071ZT",
//                                 firstName : "Leo",
//                                 lastName : "Gibbons",
//                                 age : "67",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "ROCH",
//                         id : "040-016",
//                         name : "Rochester Area Masters Swimming",
//                         swimmers : 1,
//                         yards : 264000,
//                         miles : 150,
//                         average : 150,
//                         members : [
//                             {
//                                 id : "01XXE",
//                                 firstName : "Jill",
//                                 lastName : "Thrasher",
//                                 age : "53",
//                                 miles : 150,
//                                 yards : 264000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "FAIR",
//                         id : "040-013",
//                         name : "Fairport Area Swim Team Masters",
//                         swimmers : 1,
//                         yards : 352000,
//                         miles : 200,
//                         average : 200,
//                         members : [
//                             {
//                                 id : "0B0MG",
//                                 firstName : "Julie",
//                                 lastName : "West",
//                                 age : "52",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Delaware Valley",
//                 id : "8",
//                 swimmers : 24,
//                 miles : 4625,
//                 yards : 8140000,
//                 average : 192.70833333333334,
//                 clubs : [
//                     {
//                         abbreviation : "1776",
//                         id : "081-001",
//                         name : "Colonials 1776",
//                         swimmers : 1,
//                         yards : 880000,
//                         miles : 500,
//                         average : 500,
//                         members : [
//                             {
//                                 id : "MCA69",
//                                 firstName : "maxwell",
//                                 lastName : "adams",
//                                 age : "51",
//                                 miles : 500,
//                                 yards : 880000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "LASH",
//                         id : "080-071",
//                         name : "Landshark Masters",
//                         swimmers : 2,
//                         yards : 396000,
//                         miles : 225,
//                         average : 112.5,
//                         members : [
//                             {
//                                 id : "06NKZ",
//                                 firstName : "Roberta",
//                                 lastName : "Hower",
//                                 age : "57",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "0769C",
//                                 firstName : "Amy",
//                                 lastName : "Crowe",
//                                 age : "70",
//                                 miles : 125,
//                                 yards : 220000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "GPAC",
//                         id : "080-039",
//                         name : "Greater Philadelphia Aquatic Club",
//                         swimmers : 5,
//                         yards : 2112000,
//                         miles : 1200,
//                         average : 240,
//                         members : [
//                             {
//                                 id : "0AKSS",
//                                 firstName : "Mario",
//                                 lastName : "Valori",
//                                 age : "60",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0A5MH",
//                                 firstName : "Matthew",
//                                 lastName : "Arkebauer",
//                                 age : "39",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0936M",
//                                 firstName : "Stephen",
//                                 lastName : "Soloway",
//                                 age : "57",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "07F6N",
//                                 firstName : "William",
//                                 lastName : "Fleming",
//                                 age : "71",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "0A2F7",
//                                 firstName : "Rich",
//                                 lastName : "Montgomery",
//                                 age : "54",
//                                 miles : 400,
//                                 yards : 704000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "FINS",
//                         id : "080-005",
//                         name : "Fins Aquatics Club",
//                         swimmers : 5,
//                         yards : 1936000,
//                         miles : 1100,
//                         average : 220,
//                         members : [
//                             {
//                                 id : "04D4V",
//                                 firstName : "Meghan",
//                                 lastName : "Gardner",
//                                 age : "37",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "003WJ",
//                                 firstName : "Robert",
//                                 lastName : "Breitel",
//                                 age : "53",
//                                 miles : 550,
//                                 yards : 968000
//                             },
//                             {
//                                 id : "06Y3J",
//                                 firstName : "Amy",
//                                 lastName : "Barraclough",
//                                 age : "36",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "0223N",
//                                 firstName : "Merrill",
//                                 lastName : "Hilf",
//                                 age : "60",
//                                 miles : 175,
//                                 yards : 308000
//                             },
//                             {
//                                 id : "0225Y",
//                                 firstName : "Caroline",
//                                 lastName : "Stein",
//                                 age : "49",
//                                 miles : 25,
//                                 yards : 44000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "YWMA",
//                         id : "080-025",
//                         name : "YWCA Masters of Adams County",
//                         swimmers : 1,
//                         yards : 484000,
//                         miles : 275,
//                         average : 275,
//                         members : [
//                             {
//                                 id : "070MC",
//                                 firstName : "Kristina",
//                                 lastName : "Rebert",
//                                 age : "57",
//                                 miles : 275,
//                                 yards : 484000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "STGM",
//                         id : "080-064",
//                         name : "Stuttgart Piranhas Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "04D6T",
//                                 firstName : "Robin",
//                                 lastName : "Bruce",
//                                 age : "35",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "WGR",
//                         id : "080-070",
//                         name : "Virtua Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "042PG",
//                                 firstName : "Laurie",
//                                 lastName : "Hohwald",
//                                 age : "65",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CBFY",
//                         id : "080-042",
//                         name : "YMCA Of Bucks County ",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "060XP",
//                                 firstName : "Krista",
//                                 lastName : "Striano",
//                                 age : "41",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "WBP",
//                         id : "080-088",
//                         name : "Wilkes-Barre/Pittston YMCA",
//                         swimmers : 2,
//                         yards : 1760000,
//                         miles : 1000,
//                         average : 500,
//                         members : [
//                             {
//                                 id : "090PD",
//                                 firstName : "David",
//                                 lastName : "Sauer",
//                                 age : "50",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0228D",
//                                 firstName : "Eric",
//                                 lastName : "Schall",
//                                 age : "59",
//                                 miles : 1000,
//                                 yards : 1760000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SVY",
//                         id : "080-034",
//                         name : "Spring Valley YMCA Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "090U4",
//                                 firstName : "Joseph",
//                                 lastName : "Boris",
//                                 age : "41",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "PENN",
//                         id : "080-078",
//                         name : "Penn Heron Open Water Swimming",
//                         swimmers : 1,
//                         yards : 264000,
//                         miles : 150,
//                         average : 150,
//                         members : [
//                             {
//                                 id : "GS8G3",
//                                 firstName : "Kristen",
//                                 lastName : "Stewart",
//                                 age : "58",
//                                 miles : 150,
//                                 yards : 264000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "HAYS",
//                         id : "080-043",
//                         name : "Hanover Area YMCA Sr. Stingrays",
//                         swimmers : 1,
//                         yards : 308000,
//                         miles : 175,
//                         average : 175,
//                         members : [
//                             {
//                                 id : "08E98",
//                                 firstName : "Cheryl",
//                                 lastName : "Abel",
//                                 age : "51",
//                                 miles : 175,
//                                 yards : 308000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "WWCM",
//                         id : "080-063",
//                         name : "Wildwood Crest Dolphins Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "022ER",
//                                 firstName : "Michael",
//                                 lastName : "Martin",
//                                 age : "60",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "FST",
//                         id : "080-079",
//                         name : "First State Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "0A7Z0",
//                                 firstName : "Margaret",
//                                 lastName : "Kroen",
//                                 age : "54",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Metropolitan",
//                 id : "6",
//                 swimmers : 29,
//                 miles : 873039,
//                 yards : 6218640,
//                 average : 30104.793103448275,
//                 clubs : [
//                     {
//                         abbreviation : "WM",
//                         id : "060-012",
//                         name : "Westchester Masters",
//                         swimmers : 9,
//                         yards : 736000,
//                         miles : 120350,
//                         average : 13372.222222222223,
//                         members : [
//                             {
//                                 id : "073GM",
//                                 firstName : "Patrick",
//                                 lastName : "Hewes",
//                                 age : "56",
//                                 miles : 120000,
//                                 yards : 120000
//                             },
//                             {
//                                 id : "02Z74",
//                                 firstName : "Jennifer",
//                                 lastName : "Kyff",
//                                 age : "47",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "MN6S6",
//                                 firstName : "Juliet",
//                                 lastName : "Coulthard",
//                                 age : "42",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "02XP2",
//                                 firstName : "Jorgeann",
//                                 lastName : "Cruz",
//                                 age : "53",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "FSKCY",
//                                 firstName : "Fiona",
//                                 lastName : "Russo",
//                                 age : "44",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "BM5SJ",
//                                 firstName : "William",
//                                 lastName : "Rose",
//                                 age : "30",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "YTRWB",
//                                 firstName : "Diana ",
//                                 lastName : "Afanasjev",
//                                 age : "43",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "07JZB",
//                                 firstName : "Timothy",
//                                 lastName : "Gardner",
//                                 age : "58",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "D10CH",
//                                 firstName : "Akinori",
//                                 lastName : "Iida",
//                                 age : "49",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "AGUA",
//                         id : "060-013",
//                         name : "AGUA Masters",
//                         swimmers : 2,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "06KVH",
//                                 firstName : "Charley",
//                                 lastName : "Young",
//                                 age : "33",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0301W",
//                                 firstName : "Rich",
//                                 lastName : "Bernstein",
//                                 age : "74",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SEAW",
//                         id : "060-022",
//                         name : "Seawolves Masters",
//                         swimmers : 2,
//                         yards : 88000,
//                         miles : 50,
//                         average : 25,
//                         members : [
//                             {
//                                 id : "02ZCR",
//                                 firstName : "Robert",
//                                 lastName : "Unger",
//                                 age : "63",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "095K5",
//                                 firstName : "Thomas",
//                                 lastName : "Lynch",
//                                 age : "61",
//                                 miles : 50,
//                                 yards : 88000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CHEL",
//                         id : "060-026",
//                         name : "Chelsea Piers fitness NY/BK",
//                         swimmers : 2,
//                         yards : 742400,
//                         miles : 100365,
//                         average : 50182.5,
//                         members : [
//                             {
//                                 id : "02ZM8",
//                                 firstName : "Ellen",
//                                 lastName : "Weinberg",
//                                 age : "59",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "07XRW",
//                                 firstName : "Mark",
//                                 lastName : "Jobson",
//                                 age : "61",
//                                 miles : 100000,
//                                 yards : 100000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "BSC",
//                         id : "060-071",
//                         name : "Brooklyn Swimmers Club",
//                         swimmers : 1,
//                         yards : 352000,
//                         miles : 200,
//                         average : 200,
//                         members : [
//                             {
//                                 id : "C6B9J",
//                                 firstName : "Jonathen",
//                                 lastName : "Kwok",
//                                 age : "32",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "EXMS",
//                         id : "060-075",
//                         name : "Long Island Express Masters Swimming",
//                         swimmers : 1,
//                         yards : 176000,
//                         miles : 100,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "099NR",
//                                 firstName : "STEVE",
//                                 lastName : "CONROY",
//                                 age : "76",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "REDT",
//                         id : "060-007",
//                         name : "Red Tide",
//                         swimmers : 3,
//                         yards : 1964160,
//                         miles : 1116,
//                         average : 372,
//                         members : [
//                             {
//                                 id : "02XEF",
//                                 firstName : "Anna",
//                                 lastName : "Armentrout",
//                                 age : "48",
//                                 miles : 350,
//                                 yards : 616000
//                             },
//                             {
//                                 id : "05GPA",
//                                 firstName : "Abigail",
//                                 lastName : "Fairman",
//                                 age : "43",
//                                 miles : 366,
//                                 yards : 644160
//                             },
//                             {
//                                 id : "06A6A",
//                                 firstName : "Zahava",
//                                 lastName : "Lipton",
//                                 age : "34",
//                                 miles : 400,
//                                 yards : 704000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "FISH",
//                         id : "060-020",
//                         name : "FISH Masters",
//                         swimmers : 1,
//                         yards : 352000,
//                         miles : 200,
//                         average : 200,
//                         members : [
//                             {
//                                 id : "02ZVP",
//                                 firstName : "Marie",
//                                 lastName : "Cole",
//                                 age : "58",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "IA",
//                         id : "060-041",
//                         name : "Islanders Aquatics Masters",
//                         swimmers : 1,
//                         yards : 454080,
//                         miles : 258,
//                         average : 258,
//                         members : [
//                             {
//                                 id : "09KV6",
//                                 firstName : "Maria",
//                                 lastName : "McAuley Greer",
//                                 age : "49",
//                                 miles : 258,
//                                 yards : 454080
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "FRNY",
//                         id : "060-038",
//                         name : "Front Runners New York",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "07HFJ",
//                                 firstName : "Craig",
//                                 lastName : "Goodwin-Ortiz de León",
//                                 age : "43",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "BURN",
//                         id : "060-043",
//                         name : "McBurney YMCA Masters",
//                         swimmers : 1,
//                         yards : 650000,
//                         miles : 650000,
//                         average : 650000,
//                         members : [
//                             {
//                                 id : "02YG5",
//                                 firstName : "Phyllis",
//                                 lastName : "Ho",
//                                 age : "59",
//                                 miles : 650000,
//                                 yards : 650000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "LICY",
//                         id : "060-068",
//                         name : "Long Island City YMCA Masters Swim Team",
//                         swimmers : 1,
//                         yards : 528000,
//                         miles : 300,
//                         average : 300,
//                         members : [
//                             {
//                                 id : "0B4YG",
//                                 firstName : "Jason",
//                                 lastName : "Wong",
//                                 age : "36",
//                                 miles : 300,
//                                 yards : 528000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "BRAT",
//                         id : "060-008",
//                         name : "Bay Ridge Masters",
//                         swimmers : 2,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "09CNY",
//                                 firstName : "Cheryl",
//                                 lastName : "Pawlowski",
//                                 age : "40",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "H091G",
//                                 firstName : "Ernie",
//                                 lastName : "Saasto",
//                                 age : "47",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "TNYA",
//                         id : "060-015",
//                         name : "Team New York Aquatics",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "007HG",
//                                 firstName : "RJ",
//                                 lastName : "Hermanet",
//                                 age : "50",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "HVD",
//                         id : "060-060",
//                         name : "Hudson Valley Dolphins",
//                         swimmers : 1,
//                         yards : 176000,
//                         miles : 100,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "02Z2Y",
//                                 firstName : "Heidi",
//                                 lastName : "Baks",
//                                 age : "51",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Potomac Valley",
//                 id : "10",
//                 swimmers : 47,
//                 miles : 9208,
//                 yards : 16206080,
//                 average : 195.91489361702128,
//                 clubs : [
//                     {
//                         abbreviation : "RMST",
//                         id : "100-009",
//                         name : "Reston Masters Swim Team",
//                         swimmers : 3,
//                         yards : 1188000,
//                         miles : 675,
//                         average : 225,
//                         members : [
//                             {
//                                 id : "036F9",
//                                 firstName : "Brian",
//                                 lastName : "Evans",
//                                 age : "56",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "037UT",
//                                 firstName : "Sheryl",
//                                 lastName : "Katsaros",
//                                 age : "51",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "036FR",
//                                 firstName : "Michelle",
//                                 lastName : "Moyer",
//                                 age : "58",
//                                 miles : 375,
//                                 yards : 660000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "TERR",
//                         id : "100-006",
//                         name : "Terrapin Masters",
//                         swimmers : 4,
//                         yards : 616000,
//                         miles : 350,
//                         average : 87.5,
//                         members : [
//                             {
//                                 id : "01VT9",
//                                 firstName : "Allyson",
//                                 lastName : "Adams",
//                                 age : "55",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "B5P3M",
//                                 firstName : "Carmen",
//                                 lastName : "Houston-Ludlam",
//                                 age : "22",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "022HE",
//                                 firstName : "Mollie",
//                                 lastName : "Grover",
//                                 age : "39",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "87PJW",
//                                 firstName : "Ginger",
//                                 lastName : "Houston-Ludlam",
//                                 age : "61",
//                                 miles : 50,
//                                 yards : 88000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "L4S",
//                         id : "100-005",
//                         name : "Lane 4 Swimming",
//                         swimmers : 12,
//                         yards : 4831200,
//                         miles : 2745,
//                         average : 228.75,
//                         members : [
//                             {
//                                 id : "037WA",
//                                 firstName : "Pamela",
//                                 lastName : "Wood",
//                                 age : "50",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "07J1P",
//                                 firstName : "Marlene",
//                                 lastName : "Becker",
//                                 age : "56",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "01NF8",
//                                 firstName : "Nathan",
//                                 lastName : "Dean",
//                                 age : "45",
//                                 miles : 280,
//                                 yards : 492800
//                             },
//                             {
//                                 id : "0385D",
//                                 firstName : "Adell",
//                                 lastName : "Crowe",
//                                 age : "64",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "0377R",
//                                 firstName : "William",
//                                 lastName : "Sax",
//                                 age : "51",
//                                 miles : 700,
//                                 yards : 1232000
//                             },
//                             {
//                                 id : "038GR",
//                                 firstName : "Suzy",
//                                 lastName : "Morgan",
//                                 age : "55",
//                                 miles : 225,
//                                 yards : 396000
//                             },
//                             {
//                                 id : "EBX8K",
//                                 firstName : "Kent",
//                                 lastName : "Allen",
//                                 age : "60",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "038MT",
//                                 firstName : "Lauren",
//                                 lastName : "Fitzgerald",
//                                 age : "44",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "006F1",
//                                 firstName : "Laurelyn",
//                                 lastName : "Rawson",
//                                 age : "49",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "0396Z",
//                                 firstName : "Kathy",
//                                 lastName : "Rice",
//                                 age : "61",
//                                 miles : 240,
//                                 yards : 422400
//                             },
//                             {
//                                 id : "007FJ",
//                                 firstName : "Nancy",
//                                 lastName : "Buchholz",
//                                 age : "54",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "039KC",
//                                 firstName : "Jennifer",
//                                 lastName : "Johnston",
//                                 age : "73",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "GERM",
//                         id : "100-027",
//                         name : "Germantown Maryland Masters",
//                         swimmers : 5,
//                         yards : 704000,
//                         miles : 400,
//                         average : 80,
//                         members : [
//                             {
//                                 id : "VDD3Y",
//                                 firstName : "Kim",
//                                 lastName : "Peifley",
//                                 age : "55",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "036JT",
//                                 firstName : "Michael",
//                                 lastName : "Boyle",
//                                 age : "69",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0380N",
//                                 firstName : "Jennifer",
//                                 lastName : "McVeigh",
//                                 age : "48",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "0A6E2",
//                                 firstName : "Barbara",
//                                 lastName : "Mallon",
//                                 age : "53",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "0B0DK",
//                                 firstName : "Teresa",
//                                 lastName : "Husted",
//                                 age : "50",
//                                 miles : 150,
//                                 yards : 264000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "GMUP",
//                         id : "100-002",
//                         name : "Patriot Masters Swim Team",
//                         swimmers : 2,
//                         yards : 1364000,
//                         miles : 775,
//                         average : 387.5,
//                         members : [
//                             {
//                                 id : "09JRM",
//                                 firstName : "Joe",
//                                 lastName : "Steiner",
//                                 age : "57",
//                                 miles : 275,
//                                 yards : 484000
//                             },
//                             {
//                                 id : "03BB0",
//                                 firstName : "Paul",
//                                 lastName : "Grecco",
//                                 age : "59",
//                                 miles : 500,
//                                 yards : 880000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "ALEX",
//                         id : "100-021",
//                         name : "Alexandria Masters Swimming",
//                         swimmers : 4,
//                         yards : 880000,
//                         miles : 500,
//                         average : 125,
//                         members : [
//                             {
//                                 id : "03807",
//                                 firstName : "Matthew",
//                                 lastName : "McCready",
//                                 age : "45",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01T5D",
//                                 firstName : "Fay",
//                                 lastName : "Lachney",
//                                 age : "59",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "090X1",
//                                 firstName : "Lindsey",
//                                 lastName : "Jakubchak",
//                                 age : "37",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "037H5",
//                                 firstName : "Katie",
//                                 lastName : "Palavecino",
//                                 age : "42",
//                                 miles : 500,
//                                 yards : 880000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MSSC",
//                         id : "100-019",
//                         name : "Maryland Suburban Swim Club",
//                         swimmers : 1,
//                         yards : 352000,
//                         miles : 200,
//                         average : 200,
//                         members : [
//                             {
//                                 id : "05NYA",
//                                 firstName : "Alan",
//                                 lastName : "Arnold",
//                                 age : "68",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "ANCM",
//                         id : "100-012",
//                         name : "Montgomery Ancient Mariners",
//                         swimmers : 8,
//                         yards : 2750880,
//                         miles : 1563,
//                         average : 195.375,
//                         members : [
//                             {
//                                 id : "036JV",
//                                 firstName : "Holly",
//                                 lastName : "Donnelly",
//                                 age : "48",
//                                 miles : 728,
//                                 yards : 1281280
//                             },
//                             {
//                                 id : "GKPV6",
//                                 firstName : "Marci",
//                                 lastName : "Goldberg",
//                                 age : "36",
//                                 miles : 140,
//                                 yards : 246400
//                             },
//                             {
//                                 id : "0AHYX",
//                                 firstName : "Marissa",
//                                 lastName : "Bartol",
//                                 age : "34",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01UJP",
//                                 firstName : "Julie",
//                                 lastName : "Goldberg",
//                                 age : "36",
//                                 miles : 80,
//                                 yards : 140800
//                             },
//                             {
//                                 id : "037AZ",
//                                 firstName : "Julie",
//                                 lastName : "Roddin",
//                                 age : "44",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "09GYT",
//                                 firstName : "Pam",
//                                 lastName : "Hepp",
//                                 age : "61",
//                                 miles : 165,
//                                 yards : 290400
//                             },
//                             {
//                                 id : "0361N",
//                                 firstName : "Jeffrey",
//                                 lastName : "Roddin",
//                                 age : "51",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "07B6Z",
//                                 firstName : "Kendra",
//                                 lastName : "Oehlerich",
//                                 age : "38",
//                                 miles : 150,
//                                 yards : 264000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "ARMS",
//                         id : "100-004",
//                         name : "Arlington Masters",
//                         swimmers : 2,
//                         yards : 211200,
//                         miles : 120,
//                         average : 60,
//                         members : [
//                             {
//                                 id : "01ZUF",
//                                 firstName : "Anna",
//                                 lastName : "Mod",
//                                 age : "57",
//                                 miles : 120,
//                                 yards : 211200
//                             },
//                             {
//                                 id : "038X4",
//                                 firstName : "Rachel",
//                                 lastName : "Brown",
//                                 age : "37",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "DCRP",
//                         id : "100-003",
//                         name : "DC Dept Of Recreation & Parks",
//                         swimmers : 2,
//                         yards : 836000,
//                         miles : 475,
//                         average : 237.5,
//                         members : [
//                             {
//                                 id : "05T99",
//                                 firstName : "Wendy",
//                                 lastName : "Schleicher",
//                                 age : "51",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "070MV",
//                                 firstName : "Mary",
//                                 lastName : "Dasso",
//                                 age : "58",
//                                 miles : 275,
//                                 yards : 484000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SDS",
//                         id : "100-026",
//                         name : "Sea Devil Swimming Masters",
//                         swimmers : 2,
//                         yards : 1522400,
//                         miles : 865,
//                         average : 432.5,
//                         members : [
//                             {
//                                 id : "052TG",
//                                 firstName : "Richard",
//                                 lastName : "Dexter",
//                                 age : "51",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "0977Y",
//                                 firstName : "John",
//                                 lastName : "Spicer",
//                                 age : "59",
//                                 miles : 500,
//                                 yards : 880000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "RIPM",
//                         id : "100-008",
//                         name : "Riptide Masters",
//                         swimmers : 1,
//                         yards : 352000,
//                         miles : 200,
//                         average : 200,
//                         members : [
//                             {
//                                 id : "02J6B",
//                                 firstName : "Maria",
//                                 lastName : "Dewing",
//                                 age : "57",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "DCAC",
//                         id : "100-017",
//                         name : "District Of Columbia Aquatics Club",
//                         swimmers : 1,
//                         yards : 598400,
//                         miles : 340,
//                         average : 340,
//                         members : [
//                             {
//                                 id : "037K1",
//                                 firstName : "Meredith",
//                                 lastName : "Stakem",
//                                 age : "39",
//                                 miles : 340,
//                                 yards : 598400
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "New England",
//                 id : "2",
//                 swimmers : 79,
//                 miles : 1311950.25,
//                 yards : 23422008,
//                 average : 16606.96518987342,
//                 clubs : [
//                     {
//                         abbreviation : "NEM",
//                         id : "020-001",
//                         name : "New England Masters Swim Club",
//                         swimmers : 69,
//                         yards : 21749568,
//                         miles : 1311000,
//                         average : 19000,
//                         members : [
//                             {
//                                 id : "09N3X",
//                                 firstName : "Edward",
//                                 lastName : "Fiske",
//                                 age : "56",
//                                 miles : 750,
//                                 yards : 1320000
//                             },
//                             {
//                                 id : "0824W",
//                                 firstName : "Sarah",
//                                 lastName : "Dombrowski",
//                                 age : "31",
//                                 miles : 407,
//                                 yards : 716320
//                             },
//                             {
//                                 id : "04783",
//                                 firstName : "Jean",
//                                 lastName : "Lambert",
//                                 age : "60",
//                                 miles : 175,
//                                 yards : 308000
//                             },
//                             {
//                                 id : "07B8T",
//                                 firstName : "Rob",
//                                 lastName : "Schiller",
//                                 age : "69",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "033EA",
//                                 firstName : "Christopher",
//                                 lastName : "Landry",
//                                 age : "64",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "0APME",
//                                 firstName : "Santiago",
//                                 lastName : "Tapia-Perez",
//                                 age : "81",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "034M5",
//                                 firstName : "Sydne",
//                                 lastName : "Didier",
//                                 age : "49",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "05V95",
//                                 firstName : "Jessica",
//                                 lastName : "Kallipolites",
//                                 age : "42",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "BZ7P1",
//                                 firstName : "Manuel",
//                                 lastName : "Martines",
//                                 age : "65",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06AUZ",
//                                 firstName : "Ryan",
//                                 lastName : "Pope",
//                                 age : "31",
//                                 miles : 365000,
//                                 yards : 365000
//                             },
//                             {
//                                 id : "005AX",
//                                 firstName : "Fiona",
//                                 lastName : "Atkinson",
//                                 age : "70",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "078US",
//                                 firstName : "Bob",
//                                 lastName : "Burrow",
//                                 age : "57",
//                                 miles : 569,
//                                 yards : 1001440
//                             },
//                             {
//                                 id : "5B3M0",
//                                 firstName : "Dorothy",
//                                 lastName : "Mullaney",
//                                 age : "62",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "0479E",
//                                 firstName : "Gail",
//                                 lastName : "Dufault",
//                                 age : "61",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "ANKER",
//                                 firstName : "Anker",
//                                 lastName : "Lerret",
//                                 age : "62",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "033K4",
//                                 firstName : "Catherine",
//                                 lastName : "Laramie",
//                                 age : "63",
//                                 miles : 329400,
//                                 yards : 329400
//                             },
//                             {
//                                 id : "047BV",
//                                 firstName : "Maura",
//                                 lastName : "Twomey",
//                                 age : "64",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "072M6",
//                                 firstName : "Jennifer",
//                                 lastName : "Wynn",
//                                 age : "59",
//                                 miles : 240000,
//                                 yards : 240000
//                             },
//                             {
//                                 id : "033KK",
//                                 firstName : "Liz",
//                                 lastName : "Adams",
//                                 age : "60",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "034U1",
//                                 firstName : "Steve",
//                                 lastName : "Delosh",
//                                 age : "65",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "060W2",
//                                 firstName : "Elizabeth",
//                                 lastName : "Mancuso",
//                                 age : "34",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "095YV",
//                                 firstName : "Daniel",
//                                 lastName : "Epstein",
//                                 age : "70",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "034VS",
//                                 firstName : "Jennifer",
//                                 lastName : "Downing",
//                                 age : "41",
//                                 miles : 515,
//                                 yards : 906400
//                             },
//                             {
//                                 id : "0AVCD",
//                                 firstName : "Jane",
//                                 lastName : "Schwechheimer",
//                                 age : "54",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01SAF",
//                                 firstName : "Merin",
//                                 lastName : "Troutman",
//                                 age : "47",
//                                 miles : 350,
//                                 yards : 616000
//                             },
//                             {
//                                 id : "0830W",
//                                 firstName : "Tiffany",
//                                 lastName : "McQueen",
//                                 age : "48",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06M9J",
//                                 firstName : "Dick",
//                                 lastName : "Wallace",
//                                 age : "78",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "W7GHV",
//                                 firstName : "William",
//                                 lastName : "Ritter",
//                                 age : "60",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "09FN8",
//                                 firstName : "Martha",
//                                 lastName : "Wood",
//                                 age : "58",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06M9S",
//                                 firstName : "Lorena",
//                                 lastName : "Pugh",
//                                 age : "63",
//                                 miles : 365000,
//                                 yards : 399168
//                             },
//                             {
//                                 id : "033S4",
//                                 firstName : "Sharleen",
//                                 lastName : "Goguen",
//                                 age : "63",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "03547",
//                                 firstName : "Jennifer",
//                                 lastName : "Brehob",
//                                 age : "62",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0063E",
//                                 firstName : "Daniel",
//                                 lastName : "Moran",
//                                 age : "38",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "096G1",
//                                 firstName : "Yin",
//                                 lastName : "Lu",
//                                 age : "59",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "679TZ",
//                                 firstName : "Vinka",
//                                 lastName : "Craver",
//                                 age : "45",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0AMN4",
//                                 firstName : "Debra",
//                                 lastName : "Brice",
//                                 age : "62",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "06PCA",
//                                 firstName : "Danielle",
//                                 lastName : "Bean",
//                                 age : "40",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "03373",
//                                 firstName : "Beth",
//                                 lastName : "Eggimann",
//                                 age : "59",
//                                 miles : 330,
//                                 yards : 580800
//                             },
//                             {
//                                 id : "0B9VP",
//                                 firstName : "Jason",
//                                 lastName : "Weis",
//                                 age : "24",
//                                 miles : 450,
//                                 yards : 792000
//                             },
//                             {
//                                 id : "S0UPY",
//                                 firstName : "Douglas",
//                                 lastName : "Sayles",
//                                 age : "53",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "07NHB",
//                                 firstName : "Jeff",
//                                 lastName : "Holmes",
//                                 age : "51",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "071D8",
//                                 firstName : "Cynthia",
//                                 lastName : "Needham",
//                                 age : "72",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "033AG",
//                                 firstName : "Denis",
//                                 lastName : "Desaulniers",
//                                 age : "70",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "033YM",
//                                 firstName : "Heather",
//                                 lastName : "Barna",
//                                 age : "49",
//                                 miles : 125,
//                                 yards : 220000
//                             },
//                             {
//                                 id : "05UC8",
//                                 firstName : "Margaret",
//                                 lastName : "Haskins",
//                                 age : "62",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "035P1",
//                                 firstName : "Sue-Ellen",
//                                 lastName : "Booher",
//                                 age : "67",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07JUN",
//                                 firstName : "Thomas",
//                                 lastName : "Burt",
//                                 age : "41",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0B02R",
//                                 firstName : "Christina",
//                                 lastName : "Hom",
//                                 age : "30",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06MR7",
//                                 firstName : "Nancy",
//                                 lastName : "Hutchins",
//                                 age : "53",
//                                 miles : 80,
//                                 yards : 140800
//                             },
//                             {
//                                 id : "033B9",
//                                 firstName : "Nancy",
//                                 lastName : "Tunstall",
//                                 age : "58",
//                                 miles : 520,
//                                 yards : 915200
//                             },
//                             {
//                                 id : "033Z4",
//                                 firstName : "Brian",
//                                 lastName : "McLaughlin",
//                                 age : "65",
//                                 miles : 569,
//                                 yards : 1001440
//                             },
//                             {
//                                 id : "035R1",
//                                 firstName : "John",
//                                 lastName : "Melczer",
//                                 age : "56",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "094HS",
//                                 firstName : "Kimberly",
//                                 lastName : "Kushner",
//                                 age : "48",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06HVF",
//                                 firstName : "Jenny",
//                                 lastName : "Rood",
//                                 age : "35",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "0391W",
//                                 firstName : "Hilary",
//                                 lastName : "Sullivan",
//                                 age : "40",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "7P4IM",
//                                 firstName : "Michael",
//                                 lastName : "Tyson",
//                                 age : "53",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "05UCX",
//                                 firstName : "CJ",
//                                 lastName : "Dickson",
//                                 age : "57",
//                                 miles : 220,
//                                 yards : 387200
//                             },
//                             {
//                                 id : "09HGU",
//                                 firstName : "Michael",
//                                 lastName : "LeClair",
//                                 age : "55",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "EKH20",
//                                 firstName : "Elaine",
//                                 lastName : "Howley",
//                                 age : "43",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "SAVED",
//                                 firstName : "Michael",
//                                 lastName : "Leake",
//                                 age : "42",
//                                 miles : 125,
//                                 yards : 220000
//                             },
//                             {
//                                 id : "05GYM",
//                                 firstName : "Susan",
//                                 lastName : "Hannel",
//                                 age : "57",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "07TSR",
//                                 firstName : "Alana",
//                                 lastName : "Aubin",
//                                 age : "30",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0342K",
//                                 firstName : "Dave",
//                                 lastName : "Welch",
//                                 age : "64",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "Z0E60",
//                                 firstName : "Elizabeth",
//                                 lastName : "Handen",
//                                 age : "25",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "046WN",
//                                 firstName : "Sue",
//                                 lastName : "Jensen",
//                                 age : "60",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "05HAY",
//                                 firstName : "Paul",
//                                 lastName : "Arsenault",
//                                 age : "59",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "07RCX",
//                                 firstName : "Seth",
//                                 lastName : "Grady",
//                                 age : "56",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "034GJ",
//                                 firstName : "Robert",
//                                 lastName : "Ouellette",
//                                 age : "65",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "500FR",
//                                 firstName : "Carl",
//                                 lastName : "Dearmin",
//                                 age : "57",
//                                 miles : 400,
//                                 yards : 704000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MESC",
//                         id : "020-004",
//                         name : "Maine Masters Swim Club",
//                         swimmers : 4,
//                         yards : 1170840,
//                         miles : 665.25,
//                         average : 166.3125,
//                         members : [
//                             {
//                                 id : "061UE",
//                                 firstName : "Derek",
//                                 lastName : "Cerjanec",
//                                 age : "69",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "XSEEU",
//                                 firstName : "Jen",
//                                 lastName : "Walker",
//                                 age : "50",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "05PUR",
//                                 firstName : "Kate",
//                                 lastName : "Beard-Tisdale",
//                                 age : "67",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0340N",
//                                 firstName : "Benjamin",
//                                 lastName : "Morse",
//                                 age : "48",
//                                 miles : 365.25,
//                                 yards : 642840
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "GBM",
//                         id : "020-003",
//                         name : "Great Bay Masters Swimming, Inc",
//                         swimmers : 2,
//                         yards : 211200,
//                         miles : 120,
//                         average : 60,
//                         members : [
//                             {
//                                 id : "033P8",
//                                 firstName : "Tara",
//                                 lastName : "Mack",
//                                 age : "48",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "033TX",
//                                 firstName : "Ann",
//                                 lastName : "Richard",
//                                 age : "61",
//                                 miles : 120,
//                                 yards : 211200
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "HOLY",
//                         id : "020-025",
//                         name : "Greater Holyoke YMCA Masters",
//                         swimmers : 1,
//                         yards : 176000,
//                         miles : 100,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "01SEC",
//                                 firstName : "Cathy",
//                                 lastName : "Machak",
//                                 age : "66",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SFD",
//                         id : "020-048",
//                         name : "Swim Free or Die",
//                         swimmers : 1,
//                         yards : 114400,
//                         miles : 65,
//                         average : 65,
//                         members : [
//                             {
//                                 id : "093RK",
//                                 firstName : "Elisabeth",
//                                 lastName : "Colacino",
//                                 age : "48",
//                                 miles : 65,
//                                 yards : 114400
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SWS",
//                         id : "020-018",
//                         name : "SweetWater Swim Studio",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "0AAR6",
//                                 firstName : "Amy",
//                                 lastName : "Morin",
//                                 age : "56",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "KYM",
//                         id : "020-042",
//                         name : "Kent Y Masters Swim Club",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "06WT1",
//                                 firstName : "Christina",
//                                 lastName : "Lorenson",
//                                 age : "48",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Connecticut",
//                 id : "5",
//                 swimmers : 11,
//                 miles : 2252,
//                 yards : 3963520,
//                 average : 204.72727272727272,
//                 clubs : [
//                     {
//                         abbreviation : "CPCT",
//                         id : "050-011",
//                         name : "Chelsea Piers Connecticut",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "06513",
//                                 firstName : "Aaron",
//                                 lastName : "Goldenberg",
//                                 age : "50",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CONN",
//                         id : "050-001",
//                         name : "Connecticut Masters",
//                         swimmers : 9,
//                         yards : 3567520,
//                         miles : 2027,
//                         average : 225.22222222222223,
//                         members : [
//                             {
//                                 id : "05T1Z",
//                                 firstName : "Wallace",
//                                 lastName : "Greene",
//                                 age : "63",
//                                 miles : 25,
//                                 yards : 44000
//                             },
//                             {
//                                 id : "01S8J",
//                                 firstName : "Lynne",
//                                 lastName : "Zareski",
//                                 age : "73",
//                                 miles : 225,
//                                 yards : 396000
//                             },
//                             {
//                                 id : "0AHNH",
//                                 firstName : "Thomas",
//                                 lastName : "St. Vincent",
//                                 age : "26",
//                                 miles : 266,
//                                 yards : 468160
//                             },
//                             {
//                                 id : "01SK2",
//                                 firstName : "Charles",
//                                 lastName : "Herrick",
//                                 age : "60",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "07Z28",
//                                 firstName : "Andrew",
//                                 lastName : "Feldman",
//                                 age : "59",
//                                 miles : 380,
//                                 yards : 668800
//                             },
//                             {
//                                 id : "0AX2H",
//                                 firstName : "Sarah",
//                                 lastName : "Vale",
//                                 age : "45",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07PPS",
//                                 firstName : "Stephen",
//                                 lastName : "Akers",
//                                 age : "49",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "0AN12",
//                                 firstName : "Serafina",
//                                 lastName : "Sumargo",
//                                 age : "40",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "074SN",
//                                 firstName : "Arthur",
//                                 lastName : "Gunzl",
//                                 age : "58",
//                                 miles : 366,
//                                 yards : 644160
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "WYMCA",
//                         id : "050-022",
//                         name : "Riverbrook Regional YMCA",
//                         swimmers : 1,
//                         yards : 396000,
//                         miles : 225,
//                         average : 225,
//                         members : [
//                             {
//                                 id : "VAV89",
//                                 firstName : "Clare",
//                                 lastName : "Rainone",
//                                 age : "40",
//                                 miles : 225,
//                                 yards : 396000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Virginia",
//                 id : "12",
//                 swimmers : 28,
//                 miles : 555600,
//                 yards : 10406000,
//                 average : 19842.85714285714,
//                 clubs : [
//                     {
//                         abbreviation : "SRVA",
//                         id : "120-049",
//                         name : "SwimRVA Hammerheads",
//                         swimmers : 2,
//                         yards : 440000,
//                         miles : 250,
//                         average : 125,
//                         members : [
//                             {
//                                 id : "06XAD",
//                                 firstName : "Richard",
//                                 lastName : "Stauffer",
//                                 age : "65",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "02J2Z",
//                                 firstName : "Alice",
//                                 lastName : "Phillips",
//                                 age : "55",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "VMST",
//                         id : "120-001",
//                         name : "Virginia Masters Swim Team",
//                         swimmers : 15,
//                         yards : 6864000,
//                         miles : 3900,
//                         average : 260,
//                         members : [
//                             {
//                                 id : "02HHP",
//                                 firstName : "Val",
//                                 lastName : "Van Horn Pate",
//                                 age : "58",
//                                 miles : 320,
//                                 yards : 563200
//                             },
//                             {
//                                 id : "02HJ6",
//                                 firstName : "Warner",
//                                 lastName : "Brundage",
//                                 age : "77",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "082XC",
//                                 firstName : "Chris",
//                                 lastName : "Nelson",
//                                 age : "49",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "0B1TH",
//                                 firstName : "Dianne",
//                                 lastName : "Cobb",
//                                 age : "65",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "02HSH",
//                                 firstName : "Edward",
//                                 lastName : "Gaulrapp",
//                                 age : "78",
//                                 miles : 75,
//                                 yards : 132000
//                             },
//                             {
//                                 id : "0B6NK",
//                                 firstName : "Sarah",
//                                 lastName : "Kucenas",
//                                 age : "41",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "086GT",
//                                 firstName : "Keith",
//                                 lastName : "Murray",
//                                 age : "62",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "WATER",
//                                 firstName : "Shirley",
//                                 lastName : "Loftus-Charley",
//                                 age : "69",
//                                 miles : 850,
//                                 yards : 1496000
//                             },
//                             {
//                                 id : "023UP",
//                                 firstName : "Rebecca",
//                                 lastName : "Latimer",
//                                 age : "38",
//                                 miles : 265,
//                                 yards : 466400
//                             },
//                             {
//                                 id : "05XR8",
//                                 firstName : "Nancy",
//                                 lastName : "Speer",
//                                 age : "58",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "05EZC",
//                                 firstName : "James",
//                                 lastName : "Wetzel",
//                                 age : "63",
//                                 miles : 600,
//                                 yards : 1056000
//                             },
//                             {
//                                 id : "02JKN",
//                                 firstName : "Todd",
//                                 lastName : "Bassett",
//                                 age : "56",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "046MW",
//                                 firstName : "Claire",
//                                 lastName : "Russo",
//                                 age : "37",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "074SY",
//                                 firstName : "Cheryl",
//                                 lastName : "Ptak",
//                                 age : "73",
//                                 miles : 25,
//                                 yards : 44000
//                             },
//                             {
//                                 id : "08BJ5",
//                                 firstName : "Kathleen",
//                                 lastName : "Doswell",
//                                 age : "71",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "NERD",
//                         id : "120-092",
//                         name : "SWIMNERD",
//                         swimmers : 1,
//                         yards : 176000,
//                         miles : 100,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "96CP0",
//                                 firstName : "Steven",
//                                 lastName : "Armstrong",
//                                 age : "58",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "FAFF",
//                         id : "120-026",
//                         name : "Fredricksburg American Family Fitness",
//                         swimmers : 1,
//                         yards : 176000,
//                         miles : 100,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "09P8J",
//                                 firstName : "Nancy",
//                                 lastName : "Ball",
//                                 age : "64",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "1693",
//                         id : "120-072",
//                         name : "Club Tribe",
//                         swimmers : 2,
//                         yards : 476000,
//                         miles : 300100,
//                         average : 150050,
//                         members : [
//                             {
//                                 id : "0938B",
//                                 firstName : "Nathan",
//                                 lastName : "Destree",
//                                 age : "29",
//                                 miles : 300000,
//                                 yards : 300000
//                             },
//                             {
//                                 id : "0376D",
//                                 firstName : "Michael",
//                                 lastName : "Webber",
//                                 age : "63",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "FAC",
//                         id : "120-029",
//                         name : "Freedom Aquatic Club",
//                         swimmers : 5,
//                         yards : 1482000,
//                         miles : 250700,
//                         average : 50140,
//                         members : [
//                             {
//                                 id : "0B4GG",
//                                 firstName : "KAP",
//                                 lastName : "RO",
//                                 age : "64",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "0B4GH",
//                                 firstName : "DUK",
//                                 lastName : "RO",
//                                 age : "61",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "0BAGB",
//                                 firstName : "Carol Lynn",
//                                 lastName : "Calobong-Pierce",
//                                 age : "63",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0AGCY",
//                                 firstName : "Terri",
//                                 lastName : "Cameron",
//                                 age : "56",
//                                 miles : 250000,
//                                 yards : 250000
//                             },
//                             {
//                                 id : "4XEZK",
//                                 firstName : "Valerie",
//                                 lastName : "Campbell",
//                                 age : "73",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "RCA",
//                         id : "120-007",
//                         name : "Rockbridge County Aquatics",
//                         swimmers : 1,
//                         yards : 352000,
//                         miles : 200,
//                         average : 200,
//                         members : [
//                             {
//                                 id : "02HZS",
//                                 firstName : "Patrick",
//                                 lastName : "Bradley",
//                                 age : "54",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "TIDE",
//                         id : "120-081",
//                         name : "Tide Swimming",
//                         swimmers : 1,
//                         yards : 440000,
//                         miles : 250,
//                         average : 250,
//                         members : [
//                             {
//                                 id : "02G8J",
//                                 firstName : "Harvey",
//                                 lastName : "Hill",
//                                 age : "66",
//                                 miles : 250,
//                                 yards : 440000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Maryland",
//                 id : "9",
//                 swimmers : 17,
//                 miles : 2524,
//                 yards : 4442240,
//                 average : 148.47058823529412,
//                 clubs : [
//                     {
//                         abbreviation : "MARY",
//                         id : "090-002",
//                         name : "Maryland Masters",
//                         swimmers : 7,
//                         yards : 1758240,
//                         miles : 999,
//                         average : 142.71428571428572,
//                         members : [
//                             {
//                                 id : "01VWK",
//                                 firstName : "Christopher",
//                                 lastName : "Stevens",
//                                 age : "59",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "F6YB6",
//                                 firstName : "Diane",
//                                 lastName : "Gubisch",
//                                 age : "54",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01V4E",
//                                 firstName : "Tess",
//                                 lastName : "Bloomquist",
//                                 age : "76",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0B2N5",
//                                 firstName : "Jim",
//                                 lastName : "Stafford",
//                                 age : "58",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01V9C",
//                                 firstName : "Christine",
//                                 lastName : "Jorgensen",
//                                 age : "75",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "03RH6",
//                                 firstName : "Michael",
//                                 lastName : "Brown",
//                                 age : "74",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "083YG",
//                                 firstName : "Hope Mao",
//                                 lastName : "Oehler",
//                                 age : "54",
//                                 miles : 399,
//                                 yards : 702240
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "LTMD",
//                         id : "090-049",
//                         name : "Life Time Swim Maryland",
//                         swimmers : 1,
//                         yards : 264000,
//                         miles : 150,
//                         average : 150,
//                         members : [
//                             {
//                                 id : "09AGJ",
//                                 firstName : "Laurie",
//                                 lastName : "Reuben",
//                                 age : "65",
//                                 miles : 150,
//                                 yards : 264000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "COLU",
//                         id : "090-006",
//                         name : "Columbia Masters Swim Team",
//                         swimmers : 4,
//                         yards : 1188000,
//                         miles : 675,
//                         average : 168.75,
//                         members : [
//                             {
//                                 id : "07T41",
//                                 firstName : "Sara",
//                                 lastName : "Smith",
//                                 age : "43",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "01VHP",
//                                 firstName : "Heather",
//                                 lastName : "Offenberg",
//                                 age : "56",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "01VJZ",
//                                 firstName : "Angela",
//                                 lastName : "Kozlowski",
//                                 age : "56",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01VR5",
//                                 firstName : "Roberta",
//                                 lastName : "Brown",
//                                 age : "56",
//                                 miles : 225,
//                                 yards : 396000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "PAX",
//                         id : "090-065",
//                         name : "PAX River Stingrays",
//                         swimmers : 1,
//                         yards : 352000,
//                         miles : 200,
//                         average : 200,
//                         members : [
//                             {
//                                 id : "UHA74",
//                                 firstName : "Megan",
//                                 lastName : "O'Connell",
//                                 age : "52",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "HUH",
//                         id : "090-030",
//                         name : "Health Unlimited Hurricanes",
//                         swimmers : 1,
//                         yards : 176000,
//                         miles : 100,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "GU656",
//                                 firstName : "Michele",
//                                 lastName : "Firlie",
//                                 age : "51",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "TCYS",
//                         id : "090-028",
//                         name : "Talbot Masters",
//                         swimmers : 2,
//                         yards : 704000,
//                         miles : 400,
//                         average : 200,
//                         members : [
//                             {
//                                 id : "073E2",
//                                 firstName : "Mary",
//                                 lastName : "Tillie",
//                                 age : "57",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "01JRC",
//                                 firstName : "Jennifer",
//                                 lastName : "Robinson",
//                                 age : "43",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MERR",
//                         id : "090-023",
//                         name : "Merritt Marlins",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "09SB0",
//                                 firstName : "Karen",
//                                 lastName : "Snow",
//                                 age : "61",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         id : "2",
//         name : "Dixie",
//         swimmers : 239,
//         miles : 5317022.5,
//         yards : 85194320,
//         average : 22246.956066945608,
//         lmscs : [
//             {
//                 name : "Florida Gold Coast",
//                 id : "50",
//                 swimmers : 32,
//                 miles : 307272,
//                 yards : 13098720,
//                 average : 9602.25,
//                 clubs : [
//                     {
//                         abbreviation : "GOLD",
//                         id : "500-001",
//                         name : "Gold Coast Masters",
//                         swimmers : 3,
//                         yards : 1936000,
//                         miles : 1100,
//                         average : 366.6666666666667,
//                         members : [
//                             {
//                                 id : "02EPK",
//                                 firstName : "Marianne",
//                                 lastName : "Porter",
//                                 age : "42",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "027K2",
//                                 firstName : "Bill",
//                                 lastName : "Korey",
//                                 age : "57",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "090WD",
//                                 firstName : "Stan",
//                                 lastName : "Marion",
//                                 age : "60",
//                                 miles : 400,
//                                 yards : 704000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "PBM",
//                         id : "500-035",
//                         name : "Palm Beach Masters",
//                         swimmers : 21,
//                         yards : 7922560,
//                         miles : 304331,
//                         average : 14491.952380952382,
//                         members : [
//                             {
//                                 id : "0A55G",
//                                 firstName : "Susan",
//                                 lastName : "Smith",
//                                 age : "56",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "027YV",
//                                 firstName : "Jo-Ann",
//                                 lastName : "Berry",
//                                 age : "63",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "099CG",
//                                 firstName : "Tamara",
//                                 lastName : "Burton",
//                                 age : "62",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "034NH",
//                                 firstName : "Lisa",
//                                 lastName : "Bongiovi",
//                                 age : "54",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "027ZE",
//                                 firstName : "Catherine",
//                                 lastName : "Choy",
//                                 age : "54",
//                                 miles : 130,
//                                 yards : 228800
//                             },
//                             {
//                                 id : "9CJCF",
//                                 firstName : "Erica",
//                                 lastName : "Herrera",
//                                 age : "19",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "5Z2CC",
//                                 firstName : "Jack",
//                                 lastName : "Ovadias",
//                                 age : "60",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01PH6",
//                                 firstName : "David",
//                                 lastName : "Quiggin",
//                                 age : "76",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "E3HM5",
//                                 firstName : "Carolynn",
//                                 lastName : "Foley",
//                                 age : "77",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "04420",
//                                 firstName : "Patrick",
//                                 lastName : "McMahon",
//                                 age : "66",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "08CXY",
//                                 firstName : "Suzanne",
//                                 lastName : "Mitchell",
//                                 age : "72",
//                                 miles : 175,
//                                 yards : 308000
//                             },
//                             {
//                                 id : "0AEWR",
//                                 firstName : "Quincy",
//                                 lastName : "Pearson",
//                                 age : "37",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "BAMA1",
//                                 firstName : "Ricardo",
//                                 lastName : "Valdivia",
//                                 age : "55",
//                                 miles : 300000,
//                                 yards : 300000
//                             },
//                             {
//                                 id : "CN0YG",
//                                 firstName : "Patricia",
//                                 lastName : "Sargeant",
//                                 age : "70",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02S1Z",
//                                 firstName : "Ed",
//                                 lastName : "Pritchard",
//                                 age : "64",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06MBR",
//                                 firstName : "Joan",
//                                 lastName : "Craffey",
//                                 age : "67",
//                                 miles : 600,
//                                 yards : 1056000
//                             },
//                             {
//                                 id : "09KU2",
//                                 firstName : "Edith",
//                                 lastName : "Di Francesco",
//                                 age : "57",
//                                 miles : 125,
//                                 yards : 220000
//                             },
//                             {
//                                 id : "01MDG",
//                                 firstName : "Mike",
//                                 lastName : "Taber",
//                                 age : "63",
//                                 miles : 321,
//                                 yards : 564960
//                             },
//                             {
//                                 id : "0B0PC",
//                                 firstName : "Heidi",
//                                 lastName : "Bettendorf",
//                                 age : "56",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "0212Z",
//                                 firstName : "Darcy",
//                                 lastName : "LaFountain",
//                                 age : "65",
//                                 miles : 715,
//                                 yards : 1258400
//                             },
//                             {
//                                 id : "09WV1",
//                                 firstName : "Mindy",
//                                 lastName : "Parsons",
//                                 age : "58",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SFTL",
//                         id : "500-044",
//                         name : "Swim Fort Lauderdale",
//                         swimmers : 2,
//                         yards : 616000,
//                         miles : 350,
//                         average : 175,
//                         members : [
//                             {
//                                 id : "028DC",
//                                 firstName : "Anita",
//                                 lastName : "Mitchell",
//                                 age : "70",
//                                 miles : 125,
//                                 yards : 220000
//                             },
//                             {
//                                 id : "05UCS",
//                                 firstName : "Sherie",
//                                 lastName : "Berk",
//                                 age : "67",
//                                 miles : 225,
//                                 yards : 396000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "HAFL",
//                         id : "500-065",
//                         name : "Hammerhead Aquatics",
//                         swimmers : 2,
//                         yards : 704000,
//                         miles : 400,
//                         average : 200,
//                         members : [
//                             {
//                                 id : "04PMH",
//                                 firstName : "Jose",
//                                 lastName : "Nunez",
//                                 age : "53",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02D6N",
//                                 firstName : "Dale",
//                                 lastName : "LeClair",
//                                 age : "51",
//                                 miles : 400,
//                                 yards : 704000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "WSC",
//                         id : "500-164",
//                         name : "Wellington Swim Club",
//                         swimmers : 2,
//                         yards : 616000,
//                         miles : 350,
//                         average : 175,
//                         members : [
//                             {
//                                 id : "089UX",
//                                 firstName : "Alicia",
//                                 lastName : "Geth",
//                                 age : "53",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "07ZM1",
//                                 firstName : "Ingrid",
//                                 lastName : "Bon",
//                                 age : "50",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "EA",
//                         id : "500-157",
//                         name : "Eagle Aquatics",
//                         swimmers : 1,
//                         yards : 644160,
//                         miles : 366,
//                         average : 366,
//                         members : [
//                             {
//                                 id : "037E1",
//                                 firstName : "Melissa",
//                                 lastName : "McCartney",
//                                 age : "42",
//                                 miles : 366,
//                                 yards : 644160
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "GRSC",
//                         id : "500-042",
//                         name : "Gulliver Swim Club",
//                         swimmers : 1,
//                         yards : 660000,
//                         miles : 375,
//                         average : 375,
//                         members : [
//                             {
//                                 id : "0279Z",
//                                 firstName : "John Jay",
//                                 lastName : "Miller",
//                                 age : "60",
//                                 miles : 375,
//                                 yards : 660000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Southeastern",
//                 id : "15",
//                 swimmers : 37,
//                 miles : 668895,
//                 yards : 9279200,
//                 average : 18078.243243243243,
//                 clubs : [
//                     {
//                         abbreviation : "LPM",
//                         id : "150-073",
//                         name : "Lake Providence Masters",
//                         swimmers : 11,
//                         yards : 827200,
//                         miles : 470,
//                         average : 42.72727272727273,
//                         members : [
//                             {
//                                 id : "08ECF",
//                                 firstName : "Deborah",
//                                 lastName : "Higdon",
//                                 age : "68",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0AYXX",
//                                 firstName : "Betty",
//                                 lastName : "Kamarad",
//                                 age : "68",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "0ARUB",
//                                 firstName : "Maurice",
//                                 lastName : "O'Connell",
//                                 age : "74",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "0B21C",
//                                 firstName : "Grace",
//                                 lastName : "Moran",
//                                 age : "65",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "0A6PU",
//                                 firstName : "Peggy",
//                                 lastName : "Dold",
//                                 age : "63",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "0A4KZ",
//                                 firstName : "Betty",
//                                 lastName : "Sanslow",
//                                 age : "89",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "08A4G",
//                                 firstName : "Carol",
//                                 lastName : "Sullivan",
//                                 age : "76",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "0B4W2",
//                                 firstName : "Marie",
//                                 lastName : "Reidelbach",
//                                 age : "70",
//                                 miles : 75,
//                                 yards : 132000
//                             },
//                             {
//                                 id : "035WP",
//                                 firstName : "Gloria",
//                                 lastName : "Beddow",
//                                 age : "72",
//                                 miles : 25,
//                                 yards : 44000
//                             },
//                             {
//                                 id : "09822",
//                                 firstName : "Debra",
//                                 lastName : "Baxter",
//                                 age : "64",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "ZEU6V",
//                                 firstName : "Patrick",
//                                 lastName : "Brooks",
//                                 age : "64",
//                                 miles : 20,
//                                 yards : 35200
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "901",
//                         id : "150-078",
//                         name : "Memphis Masters Swimming",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "095K6",
//                                 firstName : "Jeff",
//                                 lastName : "Tusant",
//                                 age : "49",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "NASH",
//                         id : "150-058",
//                         name : "Nashville Aquatic Club Masters",
//                         swimmers : 2,
//                         yards : 704000,
//                         miles : 400,
//                         average : 200,
//                         members : [
//                             {
//                                 id : "02HHH",
//                                 firstName : "Kelly",
//                                 lastName : "Riedinger",
//                                 age : "41",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "09DS6",
//                                 firstName : "Marie",
//                                 lastName : "Berry",
//                                 age : "49",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "GCPS",
//                         id : "150-027",
//                         name : "Gulf Coast Pirate Swimmers",
//                         swimmers : 3,
//                         yards : 1760000,
//                         miles : 1000,
//                         average : 333.3333333333333,
//                         members : [
//                             {
//                                 id : "02135",
//                                 firstName : "Bill",
//                                 lastName : "Evans",
//                                 age : "69",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "0816T",
//                                 firstName : "Jennipher",
//                                 lastName : "Scoggins",
//                                 age : "47",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "0211U",
//                                 firstName : "Sally",
//                                 lastName : "Menk",
//                                 age : "82",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "PPSL",
//                         id : "150-063",
//                         name : "Prattville Prehistoric Sea Lions",
//                         swimmers : 1,
//                         yards : 264000,
//                         miles : 264000,
//                         average : 264000,
//                         members : [
//                             {
//                                 id : "0312T",
//                                 firstName : "Doug",
//                                 lastName : "Watkins",
//                                 age : "60",
//                                 miles : 264000,
//                                 yards : 264000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "AMS",
//                         id : "150-024",
//                         name : "Auburn Master Swimmers",
//                         swimmers : 3,
//                         yards : 440000,
//                         miles : 250,
//                         average : 83.33333333333333,
//                         members : [
//                             {
//                                 id : "0B7ME",
//                                 firstName : "Taylor",
//                                 lastName : "Towns",
//                                 age : "34",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "DG3MB",
//                                 firstName : "Michelle",
//                                 lastName : "Ellwanger",
//                                 age : "26",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "037FA",
//                                 firstName : "James",
//                                 lastName : "McDonald",
//                                 age : "71",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "OLD1",
//                         id : "150-090",
//                         name : "Okaloosa's Liquid Dragons",
//                         swimmers : 3,
//                         yards : 1100000,
//                         miles : 625,
//                         average : 208.33333333333334,
//                         members : [
//                             {
//                                 id : "01ZSR",
//                                 firstName : "Melanie",
//                                 lastName : "Sellers",
//                                 age : "68",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "09GU3",
//                                 firstName : "Lisa",
//                                 lastName : "Parchment",
//                                 age : "61",
//                                 miles : 375,
//                                 yards : 660000
//                             },
//                             {
//                                 id : "02TTY",
//                                 firstName : "Paul",
//                                 lastName : "Kellum",
//                                 age : "76",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MTSC",
//                         id : "150-026",
//                         name : "Middle TN Masters Swim Club",
//                         swimmers : 1,
//                         yards : 264000,
//                         miles : 150,
//                         average : 150,
//                         members : [
//                             {
//                                 id : "0215S",
//                                 firstName : "Roger",
//                                 lastName : "Lancina",
//                                 age : "79",
//                                 miles : 150,
//                                 yards : 264000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "TNAQ",
//                         id : "150-004",
//                         name : "Tennessee Aquatics Masters Swimming",
//                         swimmers : 1,
//                         yards : 176000,
//                         miles : 100,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "0216Y",
//                                 firstName : "Susan",
//                                 lastName : "Elmore",
//                                 age : "66",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "KOWS",
//                         id : "150-112",
//                         name : "Knoxville Open Water Swimmers",
//                         swimmers : 1,
//                         yards : 880000,
//                         miles : 500,
//                         average : 500,
//                         members : [
//                             {
//                                 id : "0232M",
//                                 firstName : "Robin",
//                                 lastName : "Batchelor",
//                                 age : "63",
//                                 miles : 500,
//                                 yards : 880000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "ENSW",
//                         id : "150-074",
//                         name : "Ensworth Aquatics Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "021CG",
//                                 firstName : "James",
//                                 lastName : "Johnson",
//                                 age : "53",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "EXCL",
//                         id : "150-022",
//                         name : "Excel Aquatics Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "04426",
//                                 firstName : "Mike",
//                                 lastName : "Harry",
//                                 age : "62",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "KAC",
//                         id : "150-086",
//                         name : "Kingsport Aquatic Center",
//                         swimmers : 1,
//                         yards : 352000,
//                         miles : 200,
//                         average : 200,
//                         members : [
//                             {
//                                 id : "07N62",
//                                 firstName : "Justin",
//                                 lastName : "Mann",
//                                 age : "47",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CTMS",
//                         id : "150-044",
//                         name : "Crimson Tide Masters Swimming",
//                         swimmers : 1,
//                         yards : 400000,
//                         miles : 400000,
//                         average : 400000,
//                         members : [
//                             {
//                                 id : "083W0",
//                                 firstName : "Lin",
//                                 lastName : "Moore",
//                                 age : "60",
//                                 miles : 400000,
//                                 yards : 400000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "ATMS",
//                         id : "150-054",
//                         name : "About Time Masters Swimming",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "06JHW",
//                                 firstName : "Arnold",
//                                 lastName : "Caylor",
//                                 age : "67",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "PCST",
//                         id : "150-067",
//                         name : "Panama City Swim Team",
//                         swimmers : 1,
//                         yards : 968000,
//                         miles : 550,
//                         average : 550,
//                         members : [
//                             {
//                                 id : "07Z7X",
//                                 firstName : "Allison",
//                                 lastName : "Jinks",
//                                 age : "37",
//                                 miles : 550,
//                                 yards : 968000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MATT",
//                         id : "150-025",
//                         name : "Madison Titans",
//                         swimmers : 1,
//                         yards : 880000,
//                         miles : 500,
//                         average : 500,
//                         members : [
//                             {
//                                 id : "020ZV",
//                                 firstName : "David",
//                                 lastName : "Milburn",
//                                 age : "59",
//                                 miles : 500,
//                                 yards : 880000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "YCHA",
//                         id : "150-072",
//                         name : "YMCA Chattanooga Masters Swim Club",
//                         swimmers : 1,
//                         yards : 88000,
//                         miles : 50,
//                         average : 50,
//                         members : [
//                             {
//                                 id : "06UP0",
//                                 firstName : "Anne",
//                                 lastName : "Hendrix",
//                                 age : "58",
//                                 miles : 50,
//                                 yards : 88000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "LTSE",
//                         id : "150-079",
//                         name : "Life Time Swim Southeast",
//                         swimmers : 2,
//                         yards : 176000,
//                         miles : 100,
//                         average : 50,
//                         members : [
//                             {
//                                 id : "02100",
//                                 firstName : "Utley",
//                                 lastName : "Noble",
//                                 age : "57",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "D2VVR",
//                                 firstName : "Lynda",
//                                 lastName : "Rotter",
//                                 age : "69",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "North Carolina",
//                 id : "13",
//                 swimmers : 40,
//                 miles : 8496,
//                 yards : 14952960,
//                 average : 212.4,
//                 clubs : [
//                     {
//                         abbreviation : "NCMS",
//                         id : "130-001",
//                         name : "North Carolina Masters Swimming",
//                         swimmers : 39,
//                         yards : 14952960,
//                         miles : 8496,
//                         average : 217.84615384615384,
//                         members : [
//                             {
//                                 id : "D9BN6",
//                                 firstName : "Harold",
//                                 lastName : "Yount",
//                                 age : "53",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "070HY",
//                                 firstName : "Rebecca",
//                                 lastName : "Jones",
//                                 age : "52",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "022YV",
//                                 firstName : "Heidi",
//                                 lastName : "Williams",
//                                 age : "51",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0240A",
//                                 firstName : "Larry",
//                                 lastName : "Hartley",
//                                 age : "60",
//                                 miles : 366,
//                                 yards : 644160
//                             },
//                             {
//                                 id : "073JP",
//                                 firstName : "Sue",
//                                 lastName : "Perryman",
//                                 age : "76",
//                                 miles : 315,
//                                 yards : 554400
//                             },
//                             {
//                                 id : "070HZ",
//                                 firstName : "Milt",
//                                 lastName : "Jones",
//                                 age : "55",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "022ZR",
//                                 firstName : "James",
//                                 lastName : "Green",
//                                 age : "76",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "05SUV",
//                                 firstName : "Mark",
//                                 lastName : "Savoldi",
//                                 age : "54",
//                                 miles : 165,
//                                 yards : 290400
//                             },
//                             {
//                                 id : "06BAE",
//                                 firstName : "Mary Anne",
//                                 lastName : "Savage",
//                                 age : "60",
//                                 miles : 550,
//                                 yards : 968000
//                             },
//                             {
//                                 id : "070MN",
//                                 firstName : "Mark",
//                                 lastName : "Rubacky",
//                                 age : "51",
//                                 miles : 650,
//                                 yards : 1144000
//                             },
//                             {
//                                 id : "B1XT9",
//                                 firstName : "Yvette",
//                                 lastName : "Deese",
//                                 age : "53",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "02343",
//                                 firstName : "Stan",
//                                 lastName : "Cox",
//                                 age : "64",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07Y1S",
//                                 firstName : "Steph",
//                                 lastName : "Dunstan",
//                                 age : "36",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "0B8J8",
//                                 firstName : "Daniel",
//                                 lastName : "Kuchta",
//                                 age : "42",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "0236T",
//                                 firstName : "Richard",
//                                 lastName : "Miller",
//                                 age : "66",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "07YUC",
//                                 firstName : "David",
//                                 lastName : "Ruff",
//                                 age : "60",
//                                 miles : 284,
//                                 yards : 499840
//                             },
//                             {
//                                 id : "01PH9",
//                                 firstName : "Gerald",
//                                 lastName : "Meyer",
//                                 age : "76",
//                                 miles : 180,
//                                 yards : 316800
//                             },
//                             {
//                                 id : "06W4X",
//                                 firstName : "Kathleen",
//                                 lastName : "Pelczynski",
//                                 age : "35",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06XXC",
//                                 firstName : "Jennifer",
//                                 lastName : "Beiring",
//                                 age : "44",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "07AHK",
//                                 firstName : "Steven",
//                                 lastName : "Moore",
//                                 age : "48",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "XYFCK",
//                                 firstName : "Nancy",
//                                 lastName : "Thomason",
//                                 age : "69",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0AAD7",
//                                 firstName : "Caroline",
//                                 lastName : "Rogers",
//                                 age : "40",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0B9T3",
//                                 firstName : "Teresa",
//                                 lastName : "Bazzle",
//                                 age : "64",
//                                 miles : 125,
//                                 yards : 220000
//                             },
//                             {
//                                 id : "01GYG",
//                                 firstName : "Cheryl",
//                                 lastName : "Murray",
//                                 age : "68",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "0445F",
//                                 firstName : "Paul",
//                                 lastName : "Denison",
//                                 age : "63",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0223B",
//                                 firstName : "Michael",
//                                 lastName : "Beachler",
//                                 age : "69",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "02DZP",
//                                 firstName : "Dale",
//                                 lastName : "Alton",
//                                 age : "63",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "023FW",
//                                 firstName : "Richard",
//                                 lastName : "Bober",
//                                 age : "69",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "035EN",
//                                 firstName : "SONNY",
//                                 lastName : "NGUYEN",
//                                 age : "41",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "0A4X3",
//                                 firstName : "Meghan",
//                                 lastName : "Kruse",
//                                 age : "38",
//                                 miles : 450,
//                                 yards : 792000
//                             },
//                             {
//                                 id : "0776F",
//                                 firstName : "Henry",
//                                 lastName : "Singletary",
//                                 age : "59",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02Y31",
//                                 firstName : "Martha",
//                                 lastName : "Katzeff",
//                                 age : "68",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "05R21",
//                                 firstName : "Gregory",
//                                 lastName : "Cook",
//                                 age : "58",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "023WP",
//                                 firstName : "Abee",
//                                 lastName : "Boyles",
//                                 age : "44",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "0BA53",
//                                 firstName : "Catherine",
//                                 lastName : "Petrusz",
//                                 age : "47",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "06JVG",
//                                 firstName : "Diane",
//                                 lastName : "Byers",
//                                 age : "71",
//                                 miles : 96,
//                                 yards : 168960
//                             },
//                             {
//                                 id : "09S14",
//                                 firstName : "Amanda",
//                                 lastName : "Law",
//                                 age : "45",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "G0BY3",
//                                 firstName : "Dana",
//                                 lastName : "Greene",
//                                 age : "51",
//                                 miles : 700,
//                                 yards : 1232000
//                             },
//                             {
//                                 id : "022XN",
//                                 firstName : "Jeff",
//                                 lastName : "Weller",
//                                 age : "60",
//                                 miles : 300,
//                                 yards : 528000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MMCLT",
//                         id : "130-034",
//                         name : "Mahogany Mermaids Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "4VJA3",
//                                 firstName : "Dionne",
//                                 lastName : "Fleshman",
//                                 age : "48",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Georgia",
//                 id : "45",
//                 swimmers : 45,
//                 miles : 135650,
//                 yards : 18869000,
//                 average : 3014.4444444444443,
//                 clubs : [
//                     {
//                         abbreviation : "GAJA",
//                         id : "450-004",
//                         name : "Georgia Masters",
//                         swimmers : 28,
//                         yards : 15208200,
//                         miles : 133570,
//                         average : 4770.357142857143,
//                         members : [
//                             {
//                                 id : "06EX6",
//                                 firstName : "Andy",
//                                 lastName : "Klenzak",
//                                 age : "54",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02DCE",
//                                 firstName : "John",
//                                 lastName : "Zeigler",
//                                 age : "74",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07HZ8",
//                                 firstName : "Celine",
//                                 lastName : "Cabana",
//                                 age : "51",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "09T6J",
//                                 firstName : "Barbara",
//                                 lastName : "Ingold",
//                                 age : "61",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "02DD5",
//                                 firstName : "Robert",
//                                 lastName : "Lance",
//                                 age : "64",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "005FP",
//                                 firstName : "Joseph",
//                                 lastName : "Sebestyen",
//                                 age : "48",
//                                 miles : 85,
//                                 yards : 149600
//                             },
//                             {
//                                 id : "02DF3",
//                                 firstName : "Joe",
//                                 lastName : "Hutto",
//                                 age : "69",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "00262",
//                                 firstName : "Matthew",
//                                 lastName : "Mills",
//                                 age : "43",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "03U4H",
//                                 firstName : "Sarah",
//                                 lastName : "Chinn",
//                                 age : "36",
//                                 miles : 450,
//                                 yards : 792000
//                             },
//                             {
//                                 id : "085TS",
//                                 firstName : "Elizabeth",
//                                 lastName : "Elco",
//                                 age : "31",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "02DRS",
//                                 firstName : "Claire",
//                                 lastName : "Bacon",
//                                 age : "47",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "072V6",
//                                 firstName : "Carol",
//                                 lastName : "Cunningham",
//                                 age : "63",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "FCFB0",
//                                 firstName : "Courtney",
//                                 lastName : "Hoffman",
//                                 age : "45",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "0631D",
//                                 firstName : "Melissa",
//                                 lastName : "Massey",
//                                 age : "39",
//                                 miles : 2020,
//                                 yards : 3555200
//                             },
//                             {
//                                 id : "02D64",
//                                 firstName : "Lisa",
//                                 lastName : "Watson",
//                                 age : "66",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0ATWP",
//                                 firstName : "Jackie",
//                                 lastName : "Kendinger",
//                                 age : "59",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "02EA2",
//                                 firstName : "Pam",
//                                 lastName : "McClure",
//                                 age : "57",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "YFV5V",
//                                 firstName : "Bethany",
//                                 lastName : "Mobley",
//                                 age : "40",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "07KU8",
//                                 firstName : "Mike",
//                                 lastName : "Stille",
//                                 age : "60",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06GSF",
//                                 firstName : "Douglas",
//                                 lastName : "Michalke",
//                                 age : "67",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "02D65",
//                                 firstName : "Bill",
//                                 lastName : "Lotz",
//                                 age : "71",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "02EJC",
//                                 firstName : "Herb",
//                                 lastName : "Chuven",
//                                 age : "81",
//                                 miles : 125000,
//                                 yards : 125000
//                             },
//                             {
//                                 id : "02D67",
//                                 firstName : "Condit",
//                                 lastName : "Lotz",
//                                 age : "72",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "0AN9S",
//                                 firstName : "Stephanie",
//                                 lastName : "Lemmons",
//                                 age : "29",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "PSUCG",
//                                 firstName : "Chris",
//                                 lastName : "Greene",
//                                 age : "58",
//                                 miles : 2000,
//                                 yards : 3520000
//                             },
//                             {
//                                 id : "0B442",
//                                 firstName : "Elizabeth",
//                                 lastName : "Gieseking",
//                                 age : "54",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "02D8A",
//                                 firstName : "Catherine",
//                                 lastName : "Lavery",
//                                 age : "61",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "02DBS",
//                                 firstName : "Cathy",
//                                 lastName : "Jones",
//                                 age : "49",
//                                 miles : 300,
//                                 yards : 528000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "KSUM",
//                         id : "450-078",
//                         name : "Kennesaw State University Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "XGUG6",
//                                 firstName : "Katie",
//                                 lastName : "Hopkins",
//                                 age : "20",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "ART",
//                         id : "450-019",
//                         name : "Atlanta Rainbow Trout",
//                         swimmers : 2,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "01ZTP",
//                                 firstName : "Maureen",
//                                 lastName : "Wakeland",
//                                 age : "62",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "04ED1",
//                                 firstName : "Lawrence",
//                                 lastName : "Golusinski",
//                                 age : "56",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "HURM",
//                         id : "450-028",
//                         name : "Columbus Aquatic Club",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "9CMUC",
//                                 firstName : "Amy",
//                                 lastName : "Harkness",
//                                 age : "54",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "AWJ",
//                         id : "450-002",
//                         name : "Atlanta Water Jocks",
//                         swimmers : 8,
//                         yards : 2516800,
//                         miles : 1430,
//                         average : 178.75,
//                         members : [
//                             {
//                                 id : "06RMN",
//                                 firstName : "Elaine",
//                                 lastName : "Krugman",
//                                 age : "58",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "0675J",
//                                 firstName : "Jennifer",
//                                 lastName : "Almand",
//                                 age : "62",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "GRACE",
//                                 firstName : "Malena",
//                                 lastName : "Hankins",
//                                 age : "47",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "04EE5",
//                                 firstName : "James",
//                                 lastName : "Breen",
//                                 age : "59",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06YDK",
//                                 firstName : "Marianne",
//                                 lastName : "Countryman",
//                                 age : "56",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06PZC",
//                                 firstName : "Mark",
//                                 lastName : "Rogers",
//                                 age : "55",
//                                 miles : 330,
//                                 yards : 580800
//                             },
//                             {
//                                 id : "05ETU",
//                                 firstName : "Heidi",
//                                 lastName : "Natkin",
//                                 age : "46",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "07B6S",
//                                 firstName : "Britta",
//                                 lastName : "O'Leary",
//                                 age : "36",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "NAUT",
//                         id : "450-044",
//                         name : "Nautical Milers Special Needs Swim Team",
//                         swimmers : 2,
//                         yards : 880000,
//                         miles : 500,
//                         average : 250,
//                         members : [
//                             {
//                                 id : "FP4AY",
//                                 firstName : "Anna",
//                                 lastName : "Beem",
//                                 age : "24",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "08AZP",
//                                 firstName : "Matt",
//                                 lastName : "Jones",
//                                 age : "29",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SAMC",
//                         id : "450-063",
//                         name : "Spartans Aquatic Masters Club",
//                         swimmers : 1,
//                         yards : 264000,
//                         miles : 150,
//                         average : 150,
//                         members : [
//                             {
//                                 id : "AB83B",
//                                 firstName : "Brian",
//                                 lastName : "Jernigan",
//                                 age : "61",
//                                 miles : 150,
//                                 yards : 264000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "WHA",
//                         id : "450-029",
//                         name : "Windy Hill Athletic Club Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "02VK0",
//                                 firstName : "Lisa",
//                                 lastName : "Jassin",
//                                 age : "58",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SG",
//                         id : "450-076",
//                         name : "Swim Gainesville ",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "BVTCS",
//                                 firstName : "Ellen",
//                                 lastName : "Goodman",
//                                 age : "32",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Florida",
//                 id : "14",
//                 swimmers : 53,
//                 miles : 1943779.5,
//                 yards : 19406480,
//                 average : 36675.08490566038,
//                 clubs : [
//                     {
//                         abbreviation : "YCFM",
//                         id : "140-074",
//                         name : "Central Florida Y Masters",
//                         swimmers : 3,
//                         yards : 1012000,
//                         miles : 575,
//                         average : 191.66666666666666,
//                         members : [
//                             {
//                                 id : "0086P",
//                                 firstName : "Andy",
//                                 lastName : "Kroupa",
//                                 age : "51",
//                                 miles : 175,
//                                 yards : 308000
//                             },
//                             {
//                                 id : "07MXE",
//                                 firstName : "Rose",
//                                 lastName : "Mayfield",
//                                 age : "65",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "XEKC0",
//                                 firstName : "Cory",
//                                 lastName : "Trusty",
//                                 age : "44",
//                                 miles : 300,
//                                 yards : 528000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SHARK",
//                         id : "140-013",
//                         name : "Sarasota Sharks Masters",
//                         swimmers : 15,
//                         yards : 6767200,
//                         miles : 3845,
//                         average : 256.3333333333333,
//                         members : [
//                             {
//                                 id : "078MC",
//                                 firstName : "Jonathan",
//                                 lastName : "Eckert",
//                                 age : "34",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "09N4W",
//                                 firstName : "Albert",
//                                 lastName : "Miller",
//                                 age : "78",
//                                 miles : 55,
//                                 yards : 96800
//                             },
//                             {
//                                 id : "06J2S",
//                                 firstName : "Russ",
//                                 lastName : "Gill",
//                                 age : "73",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "02RT6",
//                                 firstName : "Thomas",
//                                 lastName : "Schwartz",
//                                 age : "60",
//                                 miles : 1200,
//                                 yards : 2112000
//                             },
//                             {
//                                 id : "01S73",
//                                 firstName : "Karen",
//                                 lastName : "Einsidler",
//                                 age : "64",
//                                 miles : 695,
//                                 yards : 1223200
//                             },
//                             {
//                                 id : "0B67R",
//                                 firstName : "Jo-Ann",
//                                 lastName : "Elo",
//                                 age : "59",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "08FHJ",
//                                 firstName : "Onshalee",
//                                 lastName : "Promchitmart",
//                                 age : "28",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02X8P",
//                                 firstName : "Roger",
//                                 lastName : "Kahn",
//                                 age : "65",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02DG8",
//                                 firstName : "Bob",
//                                 lastName : "Couch",
//                                 age : "73",
//                                 miles : 240,
//                                 yards : 422400
//                             },
//                             {
//                                 id : "0A9UE",
//                                 firstName : "Dawna",
//                                 lastName : "ONeal",
//                                 age : "72",
//                                 miles : 25,
//                                 yards : 44000
//                             },
//                             {
//                                 id : "02UR0",
//                                 firstName : "Michael",
//                                 lastName : "Bergquist",
//                                 age : "64",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "083F4",
//                                 firstName : "Jan",
//                                 lastName : "Miller",
//                                 age : "77",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "07ZAH",
//                                 firstName : "Sharon",
//                                 lastName : "Danzger",
//                                 age : "54",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "02RDM",
//                                 firstName : "Patricia",
//                                 lastName : "Bond",
//                                 age : "82",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "GAT0R",
//                                 firstName : "Kyle",
//                                 lastName : "Deery",
//                                 age : "",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "T2NM",
//                         id : "140-090",
//                         name : "T2 Naples Masters",
//                         swimmers : 3,
//                         yards : 1892000,
//                         miles : 1075,
//                         average : 358.3333333333333,
//                         members : [
//                             {
//                                 id : "07MKC",
//                                 firstName : "Jeffrey",
//                                 lastName : "Cahill",
//                                 age : "63",
//                                 miles : 350,
//                                 yards : 616000
//                             },
//                             {
//                                 id : "05E85",
//                                 firstName : "Debra",
//                                 lastName : "Orringer",
//                                 age : "48",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "07WDE",
//                                 firstName : "Bill",
//                                 lastName : "Hollowsky",
//                                 age : "57",
//                                 miles : 225,
//                                 yards : 396000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MELB",
//                         id : "140-175",
//                         name : "Swim Melbourne Masters",
//                         swimmers : 1,
//                         yards : 6160,
//                         miles : 3.5,
//                         average : 3.5,
//                         members : [
//                             {
//                                 id : "07ZVU",
//                                 firstName : "Karen",
//                                 lastName : "Holloway-Adkins",
//                                 age : "58",
//                                 miles : 3.5,
//                                 yards : 6160
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "FACT",
//                         id : "140-010",
//                         name : "Florida Aquatic Combined Team",
//                         swimmers : 7,
//                         yards : 1320000,
//                         miles : 750,
//                         average : 107.14285714285714,
//                         members : [
//                             {
//                                 id : "02RKG",
//                                 firstName : "Rolland",
//                                 lastName : "Fulton",
//                                 age : "66",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07DHT",
//                                 firstName : "Pameladell",
//                                 lastName : "Hillestad",
//                                 age : "58",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "080HN",
//                                 firstName : "Heather",
//                                 lastName : "Farnell",
//                                 age : "68",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "005Y8",
//                                 firstName : "Barbara",
//                                 lastName : "McNulty",
//                                 age : "63",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "U8BC9",
//                                 firstName : "Dale",
//                                 lastName : "Charrette",
//                                 age : "63",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07HBY",
//                                 firstName : "Paula",
//                                 lastName : "Cunio",
//                                 age : "59",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "0B7AE",
//                                 firstName : "William",
//                                 lastName : "Vayens",
//                                 age : "70",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SPCO",
//                         id : "140-031",
//                         name : "Space Coast Masters",
//                         swimmers : 3,
//                         yards : 704000,
//                         miles : 400,
//                         average : 133.33333333333334,
//                         members : [
//                             {
//                                 id : "001CA",
//                                 firstName : "Carl",
//                                 lastName : "Ellefson",
//                                 age : "46",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02RUB",
//                                 firstName : "Peter",
//                                 lastName : "Turner",
//                                 age : "61",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02U3C",
//                                 firstName : "Donald",
//                                 lastName : "Gornto",
//                                 age : "49",
//                                 miles : 400,
//                                 yards : 704000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SWAG",
//                         id : "140-166",
//                         name : "Swamp Water Aquatics Gainesville",
//                         swimmers : 1,
//                         yards : 1760000,
//                         miles : 1000,
//                         average : 1000,
//                         members : [
//                             {
//                                 id : "079T8",
//                                 firstName : "Patricia",
//                                 lastName : "Funk",
//                                 age : "70",
//                                 miles : 1000,
//                                 yards : 1760000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SLAP",
//                         id : "140-110",
//                         name : "Swim Like A Pro",
//                         swimmers : 1,
//                         yards : 176000,
//                         miles : 100,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "05VZX",
//                                 firstName : "Sean",
//                                 lastName : "McClean",
//                                 age : "51",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CAM",
//                         id : "140-115",
//                         name : "Clearwater Aquatic Masters",
//                         swimmers : 4,
//                         yards : 1056000,
//                         miles : 600,
//                         average : 150,
//                         members : [
//                             {
//                                 id : "02S00",
//                                 firstName : "Daniel",
//                                 lastName : "Jenkins",
//                                 age : "76",
//                                 miles : 350,
//                                 yards : 616000
//                             },
//                             {
//                                 id : "09PVC",
//                                 firstName : "Hugh",
//                                 lastName : "Brown",
//                                 age : "70",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "GPAG8",
//                                 firstName : "Jennifer",
//                                 lastName : "Wixon",
//                                 age : "42",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "04S0K",
//                                 firstName : "JoAnn",
//                                 lastName : "Fuller",
//                                 age : "77",
//                                 miles : 250,
//                                 yards : 440000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SRQM",
//                         id : "140-105",
//                         name : "Sarasota Tsunami Masters",
//                         swimmers : 3,
//                         yards : 720000,
//                         miles : 500125,
//                         average : 166708.33333333334,
//                         members : [
//                             {
//                                 id : "09U60",
//                                 firstName : "Mark",
//                                 lastName : "Usher",
//                                 age : "67",
//                                 miles : 500000,
//                                 yards : 500000
//                             },
//                             {
//                                 id : "KT2JH",
//                                 firstName : "Jay",
//                                 lastName : "Place",
//                                 age : "48",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0AB3Y",
//                                 firstName : "Dawson",
//                                 lastName : "Hughes",
//                                 age : "43",
//                                 miles : 125,
//                                 yards : 220000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "USN",
//                         id : "140-124",
//                         name : "Mayport Hurricanes",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "RRU9K",
//                                 firstName : "Paul",
//                                 lastName : "Martin",
//                                 age : "63",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "WIN",
//                         id : "140-008",
//                         name : "Winter Haven Masters Swim Team",
//                         swimmers : 2,
//                         yards : 1408000,
//                         miles : 322469,
//                         average : 161234.5,
//                         members : [
//                             {
//                                 id : "06Y08",
//                                 firstName : "Kenneth",
//                                 lastName : "Sweigart",
//                                 age : "69",
//                                 miles : 600,
//                                 yards : 1056000
//                             },
//                             {
//                                 id : "07FDN",
//                                 firstName : "Michael",
//                                 lastName : "Zahn",
//                                 age : "73",
//                                 miles : 321869,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "TTM",
//                         id : "140-012",
//                         name : "Tampa Tarpons Masters",
//                         swimmers : 1,
//                         yards : 390720,
//                         miles : 222,
//                         average : 222,
//                         members : [
//                             {
//                                 id : "02S7A",
//                                 firstName : "Mandy",
//                                 lastName : "Zipf",
//                                 age : "55",
//                                 miles : 222,
//                                 yards : 390720
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SFYH",
//                         id : "140-185",
//                         name : "SKY Family YMCA",
//                         swimmers : 2,
//                         yards : 500000,
//                         miles : 500000,
//                         average : 250000,
//                         members : [
//                             {
//                                 id : "06JFK",
//                                 firstName : "Gerry",
//                                 lastName : "Chojnowski",
//                                 age : "71",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07T83",
//                                 firstName : "Peter",
//                                 lastName : "Boers",
//                                 age : "57",
//                                 miles : 500000,
//                                 yards : 500000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "BMS",
//                         id : "140-150",
//                         name : "Manatee Master swim club",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "02SEH",
//                                 firstName : "Thomas",
//                                 lastName : "Dougherty",
//                                 age : "62",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "TBAM",
//                         id : "140-079",
//                         name : "Tampa Bay Aquatic Masters",
//                         swimmers : 2,
//                         yards : 942400,
//                         miles : 300365,
//                         average : 150182.5,
//                         members : [
//                             {
//                                 id : "EH2ZU",
//                                 firstName : "John",
//                                 lastName : "Harris",
//                                 age : "57",
//                                 miles : 300000,
//                                 yards : 300000
//                             },
//                             {
//                                 id : "04RW8",
//                                 firstName : "Andrew",
//                                 lastName : "Lutton",
//                                 age : "56",
//                                 miles : 365,
//                                 yards : 642400
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "HLJ",
//                         id : "140-011",
//                         name : "Holmes Lumber Jax",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "02SJ3",
//                                 firstName : "Hal",
//                                 lastName : "Gilreath",
//                                 age : "58",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "FLA",
//                         id : "140-006",
//                         name : "Florida League Of Aquatics",
//                         swimmers : 1,
//                         yards : 440000,
//                         miles : 250,
//                         average : 250,
//                         members : [
//                             {
//                                 id : "04RZ8",
//                                 firstName : "Kevin",
//                                 lastName : "Bloom",
//                                 age : "67",
//                                 miles : 250,
//                                 yards : 440000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "BDO",
//                         id : "140-078",
//                         name : "Blue Dolfins Masters",
//                         swimmers : 1,
//                         yards : 312000,
//                         miles : 312000,
//                         average : 312000,
//                         members : [
//                             {
//                                 id : "06HW7",
//                                 firstName : "Bernardo",
//                                 lastName : "Campesino",
//                                 age : "50",
//                                 miles : 312000,
//                                 yards : 312000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "South Carolina",
//                 id : "55",
//                 swimmers : 21,
//                 miles : 251915,
//                 yards : 5801560,
//                 average : 11995.952380952382,
//                 clubs : [
//                     {
//                         abbreviation : "PALM",
//                         id : "550-001",
//                         name : "Palmetto Masters",
//                         swimmers : 3,
//                         yards : 2096760,
//                         miles : 249810,
//                         average : 83270,
//                         members : [
//                             {
//                                 id : "07H27",
//                                 firstName : "Janine",
//                                 lastName : "Serell",
//                                 age : "58",
//                                 miles : 750,
//                                 yards : 1320000
//                             },
//                             {
//                                 id : "02DY0",
//                                 firstName : "Andrew",
//                                 lastName : "Perry",
//                                 age : "52",
//                                 miles : 248760,
//                                 yards : 248760
//                             },
//                             {
//                                 id : "BCUEH",
//                                 firstName : "Benjamin",
//                                 lastName : "Van der Wel",
//                                 age : "55",
//                                 miles : 300,
//                                 yards : 528000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "LOCO",
//                         id : "550-035",
//                         name : "Lowcountry Masters ",
//                         swimmers : 3,
//                         yards : 1249600,
//                         miles : 710,
//                         average : 236.66666666666666,
//                         members : [
//                             {
//                                 id : "0B19A",
//                                 firstName : "Briana",
//                                 lastName : "Johnson",
//                                 age : "51",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "0B19C",
//                                 firstName : "Clyde (Butch)",
//                                 lastName : "Johnson",
//                                 age : "59",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "01GWS",
//                                 firstName : "Barbara",
//                                 lastName : "Eisele",
//                                 age : "90",
//                                 miles : 160,
//                                 yards : 281600
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "GSMS",
//                         id : "550-019",
//                         name : "Grand Strand Masters Swimming",
//                         swimmers : 7,
//                         yards : 880000,
//                         miles : 500,
//                         average : 71.42857142857143,
//                         members : [
//                             {
//                                 id : "06NNB",
//                                 firstName : "Samuel",
//                                 lastName : "Wathen",
//                                 age : "67",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07MP6",
//                                 firstName : "Jenna",
//                                 lastName : "Miller",
//                                 age : "29",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06JAR",
//                                 firstName : "Mike",
//                                 lastName : "Casper",
//                                 age : "78",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "4DKN3",
//                                 firstName : "James",
//                                 lastName : "Hall",
//                                 age : "45",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06EAH",
//                                 firstName : "Tom",
//                                 lastName : "Maguire",
//                                 age : "77",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "PZNZE",
//                                 firstName : "Meg",
//                                 lastName : "Armstrong",
//                                 age : "58",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "061TJ",
//                                 firstName : "Karen",
//                                 lastName : "Fuss",
//                                 age : "54",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "GS",
//                         id : "550-022",
//                         name : "Greenville Splash Masters",
//                         swimmers : 5,
//                         yards : 1135200,
//                         miles : 645,
//                         average : 129,
//                         members : [
//                             {
//                                 id : "GG2K3",
//                                 firstName : "Jay",
//                                 lastName : "Crout",
//                                 age : "36",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "09PJX",
//                                 firstName : "Monte",
//                                 lastName : "St. Amant",
//                                 age : "47",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "0B4M1",
//                                 firstName : "Kristin",
//                                 lastName : "Knowles",
//                                 age : "41",
//                                 miles : 120,
//                                 yards : 211200
//                             },
//                             {
//                                 id : "0AF1M",
//                                 firstName : "Fran",
//                                 lastName : "Villa",
//                                 age : "69",
//                                 miles : 125,
//                                 yards : 220000
//                             },
//                             {
//                                 id : "01H9K",
//                                 firstName : "Barbara",
//                                 lastName : "Barber",
//                                 age : "68",
//                                 miles : 250,
//                                 yards : 440000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SMRT",
//                         id : "550-020",
//                         name : "Southern Marlins Racing Team",
//                         swimmers : 2,
//                         yards : 264000,
//                         miles : 150,
//                         average : 75,
//                         members : [
//                             {
//                                 id : "01H4S",
//                                 firstName : "Nancy",
//                                 lastName : "Haynsworth",
//                                 age : "63",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "061E0",
//                                 firstName : "John",
//                                 lastName : "O'Bryan",
//                                 age : "55",
//                                 miles : 150,
//                                 yards : 264000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "YCSC",
//                         id : "550-037",
//                         name : "YMCA Columbia Swim Club",
//                         swimmers : 1,
//                         yards : 176000,
//                         miles : 100,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "KTFAD",
//                                 firstName : "Michael",
//                                 lastName : "Sakara",
//                                 age : "52",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Southern",
//                 id : "24",
//                 swimmers : 11,
//                 miles : 2001015,
//                 yards : 3786400,
//                 average : 181910.45454545456,
//                 clubs : [
//                     {
//                         abbreviation : "SMS",
//                         id : "240-036",
//                         name : "Southern Masters Swimmers",
//                         swimmers : 6,
//                         yards : 2994400,
//                         miles : 2000565,
//                         average : 333427.5,
//                         members : [
//                             {
//                                 id : "065AN",
//                                 firstName : "Mahlon",
//                                 lastName : "Poche",
//                                 age : "56",
//                                 miles : 297,
//                                 yards : 522720
//                             },
//                             {
//                                 id : "0620J",
//                                 firstName : "Thomas",
//                                 lastName : "Schmall",
//                                 age : "43",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "CC94T",
//                                 firstName : "Mary Jane",
//                                 lastName : "Williams",
//                                 age : "61",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01T5E",
//                                 firstName : "Dale",
//                                 lastName : "Williams",
//                                 age : "68",
//                                 miles : 268,
//                                 yards : 471680
//                             },
//                             {
//                                 id : "CXTPD",
//                                 firstName : "Brian W",
//                                 lastName : "Gordon",
//                                 age : "49",
//                                 miles : 2000000,
//                                 yards : 2000000
//                             },
//                             {
//                                 id : "BWZ6U",
//                                 firstName : "Daphne",
//                                 lastName : "Childress",
//                                 age : "45",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "FINM",
//                         id : "240-013",
//                         name : "Franco's Fins Masters",
//                         swimmers : 2,
//                         yards : 616000,
//                         miles : 350,
//                         average : 175,
//                         members : [
//                             {
//                                 id : "021TF",
//                                 firstName : "Jaime",
//                                 lastName : "Loebner",
//                                 age : "48",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "0896Y",
//                                 firstName : "Woody",
//                                 lastName : "Brown",
//                                 age : "50",
//                                 miles : 250,
//                                 yards : 440000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "BNG",
//                         id : "240-066",
//                         name : "BNG Endurance",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "07HD3",
//                                 firstName : "Shana",
//                                 lastName : "Norwood",
//                                 age : "44",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "GULF",
//                         id : "240-073",
//                         name : "Gulf Coast Multi-Sport",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "0A4TE",
//                                 firstName : "Scott",
//                                 lastName : "Stevens",
//                                 age : "52",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "TAQ",
//                         id : "240-010",
//                         name : "Tiger Aquatics Swimming",
//                         swimmers : 1,
//                         yards : 176000,
//                         miles : 100,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "FWPG2",
//                                 firstName : "Brittany",
//                                 lastName : "Hebert",
//                                 age : "35",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         id : "3",
//         name : "Great Lakes",
//         swimmers : 198,
//         miles : 3759335.25,
//         yards : 64276736,
//         average : 18986.541666666668,
//         lmscs : [
//             {
//                 name : "Illinois",
//                 id : "21",
//                 swimmers : 43,
//                 miles : 1007805.25,
//                 yards : 14737240,
//                 average : 23437.331395348836,
//                 clubs : [
//                     {
//                         abbreviation : "IM",
//                         id : "210-020",
//                         name : "Illinois Masters",
//                         swimmers : 34,
//                         yards : 13074040,
//                         miles : 1006860.25,
//                         average : 29613.53676470588,
//                         members : [
//                             {
//                                 id : "0AU4T",
//                                 firstName : "Bradley",
//                                 lastName : "Kulat",
//                                 age : "59",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "07H2V",
//                                 firstName : "Sean",
//                                 lastName : "Ware",
//                                 age : "50",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "0AUB0",
//                                 firstName : "Ellen",
//                                 lastName : "Drake",
//                                 age : "28",
//                                 miles : 275,
//                                 yards : 484000
//                             },
//                             {
//                                 id : "02UNY",
//                                 firstName : "Debbie",
//                                 lastName : "Gortowski",
//                                 age : "64",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "04U1R",
//                                 firstName : "Aileen",
//                                 lastName : "Vogel",
//                                 age : "68",
//                                 miles : 175,
//                                 yards : 308000
//                             },
//                             {
//                                 id : "3Z472",
//                                 firstName : "Ali",
//                                 lastName : "Pope",
//                                 age : "27",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "072TV",
//                                 firstName : "Patricia",
//                                 lastName : "Stevens",
//                                 age : "63",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "04U45",
//                                 firstName : "Paul",
//                                 lastName : "Brown",
//                                 age : "69",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "0AM7F",
//                                 firstName : "Jeff",
//                                 lastName : "Eastman",
//                                 age : "63",
//                                 miles : 275,
//                                 yards : 484000
//                             },
//                             {
//                                 id : "07JHP",
//                                 firstName : "Chris",
//                                 lastName : "Manheim",
//                                 age : "66",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "076DX",
//                                 firstName : "Jean",
//                                 lastName : "Tyrell",
//                                 age : "66",
//                                 miles : 45,
//                                 yards : 79200
//                             },
//                             {
//                                 id : "062JD",
//                                 firstName : "Amanda",
//                                 lastName : "Castle",
//                                 age : "45",
//                                 miles : 225,
//                                 yards : 396000
//                             },
//                             {
//                                 id : "07JP9",
//                                 firstName : "John",
//                                 lastName : "Hackett",
//                                 age : "70",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "062YC",
//                                 firstName : "Jaime",
//                                 lastName : "Garcia",
//                                 age : "72",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "07F6T",
//                                 firstName : "Jordan",
//                                 lastName : "Leahey",
//                                 age : "38",
//                                 miles : 365.25,
//                                 yards : 642840
//                             },
//                             {
//                                 id : "06U72",
//                                 firstName : "Sean",
//                                 lastName : "Russell",
//                                 age : "49",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "02VAH",
//                                 firstName : "Christopher",
//                                 lastName : "Sheean",
//                                 age : "54",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "094GT",
//                                 firstName : "Don",
//                                 lastName : "Secor",
//                                 age : "45",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "09R6N",
//                                 firstName : "Camille",
//                                 lastName : "Tan",
//                                 age : "40",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "063C6",
//                                 firstName : "Michael",
//                                 lastName : "Kozlowski",
//                                 age : "70",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "09V8K",
//                                 firstName : "Richard",
//                                 lastName : "Ruderman",
//                                 age : "62",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07HDY",
//                                 firstName : "Ann",
//                                 lastName : "Keil",
//                                 age : "65",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0734K",
//                                 firstName : "Krista",
//                                 lastName : "Cimilluca",
//                                 age : "50",
//                                 miles : 360,
//                                 yards : 633600
//                             },
//                             {
//                                 id : "02VB9",
//                                 firstName : "Andreas",
//                                 lastName : "Seibt",
//                                 age : "62",
//                                 miles : 700,
//                                 yards : 1232000
//                             },
//                             {
//                                 id : "05R48",
//                                 firstName : "Kathryn",
//                                 lastName : "Froehlich",
//                                 age : "58",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "067KS",
//                                 firstName : "Paul",
//                                 lastName : "Tzur",
//                                 age : "42",
//                                 miles : 225,
//                                 yards : 396000
//                             },
//                             {
//                                 id : "06UPK",
//                                 firstName : "Michael",
//                                 lastName : "Rutkowski",
//                                 age : "53",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "31DX9",
//                                 firstName : "Brian",
//                                 lastName : "Macias",
//                                 age : "48",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06KCN",
//                                 firstName : "Karen",
//                                 lastName : "Garrow",
//                                 age : "56",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "07TU8",
//                                 firstName : "Carol",
//                                 lastName : "Bossert-Hartman",
//                                 age : "60",
//                                 miles : 1000000,
//                                 yards : 1000000
//                             },
//                             {
//                                 id : "09CWT",
//                                 firstName : "Abigail",
//                                 lastName : "Bergman",
//                                 age : "24",
//                                 miles : 1500,
//                                 yards : 2640000
//                             },
//                             {
//                                 id : "0918K",
//                                 firstName : "Rick",
//                                 lastName : "Conneely",
//                                 age : "52",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "02WB2",
//                                 firstName : "Marilyn",
//                                 lastName : "Kulak",
//                                 age : "64",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "09DA1",
//                                 firstName : "Madeline",
//                                 lastName : "Bruce",
//                                 age : "26",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SFY",
//                         id : "210-058",
//                         name : "Stephens Family YMCA",
//                         swimmers : 6,
//                         yards : 739200,
//                         miles : 420,
//                         average : 70,
//                         members : [
//                             {
//                                 id : "02WTB",
//                                 firstName : "Natalie",
//                                 lastName : "Kenny Marquez",
//                                 age : "37",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02V8S",
//                                 firstName : "Dorothy",
//                                 lastName : "Debolt",
//                                 age : "59",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "06MFE",
//                                 firstName : "Carolyn",
//                                 lastName : "Cooper",
//                                 age : "71",
//                                 miles : 95,
//                                 yards : 167200
//                             },
//                             {
//                                 id : "7AZNV",
//                                 firstName : "Jonathan",
//                                 lastName : "Hill",
//                                 age : "51",
//                                 miles : 75,
//                                 yards : 132000
//                             },
//                             {
//                                 id : "0A7Y1",
//                                 firstName : "Leslie",
//                                 lastName : "Heath",
//                                 age : "46",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02VWT",
//                                 firstName : "Tina",
//                                 lastName : "Johnson",
//                                 age : "60",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "WLAC",
//                         id : "210-033",
//                         name : "Chicago Athletic Clubs Masters",
//                         swimmers : 1,
//                         yards : 132000,
//                         miles : 75,
//                         average : 75,
//                         members : [
//                             {
//                                 id : "06GJ1",
//                                 firstName : "Emily",
//                                 lastName : "Dangremond",
//                                 age : "34",
//                                 miles : 75,
//                                 yards : 132000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "LIB",
//                         id : "210-042",
//                         name : "Libertyville Masters",
//                         swimmers : 1,
//                         yards : 528000,
//                         miles : 300,
//                         average : 300,
//                         members : [
//                             {
//                                 id : "06C4E",
//                                 firstName : "Michael",
//                                 lastName : "Reed",
//                                 age : "65",
//                                 miles : 300,
//                                 yards : 528000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SWED",
//                         id : "210-028",
//                         name : "Chicago Swedish Fish Masters ",
//                         swimmers : 1,
//                         yards : 264000,
//                         miles : 150,
//                         average : 150,
//                         members : [
//                             {
//                                 id : "4TV0P",
//                                 firstName : "Patricia",
//                                 lastName : "Wichner",
//                                 age : "52",
//                                 miles : 150,
//                                 yards : 264000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Ohio",
//                 id : "17",
//                 swimmers : 25,
//                 miles : 179306,
//                 yards : 7753560,
//                 average : 7172.24,
//                 clubs : [
//                     {
//                         abbreviation : "NAM",
//                         id : "170-007",
//                         name : "New Albany Aquatics Club",
//                         swimmers : 5,
//                         yards : 1276000,
//                         miles : 725,
//                         average : 145,
//                         members : [
//                             {
//                                 id : "06AFX",
//                                 firstName : "Angela",
//                                 lastName : "Sedivy",
//                                 age : "58",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "04P17",
//                                 firstName : "Edward",
//                                 lastName : "Devennish",
//                                 age : "75",
//                                 miles : 125,
//                                 yards : 220000
//                             },
//                             {
//                                 id : "GMY6G",
//                                 firstName : "LINDA",
//                                 lastName : "Lawrence",
//                                 age : "63",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "0A14E",
//                                 firstName : "Ward",
//                                 lastName : "Cornett",
//                                 age : "72",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01UAD",
//                                 firstName : "James",
//                                 lastName : "Purdie",
//                                 age : "68",
//                                 miles : 500,
//                                 yards : 880000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "BGSC",
//                         id : "170-006",
//                         name : "Bowling Green Swim Club Masters",
//                         swimmers : 4,
//                         yards : 879000,
//                         miles : 175400,
//                         average : 43850,
//                         members : [
//                             {
//                                 id : "01UBU",
//                                 firstName : "Laura",
//                                 lastName : "Leventhal",
//                                 age : "63",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "01UJE",
//                                 firstName : "Janet",
//                                 lastName : "Womack",
//                                 age : "63",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "01UKK",
//                                 firstName : "Stephen",
//                                 lastName : "Langendorfer",
//                                 age : "70",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "GZLCL",
//                                 firstName : "Michael",
//                                 lastName : "Marshall",
//                                 age : "43",
//                                 miles : 175000,
//                                 yards : 175000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "DAS",
//                         id : "170-040",
//                         name : "Dayton Area Sharks",
//                         swimmers : 2,
//                         yards : 1172160,
//                         miles : 666,
//                         average : 333,
//                         members : [
//                             {
//                                 id : "01UDB",
//                                 firstName : "David",
//                                 lastName : "Hardwick",
//                                 age : "69",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "04NX6",
//                                 firstName : "Ginny",
//                                 lastName : "Trimble",
//                                 age : "36",
//                                 miles : 366,
//                                 yards : 644160
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "OHSP",
//                         id : "170-032",
//                         name : "Ohio Splash",
//                         swimmers : 3,
//                         yards : 616000,
//                         miles : 350,
//                         average : 116.66666666666667,
//                         members : [
//                             {
//                                 id : "01UDG",
//                                 firstName : "Paul",
//                                 lastName : "Hinders",
//                                 age : "70",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "XT0DN",
//                                 firstName : "Erin",
//                                 lastName : "Kelley",
//                                 age : "24",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0985Z",
//                                 firstName : "Robert",
//                                 lastName : "Eblin",
//                                 age : "57",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CM",
//                         id : "170-083",
//                         name : "Cincinnati Marlins",
//                         swimmers : 1,
//                         yards : 264000,
//                         miles : 150,
//                         average : 150,
//                         members : [
//                             {
//                                 id : "07J9F",
//                                 firstName : "Josh",
//                                 lastName : "Barrett",
//                                 age : "41",
//                                 miles : 150,
//                                 yards : 264000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CSMT",
//                         id : "170-010",
//                         name : "Columbus Sharks Masters",
//                         swimmers : 5,
//                         yards : 1337600,
//                         miles : 760,
//                         average : 152,
//                         members : [
//                             {
//                                 id : "01UGK",
//                                 firstName : "Chris",
//                                 lastName : "Paolini",
//                                 age : "56",
//                                 miles : 260,
//                                 yards : 457600
//                             },
//                             {
//                                 id : "08D6E",
//                                 firstName : "Matt",
//                                 lastName : "Cahoon",
//                                 age : "32",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07FJF",
//                                 firstName : "Marni",
//                                 lastName : "Rosenberg",
//                                 age : "45",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "09W2M",
//                                 firstName : "Scott",
//                                 lastName : "Bargar",
//                                 age : "64",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "01U8W",
//                                 firstName : "Thomas",
//                                 lastName : "Gibson",
//                                 age : "57",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "UAR",
//                         id : "170-053",
//                         name : "Up and Running Swim and Tri",
//                         swimmers : 1,
//                         yards : 422400,
//                         miles : 240,
//                         average : 240,
//                         members : [
//                             {
//                                 id : "04P18",
//                                 firstName : "Liz",
//                                 lastName : "Huelsman",
//                                 age : "58",
//                                 miles : 240,
//                                 yards : 422400
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "BASH",
//                         id : "170-077",
//                         name : "Blue Ash Masters",
//                         swimmers : 1,
//                         yards : 1056000,
//                         miles : 600,
//                         average : 600,
//                         members : [
//                             {
//                                 id : "066S2",
//                                 firstName : "Calvin",
//                                 lastName : "Schildknecht",
//                                 age : "35",
//                                 miles : 600,
//                                 yards : 1056000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "LTOH",
//                         id : "170-065",
//                         name : "Life Time Swim Ohio",
//                         swimmers : 1,
//                         yards : 88000,
//                         miles : 50,
//                         average : 50,
//                         members : [
//                             {
//                                 id : "NTKUK",
//                                 firstName : "Jodi ",
//                                 lastName : "Stewart",
//                                 age : "55",
//                                 miles : 50,
//                                 yards : 88000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "KENM",
//                         id : "170-075",
//                         name : "Kenyon Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "01JGZ",
//                                 firstName : "John",
//                                 lastName : "Landreth",
//                                 age : "50",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SYL",
//                         id : "170-036",
//                         name : "Sylvania Masters Swim Club",
//                         swimmers : 1,
//                         yards : 642400,
//                         miles : 365,
//                         average : 365,
//                         members : [
//                             {
//                                 id : "01V1J",
//                                 firstName : "Alan",
//                                 lastName : "Albert",
//                                 age : "64",
//                                 miles : 365,
//                                 yards : 642400
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Indiana",
//                 id : "16",
//                 swimmers : 75,
//                 miles : 1013605,
//                 yards : 25038413,
//                 average : 13514.733333333334,
//                 clubs : [
//                     {
//                         abbreviation : "INDY",
//                         id : "160-046",
//                         name : "Indy Aquatic Masters",
//                         swimmers : 21,
//                         yards : 9656013,
//                         miles : 1004865,
//                         average : 47850.71428571428,
//                         members : [
//                             {
//                                 id : "07ZTJ",
//                                 firstName : "Lori",
//                                 lastName : "Adelson",
//                                 age : "67",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "02B11",
//                                 firstName : "Robin",
//                                 lastName : "Walker",
//                                 age : "65",
//                                 miles : 450,
//                                 yards : 792000
//                             },
//                             {
//                                 id : "09J52",
//                                 firstName : "William",
//                                 lastName : "Siderys",
//                                 age : "59",
//                                 miles : 360,
//                                 yards : 633600
//                             },
//                             {
//                                 id : "R0UCH",
//                                 firstName : "Stephen",
//                                 lastName : "Rouch",
//                                 age : "40",
//                                 miles : 1000000,
//                                 yards : 1093613
//                             },
//                             {
//                                 id : "099CR",
//                                 firstName : "Katie",
//                                 lastName : "Uppfalt",
//                                 age : "29",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02BHP",
//                                 firstName : "Linda",
//                                 lastName : "Marvin",
//                                 age : "47",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0B4EH",
//                                 firstName : "Molly",
//                                 lastName : "Meyer",
//                                 age : "26",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "09YBB",
//                                 firstName : "Leigh Ann",
//                                 lastName : "Hirschman",
//                                 age : "52",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "05GA7",
//                                 firstName : "Christopher",
//                                 lastName : "Lilienkamp",
//                                 age : "58",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "0AVR8",
//                                 firstName : "Brian",
//                                 lastName : "Loy",
//                                 age : "36",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "E85VU",
//                                 firstName : "Lindy",
//                                 lastName : "Teal",
//                                 age : "59",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "02A8X",
//                                 firstName : "Cheryl",
//                                 lastName : "Gettelfinger",
//                                 age : "63",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "04R1G",
//                                 firstName : "Judith",
//                                 lastName : "Kennedy",
//                                 age : "69",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0A1W3",
//                                 firstName : "Valerie",
//                                 lastName : "Romberg",
//                                 age : "64",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "08DH1",
//                                 firstName : "Sara",
//                                 lastName : "Wright",
//                                 age : "73",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "02AC3",
//                                 firstName : "Sue",
//                                 lastName : "Cosper",
//                                 age : "72",
//                                 miles : 600,
//                                 yards : 1056000
//                             },
//                             {
//                                 id : "04R2S",
//                                 firstName : "Carrie",
//                                 lastName : "Kirk",
//                                 age : "52",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "02AD7",
//                                 firstName : "Susan",
//                                 lastName : "Pollard",
//                                 age : "76",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "02AKX",
//                                 firstName : "Teresa \"Tracy\"",
//                                 lastName : "Knight",
//                                 age : "48",
//                                 miles : 450,
//                                 yards : 792000
//                             },
//                             {
//                                 id : "061RV",
//                                 firstName : "Katherine ",
//                                 lastName : "Merkle",
//                                 age : "38",
//                                 miles : 125,
//                                 yards : 220000
//                             },
//                             {
//                                 id : "02AMM",
//                                 firstName : "Mark",
//                                 lastName : "Spratt",
//                                 age : "65",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MMA",
//                         id : "160-048",
//                         name : "Munster Masters",
//                         swimmers : 3,
//                         yards : 880000,
//                         miles : 500,
//                         average : 166.66666666666666,
//                         members : [
//                             {
//                                 id : "0KCUH",
//                                 firstName : "Michael ",
//                                 lastName : "Tuley",
//                                 age : "46",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "07S3J",
//                                 firstName : "Peter",
//                                 lastName : "Rokosz",
//                                 age : "39",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "09UKP",
//                                 firstName : "Adriane",
//                                 lastName : "Blaesing",
//                                 age : "51",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "FWYS",
//                         id : "160-056",
//                         name : "Fort Wayne YMCA Sharks",
//                         swimmers : 8,
//                         yards : 2877600,
//                         miles : 1635,
//                         average : 204.375,
//                         members : [
//                             {
//                                 id : "09SXK",
//                                 firstName : "Christopher",
//                                 lastName : "Carlin",
//                                 age : "52",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0B5UT",
//                                 firstName : "John",
//                                 lastName : "Peirce",
//                                 age : "71",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "0AU6D",
//                                 firstName : "Melissa",
//                                 lastName : "Walther",
//                                 age : "51",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "0AZ91",
//                                 firstName : "Conner",
//                                 lastName : "Pauly",
//                                 age : "23",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "096UV",
//                                 firstName : "Mary",
//                                 lastName : "Titcomb",
//                                 age : "67",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "09BHM",
//                                 firstName : "Clifton",
//                                 lastName : "Titcomb",
//                                 age : "69",
//                                 miles : 270,
//                                 yards : 475200
//                             },
//                             {
//                                 id : "087RB",
//                                 firstName : "Cheryl",
//                                 lastName : "Pulver",
//                                 age : "50",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "0AX6R",
//                                 firstName : "Melanie",
//                                 lastName : "Koto",
//                                 age : "31",
//                                 miles : 115,
//                                 yards : 202400
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "NAST",
//                         id : "160-016",
//                         name : "Noblesville Adult Swim Team",
//                         swimmers : 4,
//                         yards : 264000,
//                         miles : 150,
//                         average : 37.5,
//                         members : [
//                             {
//                                 id : "0AKJX",
//                                 firstName : "Mike",
//                                 lastName : "Bennett",
//                                 age : "38",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "0764Y",
//                                 firstName : "Andy",
//                                 lastName : "Frey",
//                                 age : "42",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02ABJ",
//                                 firstName : "Jeffrey",
//                                 lastName : "Maydak",
//                                 age : "47",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "WEK9U",
//                                 firstName : "Hannah",
//                                 lastName : "Eppley",
//                                 age : "24",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "ISWIM",
//                         id : "160-081",
//                         name : "iSWIM Masters",
//                         swimmers : 2,
//                         yards : 563200,
//                         miles : 320,
//                         average : 160,
//                         members : [
//                             {
//                                 id : "0ACSH",
//                                 firstName : "Stephanie",
//                                 lastName : "Miller",
//                                 age : "41",
//                                 miles : 120,
//                                 yards : 211200
//                             },
//                             {
//                                 id : "MX257",
//                                 firstName : "Adam",
//                                 lastName : "Downey",
//                                 age : "41",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "THT",
//                         id : "160-030",
//                         name : "Terre Haute Torpedoes Masters",
//                         swimmers : 4,
//                         yards : 2200000,
//                         miles : 1250,
//                         average : 312.5,
//                         members : [
//                             {
//                                 id : "02WSX",
//                                 firstName : "Tom",
//                                 lastName : "Hintz",
//                                 age : "54",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "05GJB",
//                                 firstName : "Jerrilynn",
//                                 lastName : "Bayless",
//                                 age : "58",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "08DRE",
//                                 firstName : "Heather",
//                                 lastName : "Meadors",
//                                 age : "38",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "0AJRJ",
//                                 firstName : "Todd",
//                                 lastName : "Marshall",
//                                 age : "55",
//                                 miles : 600,
//                                 yards : 1056000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "FSAM",
//                         id : "160-052",
//                         name : "Southeastern Area Masters Swimming",
//                         swimmers : 3,
//                         yards : 686400,
//                         miles : 390,
//                         average : 130,
//                         members : [
//                             {
//                                 id : "02B8N",
//                                 firstName : "John",
//                                 lastName : "Ruby",
//                                 age : "48",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "080KM",
//                                 firstName : "Brian",
//                                 lastName : "Kertin",
//                                 age : "54",
//                                 miles : 90,
//                                 yards : 158400
//                             },
//                             {
//                                 id : "0AZK4",
//                                 firstName : "Matthew",
//                                 lastName : "Haviza",
//                                 age : "39",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "AGON",
//                         id : "160-062",
//                         name : "Agon",
//                         swimmers : 1,
//                         yards : 440000,
//                         miles : 250,
//                         average : 250,
//                         members : [
//                             {
//                                 id : "0B7UY",
//                                 firstName : "Dale",
//                                 lastName : "Brown",
//                                 age : "58",
//                                 miles : 250,
//                                 yards : 440000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "DLMA",
//                         id : "160-006",
//                         name : "Duneland Masters",
//                         swimmers : 8,
//                         yards : 2200000,
//                         miles : 1250,
//                         average : 156.25,
//                         members : [
//                             {
//                                 id : "0B4AP",
//                                 firstName : "Chris",
//                                 lastName : "Werner",
//                                 age : "46",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "RAE78",
//                                 firstName : "Rachel",
//                                 lastName : "Rivera",
//                                 age : "42",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "06VTB",
//                                 firstName : "Kelley",
//                                 lastName : "Keating",
//                                 age : "53",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02HZV",
//                                 firstName : "Jennifer",
//                                 lastName : "Tuck",
//                                 age : "48",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "0AAGG",
//                                 firstName : "Daniel",
//                                 lastName : "Vinet",
//                                 age : "49",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0AZS6",
//                                 firstName : "Kelly",
//                                 lastName : "Craig",
//                                 age : "22",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "0B7DD",
//                                 firstName : "Jocelyn",
//                                 lastName : "Hibshman",
//                                 age : "49",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "073GB",
//                                 firstName : "Susan",
//                                 lastName : "McGue",
//                                 age : "56",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SWIN",
//                         id : "160-043",
//                         name : "Southwest Indiana Masters",
//                         swimmers : 1,
//                         yards : 352000,
//                         miles : 200,
//                         average : 200,
//                         members : [
//                             {
//                                 id : "06TFD",
//                                 firstName : "Connie",
//                                 lastName : "Southworth",
//                                 age : "69",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "HPX",
//                         id : "160-032",
//                         name : "Indianapolis Healthplex",
//                         swimmers : 2,
//                         yards : 352000,
//                         miles : 200,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "07AGA",
//                                 firstName : "William",
//                                 lastName : "Jankowski",
//                                 age : "61",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "9EYVY",
//                                 firstName : "Gunnar",
//                                 lastName : "Gottschalk",
//                                 age : "33",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "VALM",
//                         id : "160-021",
//                         name : "Valpo Masters",
//                         swimmers : 3,
//                         yards : 528000,
//                         miles : 300,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "0AMGK",
//                                 firstName : "Jason",
//                                 lastName : "White",
//                                 age : "49",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "0B3YB",
//                                 firstName : "Eugene",
//                                 lastName : "Lin",
//                                 age : "50",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "HEW9H",
//                                 firstName : "Ashlee",
//                                 lastName : "Bradley",
//                                 age : "31",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "DOC",
//                         id : "160-001",
//                         name : "DOC IU Masters Swimming",
//                         swimmers : 2,
//                         yards : 792000,
//                         miles : 450,
//                         average : 225,
//                         members : [
//                             {
//                                 id : "0A0WK",
//                                 firstName : "Kevin",
//                                 lastName : "Eder",
//                                 age : "50",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "0B3A6",
//                                 firstName : "Nicholas",
//                                 lastName : "Blackwell",
//                                 age : "40",
//                                 miles : 250,
//                                 yards : 440000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "LTIN",
//                         id : "160-059",
//                         name : "Life Time Swim Indiana",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "UD313",
//                                 firstName : "Thomas",
//                                 lastName : "Bell",
//                                 age : "41",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CGAC",
//                         id : "160-070",
//                         name : "Center Grove Aquatic Club",
//                         swimmers : 1,
//                         yards : 264000,
//                         miles : 150,
//                         average : 150,
//                         members : [
//                             {
//                                 id : "0B2ED",
//                                 firstName : "Jeffrey",
//                                 lastName : "Udrasols",
//                                 age : "47",
//                                 miles : 150,
//                                 yards : 264000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "ZAM",
//                         id : "160-047",
//                         name : "Zionsville Aquatic Masters",
//                         swimmers : 3,
//                         yards : 642400,
//                         miles : 365,
//                         average : 121.66666666666667,
//                         members : [
//                             {
//                                 id : "0B4NA",
//                                 firstName : "Jeffrey",
//                                 lastName : "Thompson",
//                                 age : "66",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0AMYT",
//                                 firstName : "Jerry",
//                                 lastName : "Ritchie",
//                                 age : "56",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "04R2J",
//                                 firstName : "Lisa",
//                                 lastName : "Brown",
//                                 age : "58",
//                                 miles : 365,
//                                 yards : 642400
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "COLE",
//                         id : "160-045",
//                         name : "Cole YMCA Masters",
//                         swimmers : 2,
//                         yards : 228800,
//                         miles : 130,
//                         average : 65,
//                         members : [
//                             {
//                                 id : "0B6TA",
//                                 firstName : "JoEllen",
//                                 lastName : "DeCamp",
//                                 age : "55",
//                                 miles : 130,
//                                 yards : 228800
//                             },
//                             {
//                                 id : "0B6XK",
//                                 firstName : "Brian",
//                                 lastName : "DeCamp",
//                                 age : "57",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "JYMF",
//                         id : "160-054",
//                         name : "Jordan YMCA MultiFit",
//                         swimmers : 2,
//                         yards : 528000,
//                         miles : 300,
//                         average : 150,
//                         members : [
//                             {
//                                 id : "0BA16",
//                                 firstName : "Ryan",
//                                 lastName : "Murphy",
//                                 age : "41",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "02AWC",
//                                 firstName : "Maria",
//                                 lastName : "Tamer",
//                                 age : "58",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CSI",
//                         id : "160-024",
//                         name : "Cardinal Swimming Indiana",
//                         swimmers : 1,
//                         yards : 880000,
//                         miles : 500,
//                         average : 500,
//                         members : [
//                             {
//                                 id : "071KG",
//                                 firstName : "Larry",
//                                 lastName : "Strange",
//                                 age : "66",
//                                 miles : 500,
//                                 yards : 880000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SCMI",
//                         id : "160-003",
//                         name : "Sugar Creek Masters Indiana",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "0B4YJ",
//                                 firstName : "Ande",
//                                 lastName : "Warren",
//                                 age : "48",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "ACSTM",
//                         id : "160-085",
//                         name : "Avon Community Swim Team Masters",
//                         swimmers : 1,
//                         yards : 616000,
//                         miles : 350,
//                         average : 350,
//                         members : [
//                             {
//                                 id : "ERNTA",
//                                 firstName : "Deborah",
//                                 lastName : "Kinnamon",
//                                 age : "49",
//                                 miles : 350,
//                                 yards : 616000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "IRM",
//                         id : "160-036",
//                         name : "Irish Masters",
//                         swimmers : 1,
//                         yards : 88000,
//                         miles : 50,
//                         average : 50,
//                         members : [
//                             {
//                                 id : "8EGHR",
//                                 firstName : "Scott",
//                                 lastName : "Nelson",
//                                 age : "48",
//                                 miles : 50,
//                                 yards : 88000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Lake Erie",
//                 id : "18",
//                 swimmers : 19,
//                 miles : 752075,
//                 yards : 4402000,
//                 average : 39582.89473684211,
//                 clubs : [
//                     {
//                         abbreviation : "O*H*",
//                         id : "180-001",
//                         name : "O*H*I*O Masters Swim Club",
//                         swimmers : 16,
//                         yards : 4050000,
//                         miles : 751875,
//                         average : 46992.1875,
//                         members : [
//                             {
//                                 id : "02RHK",
//                                 firstName : "Flavia",
//                                 lastName : "Medlin",
//                                 age : "53",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "05ZB0",
//                                 firstName : "Ann",
//                                 lastName : "Marshfield",
//                                 age : "62",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0925T",
//                                 firstName : "Dieter",
//                                 lastName : "Lemke",
//                                 age : "64",
//                                 miles : 85,
//                                 yards : 149600
//                             },
//                             {
//                                 id : "085E1",
//                                 firstName : "Matthew",
//                                 lastName : "Jaroszewicz",
//                                 age : "30",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01PH5",
//                                 firstName : "Duane",
//                                 lastName : "Grassell",
//                                 age : "63",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "085KM",
//                                 firstName : "Chuck",
//                                 lastName : "Beatty",
//                                 age : "61",
//                                 miles : 350,
//                                 yards : 616000
//                             },
//                             {
//                                 id : "F0WHK",
//                                 firstName : "Jeffrey",
//                                 lastName : "Gifford",
//                                 age : "50",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "01WC8",
//                                 firstName : "Susan",
//                                 lastName : "Paris",
//                                 age : "74",
//                                 miles : 120,
//                                 yards : 211200
//                             },
//                             {
//                                 id : "07YX0",
//                                 firstName : "Jason",
//                                 lastName : "Campbell",
//                                 age : "47",
//                                 miles : 750000,
//                                 yards : 750000
//                             },
//                             {
//                                 id : "0A6SR",
//                                 firstName : "Sheri",
//                                 lastName : "Guess",
//                                 age : "49",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "01PNA",
//                                 firstName : "Gloria",
//                                 lastName : "Britton",
//                                 age : "67",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "076HD",
//                                 firstName : "Dennis",
//                                 lastName : "Auckley",
//                                 age : "56",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01R2Y",
//                                 firstName : "Elizabeth",
//                                 lastName : "Porter",
//                                 age : "55",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "EC81B",
//                                 firstName : "Martha",
//                                 lastName : "Woerner",
//                                 age : "34",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "0AFYG",
//                                 firstName : "Brad",
//                                 lastName : "Guess",
//                                 age : "51",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "07KW5",
//                                 firstName : "Mark",
//                                 lastName : "Marshfield",
//                                 age : "62",
//                                 miles : 320,
//                                 yards : 563200
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "AAC",
//                         id : "180-042",
//                         name : "Amherst Aquatic Club",
//                         swimmers : 2,
//                         yards : 176000,
//                         miles : 100,
//                         average : 50,
//                         members : [
//                             {
//                                 id : "ZV457",
//                                 firstName : "Stephen",
//                                 lastName : "Soboslay",
//                                 age : "19",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0089V",
//                                 firstName : "Mary",
//                                 lastName : "Bartek",
//                                 age : "56",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SHSH",
//                         id : "180-010",
//                         name : "Shaker Swimming",
//                         swimmers : 1,
//                         yards : 176000,
//                         miles : 100,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "01PUF",
//                                 firstName : "Paula",
//                                 lastName : "Rownd",
//                                 age : "59",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Wisconsin",
//                 id : "20",
//                 swimmers : 19,
//                 miles : 303373,
//                 yards : 6264563,
//                 average : 15967,
//                 clubs : [
//                     {
//                         abbreviation : "WMAC",
//                         id : "200-001",
//                         name : "Wisconsin Masters Aquatic Club",
//                         swimmers : 18,
//                         yards : 6264563,
//                         miles : 303373,
//                         average : 16854.055555555555,
//                         members : [
//                             {
//                                 id : "01RDJ",
//                                 firstName : "Gus",
//                                 lastName : "Robledo",
//                                 age : "62",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "02EPR",
//                                 firstName : "Thomas",
//                                 lastName : "Seipel",
//                                 age : "62",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01RVK",
//                                 firstName : "Wendy",
//                                 lastName : "Muller",
//                                 age : "64",
//                                 miles : 290,
//                                 yards : 510400
//                             },
//                             {
//                                 id : "07RX8",
//                                 firstName : "Kari",
//                                 lastName : "Slawson",
//                                 age : "32",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "09XKA",
//                                 firstName : "Alex",
//                                 lastName : "Bryson",
//                                 age : "28",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "3YDVY",
//                                 firstName : "Sean ",
//                                 lastName : "Murphy",
//                                 age : "38",
//                                 miles : 800,
//                                 yards : 1408000
//                             },
//                             {
//                                 id : "07MWF",
//                                 firstName : "Mark",
//                                 lastName : "Hartmann",
//                                 age : "54",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "W36Z3",
//                                 firstName : "Christele ",
//                                 lastName : "Schwerer",
//                                 age : "55",
//                                 miles : 240,
//                                 yards : 422400
//                             },
//                             {
//                                 id : "096BG",
//                                 firstName : "Jennifer",
//                                 lastName : "Gruenewald",
//                                 age : "56",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "002XB",
//                                 firstName : "Rachel",
//                                 lastName : "Budde",
//                                 age : "50",
//                                 miles : 138,
//                                 yards : 242880
//                             },
//                             {
//                                 id : "01RAN",
//                                 firstName : "Kathleen",
//                                 lastName : "Mering",
//                                 age : "62",
//                                 miles : 360,
//                                 yards : 633600
//                             },
//                             {
//                                 id : "09MDK",
//                                 firstName : "Mary Jo",
//                                 lastName : "Driscoll",
//                                 age : "54",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "07AZR",
//                                 firstName : "Gwyn",
//                                 lastName : "Guenther",
//                                 age : "47",
//                                 miles : 120,
//                                 yards : 211200
//                             },
//                             {
//                                 id : "01RBV",
//                                 firstName : "Stephen",
//                                 lastName : "Justinger",
//                                 age : "68",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01RDA",
//                                 firstName : "Melodee",
//                                 lastName : "Liegl",
//                                 age : "53",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "05XW8",
//                                 firstName : "James",
//                                 lastName : "Culp",
//                                 age : "63",
//                                 miles : 300000,
//                                 yards : 328083
//                             },
//                             {
//                                 id : "01RDC",
//                                 firstName : "Daniel",
//                                 lastName : "Slick",
//                                 age : "72",
//                                 miles : 325,
//                                 yards : 572000
//                             },
//                             {
//                                 id : "0724N",
//                                 firstName : "Angela",
//                                 lastName : "Hansen",
//                                 age : "49",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SWMKE",
//                         id : "200-009",
//                         name : "SWMKE Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "4SPVD",
//                                 firstName : "Ramon",
//                                 lastName : "Serna",
//                                 age : "36",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Allegheny Mountain",
//                 id : "11",
//                 swimmers : 8,
//                 miles : 502175,
//                 yards : 4328000,
//                 average : 62771.875,
//                 clubs : [
//                     {
//                         abbreviation : "MATM",
//                         id : "110-023",
//                         name : "Moon Area Tigers Masters",
//                         swimmers : 1,
//                         yards : 35200,
//                         miles : 20,
//                         average : 20,
//                         members : [
//                             {
//                                 id : "VB9P5",
//                                 firstName : "Pamela",
//                                 lastName : "Garza",
//                                 age : "57",
//                                 miles : 20,
//                                 yards : 35200
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "TPIT",
//                         id : "110-003",
//                         name : "Team Pittsburgh Masters",
//                         swimmers : 4,
//                         yards : 2620800,
//                         miles : 501205,
//                         average : 125301.25,
//                         members : [
//                             {
//                                 id : "07ZWZ",
//                                 firstName : "Scott",
//                                 lastName : "Graham",
//                                 age : "62",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "04UUH",
//                                 firstName : "James",
//                                 lastName : "Jensen",
//                                 age : "59",
//                                 miles : 500000,
//                                 yards : 500000
//                             },
//                             {
//                                 id : "06WAG",
//                                 firstName : "David",
//                                 lastName : "Watterson",
//                                 age : "62",
//                                 miles : 555,
//                                 yards : 976800
//                             },
//                             {
//                                 id : "01JJE",
//                                 firstName : "Kathleen",
//                                 lastName : "Lewis",
//                                 age : "68",
//                                 miles : 500,
//                                 yards : 880000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MLAC",
//                         id : "110-013",
//                         name : "Mt. Lebanon Aqua Club (MLAC)",
//                         swimmers : 3,
//                         yards : 1672000,
//                         miles : 950,
//                         average : 316.6666666666667,
//                         members : [
//                             {
//                                 id : "01JHU",
//                                 firstName : "Paula",
//                                 lastName : "Nettleship",
//                                 age : "53",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "PG3TN",
//                                 firstName : "Julie",
//                                 lastName : "Azzam",
//                                 age : "45",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "01JMF",
//                                 firstName : "Judy",
//                                 lastName : "Caves",
//                                 age : "60",
//                                 miles : 750,
//                                 yards : 1320000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Kentucky",
//                 id : "41",
//                 swimmers : 8,
//                 miles : 630,
//                 yards : 1108800,
//                 average : 78.75,
//                 clubs : [
//                     {
//                         abbreviation : "SKY",
//                         id : "410-011",
//                         name : "Swim Kentucky Masters",
//                         swimmers : 8,
//                         yards : 1108800,
//                         miles : 630,
//                         average : 78.75,
//                         members : [
//                             {
//                                 id : "01W54",
//                                 firstName : "Janice",
//                                 lastName : "Kregor",
//                                 age : "64",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "01WAH",
//                                 firstName : "Mimi",
//                                 lastName : "Ward",
//                                 age : "62",
//                                 miles : 230,
//                                 yards : 404800
//                             },
//                             {
//                                 id : "CJRUS",
//                                 firstName : "C.J. ",
//                                 lastName : "Rushman",
//                                 age : "49",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01WF7",
//                                 firstName : "Susan",
//                                 lastName : "Ehringer",
//                                 age : "52",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "05TV3",
//                                 firstName : "Laura",
//                                 lastName : "Humphrey",
//                                 age : "46",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "0065X",
//                                 firstName : "Elizabeth",
//                                 lastName : "Malkemus",
//                                 age : "51",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06N1N",
//                                 firstName : "Brent",
//                                 lastName : "Smith",
//                                 age : "49",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "084ND",
//                                 firstName : "Jason",
//                                 lastName : "Murray",
//                                 age : "45",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Michigan",
//                 id : "19",
//                 swimmers : 1,
//                 miles : 366,
//                 yards : 644160,
//                 average : 366,
//                 clubs : [
//                     {
//                         abbreviation : "DROP",
//                         id : "190-007",
//                         name : "dROP AQUATICS",
//                         swimmers : 1,
//                         yards : 644160,
//                         miles : 366,
//                         average : 366,
//                         members : [
//                             {
//                                 id : "0A2DU",
//                                 firstName : "Curt",
//                                 lastName : "Martin",
//                                 age : "53",
//                                 miles : 366,
//                                 yards : 644160
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         id : "6",
//         name : "Northwest",
//         swimmers : 129,
//         miles : 4550703,
//         yards : 44877236,
//         average : 35276.767441860466,
//         lmscs : [
//             {
//                 name : "Utah",
//                 id : "34",
//                 swimmers : 11,
//                 miles : 2409,
//                 yards : 4239840,
//                 average : 219,
//                 clubs : [
//                     {
//                         abbreviation : "SDM",
//                         id : "340-010",
//                         name : "South Davis Masters",
//                         swimmers : 3,
//                         yards : 1408000,
//                         miles : 800,
//                         average : 266.6666666666667,
//                         members : [
//                             {
//                                 id : "09J2T",
//                                 firstName : "Thomas",
//                                 lastName : "Woods",
//                                 age : "59",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "06J0H",
//                                 firstName : "Mark",
//                                 lastName : "Belnap",
//                                 age : "51",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "0042N",
//                                 firstName : "Karen",
//                                 lastName : "Oliver",
//                                 age : "60",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SUSA",
//                         id : "340-019",
//                         name : "Southern Utah Swimming Association",
//                         swimmers : 2,
//                         yards : 711040,
//                         miles : 404,
//                         average : 202,
//                         members : [
//                             {
//                                 id : "088HG",
//                                 firstName : "Bruce",
//                                 lastName : "Schroeder",
//                                 age : "68",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "06SKK",
//                                 firstName : "Carol",
//                                 lastName : "Kerlin",
//                                 age : "66",
//                                 miles : 104,
//                                 yards : 183040
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "HASC",
//                         id : "340-025",
//                         name : "Heber Adult Swim Club",
//                         swimmers : 1,
//                         yards : 352000,
//                         miles : 200,
//                         average : 200,
//                         members : [
//                             {
//                                 id : "003XN",
//                                 firstName : "Dennis",
//                                 lastName : "Tesch",
//                                 age : "55",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "UTAH",
//                         id : "340-001",
//                         name : "Swim Utah",
//                         swimmers : 3,
//                         yards : 1064800,
//                         miles : 605,
//                         average : 201.66666666666666,
//                         members : [
//                             {
//                                 id : "003Z6",
//                                 firstName : "Lisa",
//                                 lastName : "Kuwahara",
//                                 age : "57",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "003ZB",
//                                 firstName : "Lo",
//                                 lastName : "Knapp",
//                                 age : "66",
//                                 miles : 330,
//                                 yards : 580800
//                             },
//                             {
//                                 id : "05F5K",
//                                 firstName : "Debra",
//                                 lastName : "Penney",
//                                 age : "63",
//                                 miles : 275,
//                                 yards : 484000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SLOW",
//                         id : "340-006",
//                         name : "Salt Lake Open Water",
//                         swimmers : 1,
//                         yards : 704000,
//                         miles : 400,
//                         average : 400,
//                         members : [
//                             {
//                                 id : "07FW3",
//                                 firstName : "Joelle",
//                                 lastName : "Beard",
//                                 age : "32",
//                                 miles : 400,
//                                 yards : 704000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SALT",
//                         id : "340-003",
//                         name : "Salt Lake Masters Swimming",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "0310P",
//                                 firstName : "William",
//                                 lastName : "Reeves",
//                                 age : "67",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Snake River",
//                 id : "59",
//                 swimmers : 7,
//                 miles : 1594507,
//                 yards : 4496857,
//                 average : 227786.7142857143,
//                 clubs : [
//                     {
//                         abbreviation : "SAWS",
//                         id : "590-001",
//                         name : "Sawtooth Masters",
//                         swimmers : 6,
//                         yards : 4016857,
//                         miles : 1114507,
//                         average : 185751.16666666666,
//                         members : [
//                             {
//                                 id : "03F93",
//                                 firstName : "Jim",
//                                 lastName : "Clemmons",
//                                 age : "70",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "03FM4",
//                                 firstName : "Floyd",
//                                 lastName : "Fisk",
//                                 age : "68",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "UFK3S",
//                                 firstName : "Jeff",
//                                 lastName : "Geist",
//                                 age : "57",
//                                 miles : 800000,
//                                 yards : 800000
//                             },
//                             {
//                                 id : "01J02",
//                                 firstName : "Jill",
//                                 lastName : "Wright",
//                                 age : "69",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "01J12",
//                                 firstName : "Kristi",
//                                 lastName : "Lee",
//                                 age : "45",
//                                 miles : 650,
//                                 yards : 1144000
//                             },
//                             {
//                                 id : "0A3H2",
//                                 firstName : "Kathy",
//                                 lastName : "Lee",
//                                 age : "56",
//                                 miles : 312857,
//                                 yards : 312857
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "IFM",
//                         id : "590-004",
//                         name : "Idaho Falls Masters",
//                         swimmers : 1,
//                         yards : 480000,
//                         miles : 480000,
//                         average : 480000,
//                         members : [
//                             {
//                                 id : "06CUY",
//                                 firstName : "Robin",
//                                 lastName : "Piet",
//                                 age : "67",
//                                 miles : 480000,
//                                 yards : 480000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Pacific Northwest",
//                 id : "36",
//                 swimmers : 41,
//                 miles : 6887,
//                 yards : 12121120,
//                 average : 167.97560975609755,
//                 clubs : [
//                     {
//                         abbreviation : "PSM",
//                         id : "360-001",
//                         name : "Puget Sound Masters",
//                         swimmers : 37,
//                         yards : 11329120,
//                         miles : 6437,
//                         average : 173.97297297297297,
//                         members : [
//                             {
//                                 id : "ZNAXM",
//                                 firstName : "Stephen",
//                                 lastName : "Rich",
//                                 age : "52",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "SG7T8",
//                                 firstName : "Carla",
//                                 lastName : "Bigelow",
//                                 age : "57",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "02KUS",
//                                 firstName : "David",
//                                 lastName : "Tempest",
//                                 age : "70",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02KXZ",
//                                 firstName : "Kirk",
//                                 lastName : "Nelson",
//                                 age : "50",
//                                 miles : 366,
//                                 yards : 644160
//                             },
//                             {
//                                 id : "04FB3",
//                                 firstName : "James",
//                                 lastName : "Underbrink",
//                                 age : "60",
//                                 miles : 366,
//                                 yards : 644160
//                             },
//                             {
//                                 id : "024DY",
//                                 firstName : "James (Jay)",
//                                 lastName : "Bowditch",
//                                 age : "82",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "06J7C",
//                                 firstName : "Morena",
//                                 lastName : "Calvo",
//                                 age : "33",
//                                 miles : 289,
//                                 yards : 508640
//                             },
//                             {
//                                 id : "02KY0",
//                                 firstName : "Wendy",
//                                 lastName : "Hoffman",
//                                 age : "58",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "04FBZ",
//                                 firstName : "Michelle",
//                                 lastName : "McRae",
//                                 age : "45",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "05FK1",
//                                 firstName : "Alex",
//                                 lastName : "Goldstein",
//                                 age : "52",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02M0K",
//                                 firstName : "Michael",
//                                 lastName : "Jones",
//                                 age : "60",
//                                 miles : 120,
//                                 yards : 211200
//                             },
//                             {
//                                 id : "04FGZ",
//                                 firstName : "Jan",
//                                 lastName : "Coleman",
//                                 age : "60",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "076D9",
//                                 firstName : "Wendy",
//                                 lastName : "VanDeSompele",
//                                 age : "54",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "06G3S",
//                                 firstName : "Dan",
//                                 lastName : "Underbrink",
//                                 age : "64",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "07S9Z",
//                                 firstName : "Leslie",
//                                 lastName : "Brown",
//                                 age : "62",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "06TTA",
//                                 firstName : "Johnny",
//                                 lastName : "Van Velthuyzen",
//                                 age : "41",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "02MC1",
//                                 firstName : "Ross",
//                                 lastName : "Linderman",
//                                 age : "43",
//                                 miles : 75,
//                                 yards : 132000
//                             },
//                             {
//                                 id : "08D22",
//                                 firstName : "Jenny",
//                                 lastName : "Ferries",
//                                 age : "39",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02MJW",
//                                 firstName : "Carl",
//                                 lastName : "Haynie",
//                                 age : "60",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06990",
//                                 firstName : "Barbara",
//                                 lastName : "Belt",
//                                 age : "65",
//                                 miles : 240,
//                                 yards : 422400
//                             },
//                             {
//                                 id : "03BNB",
//                                 firstName : "lyle",
//                                 lastName : "nalli",
//                                 age : "60",
//                                 miles : 95,
//                                 yards : 167200
//                             },
//                             {
//                                 id : "08195",
//                                 firstName : "Chad",
//                                 lastName : "Hagedorn",
//                                 age : "48",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0971Z",
//                                 firstName : "Amy",
//                                 lastName : "Wolfe",
//                                 age : "50",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "BEARS",
//                                 firstName : "Richard",
//                                 lastName : "Adcock",
//                                 age : "65",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "067K7",
//                                 firstName : "Nathan",
//                                 lastName : "Poppink",
//                                 age : "42",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "07Z8A",
//                                 firstName : "Keith",
//                                 lastName : "Uyekawa",
//                                 age : "59",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "090XX",
//                                 firstName : "Mary",
//                                 lastName : "Tuffley",
//                                 age : "72",
//                                 miles : 120,
//                                 yards : 211200
//                             },
//                             {
//                                 id : "0843E",
//                                 firstName : "Jessica",
//                                 lastName : "Dubey",
//                                 age : "57",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "094UE",
//                                 firstName : "Allison",
//                                 lastName : "Villarreal",
//                                 age : "58",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "02KJU",
//                                 firstName : "Sally",
//                                 lastName : "Dillon",
//                                 age : "74",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "07GD5",
//                                 firstName : "Wendy",
//                                 lastName : "Polidori",
//                                 age : "51",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "04NEV",
//                                 firstName : "Chris",
//                                 lastName : "Mathes",
//                                 age : "54",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0AXJ6",
//                                 firstName : "Carol",
//                                 lastName : "Horowitz",
//                                 age : "68",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "06ESP",
//                                 firstName : "Carolyn",
//                                 lastName : "Hewitt",
//                                 age : "68",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "02KKY",
//                                 firstName : "Kris",
//                                 lastName : "Speir",
//                                 age : "57",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "0B591",
//                                 firstName : "Maddie",
//                                 lastName : "Sibilia",
//                                 age : "24",
//                                 miles : 366,
//                                 yards : 644160
//                             },
//                             {
//                                 id : "07GM3",
//                                 firstName : "Kari",
//                                 lastName : "Wetzler",
//                                 age : "40",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "BWAQ",
//                         id : "360-002",
//                         name : "Blue Wave Aquatics",
//                         swimmers : 3,
//                         yards : 528000,
//                         miles : 300,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "GBUSH",
//                                 firstName : "Gabe",
//                                 lastName : "Bush",
//                                 age : "43",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "04FMM",
//                                 firstName : "Kenneth",
//                                 lastName : "Kreer",
//                                 age : "57",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "04FNV",
//                                 firstName : "Angela",
//                                 lastName : "Turley",
//                                 age : "56",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "BSSW",
//                         id : "360-019",
//                         name : "Bellevue Swims Strong",
//                         swimmers : 1,
//                         yards : 264000,
//                         miles : 150,
//                         average : 150,
//                         members : [
//                             {
//                                 id : "083T9",
//                                 firstName : "Trish",
//                                 lastName : "Cox",
//                                 age : "54",
//                                 miles : 150,
//                                 yards : 264000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Oregon",
//                 id : "37",
//                 swimmers : 48,
//                 miles : 2943655,
//                 yards : 18308219,
//                 average : 61326.145833333336,
//                 clubs : [
//                     {
//                         abbreviation : "OREG",
//                         id : "370-001",
//                         name : "Oregon Masters",
//                         swimmers : 47,
//                         yards : 17252219,
//                         miles : 2943055,
//                         average : 62618.1914893617,
//                         members : [
//                             {
//                                 id : "02621",
//                                 firstName : "Laura",
//                                 lastName : "Worden",
//                                 age : "63",
//                                 miles : 190,
//                                 yards : 334400
//                             },
//                             {
//                                 id : "067TS",
//                                 firstName : "Steve",
//                                 lastName : "Roberts",
//                                 age : "61",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0601J",
//                                 firstName : "Paul (Tank)",
//                                 lastName : "McNamara",
//                                 age : "57",
//                                 miles : 600,
//                                 yards : 1056000
//                             },
//                             {
//                                 id : "0264J",
//                                 firstName : "Christina",
//                                 lastName : "Fox",
//                                 age : "59",
//                                 miles : 120,
//                                 yards : 211200
//                             },
//                             {
//                                 id : "07MKJ",
//                                 firstName : "Christine",
//                                 lastName : "Hirsch",
//                                 age : "51",
//                                 miles : 170,
//                                 yards : 299200
//                             },
//                             {
//                                 id : "08C5T",
//                                 firstName : "Allison",
//                                 lastName : "Kunerth",
//                                 age : "34",
//                                 miles : 75,
//                                 yards : 132000
//                             },
//                             {
//                                 id : "09N7Y",
//                                 firstName : "Sally",
//                                 lastName : "Panasenko",
//                                 age : "60",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "026BY",
//                                 firstName : "Janet",
//                                 lastName : "Gettling",
//                                 age : "72",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "EYEEM",
//                                 firstName : "Anicia",
//                                 lastName : "Criscione",
//                                 age : "47",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "026FA",
//                                 firstName : "Cheryl",
//                                 lastName : "Morgen",
//                                 age : "51",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "06FNZ",
//                                 firstName : "Lara",
//                                 lastName : "Sernoffsky",
//                                 age : "39",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "XV6K1",
//                                 firstName : "Melisa",
//                                 lastName : "Wells",
//                                 age : "32",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "09JSX",
//                                 firstName : "Megan",
//                                 lastName : "Tosh",
//                                 age : "35",
//                                 miles : 620000,
//                                 yards : 620000
//                             },
//                             {
//                                 id : "026GP",
//                                 firstName : "Mary Anne",
//                                 lastName : "Royle",
//                                 age : "68",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01KKH",
//                                 firstName : "Sumner",
//                                 lastName : "Williams",
//                                 age : "41",
//                                 miles : 365000,
//                                 yards : 365000
//                             },
//                             {
//                                 id : "JAMES",
//                                 firstName : "James",
//                                 lastName : "Adams",
//                                 age : "43",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "026K1",
//                                 firstName : "Lori",
//                                 lastName : "Lamoureux",
//                                 age : "61",
//                                 miles : 225,
//                                 yards : 396000
//                             },
//                             {
//                                 id : "068S7",
//                                 firstName : "Nadine",
//                                 lastName : "Edwards",
//                                 age : "73",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "06RND",
//                                 firstName : "John",
//                                 lastName : "Chalmers",
//                                 age : "57",
//                                 miles : 500000,
//                                 yards : 546806
//                             },
//                             {
//                                 id : "06W7A",
//                                 firstName : "Sue",
//                                 lastName : "Phillips",
//                                 age : "56",
//                                 miles : 1000000,
//                                 yards : 1093613
//                             },
//                             {
//                                 id : "026NC",
//                                 firstName : "Wes",
//                                 lastName : "Edwards",
//                                 age : "67",
//                                 miles : 60,
//                                 yards : 105600
//                             },
//                             {
//                                 id : "07AK9",
//                                 firstName : "Kelly",
//                                 lastName : "MacNeil",
//                                 age : "38",
//                                 miles : 366,
//                                 yards : 644160
//                             },
//                             {
//                                 id : "BARRY",
//                                 firstName : "Barry",
//                                 lastName : "Fasbender",
//                                 age : "83",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07VY6",
//                                 firstName : "Marcie",
//                                 lastName : "Bowman",
//                                 age : "56",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "05WN2",
//                                 firstName : "Douglas",
//                                 lastName : "Easton",
//                                 age : "66",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "CPTBH",
//                                 firstName : "Jason",
//                                 lastName : "McCauley",
//                                 age : "52",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "UE4JT",
//                                 firstName : "Lori",
//                                 lastName : "Shontz",
//                                 age : "51",
//                                 miles : 450000,
//                                 yards : 450000
//                             },
//                             {
//                                 id : "03HB5",
//                                 firstName : "Marg",
//                                 lastName : "Bartosek",
//                                 age : "69",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "07343",
//                                 firstName : "Michael",
//                                 lastName : "Kelber",
//                                 age : "73",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "025Y4",
//                                 firstName : "Patrick",
//                                 lastName : "Allender",
//                                 age : "62",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "0AWJ4",
//                                 firstName : "Erin",
//                                 lastName : "Cavender",
//                                 age : "26",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "026UR",
//                                 firstName : "Jules",
//                                 lastName : "DeGiulio",
//                                 age : "67",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "0260N",
//                                 firstName : "Nancy",
//                                 lastName : "Vincent",
//                                 age : "61",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "026ZH",
//                                 firstName : "Elizabeth",
//                                 lastName : "Harrison",
//                                 age : "46",
//                                 miles : 450,
//                                 yards : 792000
//                             },
//                             {
//                                 id : "0B75Y",
//                                 firstName : "Anna",
//                                 lastName : "Daggett",
//                                 age : "25",
//                                 miles : 350,
//                                 yards : 616000
//                             },
//                             {
//                                 id : "0261C",
//                                 firstName : "Ralph",
//                                 lastName : "Mohr",
//                                 age : "79",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "007A2",
//                                 firstName : "James",
//                                 lastName : "Proffitt",
//                                 age : "55",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "0261N",
//                                 firstName : "James",
//                                 lastName : "DiGiulio",
//                                 age : "68",
//                                 miles : 234,
//                                 yards : 411840
//                             },
//                             {
//                                 id : "02702",
//                                 firstName : "Aubree",
//                                 lastName : "Gustafson",
//                                 age : "39",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0700Z",
//                                 firstName : "Jo Ann",
//                                 lastName : "Casselberry",
//                                 age : "66",
//                                 miles : 75,
//                                 yards : 132000
//                             },
//                             {
//                                 id : "09MMT",
//                                 firstName : "Janelle",
//                                 lastName : "Miller",
//                                 age : "57",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "0261R",
//                                 firstName : "Kathy",
//                                 lastName : "Eckert-Mason",
//                                 age : "63",
//                                 miles : 335,
//                                 yards : 589600
//                             },
//                             {
//                                 id : "06UPX",
//                                 firstName : "Chris",
//                                 lastName : "Donnermeyer",
//                                 age : "44",
//                                 miles : 125,
//                                 yards : 220000
//                             },
//                             {
//                                 id : "07883",
//                                 firstName : "Linda",
//                                 lastName : "Fox",
//                                 age : "57",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "046WU",
//                                 firstName : "Elise",
//                                 lastName : "Mahoney",
//                                 age : "36",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "0B44R",
//                                 firstName : "Rob",
//                                 lastName : "Birdwell",
//                                 age : "55",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "06NDJ",
//                                 firstName : "Nick",
//                                 lastName : "Thorpe",
//                                 age : "41",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "WSCM",
//                         id : "370-015",
//                         name : "willamalane swim club masters",
//                         swimmers : 1,
//                         yards : 1056000,
//                         miles : 600,
//                         average : 600,
//                         members : [
//                             {
//                                 id : "03S67",
//                                 firstName : "Lynette",
//                                 lastName : "Greco",
//                                 age : "51",
//                                 miles : 600,
//                                 yards : 1056000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Alaska",
//                 id : "56",
//                 swimmers : 8,
//                 miles : 1295,
//                 yards : 2279200,
//                 average : 161.875,
//                 clubs : [
//                     {
//                         abbreviation : "AKMS",
//                         id : "560-001",
//                         name : "AKMS",
//                         swimmers : 8,
//                         yards : 2279200,
//                         miles : 1295,
//                         average : 161.875,
//                         members : [
//                             {
//                                 id : "01P3M",
//                                 firstName : "James",
//                                 lastName : "Lima",
//                                 age : "65",
//                                 miles : 125,
//                                 yards : 220000
//                             },
//                             {
//                                 id : "01P7G",
//                                 firstName : "Cathy",
//                                 lastName : "Tide",
//                                 age : "46",
//                                 miles : 170,
//                                 yards : 299200
//                             },
//                             {
//                                 id : "SWAMR",
//                                 firstName : "Kenneth",
//                                 lastName : "Winterberger",
//                                 age : "67",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "028HT",
//                                 firstName : "Barbara",
//                                 lastName : "Johnson",
//                                 age : "70",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "620VJ",
//                                 firstName : "Kristen",
//                                 lastName : "Hamilton",
//                                 age : "33",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07EX7",
//                                 firstName : "Matthew",
//                                 lastName : "Rielly",
//                                 age : "65",
//                                 miles : 450,
//                                 yards : 792000
//                             },
//                             {
//                                 id : "070RB",
//                                 firstName : "Ben",
//                                 lastName : "Harris",
//                                 age : "55",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "P64K9",
//                                 firstName : "Michael",
//                                 lastName : "Burt",
//                                 age : "50",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Inland Northwest",
//                 id : "35",
//                 swimmers : 9,
//                 miles : 1210,
//                 yards : 2129600,
//                 average : 134.44444444444446,
//                 clubs : [
//                     {
//                         abbreviation : "LCNM",
//                         id : "350-004",
//                         name : "Lewis Clark Neptunes Masters",
//                         swimmers : 3,
//                         yards : 264000,
//                         miles : 150,
//                         average : 50,
//                         members : [
//                             {
//                                 id : "07K68",
//                                 firstName : "Jay",
//                                 lastName : "Hesse",
//                                 age : "51",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07THT",
//                                 firstName : "Herlinde",
//                                 lastName : "Beck",
//                                 age : "67",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "01MZ1",
//                                 firstName : "Margaret",
//                                 lastName : "Hair",
//                                 age : "65",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "KM",
//                         id : "350-018",
//                         name : "Kroc Masters",
//                         swimmers : 3,
//                         yards : 897600,
//                         miles : 510,
//                         average : 170,
//                         members : [
//                             {
//                                 id : "04DE9",
//                                 firstName : "Jennifer",
//                                 lastName : "Polello",
//                                 age : "49",
//                                 miles : 210,
//                                 yards : 369600
//                             },
//                             {
//                                 id : "01ZZG",
//                                 firstName : "Matthew",
//                                 lastName : "Bronson",
//                                 age : "55",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "077AY",
//                                 firstName : "Bill",
//                                 lastName : "Waggoner",
//                                 age : "73",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MRA",
//                         id : "350-033",
//                         name : "Moses Lake Masters",
//                         swimmers : 1,
//                         yards : 528000,
//                         miles : 300,
//                         average : 300,
//                         members : [
//                             {
//                                 id : "05TC3",
//                                 firstName : "Mark",
//                                 lastName : "Amara",
//                                 age : "70",
//                                 miles : 300,
//                                 yards : 528000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "WENM",
//                         id : "350-016",
//                         name : "Wenatchee Valley Masters",
//                         swimmers : 1,
//                         yards : 440000,
//                         miles : 250,
//                         average : 250,
//                         members : [
//                             {
//                                 id : "4DNHS",
//                                 firstName : "Aleesha",
//                                 lastName : "Kobernik",
//                                 age : "41",
//                                 miles : 250,
//                                 yards : 440000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SCM",
//                         id : "350-025",
//                         name : "Spokane Club Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "01MXU",
//                                 firstName : "Larry",
//                                 lastName : "Krauser",
//                                 age : "67",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Montana",
//                 id : "31",
//                 swimmers : 5,
//                 miles : 740,
//                 yards : 1302400,
//                 average : 148,
//                 clubs : [
//                     {
//                         abbreviation : "BOZE",
//                         id : "310-002",
//                         name : "Bozeman Masters Swimming Club",
//                         swimmers : 1,
//                         yards : 334400,
//                         miles : 190,
//                         average : 190,
//                         members : [
//                             {
//                                 id : "05P8P",
//                                 firstName : "Mary",
//                                 lastName : "Robbins",
//                                 age : "71",
//                                 miles : 190,
//                                 yards : 334400
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "FLOW",
//                         id : "310-006",
//                         name : "Flathead Lake Open Water Swimmers",
//                         swimmers : 1,
//                         yards : 440000,
//                         miles : 250,
//                         average : 250,
//                         members : [
//                             {
//                                 id : "089CF",
//                                 firstName : "Jill",
//                                 lastName : "Zadny",
//                                 age : "41",
//                                 miles : 250,
//                                 yards : 440000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MMMT",
//                         id : "310-007",
//                         name : "Missoula Masters",
//                         swimmers : 2,
//                         yards : 352000,
//                         miles : 200,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "01JPD",
//                                 firstName : "Mark",
//                                 lastName : "Comfort",
//                                 age : "66",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "0BANK",
//                                 firstName : "Brady",
//                                 lastName : "Baughman",
//                                 age : "26",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "KATS",
//                         id : "310-005",
//                         name : "Kalispell Masters",
//                         swimmers : 1,
//                         yards : 176000,
//                         miles : 100,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "0AP3S",
//                                 firstName : "Sandy",
//                                 lastName : "Ross",
//                                 age : "61",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         id : "8",
//         name : "Oceana",
//         swimmers : 170,
//         miles : 6841458,
//         yards : 56945886,
//         average : 40243.870588235295,
//         lmscs : [
//             {
//                 name : "Pacific",
//                 id : "38",
//                 swimmers : 161,
//                 miles : 5490743,
//                 yards : 54337486,
//                 average : 34103.99378881988,
//                 clubs : [
//                     {
//                         abbreviation : "MVM",
//                         id : "380-006",
//                         name : "Mountain View Masters",
//                         swimmers : 12,
//                         yards : 3507680,
//                         miles : 1993,
//                         average : 166.08333333333334,
//                         members : [
//                             {
//                                 id : "03SYF",
//                                 firstName : "Richard",
//                                 lastName : "Freeman",
//                                 age : "62",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0ACZM",
//                                 firstName : "John",
//                                 lastName : "Goode",
//                                 age : "53",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "00FNZ",
//                                 firstName : "Elaine",
//                                 lastName : "Thomas",
//                                 age : "66",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0AHPD",
//                                 firstName : "Mary",
//                                 lastName : "Campione",
//                                 age : "57",
//                                 miles : 220,
//                                 yards : 387200
//                             },
//                             {
//                                 id : "03GND",
//                                 firstName : "T Dale",
//                                 lastName : "Jackson",
//                                 age : "59",
//                                 miles : 385,
//                                 yards : 677600
//                             },
//                             {
//                                 id : "03GPT",
//                                 firstName : "Vickey",
//                                 lastName : "Weir",
//                                 age : "69",
//                                 miles : 366,
//                                 yards : 644160
//                             },
//                             {
//                                 id : "07JWD",
//                                 firstName : "Kristin",
//                                 lastName : "Norwood",
//                                 age : "36",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "03GPU",
//                                 firstName : "Andrew",
//                                 lastName : "Maisel",
//                                 age : "64",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "06MZ8",
//                                 firstName : "Sabrina",
//                                 lastName : "Maisel",
//                                 age : "30",
//                                 miles : 257,
//                                 yards : 452320
//                             },
//                             {
//                                 id : "08A8C",
//                                 firstName : "Kathi",
//                                 lastName : "Lucas",
//                                 age : "67",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "07X03",
//                                 firstName : "Michael",
//                                 lastName : "Thomas",
//                                 age : "28",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "SB1EF",
//                                 firstName : "Eric",
//                                 lastName : "Vettel",
//                                 age : "55",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "VACA",
//                         id : "380-174",
//                         name : "Vacaville Swim Club",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "075CS",
//                                 firstName : "Mark",
//                                 lastName : "Frazier",
//                                 age : "61",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CGM",
//                         id : "380-347",
//                         name : "California Gold Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "0AYKV",
//                                 firstName : "Eric",
//                                 lastName : "Wright",
//                                 age : "47",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "TSUN",
//                         id : "380-133",
//                         name : "SF Tsunami Masters",
//                         swimmers : 5,
//                         yards : 2590720,
//                         miles : 1472,
//                         average : 294.4,
//                         members : [
//                             {
//                                 id : "03G3H",
//                                 firstName : "Mark",
//                                 lastName : "White",
//                                 age : "57",
//                                 miles : 350,
//                                 yards : 616000
//                             },
//                             {
//                                 id : "03X6C",
//                                 firstName : "Christophe",
//                                 lastName : "Crombez",
//                                 age : "53",
//                                 miles : 366,
//                                 yards : 644160
//                             },
//                             {
//                                 id : "03HRM",
//                                 firstName : "Casey",
//                                 lastName : "Cheung",
//                                 age : "47",
//                                 miles : 366,
//                                 yards : 644160
//                             },
//                             {
//                                 id : "06ABK",
//                                 firstName : "Phil",
//                                 lastName : "Diers",
//                                 age : "63",
//                                 miles : 190,
//                                 yards : 334400
//                             },
//                             {
//                                 id : "03VNM",
//                                 firstName : "Louis",
//                                 lastName : "Ceci",
//                                 age : "70",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "DAM",
//                         id : "380-003",
//                         name : "Davis Aquatic Masters",
//                         swimmers : 15,
//                         yards : 5244246,
//                         miles : 502669,
//                         average : 33511.26666666667,
//                         members : [
//                             {
//                                 id : "040UN",
//                                 firstName : "Katy",
//                                 lastName : "Lantz",
//                                 age : "67",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "0A3M4",
//                                 firstName : "Victoria",
//                                 lastName : "Burruel",
//                                 age : "66",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "03GEZ",
//                                 firstName : "Leslie",
//                                 lastName : "Westergaard",
//                                 age : "77",
//                                 miles : 385,
//                                 yards : 677600
//                             },
//                             {
//                                 id : "041KE",
//                                 firstName : "Deanna",
//                                 lastName : "Johnson",
//                                 age : "64",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "03U42",
//                                 firstName : "Robert",
//                                 lastName : "Lantz",
//                                 age : "69",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "08CRR",
//                                 firstName : "Kevin",
//                                 lastName : "Waterson",
//                                 age : "41",
//                                 miles : 500000,
//                                 yards : 546806
//                             },
//                             {
//                                 id : "07KEV",
//                                 firstName : "Steve",
//                                 lastName : "Reynolds",
//                                 age : "62",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "03GGS",
//                                 firstName : "Jackie",
//                                 lastName : "Chow",
//                                 age : "42",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "JENNY",
//                                 firstName : "Jennifer",
//                                 lastName : "Phalen",
//                                 age : "56",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "06JFA",
//                                 firstName : "Helene",
//                                 lastName : "Nehrebecki",
//                                 age : "40",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "05PKW",
//                                 firstName : "Melanie",
//                                 lastName : "Belluomini",
//                                 age : "43",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "03HHA",
//                                 firstName : "Lynn",
//                                 lastName : "Narlesky",
//                                 age : "68",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "03FZX",
//                                 firstName : "Melanie",
//                                 lastName : "Bowden",
//                                 age : "57",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "03GY3",
//                                 firstName : "Kathy",
//                                 lastName : "Gill",
//                                 age : "66",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "07TXP",
//                                 firstName : "Edith",
//                                 lastName : "Hannigan",
//                                 age : "33",
//                                 miles : 84,
//                                 yards : 147840
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MMSW",
//                         id : "380-237",
//                         name : "Mavericks Masters Swimming",
//                         swimmers : 2,
//                         yards : 132000,
//                         miles : 75,
//                         average : 37.5,
//                         members : [
//                             {
//                                 id : "06XA8",
//                                 firstName : "Joseph",
//                                 lastName : "Giulianelli",
//                                 age : "59",
//                                 miles : 75,
//                                 yards : 132000
//                             },
//                             {
//                                 id : "07307",
//                                 firstName : "Erika",
//                                 lastName : "Adkins",
//                                 age : "51",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "STAN",
//                         id : "380-082",
//                         name : "Stanford Masters Swimming",
//                         swimmers : 3,
//                         yards : 799120,
//                         miles : 250312,
//                         average : 83437.33333333333,
//                         members : [
//                             {
//                                 id : "03H0Y",
//                                 firstName : "Nicole",
//                                 lastName : "Watson-Digneo",
//                                 age : "48",
//                                 miles : 250000,
//                                 yards : 250000
//                             },
//                             {
//                                 id : "03K93",
//                                 firstName : "Rick",
//                                 lastName : "Gould",
//                                 age : "52",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "03Z9Z",
//                                 firstName : "Nan",
//                                 lastName : "McKenna",
//                                 age : "59",
//                                 miles : 312,
//                                 yards : 549120
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SCSC",
//                         id : "380-044",
//                         name : "Santa Clara Swim Club Masters",
//                         swimmers : 1,
//                         yards : 966240,
//                         miles : 549,
//                         average : 549,
//                         members : [
//                             {
//                                 id : "03K8S",
//                                 firstName : "Maximiliano",
//                                 lastName : "Mehech",
//                                 age : "59",
//                                 miles : 549,
//                                 yards : 966240
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "PALO",
//                         id : "380-375",
//                         name : "Palo Alto Masters",
//                         swimmers : 2,
//                         yards : 528000,
//                         miles : 300,
//                         average : 150,
//                         members : [
//                             {
//                                 id : "03FAD",
//                                 firstName : "Mike",
//                                 lastName : "Cobb",
//                                 age : "55",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "RGAB1",
//                                 firstName : "Richard",
//                                 lastName : "Bone",
//                                 age : "53",
//                                 miles : 50,
//                                 yards : 88000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "ECAM",
//                         id : "380-018",
//                         name : "El Cerrito Aquatic Masters",
//                         swimmers : 4,
//                         yards : 176000,
//                         miles : 100,
//                         average : 25,
//                         members : [
//                             {
//                                 id : "03T45",
//                                 firstName : "Keri",
//                                 lastName : "Pock",
//                                 age : "35",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "03HS4",
//                                 firstName : "Michelle",
//                                 lastName : "Rembaum-Fox",
//                                 age : "62",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "03J5C",
//                                 firstName : "Stephen",
//                                 lastName : "Dunkle",
//                                 age : "58",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "XACF8",
//                                 firstName : "Gregory",
//                                 lastName : "Rice",
//                                 age : "47",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "TCAM",
//                         id : "380-050",
//                         name : "Tuolumne County Aquatic Masters",
//                         swimmers : 4,
//                         yards : 528000,
//                         miles : 300,
//                         average : 75,
//                         members : [
//                             {
//                                 id : "03G6X",
//                                 firstName : "Megan",
//                                 lastName : "Mills",
//                                 age : "50",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "03M9M",
//                                 firstName : "Carlina",
//                                 lastName : "Shepherd",
//                                 age : "64",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "077AV",
//                                 firstName : "Cheryl",
//                                 lastName : "Harms",
//                                 age : "69",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "03JFS",
//                                 firstName : "Maria",
//                                 lastName : "Layne",
//                                 age : "62",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "HUMM",
//                         id : "380-290",
//                         name : "Humboldt Masters",
//                         swimmers : 4,
//                         yards : 1792000,
//                         miles : 1000450,
//                         average : 250112.5,
//                         members : [
//                             {
//                                 id : "03XJZ",
//                                 firstName : "Debby",
//                                 lastName : "Lazzar",
//                                 age : "68",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "03UZV",
//                                 firstName : "Suzanne",
//                                 lastName : "Pasztor",
//                                 age : "56",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "026TZ",
//                                 firstName : "Donna",
//                                 lastName : "Taylor",
//                                 age : "62",
//                                 miles : 1000000,
//                                 yards : 1000000
//                             },
//                             {
//                                 id : "06AC0",
//                                 firstName : "Kelly",
//                                 lastName : "Carlin",
//                                 age : "58",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "ECYM",
//                         id : "380-038",
//                         name : "El Camino YMCA Masters",
//                         swimmers : 1,
//                         yards : 387200,
//                         miles : 220,
//                         average : 220,
//                         members : [
//                             {
//                                 id : "040Z9",
//                                 firstName : "Lucia",
//                                 lastName : "Panini",
//                                 age : "52",
//                                 miles : 220,
//                                 yards : 387200
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MELO",
//                         id : "380-036",
//                         name : "Menlo Masters ",
//                         swimmers : 2,
//                         yards : 1440000,
//                         miles : 1000250,
//                         average : 500125,
//                         members : [
//                             {
//                                 id : "03H12",
//                                 firstName : "Stacy",
//                                 lastName : "Fredericksen",
//                                 age : "62",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "02000",
//                                 firstName : "Janet",
//                                 lastName : "Renner",
//                                 age : "59",
//                                 miles : 1000000,
//                                 yards : 1000000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "TVM",
//                         id : "380-102",
//                         name : "Tri Valley Masters",
//                         swimmers : 3,
//                         yards : 730400,
//                         miles : 415,
//                         average : 138.33333333333334,
//                         members : [
//                             {
//                                 id : "07BJ6",
//                                 firstName : "Maddison",
//                                 lastName : "Bowles",
//                                 age : "32",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "03BCW",
//                                 firstName : "Katie",
//                                 lastName : "Burch",
//                                 age : "43",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "06SJ1",
//                                 firstName : "Don",
//                                 lastName : "Johnston",
//                                 age : "67",
//                                 miles : 165,
//                                 yards : 290400
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "PAC1",
//                         id : "380-365",
//                         name : "Elk Grove Piranhas Aquatic Club",
//                         swimmers : 1,
//                         yards : 968000,
//                         miles : 550,
//                         average : 550,
//                         members : [
//                             {
//                                 id : "0B47K",
//                                 firstName : "Sean",
//                                 lastName : "Bateman",
//                                 age : "51",
//                                 miles : 550,
//                                 yards : 968000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "LAMV",
//                         id : "380-132",
//                         name : "Los Altos Mountain View Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "0681Y",
//                                 firstName : "Berke",
//                                 lastName : "Cetinoneri",
//                                 age : "35",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "GFDM",
//                         id : "380-047",
//                         name : "Get Fit Davis Swim Masters",
//                         swimmers : 2,
//                         yards : 792000,
//                         miles : 450,
//                         average : 225,
//                         members : [
//                             {
//                                 id : "07U6U",
//                                 firstName : "Susan",
//                                 lastName : "Padgett",
//                                 age : "72",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "05GSU",
//                                 firstName : "Rita",
//                                 lastName : "Mt Joy",
//                                 age : "78",
//                                 miles : 250,
//                                 yards : 440000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MAQ",
//                         id : "380-264",
//                         name : "Marin Aquatic Masters ",
//                         swimmers : 2,
//                         yards : 1425600,
//                         miles : 810,
//                         average : 405,
//                         members : [
//                             {
//                                 id : "072A0",
//                                 firstName : "Stacey",
//                                 lastName : "Ellison",
//                                 age : "54",
//                                 miles : 700,
//                                 yards : 1232000
//                             },
//                             {
//                                 id : "06UCT",
//                                 firstName : "Terri",
//                                 lastName : "Leinsteiner",
//                                 age : "62",
//                                 miles : 110,
//                                 yards : 193600
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CCA",
//                         id : "380-355",
//                         name : "California Capital Aquatics Masters",
//                         swimmers : 2,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "05VHV",
//                                 firstName : "Rachel",
//                                 lastName : "Robertson",
//                                 age : "30",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "NHBE4",
//                                 firstName : "Matthew",
//                                 lastName : "Kennedy",
//                                 age : "38",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "WCM",
//                         id : "380-027",
//                         name : "Walnut Creek Masters",
//                         swimmers : 11,
//                         yards : 4514920,
//                         miles : 615217,
//                         average : 55928.818181818184,
//                         members : [
//                             {
//                                 id : "03FBU",
//                                 firstName : "David",
//                                 lastName : "Matthews",
//                                 age : "57",
//                                 miles : 250000,
//                                 yards : 250000
//                             },
//                             {
//                                 id : "B0BUP",
//                                 firstName : "Bob",
//                                 lastName : "Upshaw",
//                                 age : "71",
//                                 miles : 350,
//                                 yards : 616000
//                             },
//                             {
//                                 id : "03K97",
//                                 firstName : "Karen",
//                                 lastName : "Tukua",
//                                 age : "70",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "03KCE",
//                                 firstName : "Robert",
//                                 lastName : "McNally",
//                                 age : "74",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "03KYM",
//                                 firstName : "Spence",
//                                 lastName : "Culpepper",
//                                 age : "49",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "03M7B",
//                                 firstName : "Laurie",
//                                 lastName : "Gardiner",
//                                 age : "56",
//                                 miles : 210,
//                                 yards : 369600
//                             },
//                             {
//                                 id : "074CA",
//                                 firstName : "Linda",
//                                 lastName : "Harrell",
//                                 age : "62",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "04EH3",
//                                 firstName : "Kelly",
//                                 lastName : "Stynes",
//                                 age : "49",
//                                 miles : 349,
//                                 yards : 614240
//                             },
//                             {
//                                 id : "081Y6",
//                                 firstName : "Catherine",
//                                 lastName : "Taylor",
//                                 age : "57",
//                                 miles : 375,
//                                 yards : 660000
//                             },
//                             {
//                                 id : "05S3C",
//                                 firstName : "Paula",
//                                 lastName : "Asmus",
//                                 age : "55",
//                                 miles : 363000,
//                                 yards : 363000
//                             },
//                             {
//                                 id : "004V9",
//                                 firstName : "Julie",
//                                 lastName : "Meis",
//                                 age : "63",
//                                 miles : 333,
//                                 yards : 586080
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SMAC",
//                         id : "380-274",
//                         name : "Sebastopol Masters Aquatic Club",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "03TX2",
//                                 firstName : "Samuel",
//                                 lastName : "Leader",
//                                 age : "73",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "NVM",
//                         id : "380-068",
//                         name : "Napa Valley Masters",
//                         swimmers : 1,
//                         yards : 176000,
//                         miles : 100,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "03XU7",
//                                 firstName : "Thomas",
//                                 lastName : "MCNICHOLAS",
//                                 age : "81",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "TOC",
//                         id : "380-008",
//                         name : "The Olympic Club",
//                         swimmers : 3,
//                         yards : 880000,
//                         miles : 500,
//                         average : 166.66666666666666,
//                         members : [
//                             {
//                                 id : "079BY",
//                                 firstName : "Lee",
//                                 lastName : "Haris",
//                                 age : "66",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06P5K",
//                                 firstName : "Dick",
//                                 lastName : "Warren",
//                                 age : "73",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "03F7Y",
//                                 firstName : "Phyllis",
//                                 lastName : "Quinn",
//                                 age : "65",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MAM",
//                         id : "380-053",
//                         name : "Manatee Aquatic Masters Inc",
//                         swimmers : 20,
//                         yards : 8034400,
//                         miles : 4565,
//                         average : 228.25,
//                         members : [
//                             {
//                                 id : "03H39",
//                                 firstName : "Peter",
//                                 lastName : "Finney",
//                                 age : "53",
//                                 miles : 350,
//                                 yards : 616000
//                             },
//                             {
//                                 id : "03HSY",
//                                 firstName : "John",
//                                 lastName : "Keady",
//                                 age : "56",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "03GFS",
//                                 firstName : "Donna",
//                                 lastName : "Straff",
//                                 age : "68",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "03H3C",
//                                 firstName : "Chris",
//                                 lastName : "Bond",
//                                 age : "53",
//                                 miles : 600,
//                                 yards : 1056000
//                             },
//                             {
//                                 id : "03GFV",
//                                 firstName : "Robin",
//                                 lastName : "Mills",
//                                 age : "58",
//                                 miles : 325,
//                                 yards : 572000
//                             },
//                             {
//                                 id : "03J5A",
//                                 firstName : "Kirsten",
//                                 lastName : "Halbrook",
//                                 age : "52",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "09UK6",
//                                 firstName : "David",
//                                 lastName : "Law",
//                                 age : "35",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "03Z89",
//                                 firstName : "Jennifer",
//                                 lastName : "Brakeman",
//                                 age : "50",
//                                 miles : 350,
//                                 yards : 616000
//                             },
//                             {
//                                 id : "03FWJ",
//                                 firstName : "Juliet",
//                                 lastName : "Cox",
//                                 age : "52",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "03V2T",
//                                 firstName : "Caroline",
//                                 lastName : "Sorenson",
//                                 age : "38",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "03FWP",
//                                 firstName : "Annmarie",
//                                 lastName : "Hallin",
//                                 age : "77",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "03ZWE",
//                                 firstName : "Beccah",
//                                 lastName : "Rothschild",
//                                 age : "46",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "03FWT",
//                                 firstName : "Kate",
//                                 lastName : "Johnson",
//                                 age : "66",
//                                 miles : 180,
//                                 yards : 316800
//                             },
//                             {
//                                 id : "03HPR",
//                                 firstName : "Michael",
//                                 lastName : "Voorhies",
//                                 age : "73",
//                                 miles : 120,
//                                 yards : 211200
//                             },
//                             {
//                                 id : "03F7H",
//                                 firstName : "Brian",
//                                 lastName : "Stack",
//                                 age : "69",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "03S2K",
//                                 firstName : "Kathleen",
//                                 lastName : "Kline",
//                                 age : "64",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "03HPT",
//                                 firstName : "Susan",
//                                 lastName : "Fuentes",
//                                 age : "47",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "03G1A",
//                                 firstName : "Kelly",
//                                 lastName : "McGrath",
//                                 age : "60",
//                                 miles : 180,
//                                 yards : 316800
//                             },
//                             {
//                                 id : "03HPW",
//                                 firstName : "Vickie",
//                                 lastName : "Giusti",
//                                 age : "67",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "06KUZ",
//                                 firstName : "Cheryl",
//                                 lastName : "Miller",
//                                 age : "62",
//                                 miles : 210,
//                                 yards : 369600
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SNM",
//                         id : "380-037",
//                         name : "Sierra Nevada Masters",
//                         swimmers : 2,
//                         yards : 1484000,
//                         miles : 1000275,
//                         average : 500137.5,
//                         members : [
//                             {
//                                 id : "GCNX0",
//                                 firstName : "Eric",
//                                 lastName : "Hatch",
//                                 age : "46",
//                                 miles : 1000000,
//                                 yards : 1000000
//                             },
//                             {
//                                 id : "03J6G",
//                                 firstName : "Dawn",
//                                 lastName : "Lawrie",
//                                 age : "45",
//                                 miles : 275,
//                                 yards : 484000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SACMA",
//                         id : "380-368",
//                         name : "Sacramento Masters",
//                         swimmers : 2,
//                         yards : 668800,
//                         miles : 380,
//                         average : 190,
//                         members : [
//                             {
//                                 id : "5W2KS",
//                                 firstName : "J Steve",
//                                 lastName : "Pinson",
//                                 age : "57",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "03H4E",
//                                 firstName : "Andrew",
//                                 lastName : "Hitchings",
//                                 age : "56",
//                                 miles : 280,
//                                 yards : 492800
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "HTUB",
//                         id : "380-069",
//                         name : "Club Hot Tub",
//                         swimmers : 2,
//                         yards : 1480000,
//                         miles : 600500,
//                         average : 300250,
//                         members : [
//                             {
//                                 id : "W1CKD",
//                                 firstName : "Jim",
//                                 lastName : "McDonald",
//                                 age : "54",
//                                 miles : 600000,
//                                 yards : 600000
//                             },
//                             {
//                                 id : "03H71",
//                                 firstName : "John",
//                                 lastName : "Crane",
//                                 age : "69",
//                                 miles : 500,
//                                 yards : 880000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MTRC",
//                         id : "380-116",
//                         name : "Mt. Tam Racquet Club",
//                         swimmers : 4,
//                         yards : 1232000,
//                         miles : 700,
//                         average : 175,
//                         members : [
//                             {
//                                 id : "06RA6",
//                                 firstName : "Juli",
//                                 lastName : "Kauffman",
//                                 age : "60",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "06P3Y",
//                                 firstName : "Marie",
//                                 lastName : "Lyons",
//                                 age : "53",
//                                 miles : 275,
//                                 yards : 484000
//                             },
//                             {
//                                 id : "03H03",
//                                 firstName : "Sally",
//                                 lastName : "Marshall",
//                                 age : "71",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "05SAX",
//                                 firstName : "Andrea",
//                                 lastName : "O'Dell",
//                                 age : "49",
//                                 miles : 275,
//                                 yards : 484000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CRUZ",
//                         id : "380-040",
//                         name : "Santa Cruz Masters Aquatics",
//                         swimmers : 5,
//                         yards : 809600,
//                         miles : 460,
//                         average : 92,
//                         members : [
//                             {
//                                 id : "03FGV",
//                                 firstName : "Patricia",
//                                 lastName : "Knowles",
//                                 age : "49",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "068K7",
//                                 firstName : "Tesla",
//                                 lastName : "Profumo",
//                                 age : "43",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "03GK4",
//                                 firstName : "Michele",
//                                 lastName : "Ignoffo",
//                                 age : "51",
//                                 miles : 285,
//                                 yards : 501600
//                             },
//                             {
//                                 id : "06S14",
//                                 firstName : "Greg",
//                                 lastName : "Lendahl",
//                                 age : "51",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06DAZ",
//                                 firstName : "Vince",
//                                 lastName : "Grimaldi",
//                                 age : "54",
//                                 miles : 175,
//                                 yards : 308000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CALM",
//                         id : "380-024",
//                         name : "Cal Aquatic Masters",
//                         swimmers : 3,
//                         yards : 1452000,
//                         miles : 825,
//                         average : 275,
//                         members : [
//                             {
//                                 id : "07K76",
//                                 firstName : "Zachary",
//                                 lastName : "Unger",
//                                 age : "47",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "03YR6",
//                                 firstName : "Stephen",
//                                 lastName : "Washburn",
//                                 age : "62",
//                                 miles : 425,
//                                 yards : 748000
//                             },
//                             {
//                                 id : "03RD5",
//                                 firstName : "Lauren",
//                                 lastName : "Au Brinkmeyer",
//                                 age : "36",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "QSSSJ",
//                         id : "380-369",
//                         name : "Quicksilver",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "DZGKE",
//                                 firstName : "Ed",
//                                 lastName : "Kopakowski",
//                                 age : "65",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SUNY",
//                         id : "380-275",
//                         name : "CSC Masters-Sunnyvale",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "03J1Y",
//                                 firstName : "Stephen",
//                                 lastName : "O'Neill",
//                                 age : "62",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SRM",
//                         id : "380-032",
//                         name : "Santa Rosa Masters",
//                         swimmers : 4,
//                         yards : 2006400,
//                         miles : 1140,
//                         average : 285,
//                         members : [
//                             {
//                                 id : "05P68",
//                                 firstName : "Ericka",
//                                 lastName : "Richards",
//                                 age : "42",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "024PJ",
//                                 firstName : "Sheila",
//                                 lastName : "Nelson",
//                                 age : "52",
//                                 miles : 240,
//                                 yards : 422400
//                             },
//                             {
//                                 id : "03JER",
//                                 firstName : "Hilary",
//                                 lastName : "Hafner",
//                                 age : "60",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07MHY",
//                                 firstName : "Robin",
//                                 lastName : "Bulman",
//                                 age : "55",
//                                 miles : 400,
//                                 yards : 704000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "BAM",
//                         id : "380-002",
//                         name : "Berkeley (CA) Aquatic Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "068FE",
//                                 firstName : "August",
//                                 lastName : "Fern",
//                                 age : "46",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SON",
//                         id : "380-259",
//                         name : "Sonoma Aquatic Club Masters",
//                         swimmers : 1,
//                         yards : 105600,
//                         miles : 60,
//                         average : 60,
//                         members : [
//                             {
//                                 id : "03Z3C",
//                                 firstName : "William",
//                                 lastName : "Cochrane",
//                                 age : "66",
//                                 miles : 60,
//                                 yards : 105600
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "FDM",
//                         id : "380-158",
//                         name : "Fresno Dolphins Masters Swim Team",
//                         swimmers : 1,
//                         yards : 440000,
//                         miles : 250,
//                         average : 250,
//                         members : [
//                             {
//                                 id : "U11SG",
//                                 firstName : "Ryan",
//                                 lastName : "Williams",
//                                 age : "53",
//                                 miles : 250,
//                                 yards : 440000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "LOM",
//                         id : "380-094",
//                         name : "Ladera Oaks Masters",
//                         swimmers : 1,
//                         yards : 616000,
//                         miles : 350,
//                         average : 350,
//                         members : [
//                             {
//                                 id : "062BB",
//                                 firstName : "William",
//                                 lastName : "Salisbury",
//                                 age : "61",
//                                 miles : 350,
//                                 yards : 616000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SMM",
//                         id : "380-001",
//                         name : "San Mateo Masters",
//                         swimmers : 2,
//                         yards : 880000,
//                         miles : 500,
//                         average : 250,
//                         members : [
//                             {
//                                 id : "03J45",
//                                 firstName : "David",
//                                 lastName : "Traver",
//                                 age : "61",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "06WNC",
//                                 firstName : "Robert",
//                                 lastName : "Levi",
//                                 age : "68",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "BC",
//                         id : "380-333",
//                         name : "Bay Club",
//                         swimmers : 2,
//                         yards : 508000,
//                         miles : 200175,
//                         average : 100087.5,
//                         members : [
//                             {
//                                 id : "03FN8",
//                                 firstName : "Thomas",
//                                 lastName : "Tisch",
//                                 age : "81",
//                                 miles : 200000,
//                                 yards : 200000
//                             },
//                             {
//                                 id : "KYPCC",
//                                 firstName : "Leyla",
//                                 lastName : "Hanson",
//                                 age : "60",
//                                 miles : 175,
//                                 yards : 308000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SMST",
//                         id : "380-143",
//                         name : "Sierra Marlins Masters",
//                         swimmers : 1,
//                         yards : 308000,
//                         miles : 175,
//                         average : 175,
//                         members : [
//                             {
//                                 id : "03Z5W",
//                                 firstName : "Barry",
//                                 lastName : "Curran",
//                                 age : "59",
//                                 miles : 175,
//                                 yards : 308000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MSMA",
//                         id : "380-248",
//                         name : "Merced Skimmers Masters Aquatics",
//                         swimmers : 1,
//                         yards : 176000,
//                         miles : 100,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "0B2BN",
//                                 firstName : "Noel",
//                                 lastName : "Ellett",
//                                 age : "52",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MEMO",
//                         id : "380-253",
//                         name : "Marcia's Enthusiastic Masters of Oakland",
//                         swimmers : 1,
//                         yards : 440000,
//                         miles : 250,
//                         average : 250,
//                         members : [
//                             {
//                                 id : "07N2N",
//                                 firstName : "Peter",
//                                 lastName : "Tsugawa",
//                                 age : "62",
//                                 miles : 250,
//                                 yards : 440000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "TAM",
//                         id : "380-020",
//                         name : "Tamalpais Aquatic Masters",
//                         swimmers : 3,
//                         yards : 2156000,
//                         miles : 1225,
//                         average : 408.3333333333333,
//                         members : [
//                             {
//                                 id : "03H4R",
//                                 firstName : "Gary",
//                                 lastName : "Parlapiano",
//                                 age : "73",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "03FUB",
//                                 firstName : "James",
//                                 lastName : "Stambolis",
//                                 age : "73",
//                                 miles : 425,
//                                 yards : 748000
//                             },
//                             {
//                                 id : "03K2U",
//                                 firstName : "Judy",
//                                 lastName : "Eisenman",
//                                 age : "66",
//                                 miles : 400,
//                                 yards : 704000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SFGG",
//                         id : "380-305",
//                         name : "Swim Fremont Glenmoor Gardens",
//                         swimmers : 2,
//                         yards : 1029600,
//                         miles : 585,
//                         average : 292.5,
//                         members : [
//                             {
//                                 id : "03V0S",
//                                 firstName : "Jerry",
//                                 lastName : "Audiat",
//                                 age : "74",
//                                 miles : 220,
//                                 yards : 387200
//                             },
//                             {
//                                 id : "03V59",
//                                 firstName : "Marta",
//                                 lastName : "Elliott",
//                                 age : "67",
//                                 miles : 365,
//                                 yards : 642400
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SRVM",
//                         id : "380-265",
//                         name : "San Ramon Valley Aquatics Masters",
//                         swimmers : 2,
//                         yards : 652000,
//                         miles : 300200,
//                         average : 150100,
//                         members : [
//                             {
//                                 id : "03FUP",
//                                 firstName : "Judy",
//                                 lastName : "Bracken",
//                                 age : "63",
//                                 miles : 300000,
//                                 yards : 300000
//                             },
//                             {
//                                 id : "03V2R",
//                                 firstName : "Angela",
//                                 lastName : "Smith",
//                                 age : "46",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MCMC",
//                         id : "380-325",
//                         name : "Mills College Master Cyclones",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "72PWB",
//                                 firstName : "Jez",
//                                 lastName : "Lee",
//                                 age : "40",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "BHAM",
//                         id : "380-289",
//                         name : "Bret Harte Aquatic Masters",
//                         swimmers : 1,
//                         yards : 42240,
//                         miles : 24,
//                         average : 24,
//                         members : [
//                             {
//                                 id : "0AFVN",
//                                 firstName : "Jennifer",
//                                 lastName : "MacNaughton",
//                                 age : "42",
//                                 miles : 24,
//                                 yards : 42240
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CMAM",
//                         id : "380-043",
//                         name : "Cal Maritime Academy Masters",
//                         swimmers : 3,
//                         yards : 1232000,
//                         miles : 700,
//                         average : 233.33333333333334,
//                         members : [
//                             {
//                                 id : "07AXF",
//                                 firstName : "Cynthia",
//                                 lastName : "Trevisan",
//                                 age : "55",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "074MJ",
//                                 firstName : "Jesse",
//                                 lastName : "Ford",
//                                 age : "38",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "06HZA",
//                                 firstName : "Karen",
//                                 lastName : "Jensen",
//                                 age : "53",
//                                 miles : 500,
//                                 yards : 880000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CSTS",
//                         id : "380-258",
//                         name : "CoastSide Tiger Sharks",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "03HCE",
//                                 firstName : "Brad",
//                                 lastName : "Pence",
//                                 age : "68",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CLOV",
//                         id : "380-222",
//                         name : "Clovis Swim Club Masters",
//                         swimmers : 1,
//                         yards : 390720,
//                         miles : 222,
//                         average : 222,
//                         members : [
//                             {
//                                 id : "067AY",
//                                 firstName : "Linda",
//                                 lastName : "Kelsey",
//                                 age : "64",
//                                 miles : 222,
//                                 yards : 390720
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "ARM",
//                         id : "380-327",
//                         name : "Spare Time American River Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "03JC8",
//                                 firstName : "Elizabeth",
//                                 lastName : "Tiedemann",
//                                 age : "57",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "OAK",
//                         id : "380-007",
//                         name : "Oakwood Athletic Club Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "03GTW",
//                                 firstName : "Don",
//                                 lastName : "Tatzin",
//                                 age : "68",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "RPM",
//                         id : "380-247",
//                         name : "Richmond Plunge Masters",
//                         swimmers : 2,
//                         yards : 176000,
//                         miles : 100,
//                         average : 50,
//                         members : [
//                             {
//                                 id : "0ABJ2",
//                                 firstName : "Christina",
//                                 lastName : "Kossa",
//                                 age : "54",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07K2W",
//                                 firstName : "Karen",
//                                 lastName : "Harris",
//                                 age : "54",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "FGST",
//                         id : "380-031",
//                         name : "Fig Garden Swim Team",
//                         swimmers : 1,
//                         yards : 176000,
//                         miles : 100,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "EN8T9",
//                                 firstName : "Rebecca",
//                                 lastName : "Kendall",
//                                 age : "61",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "AHSM",
//                         id : "380-073",
//                         name : "Alpine Hills Swimming Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "03X2M",
//                                 firstName : "Katie",
//                                 lastName : "Lin",
//                                 age : "46",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CUDA",
//                         id : "380-134",
//                         name : "Oakland Barracuda Masters",
//                         swimmers : 1,
//                         yards : 264000,
//                         miles : 150,
//                         average : 150,
//                         members : [
//                             {
//                                 id : "040DP",
//                                 firstName : "Gwendolynne",
//                                 lastName : "Barr",
//                                 age : "54",
//                                 miles : 150,
//                                 yards : 264000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "UCSF",
//                         id : "380-352",
//                         name : "UCSF Masters",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "03K5A",
//                                 firstName : "Jillian",
//                                 lastName : "Silva",
//                                 age : "43",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Hawaii",
//                 id : "39",
//                 swimmers : 9,
//                 miles : 1350715,
//                 yards : 2608400,
//                 average : 150079.44444444444,
//                 clubs : [
//                     {
//                         abbreviation : "UHM",
//                         id : "390-004",
//                         name : "University of Hawaii Masters",
//                         swimmers : 1,
//                         yards : 642400,
//                         miles : 365,
//                         average : 365,
//                         members : [
//                             {
//                                 id : "04T0R",
//                                 firstName : "Denise",
//                                 lastName : "Webb",
//                                 age : "59",
//                                 miles : 365,
//                                 yards : 642400
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "WST",
//                         id : "390-038",
//                         name : "WS Twente",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "01N9V",
//                                 firstName : "Harm-Jan",
//                                 lastName : "Steenhuis",
//                                 age : "53",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "HIMA",
//                         id : "390-020",
//                         name : "Hawaii Masters",
//                         swimmers : 2,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "02UD6",
//                                 firstName : "Kevin",
//                                 lastName : "Drake",
//                                 age : "64",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "03AEJ",
//                                 firstName : "Brenda",
//                                 lastName : "Jarmakani",
//                                 age : "73",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "HAQ",
//                         id : "390-017",
//                         name : "Hilo Aquatic Club",
//                         swimmers : 4,
//                         yards : 1438000,
//                         miles : 1350050,
//                         average : 337512.5,
//                         members : [
//                             {
//                                 id : "02MB5",
//                                 firstName : "Michael",
//                                 lastName : "Pipta",
//                                 age : "56",
//                                 miles : 500000,
//                                 yards : 500000
//                             },
//                             {
//                                 id : "06GJ7",
//                                 firstName : "Ron",
//                                 lastName : "Whitmore",
//                                 age : "51",
//                                 miles : 500000,
//                                 yards : 500000
//                             },
//                             {
//                                 id : "020DT",
//                                 firstName : "Rebecca",
//                                 lastName : "Ostertag",
//                                 age : "51",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "020NG",
//                                 firstName : "Vaughn",
//                                 lastName : "Cook",
//                                 age : "51",
//                                 miles : 350000,
//                                 yards : 350000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "KONA",
//                         id : "390-011",
//                         name : "Kona Aquatics",
//                         swimmers : 1,
//                         yards : 528000,
//                         miles : 300,
//                         average : 300,
//                         members : [
//                             {
//                                 id : "04ZEY",
//                                 firstName : "Bob",
//                                 lastName : "Hoxsie",
//                                 age : "62",
//                                 miles : 300,
//                                 yards : 528000
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         id : "5",
//         name : "South Central",
//         swimmers : 192,
//         miles : 2377794,
//         yards : 60230943,
//         average : 12384.34375,
//         lmscs : [
//             {
//                 name : "South Texas",
//                 id : "43",
//                 swimmers : 47,
//                 miles : 10069,
//                 yards : 17721440,
//                 average : 214.2340425531915,
//                 clubs : [
//                     {
//                         abbreviation : "WLOO",
//                         id : "430-085",
//                         name : "Waterloo Swimming",
//                         swimmers : 3,
//                         yards : 542080,
//                         miles : 308,
//                         average : 102.66666666666667,
//                         members : [
//                             {
//                                 id : "BY4DV",
//                                 firstName : "Kristine",
//                                 lastName : "Massey",
//                                 age : "42",
//                                 miles : 168,
//                                 yards : 295680
//                             },
//                             {
//                                 id : "086EY",
//                                 firstName : "Todd",
//                                 lastName : "Bellino",
//                                 age : "53",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "25WJ3",
//                                 firstName : "Laura",
//                                 lastName : "Painter",
//                                 age : "58",
//                                 miles : 140,
//                                 yards : 246400
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "RGMS",
//                         id : "430-055",
//                         name : "Red Giant Masters Swimming",
//                         swimmers : 2,
//                         yards : 598400,
//                         miles : 340,
//                         average : 170,
//                         members : [
//                             {
//                                 id : "06UXD",
//                                 firstName : "Louise",
//                                 lastName : "Allen",
//                                 age : "58",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "06U22",
//                                 firstName : "Dan",
//                                 lastName : "Ruble",
//                                 age : "58",
//                                 miles : 140,
//                                 yards : 246400
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "TXLA",
//                         id : "430-035",
//                         name : "Longhorn Aquatics",
//                         swimmers : 2,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "02NS9",
//                                 firstName : "Ed",
//                                 lastName : "Coates",
//                                 age : "54",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06N4M",
//                                 firstName : "Jim",
//                                 lastName : "Sauer",
//                                 age : "63",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MOST",
//                         id : "430-028",
//                         name : "Masters of South Texas",
//                         swimmers : 26,
//                         yards : 10340000,
//                         miles : 5875,
//                         average : 225.96153846153845,
//                         members : [
//                             {
//                                 id : "08EEJ",
//                                 firstName : "Nicole",
//                                 lastName : "Bott",
//                                 age : "35",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0A8RY",
//                                 firstName : "Barbara",
//                                 lastName : "Lincoln",
//                                 age : "55",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "DBS53",
//                                 firstName : "De Shann",
//                                 lastName : "Schinkel",
//                                 age : "56",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "15479",
//                                 firstName : "Donald",
//                                 lastName : "Walker",
//                                 age : "62",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "C0NNE",
//                                 firstName : "Connie",
//                                 lastName : "Lindsey",
//                                 age : "68",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "008RJ",
//                                 firstName : "Suzanne",
//                                 lastName : "Cuda",
//                                 age : "60",
//                                 miles : 550,
//                                 yards : 968000
//                             },
//                             {
//                                 id : "SUSAN",
//                                 firstName : "Susan",
//                                 lastName : "Ingraham",
//                                 age : "61",
//                                 miles : 600,
//                                 yards : 1056000
//                             },
//                             {
//                                 id : "005M6",
//                                 firstName : "Martha",
//                                 lastName : "Towers",
//                                 age : "49",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02HNJ",
//                                 firstName : "Andrew",
//                                 lastName : "Gale",
//                                 age : "54",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "09U2V",
//                                 firstName : "Deborah",
//                                 lastName : "Pederson",
//                                 age : "63",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "06P0P",
//                                 firstName : "Catharine",
//                                 lastName : "Cebrowski",
//                                 age : "50",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "02P50",
//                                 firstName : "Nancy",
//                                 lastName : "Wood",
//                                 age : "69",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02PNA",
//                                 firstName : "Lee",
//                                 lastName : "Porisch",
//                                 age : "65",
//                                 miles : 350,
//                                 yards : 616000
//                             },
//                             {
//                                 id : "096DK",
//                                 firstName : "Jennifer",
//                                 lastName : "Jones",
//                                 age : "44",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "02PWB",
//                                 firstName : "Marie",
//                                 lastName : "DeGennaro",
//                                 age : "60",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0AF1A",
//                                 firstName : "Ray",
//                                 lastName : "Bruce",
//                                 age : "55",
//                                 miles : 350,
//                                 yards : 616000
//                             },
//                             {
//                                 id : "02PXA",
//                                 firstName : "Brent",
//                                 lastName : "Anderson",
//                                 age : "58",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "WST24",
//                                 firstName : "Simon",
//                                 lastName : "Thornton",
//                                 age : "61",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "02R0H",
//                                 firstName : "Susan",
//                                 lastName : "Gershenhorn",
//                                 age : "58",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07789",
//                                 firstName : "Michael",
//                                 lastName : "Rourke",
//                                 age : "29",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "SAUER",
//                                 firstName : "DeEtte",
//                                 lastName : "Sauer",
//                                 age : "79",
//                                 miles : 380,
//                                 yards : 668800
//                             },
//                             {
//                                 id : "FV34A",
//                                 firstName : "Eddie",
//                                 lastName : "O'Connell",
//                                 age : "48",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "02RC5",
//                                 firstName : "Nancy",
//                                 lastName : "Fields",
//                                 age : "69",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02NPK",
//                                 firstName : "Julie",
//                                 lastName : "Eakle",
//                                 age : "60",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "0AGFP",
//                                 firstName : "RaLynn",
//                                 lastName : "McGuire",
//                                 age : "39",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02NR1",
//                                 firstName : "Judy",
//                                 lastName : "Paukert",
//                                 age : "72",
//                                 miles : 500,
//                                 yards : 880000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "ASC",
//                         id : "430-080",
//                         name : "Austin Swim Club",
//                         swimmers : 3,
//                         yards : 1056000,
//                         miles : 600,
//                         average : 200,
//                         members : [
//                             {
//                                 id : "02NTF",
//                                 firstName : "Stephen",
//                                 lastName : "Wright",
//                                 age : "62",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "09DY2",
//                                 firstName : "Maureen",
//                                 lastName : "Helm",
//                                 age : "40",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "02NM3",
//                                 firstName : "Jeff",
//                                 lastName : "Wetzel",
//                                 age : "64",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "TW",
//                         id : "430-081",
//                         name : "Team Walker",
//                         swimmers : 1,
//                         yards : 176000,
//                         miles : 100,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "02NUR",
//                                 firstName : "Louis",
//                                 lastName : "De Leon",
//                                 age : "44",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "GTX",
//                         id : "430-037",
//                         name : "Texas Gold Georgetown Masters",
//                         swimmers : 2,
//                         yards : 968000,
//                         miles : 550,
//                         average : 275,
//                         members : [
//                             {
//                                 id : "02F69",
//                                 firstName : "Timothy",
//                                 lastName : "Murphy",
//                                 age : "51",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "05X5H",
//                                 firstName : "Kelley",
//                                 lastName : "Spencer",
//                                 age : "61",
//                                 miles : 50,
//                                 yards : 88000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CTS",
//                         id : "430-070",
//                         name : "Central Texas Masters Swimmers",
//                         swimmers : 3,
//                         yards : 1928960,
//                         miles : 1096,
//                         average : 365.3333333333333,
//                         members : [
//                             {
//                                 id : "05GBH",
//                                 firstName : "David",
//                                 lastName : "Thomas",
//                                 age : "59",
//                                 miles : 366,
//                                 yards : 644160
//                             },
//                             {
//                                 id : "02NEK",
//                                 firstName : "Marianne",
//                                 lastName : "Thomas",
//                                 age : "57",
//                                 miles : 430,
//                                 yards : 756800
//                             },
//                             {
//                                 id : "02NHP",
//                                 firstName : "Donna",
//                                 lastName : "Schubkegel",
//                                 age : "68",
//                                 miles : 300,
//                                 yards : 528000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "NBM",
//                         id : "430-097",
//                         name : "New Braunfels Masters Swimmers",
//                         swimmers : 1,
//                         yards : 528000,
//                         miles : 300,
//                         average : 300,
//                         members : [
//                             {
//                                 id : "01KNX",
//                                 firstName : "Lex",
//                                 lastName : "Pegues",
//                                 age : "60",
//                                 miles : 300,
//                                 yards : 528000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "WHAC",
//                         id : "430-060",
//                         name : "WHAC Masters",
//                         swimmers : 1,
//                         yards : 440000,
//                         miles : 250,
//                         average : 250,
//                         members : [
//                             {
//                                 id : "03ZYJ",
//                                 firstName : "Todd",
//                                 lastName : "Narter",
//                                 age : "56",
//                                 miles : 250,
//                                 yards : 440000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "NITR",
//                         id : "430-050",
//                         name : "Nitro Swimming",
//                         swimmers : 2,
//                         yards : 704000,
//                         miles : 400,
//                         average : 200,
//                         members : [
//                             {
//                                 id : "0980B",
//                                 firstName : "Alla",
//                                 lastName : "Postelnik",
//                                 age : "48",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "05HG2",
//                                 firstName : "Steven",
//                                 lastName : "Unruh",
//                                 age : "54",
//                                 miles : 300,
//                                 yards : 528000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "AAAA",
//                         id : "430-007",
//                         name : "Alamo Area Aquatic Association",
//                         swimmers : 1,
//                         yards : 440000,
//                         miles : 250,
//                         average : 250,
//                         members : [
//                             {
//                                 id : "04KSG",
//                                 firstName : "Katherine",
//                                 lastName : "Canales",
//                                 age : "58",
//                                 miles : 250,
//                                 yards : 440000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "North Texas",
//                 id : "26",
//                 swimmers : 83,
//                 miles : 992797,
//                 yards : 23577610,
//                 average : 11961.409638554216,
//                 clubs : [
//                     {
//                         abbreviation : "O2",
//                         id : "260-004",
//                         name : "O2 Performance Aquatics",
//                         swimmers : 12,
//                         yards : 1936000,
//                         miles : 1100,
//                         average : 91.66666666666667,
//                         members : [
//                             {
//                                 id : "0054R",
//                                 firstName : "Amelia",
//                                 lastName : "Frye",
//                                 age : "38",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "SU9DS",
//                                 firstName : "Sherrill",
//                                 lastName : "Wolf",
//                                 age : "54",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02G5Z",
//                                 firstName : "Michael",
//                                 lastName : "Agar",
//                                 age : "62",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "23ZZ4",
//                                 firstName : "Giovanni",
//                                 lastName : "Martin",
//                                 age : "29",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "9KKZV",
//                                 firstName : "Francisco",
//                                 lastName : "Romero",
//                                 age : "44",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "02G63",
//                                 firstName : "Cynthia",
//                                 lastName : "Myer",
//                                 age : "67",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "060Z0",
//                                 firstName : "Dennis",
//                                 lastName : "Butts",
//                                 age : "49",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "0ATS3",
//                                 firstName : "Gregg",
//                                 lastName : "Gleichert",
//                                 age : "72",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "04G1F",
//                                 firstName : "Steven",
//                                 lastName : "Schiemann",
//                                 age : "58",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "CR8PC",
//                                 firstName : "Ginnie",
//                                 lastName : "Holmes",
//                                 age : "57",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "06472",
//                                 firstName : "Joe",
//                                 lastName : "Wickline",
//                                 age : "63",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07HR8",
//                                 firstName : "Ann",
//                                 lastName : "Drewes",
//                                 age : "45",
//                                 miles : 400,
//                                 yards : 704000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "LSM",
//                         id : "260-074",
//                         name : "Lone Star Masters",
//                         swimmers : 17,
//                         yards : 5230890,
//                         miles : 802475,
//                         average : 47204.41176470588,
//                         members : [
//                             {
//                                 id : "02GG2",
//                                 firstName : "Joseph",
//                                 lastName : "Murray",
//                                 age : "61",
//                                 miles : 195,
//                                 yards : 343200
//                             },
//                             {
//                                 id : "000H4",
//                                 firstName : "Tom",
//                                 lastName : "Barton",
//                                 age : "64",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "EWJ7F",
//                                 firstName : "Rick",
//                                 lastName : "Lynch",
//                                 age : "66",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "02G3H",
//                                 firstName : "Elaine",
//                                 lastName : "Disney",
//                                 age : "57",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "05P9Y",
//                                 firstName : "Heather",
//                                 lastName : "Frees",
//                                 age : "37",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "003FJ",
//                                 firstName : "Berry",
//                                 lastName : "Hamilton",
//                                 age : "67",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "025WG",
//                                 firstName : "Alison",
//                                 lastName : "Moore",
//                                 age : "50",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "02GUY",
//                                 firstName : "Lynn",
//                                 lastName : "Barnhart",
//                                 age : "59",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0AJFE",
//                                 firstName : "Robert",
//                                 lastName : "Sussmeier",
//                                 age : "30",
//                                 miles : 380,
//                                 yards : 668800
//                             },
//                             {
//                                 id : "02GZU",
//                                 firstName : "Thomas",
//                                 lastName : "Dillon",
//                                 age : "79",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "0AN0T",
//                                 firstName : "Brad",
//                                 lastName : "Von Readen",
//                                 age : "55",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "02GA4",
//                                 firstName : "Kristin",
//                                 lastName : "Henderson",
//                                 age : "60",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "02H01",
//                                 firstName : "Michael",
//                                 lastName : "Doyle",
//                                 age : "56",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "09MGB",
//                                 firstName : "Keith",
//                                 lastName : "Pavolonis",
//                                 age : "51",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "7VM55",
//                                 firstName : "Jeffrey ",
//                                 lastName : "Hinton",
//                                 age : "47",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "02H3V",
//                                 firstName : "Robert",
//                                 lastName : "Kelsoe",
//                                 age : "67",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02GC3",
//                                 firstName : "Kristianne",
//                                 lastName : "Hinkamp",
//                                 age : "61",
//                                 miles : 800000,
//                                 yards : 874890
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "PCAT",
//                         id : "260-001",
//                         name : "City of Plano Swimmers Wetcats",
//                         swimmers : 18,
//                         yards : 2349600,
//                         miles : 1335,
//                         average : 74.16666666666667,
//                         members : [
//                             {
//                                 id : "01JZT",
//                                 firstName : "Christopher",
//                                 lastName : "Gill",
//                                 age : "60",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "38K8Z",
//                                 firstName : "David",
//                                 lastName : "Spaans",
//                                 age : "59",
//                                 miles : 225,
//                                 yards : 396000
//                             },
//                             {
//                                 id : "05FEV",
//                                 firstName : "Duncan",
//                                 lastName : "Hare",
//                                 age : "66",
//                                 miles : 215,
//                                 yards : 378400
//                             },
//                             {
//                                 id : "09JSE",
//                                 firstName : "David",
//                                 lastName : "Hahn",
//                                 age : "54",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "02GNS",
//                                 firstName : "Sharyl",
//                                 lastName : "Griffith",
//                                 age : "59",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0B6MP",
//                                 firstName : "Zoheb",
//                                 lastName : "Noorani",
//                                 age : "31",
//                                 miles : 75,
//                                 yards : 132000
//                             },
//                             {
//                                 id : "0AA6R",
//                                 firstName : "Thomas",
//                                 lastName : "Ambrose",
//                                 age : "52",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "02GRP",
//                                 firstName : "Elaine",
//                                 lastName : "Smith",
//                                 age : "53",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07SBB",
//                                 firstName : "Arthur",
//                                 lastName : "Larson",
//                                 age : "58",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "02GSP",
//                                 firstName : "David",
//                                 lastName : "Gregory",
//                                 age : "56",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02G7E",
//                                 firstName : "Lynn",
//                                 lastName : "Silver",
//                                 age : "68",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "09PX3",
//                                 firstName : "Jennifer",
//                                 lastName : "Goodwin",
//                                 age : "48",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07KNV",
//                                 firstName : "Leslie",
//                                 lastName : "Wyatt",
//                                 age : "32",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06119",
//                                 firstName : "Amy",
//                                 lastName : "Krajewski",
//                                 age : "50",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "04G43",
//                                 firstName : "Darlene",
//                                 lastName : "Jones",
//                                 age : "52",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06WPD",
//                                 firstName : "Peter",
//                                 lastName : "Calabrese",
//                                 age : "54",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "09HWE",
//                                 firstName : "David",
//                                 lastName : "Tomkinson",
//                                 age : "47",
//                                 miles : 120,
//                                 yards : 211200
//                             },
//                             {
//                                 id : "067MB",
//                                 firstName : "Randal",
//                                 lastName : "Davis",
//                                 age : "50",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "DAMM",
//                         id : "260-018",
//                         name : "Dallas Aquatic Masters",
//                         swimmers : 6,
//                         yards : 1253120,
//                         miles : 712,
//                         average : 118.66666666666667,
//                         members : [
//                             {
//                                 id : "02GGG",
//                                 firstName : "Glenn",
//                                 lastName : "Henry",
//                                 age : "60",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02GJA",
//                                 firstName : "Bill",
//                                 lastName : "Radford",
//                                 age : "69",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "09JUP",
//                                 firstName : "Jim",
//                                 lastName : "Alkire",
//                                 age : "62",
//                                 miles : 312,
//                                 yards : 549120
//                             },
//                             {
//                                 id : "04G1X",
//                                 firstName : "Katrina",
//                                 lastName : "Lane",
//                                 age : "72",
//                                 miles : 70,
//                                 yards : 123200
//                             },
//                             {
//                                 id : "01TD1",
//                                 firstName : "Keith",
//                                 lastName : "McCain",
//                                 age : "55",
//                                 miles : 330,
//                                 yards : 580800
//                             },
//                             {
//                                 id : "02GBD",
//                                 firstName : "S. Phyllis",
//                                 lastName : "Foer",
//                                 age : "73",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "RIDG",
//                         id : "260-016",
//                         name : "Team Ridglea",
//                         swimmers : 7,
//                         yards : 4488000,
//                         miles : 2550,
//                         average : 364.2857142857143,
//                         members : [
//                             {
//                                 id : "082DC",
//                                 firstName : "Jason",
//                                 lastName : "Wickland",
//                                 age : "49",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "02GH6",
//                                 firstName : "Beth",
//                                 lastName : "Jones",
//                                 age : "63",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07HAU",
//                                 firstName : "Patricia",
//                                 lastName : "Campbell",
//                                 age : "56",
//                                 miles : 1000,
//                                 yards : 1760000
//                             },
//                             {
//                                 id : "04G1E",
//                                 firstName : "Julie",
//                                 lastName : "Jackson",
//                                 age : "59",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "09BMH",
//                                 firstName : "Marshall",
//                                 lastName : "Campbell",
//                                 age : "55",
//                                 miles : 1000,
//                                 yards : 1760000
//                             },
//                             {
//                                 id : "09MJ8",
//                                 firstName : "Andy",
//                                 lastName : "Duncan",
//                                 age : "52",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "02HBA",
//                                 firstName : "Carol",
//                                 lastName : "Standerfer",
//                                 age : "67",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "TFAM",
//                         id : "260-054",
//                         name : "Texas Ford Aquatics Masters",
//                         swimmers : 12,
//                         yards : 4474400,
//                         miles : 182440,
//                         average : 15203.333333333334,
//                         members : [
//                             {
//                                 id : "0AGW9",
//                                 firstName : "Katie",
//                                 lastName : "Hayes",
//                                 age : "41",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "0905V",
//                                 firstName : "Juan",
//                                 lastName : "Guerin",
//                                 age : "53",
//                                 miles : 600,
//                                 yards : 1056000
//                             },
//                             {
//                                 id : "235CJ",
//                                 firstName : "Mike",
//                                 lastName : "Wilson",
//                                 age : "54",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "09Z95",
//                                 firstName : "Jinah",
//                                 lastName : "Park Koo",
//                                 age : "48",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0B2ER",
//                                 firstName : "Ute",
//                                 lastName : "Nestler",
//                                 age : "49",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0A505",
//                                 firstName : "Carlos",
//                                 lastName : "Rodriguez",
//                                 age : "31",
//                                 miles : 525,
//                                 yards : 924000
//                             },
//                             {
//                                 id : "0073D",
//                                 firstName : "Dave",
//                                 lastName : "Doll",
//                                 age : "57",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "0AJMW",
//                                 firstName : "Ashleigh",
//                                 lastName : "Gaulke",
//                                 age : "34",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01TFT",
//                                 firstName : "Jessica ",
//                                 lastName : "Lloyd",
//                                 age : "61",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0ATYT",
//                                 firstName : "Erin",
//                                 lastName : "Roehrig",
//                                 age : "29",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "0ABV8",
//                                 firstName : "Susan",
//                                 lastName : "Hengstenberg",
//                                 age : "40",
//                                 miles : 180000,
//                                 yards : 180000
//                             },
//                             {
//                                 id : "0AKFE",
//                                 firstName : "Marc",
//                                 lastName : "Biernat",
//                                 age : "55",
//                                 miles : 165,
//                                 yards : 290400
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "TXAQ",
//                         id : "260-047",
//                         name : "Texoma Aquatics Masters",
//                         swimmers : 2,
//                         yards : 1760000,
//                         miles : 1000,
//                         average : 500,
//                         members : [
//                             {
//                                 id : "J1AUP",
//                                 firstName : "Deborah ",
//                                 lastName : "Daugherty",
//                                 age : "61",
//                                 miles : 1000,
//                                 yards : 1760000
//                             },
//                             {
//                                 id : "CZEY8",
//                                 firstName : "Analynn",
//                                 lastName : "Bartlett",
//                                 age : "31",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "DASC",
//                         id : "260-041",
//                         name : "Denton Area Swim Club",
//                         swimmers : 4,
//                         yards : 1276000,
//                         miles : 725,
//                         average : 181.25,
//                         members : [
//                             {
//                                 id : "09EUT",
//                                 firstName : "Rusty",
//                                 lastName : "Miller",
//                                 age : "71",
//                                 miles : 175,
//                                 yards : 308000
//                             },
//                             {
//                                 id : "07JWY",
//                                 firstName : "Becky",
//                                 lastName : "Voight",
//                                 age : "55",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "02H3S",
//                                 firstName : "Dianna",
//                                 lastName : "Ray",
//                                 age : "66",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "07M9G",
//                                 firstName : "Shelly",
//                                 lastName : "Ehler",
//                                 age : "49",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "STAR",
//                         id : "260-053",
//                         name : "TRI-STAR Masters Swimming",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "09U38",
//                                 firstName : "Marlo",
//                                 lastName : "Hutchinson",
//                                 age : "50",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MTRM",
//                         id : "260-070",
//                         name : "Metroplex Aquatics Masters",
//                         swimmers : 3,
//                         yards : 809600,
//                         miles : 460,
//                         average : 153.33333333333334,
//                         members : [
//                             {
//                                 id : "07VH1",
//                                 firstName : "James",
//                                 lastName : "Royal",
//                                 age : "58",
//                                 miles : 60,
//                                 yards : 105600
//                             },
//                             {
//                                 id : "02GAX",
//                                 firstName : "David",
//                                 lastName : "Young",
//                                 age : "71",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "SFABR",
//                                 firstName : "N Clayton",
//                                 lastName : "Tangen",
//                                 age : "52",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "FAST",
//                         id : "260-005",
//                         name : "Fort Worth Area Swim Team",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "05XSP",
//                                 firstName : "Craig",
//                                 lastName : "Farmer",
//                                 age : "71",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Arkansas",
//                 id : "23",
//                 swimmers : 8,
//                 miles : 1258,
//                 yards : 2214080,
//                 average : 157.25,
//                 clubs : [
//                     {
//                         abbreviation : "DART",
//                         id : "230-007",
//                         name : "Dart Frog Aquatics",
//                         swimmers : 1,
//                         yards : 396000,
//                         miles : 225,
//                         average : 225,
//                         members : [
//                             {
//                                 id : "09205",
//                                 firstName : "Glenda",
//                                 lastName : "Chamberlain",
//                                 age : "55",
//                                 miles : 225,
//                                 yards : 396000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "NWAM",
//                         id : "230-008",
//                         name : "Northwest Arkansas Masters",
//                         swimmers : 7,
//                         yards : 1818080,
//                         miles : 1033,
//                         average : 147.57142857142858,
//                         members : [
//                             {
//                                 id : "01K71",
//                                 firstName : "Steffan",
//                                 lastName : "Sarkin",
//                                 age : "60",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01JBC",
//                                 firstName : "Carie",
//                                 lastName : "O'Banion",
//                                 age : "61",
//                                 miles : 220,
//                                 yards : 387200
//                             },
//                             {
//                                 id : "01K7A",
//                                 firstName : "Steve",
//                                 lastName : "Lisle",
//                                 age : "54",
//                                 miles : 243,
//                                 yards : 427680
//                             },
//                             {
//                                 id : "01NDY",
//                                 firstName : "Scott",
//                                 lastName : "Halliburton",
//                                 age : "58",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0AR1H",
//                                 firstName : "Jacob",
//                                 lastName : "Barnes",
//                                 age : "39",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "0B6AS",
//                                 firstName : "Theresa",
//                                 lastName : "Parrish",
//                                 age : "63",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "64V8G",
//                                 firstName : "Kristen",
//                                 lastName : "Caldwell",
//                                 age : "51",
//                                 miles : 220,
//                                 yards : 387200
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Gulf",
//                 id : "25",
//                 swimmers : 50,
//                 miles : 1373135,
//                 yards : 15776213,
//                 average : 27462.7,
//                 clubs : [
//                     {
//                         abbreviation : "FCST",
//                         id : "250-023",
//                         name : "First Colony Masters Swimming",
//                         swimmers : 7,
//                         yards : 976800,
//                         miles : 555,
//                         average : 79.28571428571429,
//                         members : [
//                             {
//                                 id : "02UCC",
//                                 firstName : "Max",
//                                 lastName : "Zollner",
//                                 age : "82",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "36YP6",
//                                 firstName : "Rachel",
//                                 lastName : "Phan",
//                                 age : "36",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "09ACV",
//                                 firstName : "Bonnie",
//                                 lastName : "Finnigan",
//                                 age : "51",
//                                 miles : 305,
//                                 yards : 536800
//                             },
//                             {
//                                 id : "06Z0B",
//                                 firstName : "Peter",
//                                 lastName : "Gerngross",
//                                 age : "51",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0ATXA",
//                                 firstName : "Paul",
//                                 lastName : "Zollner",
//                                 age : "50",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02R9M",
//                                 firstName : "Terry Lynn",
//                                 lastName : "Toon",
//                                 age : "60",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "05F4W",
//                                 firstName : "Mike",
//                                 lastName : "Offner",
//                                 age : "44",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SWYM",
//                         id : "250-021",
//                         name : "South West YMCA Masters",
//                         swimmers : 3,
//                         yards : 1408000,
//                         miles : 800,
//                         average : 266.6666666666667,
//                         members : [
//                             {
//                                 id : "085BG",
//                                 firstName : "Robin",
//                                 lastName : "Tompkins",
//                                 age : "52",
//                                 miles : 350,
//                                 yards : 616000
//                             },
//                             {
//                                 id : "0936E",
//                                 firstName : "Deborah",
//                                 lastName : "Nichols",
//                                 age : "65",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "08EAS",
//                                 firstName : "Mary Anne",
//                                 lastName : "Janish",
//                                 age : "80",
//                                 miles : 150,
//                                 yards : 264000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MTM",
//                         id : "250-066",
//                         name : "Montgomery Masters",
//                         swimmers : 2,
//                         yards : 1056000,
//                         miles : 600,
//                         average : 300,
//                         members : [
//                             {
//                                 id : "02WPC",
//                                 firstName : "Amy",
//                                 lastName : "Wells",
//                                 age : "48",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "0AGBU",
//                                 firstName : "Kelly",
//                                 lastName : "Miller",
//                                 age : "42",
//                                 miles : 300,
//                                 yards : 528000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "RICE",
//                         id : "250-018",
//                         name : "Rice Aquatic Masters",
//                         swimmers : 10,
//                         yards : 2384800,
//                         miles : 1355,
//                         average : 135.5,
//                         members : [
//                             {
//                                 id : "01ZHY",
//                                 firstName : "Cynthia",
//                                 lastName : "Thomas",
//                                 age : "71",
//                                 miles : 145,
//                                 yards : 255200
//                             },
//                             {
//                                 id : "05SNT",
//                                 firstName : "Alvin",
//                                 lastName : "Thomas",
//                                 age : "74",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0AKT1",
//                                 firstName : "William",
//                                 lastName : "Duong",
//                                 age : "31",
//                                 miles : 360,
//                                 yards : 633600
//                             },
//                             {
//                                 id : "0AM49",
//                                 firstName : "Sanghee",
//                                 lastName : "Yoo",
//                                 age : "56",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01ZWB",
//                                 firstName : "Colette",
//                                 lastName : "Lanier",
//                                 age : "62",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "04DV1",
//                                 firstName : "Nicole",
//                                 lastName : "Van Nood",
//                                 age : "48",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06JD5",
//                                 firstName : "Karin",
//                                 lastName : "Fox",
//                                 age : "49",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "070P8",
//                                 firstName : "Robert",
//                                 lastName : "Li",
//                                 age : "39",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "06BHV",
//                                 firstName : "David",
//                                 lastName : "Garza",
//                                 age : "52",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01Z1J",
//                                 firstName : "Judy",
//                                 lastName : "Levison",
//                                 age : "70",
//                                 miles : 150,
//                                 yards : 264000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CFSC",
//                         id : "250-036",
//                         name : "Fleet Masters Swimming/Cy-Fair Swim Club",
//                         swimmers : 5,
//                         yards : 2376000,
//                         miles : 1350,
//                         average : 270,
//                         members : [
//                             {
//                                 id : "58Y8M",
//                                 firstName : "Nicole",
//                                 lastName : "Matsuyama",
//                                 age : "45",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "08C13",
//                                 firstName : "Maryanne",
//                                 lastName : "Svoboda",
//                                 age : "32",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "0APRD",
//                                 firstName : "Susan",
//                                 lastName : "Honeywell",
//                                 age : "63",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "06M0U",
//                                 firstName : "Jim",
//                                 lastName : "Svoboda",
//                                 age : "42",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "02PZ2",
//                                 firstName : "Tanya",
//                                 lastName : "Hamilton",
//                                 age : "47",
//                                 miles : 50,
//                                 yards : 88000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SSCGU",
//                         id : "250-072",
//                         name : "Sharks Swim Club",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "HV23W",
//                                 firstName : "Heidi",
//                                 lastName : "Riggs",
//                                 age : "51",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MACA",
//                         id : "250-010",
//                         name : "Memorial Athletic Club Aquatics",
//                         swimmers : 7,
//                         yards : 2560000,
//                         miles : 141375,
//                         average : 20196.428571428572,
//                         members : [
//                             {
//                                 id : "060HB",
//                                 firstName : "Robert",
//                                 lastName : "Barela",
//                                 age : "63",
//                                 miles : 525,
//                                 yards : 924000
//                             },
//                             {
//                                 id : "06KYX",
//                                 firstName : "Carlye",
//                                 lastName : "Graydon",
//                                 age : "50",
//                                 miles : 140000,
//                                 yards : 140000
//                             },
//                             {
//                                 id : "09B4F",
//                                 firstName : "Lynn",
//                                 lastName : "Cadena",
//                                 age : "64",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "SA6RX",
//                                 firstName : "Jon",
//                                 lastName : "Bergmann",
//                                 age : "56",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "06Z4R",
//                                 firstName : "Jennifer",
//                                 lastName : "Balevic",
//                                 age : "56",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "07FZF",
//                                 firstName : "Debbie",
//                                 lastName : "Loux",
//                                 age : "62",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "01Z81",
//                                 firstName : "Steven",
//                                 lastName : "Clancy",
//                                 age : "65",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "DADS",
//                         id : "250-020",
//                         name : "Dad's Club Swim Team Masters",
//                         swimmers : 2,
//                         yards : 616000,
//                         miles : 350,
//                         average : 175,
//                         members : [
//                             {
//                                 id : "07CRF",
//                                 firstName : "Craig",
//                                 lastName : "Fox",
//                                 age : "65",
//                                 miles : 350,
//                                 yards : 616000
//                             },
//                             {
//                                 id : "065CM",
//                                 firstName : "Nicole",
//                                 lastName : "Christensen",
//                                 age : "59",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "UH20",
//                         id : "250-064",
//                         name : "University of Houston Masters",
//                         swimmers : 2,
//                         yards : 352000,
//                         miles : 200,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "073WN",
//                                 firstName : "Mark",
//                                 lastName : "Kelly",
//                                 age : "65",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "0ASRX",
//                                 firstName : "Anna",
//                                 lastName : "Bass",
//                                 age : "40",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "ETEX",
//                         id : "250-013",
//                         name : "Ambush Swimming",
//                         swimmers : 1,
//                         yards : 352000,
//                         miles : 200,
//                         average : 200,
//                         members : [
//                             {
//                                 id : "0A9D7",
//                                 firstName : "Julie",
//                                 lastName : "Brotzen",
//                                 age : "61",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "KAMS",
//                         id : "250-011",
//                         name : "Katy Aquatic Masters Swimming",
//                         swimmers : 2,
//                         yards : 440000,
//                         miles : 250,
//                         average : 125,
//                         members : [
//                             {
//                                 id : "EZB6F",
//                                 firstName : "Tom",
//                                 lastName : "Howes",
//                                 age : "60",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "W8323",
//                                 firstName : "Jeffrey",
//                                 lastName : "Rocheleau",
//                                 age : "38",
//                                 miles : 250,
//                                 yards : 440000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "COOG",
//                         id : "250-047",
//                         name : "Houston Cougar Masters",
//                         swimmers : 6,
//                         yards : 2677613,
//                         miles : 1000900,
//                         average : 166816.66666666666,
//                         members : [
//                             {
//                                 id : "02RZV",
//                                 firstName : "John",
//                                 lastName : "Keen",
//                                 age : "56",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "0ADTW",
//                                 firstName : "Lauren",
//                                 lastName : "Grous",
//                                 age : "36",
//                                 miles : 1000000,
//                                 yards : 1093613
//                             },
//                             {
//                                 id : "04DZ8",
//                                 firstName : "Cheryl",
//                                 lastName : "Hubbard",
//                                 age : "53",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "02AAW",
//                                 firstName : "Karlene",
//                                 lastName : "Denby",
//                                 age : "67",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02SG4",
//                                 firstName : "Linda",
//                                 lastName : "Visser",
//                                 age : "50",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0643H",
//                                 firstName : "Lydia",
//                                 lastName : "Tiede",
//                                 age : "55",
//                                 miles : 300,
//                                 yards : 528000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SCAT",
//                         id : "250-060",
//                         name : "Space City Aquatic Team",
//                         swimmers : 1,
//                         yards : 225000,
//                         miles : 225000,
//                         average : 225000,
//                         members : [
//                             {
//                                 id : "0A7C8",
//                                 firstName : "Edmond",
//                                 lastName : "Puckett",
//                                 age : "51",
//                                 miles : 225000,
//                                 yards : 225000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SPAM",
//                         id : "250-030",
//                         name : "Sienna Plantation Aquatic Masters",
//                         swimmers : 1,
//                         yards : 352000,
//                         miles : 200,
//                         average : 200,
//                         members : [
//                             {
//                                 id : "01ZHT",
//                                 firstName : "Jeffrey",
//                                 lastName : "Tarr",
//                                 age : "61",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Oklahoma",
//                 id : "27",
//                 swimmers : 4,
//                 miles : 535,
//                 yards : 941600,
//                 average : 133.75,
//                 clubs : [
//                     {
//                         abbreviation : "OKMS",
//                         id : "270-002",
//                         name : "Oklahoma Masters Swim Club",
//                         swimmers : 2,
//                         yards : 325600,
//                         miles : 185,
//                         average : 92.5,
//                         members : [
//                             {
//                                 id : "08F44",
//                                 firstName : "Phillip",
//                                 lastName : "Fitzsimmons",
//                                 age : "58",
//                                 miles : 10,
//                                 yards : 17600
//                             },
//                             {
//                                 id : "01JWS",
//                                 firstName : "Louise",
//                                 lastName : "Churchill",
//                                 age : "66",
//                                 miles : 175,
//                                 yards : 308000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "TULS",
//                         id : "270-001",
//                         name : "Tulsa Masters Swim Club",
//                         swimmers : 2,
//                         yards : 616000,
//                         miles : 350,
//                         average : 175,
//                         members : [
//                             {
//                                 id : "005ZH",
//                                 firstName : "Bonnie",
//                                 lastName : "Henke",
//                                 age : "79",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "07B6W",
//                                 firstName : "Bruce",
//                                 lastName : "Dart",
//                                 age : "65",
//                                 miles : 250,
//                                 yards : 440000
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         id : "7",
//         name : "Southwest",
//         swimmers : 131,
//         miles : 2125304,
//         yards : 46635040,
//         average : 16223.69465648855,
//         lmscs : [
//             {
//                 name : "Southern Pacific",
//                 id : "33",
//                 swimmers : 106,
//                 miles : 2020164,
//                 yards : 37488640,
//                 average : 19058.150943396227,
//                 clubs : [
//                     {
//                         abbreviation : "VCM",
//                         id : "330-038",
//                         name : "Ventura County Masters",
//                         swimmers : 9,
//                         yards : 1849760,
//                         miles : 1051,
//                         average : 116.77777777777777,
//                         members : [
//                             {
//                                 id : "0AGJK",
//                                 firstName : "Mitch",
//                                 lastName : "Loman",
//                                 age : "60",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "03B05",
//                                 firstName : "Bryant",
//                                 lastName : "Lum",
//                                 age : "59",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "03B07",
//                                 firstName : "Jim",
//                                 lastName : "Mc Conica",
//                                 age : "69",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02CD9",
//                                 firstName : "Michelle",
//                                 lastName : "McConica",
//                                 age : "64",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "42ZG5",
//                                 firstName : "Susan",
//                                 lastName : "Hansell-Smuck",
//                                 age : "64",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "27N9C",
//                                 firstName : "Gerald",
//                                 lastName : "Uyeno",
//                                 age : "63",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "061JS",
//                                 firstName : "Nancy",
//                                 lastName : "Booth",
//                                 age : "59",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "UY12F",
//                                 firstName : "Tamar",
//                                 lastName : "Swan",
//                                 age : "51",
//                                 miles : 501,
//                                 yards : 881760
//                             },
//                             {
//                                 id : "03AZM",
//                                 firstName : "Michael",
//                                 lastName : "Blatt",
//                                 age : "65",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SWLB",
//                         id : "330-134",
//                         name : "SWIM Long Beach",
//                         swimmers : 2,
//                         yards : 176000,
//                         miles : 100,
//                         average : 50,
//                         members : [
//                             {
//                                 id : "0B128",
//                                 firstName : "Camille",
//                                 lastName : "Ayers",
//                                 age : "50",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "02CDJ",
//                                 firstName : "Samantha",
//                                 lastName : "Simmons",
//                                 age : "47",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CVMM",
//                         id : "330-151",
//                         name : "Conejo Valley Masters",
//                         swimmers : 5,
//                         yards : 3432000,
//                         miles : 1950,
//                         average : 390,
//                         members : [
//                             {
//                                 id : "EV1EM",
//                                 firstName : "Eve",
//                                 lastName : "Maidenberg",
//                                 age : "44",
//                                 miles : 1000,
//                                 yards : 1760000
//                             },
//                             {
//                                 id : "04A8R",
//                                 firstName : "Tom",
//                                 lastName : "Pani",
//                                 age : "64",
//                                 miles : 210,
//                                 yards : 369600
//                             },
//                             {
//                                 id : "06VBF",
//                                 firstName : "Rich",
//                                 lastName : "Katz",
//                                 age : "51",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "03A2E",
//                                 firstName : "Niki",
//                                 lastName : "Stokols",
//                                 age : "62",
//                                 miles : 375,
//                                 yards : 660000
//                             },
//                             {
//                                 id : "049RA",
//                                 firstName : "Mary",
//                                 lastName : "Ho",
//                                 age : "45",
//                                 miles : 115,
//                                 yards : 202400
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "DARE",
//                         id : "330-267",
//                         name : "DARE Masters",
//                         swimmers : 2,
//                         yards : 528000,
//                         miles : 300,
//                         average : 150,
//                         members : [
//                             {
//                                 id : "088H4",
//                                 firstName : "Carlos",
//                                 lastName : "Cruz",
//                                 age : "36",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "YS09V",
//                                 firstName : "TERRY",
//                                 lastName : "JO",
//                                 age : "60",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CTM",
//                         id : "330-002",
//                         name : "Caltech Masters",
//                         swimmers : 5,
//                         yards : 3784000,
//                         miles : 2150,
//                         average : 430,
//                         members : [
//                             {
//                                 id : "039ZH",
//                                 firstName : "Suzanne",
//                                 lastName : "Dodd",
//                                 age : "59",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "09G60",
//                                 firstName : "Linda",
//                                 lastName : "Simons",
//                                 age : "55",
//                                 miles : 750,
//                                 yards : 1320000
//                             },
//                             {
//                                 id : "03AC7",
//                                 firstName : "Nikki",
//                                 lastName : "Takarabe",
//                                 age : "54",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "026ZY",
//                                 firstName : "Robert",
//                                 lastName : "DaSilva",
//                                 age : "52",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "07KXG",
//                                 firstName : "Duff",
//                                 lastName : "Murphy",
//                                 age : "66",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "RIPT",
//                         id : "330-200",
//                         name : "Orange County Riptide Aquatics",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "ACGAN",
//                                 firstName : "Mary ",
//                                 lastName : "Twomey",
//                                 age : "66",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SBM",
//                         id : "330-061",
//                         name : "Santa Barbara Masters Swimming",
//                         swimmers : 4,
//                         yards : 642400,
//                         miles : 365,
//                         average : 91.25,
//                         members : [
//                             {
//                                 id : "07X8G",
//                                 firstName : "Debby",
//                                 lastName : "Hamilton",
//                                 age : "55",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "03B58",
//                                 firstName : "Sherry",
//                                 lastName : "Keigher",
//                                 age : "68",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "XYXK7",
//                                 firstName : "Abraham ",
//                                 lastName : "Garcia",
//                                 age : "31",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "08EBR",
//                                 firstName : "Elizabeth",
//                                 lastName : "Boscacci",
//                                 age : "64",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "PSP",
//                         id : "330-052",
//                         name : "Piranha Swim Team Masters",
//                         swimmers : 2,
//                         yards : 704000,
//                         miles : 400,
//                         average : 200,
//                         members : [
//                             {
//                                 id : "07K65",
//                                 firstName : "Steven",
//                                 lastName : "Erickson",
//                                 age : "49",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "06B9M",
//                                 firstName : "Karla",
//                                 lastName : "Anderson",
//                                 age : "45",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "BGWM",
//                         id : "330-034",
//                         name : "Bakersfield Gold Wave Masters",
//                         swimmers : 2,
//                         yards : 352000,
//                         miles : 200,
//                         average : 100,
//                         members : [
//                             {
//                                 id : "06EZ8",
//                                 firstName : "Bruce",
//                                 lastName : "Friedman",
//                                 age : "68",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "03WDC",
//                                 firstName : "Callie",
//                                 lastName : "Peat",
//                                 age : "39",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "NOVA",
//                         id : "330-025",
//                         name : "Novaquatics Masters",
//                         swimmers : 6,
//                         yards : 1786400,
//                         miles : 1015,
//                         average : 169.16666666666666,
//                         members : [
//                             {
//                                 id : "06UZ1",
//                                 firstName : "Lexie",
//                                 lastName : "Kelly",
//                                 age : "34",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "074AD",
//                                 firstName : "Marcia",
//                                 lastName : "Duff",
//                                 age : "71",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "07HDE",
//                                 firstName : "Carol",
//                                 lastName : "Hayden",
//                                 age : "70",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07TES",
//                                 firstName : "Stephen",
//                                 lastName : "Sponagle",
//                                 age : "65",
//                                 miles : 600,
//                                 yards : 1056000
//                             },
//                             {
//                                 id : "08A69",
//                                 firstName : "Chris",
//                                 lastName : "Smelt",
//                                 age : "57",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "UVVCN",
//                                 firstName : "Alon",
//                                 lastName : "Ben Jacob",
//                                 age : "44",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SCAQ",
//                         id : "330-026",
//                         name : "Southern California Aquatic Masters",
//                         swimmers : 7,
//                         yards : 2320000,
//                         miles : 1000750,
//                         average : 142964.2857142857,
//                         members : [
//                             {
//                                 id : "03A12",
//                                 firstName : "Bill",
//                                 lastName : "Ireland",
//                                 age : "61",
//                                 miles : 1000000,
//                                 yards : 1000000
//                             },
//                             {
//                                 id : "03BCE",
//                                 firstName : "Corby",
//                                 lastName : "Arthur",
//                                 age : "62",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "07AUT",
//                                 firstName : "Kimberly",
//                                 lastName : "Meyer",
//                                 age : "62",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "2FKPK",
//                                 firstName : "Lynda",
//                                 lastName : "Scott",
//                                 age : "61",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "04630",
//                                 firstName : "Bill",
//                                 lastName : "Wheeler",
//                                 age : "59",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "03AGC",
//                                 firstName : "Jeanne",
//                                 lastName : "Sather",
//                                 age : "63",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "07RAK",
//                                 firstName : "Alejandra",
//                                 lastName : "Wachler",
//                                 age : "43",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MVN",
//                         id : "330-033",
//                         name : "Mission Viejo Masters",
//                         swimmers : 8,
//                         yards : 1630080,
//                         miles : 1000358,
//                         average : 125044.75,
//                         members : [
//                             {
//                                 id : "0B642",
//                                 firstName : "Patty",
//                                 lastName : "Furukawa",
//                                 age : "49",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07V6B",
//                                 firstName : "Audrey",
//                                 lastName : "Viers",
//                                 age : "37",
//                                 miles : 1000000,
//                                 yards : 1000000
//                             },
//                             {
//                                 id : "XY34W",
//                                 firstName : "Hamilton",
//                                 lastName : "Blake",
//                                 age : "56",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0352K",
//                                 firstName : "Mary Ann",
//                                 lastName : "Alwan",
//                                 age : "58",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "03Z6V",
//                                 firstName : "Carol",
//                                 lastName : "Wilson",
//                                 age : "63",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0AJ7C",
//                                 firstName : "Summer",
//                                 lastName : "Serpas",
//                                 age : "43",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "048YV",
//                                 firstName : "Beverly",
//                                 lastName : "Montrella",
//                                 age : "74",
//                                 miles : 208,
//                                 yards : 366080
//                             },
//                             {
//                                 id : "039YP",
//                                 firstName : "Michael",
//                                 lastName : "Heather",
//                                 age : "66",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "GRA",
//                         id : "330-221",
//                         name : "Golden Road Aquatics",
//                         swimmers : 3,
//                         yards : 1056000,
//                         miles : 600,
//                         average : 200,
//                         members : [
//                             {
//                                 id : "0A93V",
//                                 firstName : "Scott",
//                                 lastName : "Winslow",
//                                 age : "48",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06U85",
//                                 firstName : "Heather",
//                                 lastName : "Mikels",
//                                 age : "52",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02EM5",
//                                 firstName : "Kurt",
//                                 lastName : "Dickson",
//                                 age : "53",
//                                 miles : 600,
//                                 yards : 1056000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SWHM",
//                         id : "330-181",
//                         name : "Swim With Heart Masters",
//                         swimmers : 1,
//                         yards : 264000,
//                         miles : 150,
//                         average : 150,
//                         members : [
//                             {
//                                 id : "1AMAR",
//                                 firstName : "Ann",
//                                 lastName : "Roller",
//                                 age : "46",
//                                 miles : 150,
//                                 yards : 264000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "LVM",
//                         id : "330-009",
//                         name : "Las Vegas Masters",
//                         swimmers : 8,
//                         yards : 6336000,
//                         miles : 3600,
//                         average : 450,
//                         members : [
//                             {
//                                 id : "085KC",
//                                 firstName : "Priscilla",
//                                 lastName : "Brunella",
//                                 age : "60",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "038A6",
//                                 firstName : "Susan",
//                                 lastName : "Cushman",
//                                 age : "58",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "05W3X",
//                                 firstName : "Dara",
//                                 lastName : "Goldsmith",
//                                 age : "54",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0A79K",
//                                 firstName : "Nicole",
//                                 lastName : "Baker",
//                                 age : "51",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "4T2TX",
//                                 firstName : "Kellie",
//                                 lastName : "Archuletta",
//                                 age : "59",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "081FG",
//                                 firstName : "Doug",
//                                 lastName : "Allen",
//                                 age : "61",
//                                 miles : 2800,
//                                 yards : 4928000
//                             },
//                             {
//                                 id : "094T3",
//                                 firstName : "Jennifer",
//                                 lastName : "Nolan",
//                                 age : "41",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "06X65",
//                                 firstName : "Jeff",
//                                 lastName : "Ghan",
//                                 age : "70",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "RAA",
//                         id : "330-098",
//                         name : "Riverside Aquatics Association",
//                         swimmers : 2,
//                         yards : 281600,
//                         miles : 160,
//                         average : 80,
//                         members : [
//                             {
//                                 id : "06XCG",
//                                 firstName : "Larry",
//                                 lastName : "Vesely",
//                                 age : "69",
//                                 miles : 60,
//                                 yards : 105600
//                             },
//                             {
//                                 id : "09RJH",
//                                 firstName : "PAUL",
//                                 lastName : "SZUSZKIEWICZ",
//                                 age : "66",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "FMT",
//                         id : "330-073",
//                         name : "Fullerton FAST Masters Team",
//                         swimmers : 3,
//                         yards : 1260160,
//                         miles : 716,
//                         average : 238.66666666666666,
//                         members : [
//                             {
//                                 id : "03A1C",
//                                 firstName : "Michael",
//                                 lastName : "Pawloski",
//                                 age : "63",
//                                 miles : 175,
//                                 yards : 308000
//                             },
//                             {
//                                 id : "06NRU",
//                                 firstName : "Matt",
//                                 lastName : "Truxaw",
//                                 age : "61",
//                                 miles : 366,
//                                 yards : 644160
//                             },
//                             {
//                                 id : "03AK4",
//                                 firstName : "Robert",
//                                 lastName : "Bergstrom",
//                                 age : "79",
//                                 miles : 175,
//                                 yards : 308000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SLOM",
//                         id : "330-056",
//                         name : "San Luis Obispo Masters",
//                         swimmers : 2,
//                         yards : 528000,
//                         miles : 300,
//                         average : 150,
//                         members : [
//                             {
//                                 id : "03B48",
//                                 firstName : "Michael",
//                                 lastName : "Hure",
//                                 age : "57",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "05UFH",
//                                 firstName : "Ben",
//                                 lastName : "Palmer",
//                                 age : "40",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "KMAN",
//                         id : "330-072",
//                         name : "Atascadero Swim Masters",
//                         swimmers : 4,
//                         yards : 2031040,
//                         miles : 1154,
//                         average : 288.5,
//                         members : [
//                             {
//                                 id : "0A61Z",
//                                 firstName : "Cindy",
//                                 lastName : "Watson",
//                                 age : "54",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "072UT",
//                                 firstName : "Tara",
//                                 lastName : "Dolan",
//                                 age : "47",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "0676M",
//                                 firstName : "Jacquie",
//                                 lastName : "Anderson",
//                                 age : "84",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "0AKD2",
//                                 firstName : "Margret",
//                                 lastName : "McCall",
//                                 age : "67",
//                                 miles : 354,
//                                 yards : 623040
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SPP",
//                         id : "330-244",
//                         name : "SilverPeak Performance",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "22VW8",
//                                 firstName : "Pat",
//                                 lastName : "Luangeaktrakul",
//                                 age : "51",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "CTSM",
//                         id : "330-178",
//                         name : "Competitive Tri-Swim Masters LLC",
//                         swimmers : 2,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "06XGE",
//                                 firstName : "Suzy",
//                                 lastName : "Degazon",
//                                 age : "56",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "XCCME",
//                                 firstName : "John",
//                                 lastName : "Allaire",
//                                 age : "61",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SCAL",
//                         id : "330-003",
//                         name : "SOCAL Aquatics Association",
//                         swimmers : 2,
//                         yards : 1056000,
//                         miles : 600,
//                         average : 300,
//                         members : [
//                             {
//                                 id : "0622M",
//                                 firstName : "Leonard",
//                                 lastName : "Goodsir",
//                                 age : "56",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "065UD",
//                                 firstName : "David",
//                                 lastName : "Hayes",
//                                 age : "66",
//                                 miles : 300,
//                                 yards : 528000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "LBG",
//                         id : "330-063",
//                         name : "Long Beach Grunions",
//                         swimmers : 6,
//                         yards : 1064800,
//                         miles : 605,
//                         average : 100.83333333333333,
//                         members : [
//                             {
//                                 id : "03A1S",
//                                 firstName : "Bart",
//                                 lastName : "Parnes",
//                                 age : "64",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "09FC9",
//                                 firstName : "Elizabeth",
//                                 lastName : "Carlin",
//                                 age : "46",
//                                 miles : 135,
//                                 yards : 237600
//                             },
//                             {
//                                 id : "05W1J",
//                                 firstName : "Stan",
//                                 lastName : "Smith",
//                                 age : "73",
//                                 miles : 150,
//                                 yards : 264000
//                             },
//                             {
//                                 id : "048ZM",
//                                 firstName : "Susan",
//                                 lastName : "Duquesnel",
//                                 age : "61",
//                                 miles : 120,
//                                 yards : 211200
//                             },
//                             {
//                                 id : "03DYZ",
//                                 firstName : "Anita",
//                                 lastName : "Cole",
//                                 age : "73",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "0DP3K",
//                                 firstName : "Lee",
//                                 lastName : "Zeledon",
//                                 age : "39",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "ROSE",
//                         id : "330-019",
//                         name : "Rose Bowl Masters",
//                         swimmers : 7,
//                         yards : 2402400,
//                         miles : 1365,
//                         average : 195,
//                         members : [
//                             {
//                                 id : "04867",
//                                 firstName : "Kendra",
//                                 lastName : "Wilson",
//                                 age : "39",
//                                 miles : 400,
//                                 yards : 704000
//                             },
//                             {
//                                 id : "03ABJ",
//                                 firstName : "Frank",
//                                 lastName : "Campbell",
//                                 age : "62",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "0B6NU",
//                                 firstName : "Lynda",
//                                 lastName : "Leopold",
//                                 age : "72",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "03C1B",
//                                 firstName : "Stephen",
//                                 lastName : "Stedry",
//                                 age : "69",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "087AR",
//                                 firstName : "Carlyn",
//                                 lastName : "Lee",
//                                 age : "34",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "03AVE",
//                                 firstName : "Dan",
//                                 lastName : "Borton",
//                                 age : "52",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "049TA",
//                                 firstName : "Patrick",
//                                 lastName : "Mc Ginley",
//                                 age : "57",
//                                 miles : 365,
//                                 yards : 642400
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "WH2O",
//                         id : "330-028",
//                         name : "West Hollywood Aquatics",
//                         swimmers : 2,
//                         yards : 792000,
//                         miles : 450,
//                         average : 225,
//                         members : [
//                             {
//                                 id : "01NGJ",
//                                 firstName : "Karl",
//                                 lastName : "Gundersen",
//                                 age : "51",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "069GN",
//                                 firstName : "Charles",
//                                 lastName : "Myers",
//                                 age : "67",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SVL",
//                         id : "330-167",
//                         name : "Swim Velocity",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "09GSU",
//                                 firstName : "Larissa",
//                                 lastName : "Chiari-Keith",
//                                 age : "47",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "NBS",
//                         id : "330-275",
//                         name : "Newport Beach Swimming",
//                         swimmers : 1,
//                         yards : 132000,
//                         miles : 75,
//                         average : 75,
//                         members : [
//                             {
//                                 id : "0AWHE",
//                                 firstName : "Daniel",
//                                 lastName : "Carey",
//                                 age : "58",
//                                 miles : 75,
//                                 yards : 132000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "UCLA",
//                         id : "330-108",
//                         name : "UCLA Bruin Masters",
//                         swimmers : 1,
//                         yards : 352000,
//                         miles : 200,
//                         average : 200,
//                         members : [
//                             {
//                                 id : "02J01",
//                                 firstName : "Dell",
//                                 lastName : "Upton",
//                                 age : "71",
//                                 miles : 200,
//                                 yards : 352000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "RMDA",
//                         id : "330-133",
//                         name : "La Mirada Armada",
//                         swimmers : 2,
//                         yards : 880000,
//                         miles : 500,
//                         average : 250,
//                         members : [
//                             {
//                                 id : "06WHG",
//                                 firstName : "Glenn",
//                                 lastName : "Piner",
//                                 age : "51",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "037UG",
//                                 firstName : "Diana",
//                                 lastName : "Corbin",
//                                 age : "52",
//                                 miles : 500,
//                                 yards : 880000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "LAPS",
//                         id : "330-104",
//                         name : "Los Angeles Peninsula Swimmers",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "03AFG",
//                                 firstName : "Paige",
//                                 lastName : "Kobayashi",
//                                 age : "52",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "ATCM",
//                         id : "330-252",
//                         name : "Aquatic Training Center Masters",
//                         swimmers : 1,
//                         yards : 1760000,
//                         miles : 1000,
//                         average : 1000,
//                         members : [
//                             {
//                                 id : "09R9X",
//                                 firstName : "Suzanne",
//                                 lastName : "Dieriex",
//                                 age : "42",
//                                 miles : 1000,
//                                 yards : 1760000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SCAC",
//                         id : "330-191",
//                         name : "Surf City Aquatics Club",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "06HVW",
//                                 firstName : "Patty",
//                                 lastName : "Smith",
//                                 age : "67",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "YST",
//                         id : "330-265",
//                         name : "Yucaipa masters",
//                         swimmers : 1,
//                         yards : 88000,
//                         miles : 50,
//                         average : 50,
//                         members : [
//                             {
//                                 id : "0A2KT",
//                                 firstName : "John",
//                                 lastName : "Ramos",
//                                 age : "62",
//                                 miles : 50,
//                                 yards : 88000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "VKNG",
//                         id : "330-170",
//                         name : "Viking Aquatics",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "04A3G",
//                                 firstName : "Jocelyn",
//                                 lastName : "Atkinson",
//                                 age : "46",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "San Diego-Imperial",
//                 id : "44",
//                 swimmers : 13,
//                 miles : 3040,
//                 yards : 5350400,
//                 average : 233.84615384615384,
//                 clubs : [
//                     {
//                         abbreviation : "WIND",
//                         id : "440-033",
//                         name : "Wind-n-Sea Masters Swimming",
//                         swimmers : 3,
//                         yards : 1144000,
//                         miles : 650,
//                         average : 216.66666666666666,
//                         members : [
//                             {
//                                 id : "HP96S",
//                                 firstName : "Catherine",
//                                 lastName : "de Groot-Hedlin",
//                                 age : "60",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "0374H",
//                                 firstName : "Jon",
//                                 lastName : "Brendsel",
//                                 age : "56",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02CRR",
//                                 firstName : "Paton",
//                                 lastName : "McClung",
//                                 age : "51",
//                                 miles : 400,
//                                 yards : 704000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "SDSM",
//                         id : "440-001",
//                         name : "San Diego Swim Masters",
//                         swimmers : 8,
//                         yards : 2666400,
//                         miles : 1515,
//                         average : 189.375,
//                         members : [
//                             {
//                                 id : "088X8",
//                                 firstName : "Bill",
//                                 lastName : "Durell",
//                                 age : "70",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07H8P",
//                                 firstName : "Marieke",
//                                 lastName : "Thayer",
//                                 age : "59",
//                                 miles : 100,
//                                 yards : 176000
//                             },
//                             {
//                                 id : "01YV4",
//                                 firstName : "Anne-France",
//                                 lastName : "Saillot",
//                                 age : "58",
//                                 miles : 365,
//                                 yards : 642400
//                             },
//                             {
//                                 id : "09JUX",
//                                 firstName : "Stephen",
//                                 lastName : "Rozow",
//                                 age : "52",
//                                 miles : 700,
//                                 yards : 1232000
//                             },
//                             {
//                                 id : "02CSU",
//                                 firstName : "Darrell",
//                                 lastName : "Jett",
//                                 age : "62",
//                                 miles : 200,
//                                 yards : 352000
//                             },
//                             {
//                                 id : "06PM8",
//                                 firstName : "Kristina",
//                                 lastName : "Maroudis",
//                                 age : "45",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "04986",
//                                 firstName : "Valerie",
//                                 lastName : "Lang",
//                                 age : "61",
//                                 miles : 50,
//                                 yards : 88000
//                             },
//                             {
//                                 id : "2Z0SN",
//                                 firstName : "Aida",
//                                 lastName : "Munoz Welch",
//                                 age : "61",
//                                 miles : 100,
//                                 yards : 176000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "OSIDE",
//                         id : "440-053",
//                         name : "City of Oceanside Sea Slugs",
//                         swimmers : 2,
//                         yards : 1540000,
//                         miles : 875,
//                         average : 437.5,
//                         members : [
//                             {
//                                 id : "03NXU",
//                                 firstName : "Michael",
//                                 lastName : "Bullock",
//                                 age : "74",
//                                 miles : 375,
//                                 yards : 660000
//                             },
//                             {
//                                 id : "064M7",
//                                 firstName : "Jean",
//                                 lastName : "Gallagher",
//                                 age : "62",
//                                 miles : 500,
//                                 yards : 880000
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "New Mexico",
//                 id : "42",
//                 swimmers : 3,
//                 miles : 635,
//                 yards : 1117600,
//                 average : 211.66666666666666,
//                 clubs : [
//                     {
//                         abbreviation : "NMMS",
//                         id : "420-001",
//                         name : "New Mexico Masters Swimming",
//                         swimmers : 3,
//                         yards : 1117600,
//                         miles : 635,
//                         average : 211.66666666666666,
//                         members : [
//                             {
//                                 id : "04F2J",
//                                 firstName : "Aimee",
//                                 lastName : "Dunavant",
//                                 age : "37",
//                                 miles : 315,
//                                 yards : 554400
//                             },
//                             {
//                                 id : "047YM",
//                                 firstName : "Carol",
//                                 lastName : "Ritchie",
//                                 age : "62",
//                                 miles : 320,
//                                 yards : 563200
//                             },
//                             {
//                                 id : "X1G1X",
//                                 firstName : "Steve",
//                                 lastName : "Phelps",
//                                 age : "72",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 name : "Arizona",
//                 id : "48",
//                 swimmers : 9,
//                 miles : 101465,
//                 yards : 2678400,
//                 average : 11273.888888888889,
//                 clubs : [
//                     {
//                         abbreviation : "PSCM",
//                         id : "480-003",
//                         name : "Phoenix Swim Club",
//                         swimmers : 5,
//                         yards : 1698400,
//                         miles : 965,
//                         average : 193,
//                         members : [
//                             {
//                                 id : "02F2A",
//                                 firstName : "Martin",
//                                 lastName : "Hahm",
//                                 age : "79",
//                                 miles : 300,
//                                 yards : 528000
//                             },
//                             {
//                                 id : "0A6UJ",
//                                 firstName : "Melanie",
//                                 lastName : "Mumbauer",
//                                 age : "68",
//                                 miles : 415,
//                                 yards : 730400
//                             },
//                             {
//                                 id : "0465K",
//                                 firstName : "Sharon",
//                                 lastName : "Ottman",
//                                 age : "52",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "02EMS",
//                                 firstName : "Robert",
//                                 lastName : "Liotta",
//                                 age : "69",
//                                 miles : 250,
//                                 yards : 440000
//                             },
//                             {
//                                 id : "02EMT",
//                                 firstName : "Brenda",
//                                 lastName : "Creswell Liotta",
//                                 age : "58",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "MMAC",
//                         id : "480-008",
//                         name : "Mesa Aquatics Club-Masters",
//                         swimmers : 3,
//                         yards : 980000,
//                         miles : 100500,
//                         average : 33500,
//                         members : [
//                             {
//                                 id : "06VNW",
//                                 firstName : "Peter",
//                                 lastName : "Lofquist",
//                                 age : "59",
//                                 miles : 500,
//                                 yards : 880000
//                             },
//                             {
//                                 id : "060WH",
//                                 firstName : "Diane",
//                                 lastName : "Sabatier",
//                                 age : "64",
//                                 miles : 0,
//                                 yards : 0
//                             },
//                             {
//                                 id : "07RG8",
//                                 firstName : "Raymond",
//                                 lastName : "Marciniak",
//                                 age : "63",
//                                 miles : 100000,
//                                 yards : 100000
//                             }
//                         ]
//                     },
//                     {
//                         abbreviation : "DDSA",
//                         id : "480-048",
//                         name : "Dolphins of the Desert",
//                         swimmers : 1,
//                         yards : 0,
//                         miles : 0,
//                         average : 0,
//                         members : [
//                             {
//                                 id : "06JC1",
//                                 firstName : "Randie",
//                                 lastName : "Collier",
//                                 age : "52",
//                                 miles : 0,
//                                 yards : 0
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     }
// ]
// createHtml(dataLmsc);

// console.log(createHtml());





var getSwimFeed = $.ajax({
    url: "https://j-place.github.io/participants_all.json",
    type: "GET",
    success: function(response) {
      var data = JSON.parse(getSwimFeed.responseText);
      console.log(data);
      createHtml(data);
    },
    error: function(xhr) {
      console.log("Failed to load data.");
    }
  })



function createHtml(dataLmscNew) {
    var rawTemplate = document.getElementById("lmscTemplate").innerHTML;
    var compiledTemplate = Handlebars.compile(rawTemplate);
    var generatedHTML = compiledTemplate(dataLmscNew)
    var lmscWrapper = document.getElementById("lmscWrapper");
    lmscWrapper.innerHTML = generatedHTML;
  }
  