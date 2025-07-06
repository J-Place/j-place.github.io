const jsonData = [
[
    {
        "#": "1",
        "First": "Mia",
        "Last": "Wood",
        "Club": "CSM",
        "Time": "5:01.32",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9673&mrid=3796807&fn=Mia&ln=Wood",
        "Date": "11/30/2017"
    },
    {
        "#": "2",
        "First": "Madelaine",
        "Last": "McClain",
        "Club": "MESA",
        "Time": "5:04.29",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9673&mrid=3796456&fn=Madelaine&ln=McClain",
        "Date": "11/30/2017"
    },
    {
        "#": "3",
        "First": "Katelin",
        "Last": "Staab",
        "Club": "MESA",
        "Time": "5:05.43",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9673&mrid=3796566&fn=Katelin&ln=Staab",
        "Date": "11/30/2017"
    },
    {
        "#": "4",
        "First": "Lindsay",
        "Last": "Knapp",
        "Club": "GTSC",
        "Time": "5:11.77",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3954938&fn=Lindsay&ln=Knapp",
        "Date": "04/06/2018"
    },
    {
        "#": "5",
        "First": "Isabelle",
        "Last": "Hansson",
        "Club": "MESA",
        "Time": "5:11.91",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9673&mrid=3796376&fn=Isabelle&ln=Hansson",
        "Date": "11/30/2017"
    },
    {
        "#": "6",
        "First": "Grace",
        "Last": "Payton",
        "Club": "MESA",
        "Time": "5:13.93",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9673&mrid=3796483&fn=Grace&ln=Payton",
        "Date": "11/30/2017"
    },
    {
        "#": "7",
        "First": "Paige",
        "Last": "McCaskill",
        "Club": "ASU",
        "Time": "5:14.85",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9673&mrid=3796136&fn=Paige&ln=McCaskill",
        "Date": "11/30/2017"
    },
    {
        "#": "8",
        "First": "Olivia",
        "Last": "Morley",
        "Club": "CSM",
        "Time": "5:14.90",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9673&mrid=3796712&fn=Olivia&ln=Morley",
        "Date": "11/30/2017"
    },
    {
        "#": "9",
        "First": "Allison",
        "Last": "Nastasi",
        "Club": "GTSC",
        "Time": "5:17.44",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3954971&fn=Allison&ln=Nastasi",
        "Date": "04/06/2018"
    },
    {
        "#": "10",
        "First": "Olivia",
        "Last": "Lomax",
        "Club": "CSM",
        "Time": "5:17.82",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9673&mrid=3796696&fn=Olivia&ln=Lomax",
        "Date": "11/30/2017"
    },
    {
        "#": "11",
        "First": "Hannah",
        "Last": "Bodkin",
        "Club": "DSU",
        "Time": "5:18.01",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9673&mrid=3796891&fn=Hannah&ln=Bodkin",
        "Date": "11/30/2017"
    },
    {
        "#": "12",
        "First": "Hannah",
        "Last": "Sakaluk",
        "Club": "IUSC",
        "Time": "5:19.25",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10108&mrid=3850683&fn=Hannah&ln=Sakaluk",
        "Date": "03/03/2018"
    },
    {
        "#": "13",
        "First": "Megan",
        "Last": "Ruppenthal",
        "Club": "DSU",
        "Time": "5:20.05",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9673&mrid=3796937&fn=Megan&ln=Ruppenthal",
        "Date": "11/30/2017"
    },
    {
        "#": "14",
        "First": "Sydney",
        "Last": "Skiles",
        "Club": "WSCU",
        "Time": "5:20.88",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9673&mrid=3797069&fn=Sydney&ln=Skiles",
        "Date": "11/30/2017"
    },
    {
        "#": "15",
        "First": "Anna",
        "Last": "Kaiser",
        "Club": "WSCU",
        "Time": "5:21.50",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9673&mrid=3797041&fn=Anna&ln=Kaiser",
        "Date": "11/30/2017"
    },
    {
        "#": "16",
        "First": "Shelby",
        "Last": "Graves",
        "Club": "DSU",
        "Time": "5:22.98",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9673&mrid=3796912&fn=Shelby&ln=Graves",
        "Date": "11/30/2017"
    },
    {
        "#": "17",
        "First": "Kelly",
        "Last": "Doktorski",
        "Club": "UVM",
        "Time": "5:24.08",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3959160&fn=Kelly&ln=Doktorski",
        "Date": "04/06/2018"
    },
    {
        "#": "18",
        "First": "Mckynley",
        "Last": "Larson",
        "Club": "GRIN",
        "Time": "5:24.54",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9844&mrid=3809883&fn=Mckynley&ln=Larson",
        "Date": "02/03/2018"
    },
    {
        "#": "19",
        "First": "Allison",
        "Last": "Noble",
        "Club": "NEAST",
        "Time": "5:24.77",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3956192&fn=Allison&ln=Noble",
        "Date": "04/06/2018"
    },
    {
        "#": "20",
        "First": "Jessica",
        "Last": "Lee",
        "Club": "SCUCD",
        "Time": "5:26.40",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9651&mrid=3787362&fn=Jessica&ln=Lee",
        "Date": "11/11/2017"
    },
    {
        "#": "21",
        "First": "Alina",
        "Last": "Barnes",
        "Club": "UTES",
        "Time": "5:27.11",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3958966&fn=Alina&ln=Barnes",
        "Date": "04/06/2018"
    },
    {
        "#": "22",
        "First": "Abbie",
        "Last": "Porter",
        "Club": "CMU",
        "Time": "5:27.30",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3953991&fn=Abbie&ln=Porter",
        "Date": "04/06/2018"
    },
    {
        "#": "23",
        "First": "Kate",
        "Last": "Pack",
        "Club": "DSU",
        "Time": "5:27.93",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9673&mrid=3796928&fn=Kate&ln=Pack",
        "Date": "11/30/2017"
    },
    {
        "#": "24",
        "First": "Alex",
        "Last": "Lewis",
        "Club": "CU",
        "Time": "5:28.96",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3954186&fn=Alex&ln=Lewis",
        "Date": "04/06/2018"
    },
    {
        "#": "25",
        "First": "Ellie",
        "Last": "Furuta",
        "Club": "NEAST",
        "Time": "5:29.34",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3956139&fn=Ellie&ln=Furuta",
        "Date": "04/06/2018"
    },
    {
        "#": "26",
        "First": "Madeline",
        "Last": "White",
        "Club": "WSCU",
        "Time": "5:29.51",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9673&mrid=3797083&fn=Madeline&ln=White",
        "Date": "11/30/2017"
    },
    {
        "#": "27",
        "First": "Allison",
        "Last": "Nastasi",
        "Club": "GTSC",
        "Time": "5:30.07",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9940&mrid=3817361&fn=Allison&ln=Nastasi",
        "Date": "01/28/2018"
    },
    {
        "#": "28",
        "First": "Sarah",
        "Last": "Jorgensen",
        "Club": "JMU",
        "Time": "5:30.16",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3955491&fn=Sarah&ln=Jorgensen",
        "Date": "04/06/2018"
    },
    {
        "#": "29",
        "First": "Tally",
        "Last": "Danielson",
        "Club": "MESA",
        "Time": "5:30.52",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9673&mrid=3796282&fn=Tally&ln=Danielson",
        "Date": "11/30/2017"
    },
    {
        "#": "30",
        "First": "Hannah",
        "Last": "Brockie",
        "Club": "CMU",
        "Time": "5:32.18",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3953942&fn=Hannah&ln=Brockie",
        "Date": "04/06/2018"
    },
    {
        "#": "31",
        "First": "Madeline",
        "Last": "Wolf",
        "Club": "NUSC",
        "Time": "5:33.20",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10102&mrid=3815835&fn=Madeline&ln=Wolf",
        "Date": "10/21/2017"
    },
    {
        "#": "32",
        "First": "Makenna",
        "Last": "Laffey",
        "Club": "GTSC",
        "Time": "5:33.94",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9561&mrid=3777111&fn=Makenna&ln=Laffey",
        "Date": "10/07/2017"
    },
    {
        "#": "33",
        "First": "Lindsay",
        "Last": "Knapp",
        "Club": "GTSC",
        "Time": "5:34.76",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9940&mrid=3817335&fn=Lindsay&ln=Knapp",
        "Date": "01/28/2018"
    },
    {
        "#": "34",
        "First": "Morgan",
        "Last": "Contino",
        "Club": "UKCS",
        "Time": "5:35.53",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9551&mrid=3784254&fn=Morgan&ln=Contino",
        "Date": "10/28/2017"
    },
    {
        "#": "35",
        "First": "Allison",
        "Last": "Noble",
        "Club": "NUSC",
        "Time": "5:36.16",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9792&mrid=3834957&fn=Allison&ln=Noble",
        "Date": "02/24/2018"
    },
    {
        "#": "36",
        "First": "Allison",
        "Last": "Noble",
        "Club": "NUSC",
        "Time": "5:36.22",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10102&mrid=3815833&fn=Allison&ln=Noble",
        "Date": "10/21/2017"
    },
    {
        "#": "37",
        "First": "Teresa",
        "Last": "Niehaus",
        "Club": "NDSC",
        "Time": "5:36.93",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3956368&fn=Teresa&ln=Niehaus",
        "Date": "04/06/2018"
    },
    {
        "#": "38",
        "First": "Ashley",
        "Last": "May",
        "Club": "UNCCH",
        "Time": "5:37.41",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3958438&fn=Ashley&ln=May",
        "Date": "04/06/2018"
    },
    {
        "#": "39",
        "First": "Katie",
        "Last": "Adorable",
        "Club": "PSC",
        "Time": "5:37.93",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9554&mrid=3790089&fn=Katie&ln=Adorable",
        "Date": "11/11/2017"
    },
    {
        "#": "40",
        "First": "Sydney",
        "Last": "Miller",
        "Club": "CMU",
        "Time": "5:38.04",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3953974&fn=Sydney&ln=Miller",
        "Date": "04/06/2018"
    },
    {
        "#": "41",
        "First": "Maria",
        "Last": "Venneri",
        "Club": "GRIN",
        "Time": "5:38.19",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9844&mrid=3809997&fn=Maria&ln=Venneri",
        "Date": "02/03/2018"
    },
    {
        "#": "42",
        "First": "Allison",
        "Last": "Noble",
        "Club": "NE",
        "Time": "5:38.22",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10003&mrid=3842905&fn=Allison&ln=Noble",
        "Date": "11/11/2017"
    },
    {
        "#": "43",
        "First": "Kelsey",
        "Last": "Bittel",
        "Club": "PSU",
        "Time": "5:38.49",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9837&mrid=3832312&fn=Kelsey&ln=Bittel",
        "Date": "02/24/2018"
    },
    {
        "#": "44",
        "First": "Teresa",
        "Last": "Niehaus",
        "Club": "NDSC",
        "Time": "5:38.69",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9554&mrid=3790003&fn=Teresa&ln=Niehaus",
        "Date": "11/11/2017"
    },
    {
        "#": "45",
        "First": "Emma",
        "Last": "Finnerty",
        "Club": "UCONN",
        "Time": "5:38.78",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3958176&fn=Emma&ln=Finnerty",
        "Date": "04/06/2018"
    },
    {
        "#": "46",
        "First": "Sarah",
        "Last": "Jorgensen",
        "Club": "JMU",
        "Time": "5:39.18",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9825&mrid=3821490&fn=Sarah&ln=Jorgensen",
        "Date": "02/17/2018"
    },
    {
        "#": "47",
        "First": "Kelly",
        "Last": "Doktorski",
        "Club": "UVM",
        "Time": "5:39.35",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10002&mrid=3814369&fn=Kelly&ln=Doktorski",
        "Date": "02/10/2018"
    },
    {
        "#": "48",
        "First": "Kelsey",
        "Last": "Bittel",
        "Club": "PSU",
        "Time": "5:39.62",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3956515&fn=Kelsey&ln=Bittel",
        "Date": "04/06/2018"
    },
    {
        "#": "49",
        "First": "Emma",
        "Last": "Finnerty",
        "Club": "UCONN",
        "Time": "5:39.74",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10102&mrid=3815839&fn=Emma&ln=Finnerty",
        "Date": "10/21/2017"
    },
    {
        "#": "50",
        "First": "Jessica",
        "Last": "Lee",
        "Club": "UCD",
        "Time": "5:39.88",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9794&mrid=3817933&fn=Jessica&ln=Lee",
        "Date": "02/10/2018"
    },
    {
        "#": "51",
        "First": "Emma",
        "Last": "Finnerty",
        "Club": "UCONN",
        "Time": "5:40.11",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9570&mrid=3778379&fn=Emma&ln=Finnerty",
        "Date": "10/07/2017"
    },
    {
        "#": "52",
        "First": "Katrina",
        "Last": "Perito",
        "Club": "UW",
        "Time": "5:40.99",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9818&mrid=3809344&fn=Katrina&ln=Perito",
        "Date": "01/20/2018"
    },
    {
        "#": "53",
        "First": "Alina",
        "Last": "Barnes",
        "Club": "UTES",
        "Time": "5:41.07",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9730&mrid=3822897&fn=Alina&ln=Barnes",
        "Date": "02/17/2018"
    },
    {
        "#": "54",
        "First": "Brooke",
        "Last": "Dresden",
        "Club": "CMUCS",
        "Time": "5:41.27",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3953357&fn=Brooke&ln=Dresden",
        "Date": "04/06/2018"
    },
    {
        "#": "55",
        "First": "Kelsey",
        "Last": "Bittel",
        "Club": "PSU",
        "Time": "5:41.60",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9642&mrid=3778742&fn=Kelsey&ln=Bittel",
        "Date": "11/04/2017"
    },
    {
        "#": "56",
        "First": "Allison",
        "Last": "Noble",
        "Club": "NUSC",
        "Time": "5:41.99",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10076&mrid=3815045&fn=Allison&ln=Noble",
        "Date": "02/10/2018"
    },
    {
        "#": "57",
        "First": "Maddie",
        "Last": "Sibilia",
        "Club": "GTSC",
        "Time": "5:42.81",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9940&mrid=3817409&fn=Maddie&ln=Sibilia",
        "Date": "01/28/2018"
    },
    {
        "#": "58",
        "First": "Jessica",
        "Last": "Lee",
        "Club": "UCD",
        "Time": "5:42.98",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10063&mrid=3812283&fn=Jessica&ln=Lee",
        "Date": "12/02/2017"
    },
    {
        "#": "59",
        "First": "Madeline",
        "Last": "Wolf",
        "Club": "NE",
        "Time": "5:43.10",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10003&mrid=3842924&fn=Madeline&ln=Wolf",
        "Date": "11/11/2017"
    },
    {
        "#": "60",
        "First": "Siena",
        "Last": "Shannon",
        "Club": "UVA",
        "Time": "5:43.63",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9825&mrid=3821184&fn=Siena&ln=Shannon",
        "Date": "02/17/2018"
    },
    {
        "#": "61",
        "First": "Emma",
        "Last": "Hollowell",
        "Club": "MSU",
        "Time": "5:43.79",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9554&mrid=3789755&fn=Emma&ln=Hollowell",
        "Date": "11/11/2017"
    },
    {
        "#": "61",
        "First": "Hannah",
        "Last": "Brockie",
        "Club": "CLUB",
        "Time": "5:43.79",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9958&mrid=3850050&fn=Hannah&ln=Brockie",
        "Date": "03/02/2018"
    },
    {
        "#": "63",
        "First": "Emma",
        "Last": "Buckley",
        "Club": "WM",
        "Time": "5:43.90",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3959755&fn=Emma&ln=Buckley",
        "Date": "04/06/2018"
    },
    {
        "#": "64",
        "First": "Shannon",
        "Last": "Linsey",
        "Club": "NUSC",
        "Time": "5:43.91",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10102&mrid=3815836&fn=Shannon&ln=Linsey",
        "Date": "10/21/2017"
    },
    {
        "#": "65",
        "First": "Sydney",
        "Last": "Miller",
        "Club": "CLUB",
        "Time": "5:44.06",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9958&mrid=3850074&fn=Sydney&ln=Miller",
        "Date": "03/02/2018"
    },
    {
        "#": "66",
        "First": "Teresa",
        "Last": "Niehaus",
        "Club": "NDSC",
        "Time": "5:44.14",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9831&mrid=3815396&fn=Teresa&ln=Niehaus",
        "Date": "02/03/2018"
    },
    {
        "#": "67",
        "First": "Grace",
        "Last": "Hofmann",
        "Club": "WFU",
        "Time": "5:44.15",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10015&mrid=3822389&fn=Grace&ln=Hofmann",
        "Date": "02/17/2018"
    },
    {
        "#": "68",
        "First": "Marissa",
        "Last": "James",
        "Club": "NCSU",
        "Time": "5:44.31",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9664&mrid=3788301&fn=Marissa&ln=James",
        "Date": "11/12/2017"
    },
    {
        "#": "69",
        "First": "Morgan",
        "Last": "Contino",
        "Club": "UKCS",
        "Time": "5:44.33",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9640&mrid=3836034&fn=Morgan&ln=Contino",
        "Date": "02/24/2018"
    },
    {
        "#": "70",
        "First": "Ashley",
        "Last": "Herrod",
        "Club": "FSU",
        "Time": "5:44.39",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9410&mrid=3790936&fn=Ashley&ln=Herrod",
        "Date": "11/11/2017"
    },
    {
        "#": "71",
        "First": "Alex",
        "Last": "Lewis",
        "Club": "CU",
        "Time": "5:44.51",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9816&mrid=3814223&fn=Alex&ln=Lewis",
        "Date": "02/10/2018"
    },
    {
        "#": "72",
        "First": "Jenni",
        "Last": "Uplinger",
        "Club": "CAZ",
        "Time": "5:44.75",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9982&mrid=3816113&fn=Jenni&ln=Uplinger",
        "Date": "02/03/2018"
    },
    {
        "#": "73",
        "First": "Courteney",
        "Last": "Lerch",
        "Club": "TAMCS",
        "Time": "5:44.80",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3957827&fn=Courteney&ln=Lerch",
        "Date": "04/06/2018"
    },
    {
        "#": "74",
        "First": "Kelsey",
        "Last": "Bittel",
        "Club": "PSU",
        "Time": "5:45.04",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9834&mrid=3810542&fn=Kelsey&ln=Bittel",
        "Date": "02/03/2018"
    },
    {
        "#": "75",
        "First": "Katrina",
        "Last": "Perito",
        "Club": "UW",
        "Time": "5:45.37",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9584&mrid=3785845&fn=Katrina&ln=Perito",
        "Date": "10/28/2017"
    },
    {
        "#": "76",
        "First": "Ashley",
        "Last": "Herrod",
        "Club": "FSU",
        "Time": "5:45.81",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9631&mrid=3785422&fn=Ashley&ln=Herrod",
        "Date": "10/28/2017"
    },
    {
        "#": "77",
        "First": "Emma",
        "Last": "Dietz",
        "Club": "UMASS",
        "Time": "5:46.47",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10003&mrid=3842944&fn=Emma&ln=Dietz",
        "Date": "11/11/2017"
    },
    {
        "#": "78",
        "First": "Michelle",
        "Last": "Karpishin",
        "Club": "USCA",
        "Time": "5:46.57",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3957559&fn=Michelle&ln=Karpishin",
        "Date": "04/06/2018"
    },
    {
        "#": "79",
        "First": "Marissa",
        "Last": "James",
        "Club": "NCSU",
        "Time": "5:46.71",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3957194&fn=Marissa&ln=James",
        "Date": "04/06/2018"
    },
    {
        "#": "80",
        "First": "Alina",
        "Last": "Barnes",
        "Club": "UTES",
        "Time": "5:47.38",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9562&mrid=3793203&fn=Alina&ln=Barnes",
        "Date": "10/13/2017"
    },
    {
        "#": "81",
        "First": "Abbie",
        "Last": "Porter",
        "Club": "CLUB",
        "Time": "5:47.63",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9958&mrid=3850092&fn=Abbie&ln=Porter",
        "Date": "03/02/2018"
    },
    {
        "#": "82",
        "First": "Emma",
        "Last": "Buckley",
        "Club": "W&M",
        "Time": "5:48.01",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9825&mrid=3822008&fn=Emma&ln=Buckley",
        "Date": "02/17/2018"
    },
    {
        "#": "83",
        "First": "Hannah",
        "Last": "Boyce",
        "Club": "NEAST",
        "Time": "5:48.29",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3956115&fn=Hannah&ln=Boyce",
        "Date": "04/06/2018"
    },
    {
        "#": "84",
        "First": "Emma",
        "Last": "Buckley",
        "Club": "W&M",
        "Time": "5:48.58",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9611&mrid=3793947&fn=Emma&ln=Buckley",
        "Date": "10/28/2017"
    },
    {
        "#": "85",
        "First": "Michelle",
        "Last": "Karpishin",
        "Club": "USC",
        "Time": "5:49.46",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9794&mrid=3818052&fn=Michelle&ln=Karpishin",
        "Date": "02/10/2018"
    },
    {
        "#": "86",
        "First": "Polina",
        "Last": "Cherkez",
        "Club": "UNCCH",
        "Time": "5:49.49",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3958382&fn=Polina&ln=Cherkez",
        "Date": "04/06/2018"
    },
    {
        "#": "87",
        "First": "Jessica",
        "Last": "Lee",
        "Club": "SCUCD",
        "Time": "5:49.73",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3957527&fn=Jessica&ln=Lee",
        "Date": "04/06/2018"
    },
    {
        "#": "88",
        "First": "Dorota",
        "Last": "Tou",
        "Club": "DUCS",
        "Time": "5:49.99",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9642&mrid=3778640&fn=Dorota&ln=Tou",
        "Date": "11/04/2017"
    },
    {
        "#": "89",
        "First": "Rachel",
        "Last": "Redmond",
        "Club": "UNC",
        "Time": "5:50.06",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9561&mrid=3777113&fn=Rachel&ln=Redmond",
        "Date": "10/07/2017"
    },
    {
        "#": "90",
        "First": "Emma",
        "Last": "Hollowell",
        "Club": "MSUSC",
        "Time": "5:50.09",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3955900&fn=Emma&ln=Hollowell",
        "Date": "04/06/2018"
    },
    {
        "#": "91",
        "First": "Emma",
        "Last": "Buckley",
        "Club": "W&M",
        "Time": "5:50.79",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9913&mrid=3802177&fn=Emma&ln=Buckley",
        "Date": "09/08/2017"
    },
    {
        "#": "92",
        "First": "Alina",
        "Last": "Barnes",
        "Club": "UTES",
        "Time": "5:51.31",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9654&mrid=3792131&fn=Alina&ln=Barnes",
        "Date": "12/02/2017"
    },
    {
        "#": "93",
        "First": "Haruka",
        "Last": "Uchida",
        "Club": "HCS",
        "Time": "5:51.37",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10102&mrid=3815840&fn=Haruka&ln=Uchida",
        "Date": "10/21/2017"
    },
    {
        "#": "93",
        "First": "Brooke",
        "Last": "Dresden",
        "Club": "CMU",
        "Time": "5:51.37",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9789&mrid=3818138&fn=Brooke&ln=Dresden",
        "Date": "02/10/2018"
    },
    {
        "#": "95",
        "First": "Kelsey",
        "Last": "Bittel",
        "Club": "PSU",
        "Time": "5:51.46",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9510&mrid=3779762&fn=Kelsey&ln=Bittel",
        "Date": "09/25/2017"
    },
    {
        "#": "96",
        "First": "Kimberly",
        "Last": "Ma",
        "Club": "DART",
        "Time": "5:51.83",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9637&mrid=3777588&fn=Kimberly&ln=Ma",
        "Date": "11/04/2017"
    },
    {
        "#": "97",
        "First": "Tori",
        "Last": "LaVerdiere",
        "Club": "GRIN",
        "Time": "5:51.88",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9844&mrid=3809887&fn=Tori&ln=LaVerdiere",
        "Date": "02/03/2018"
    },
    {
        "#": "98",
        "First": "Kelsey",
        "Last": "Bittel",
        "Club": "PSU",
        "Time": "5:52.18",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9570&mrid=3777905&fn=Kelsey&ln=Bittel",
        "Date": "10/07/2017"
    },
    {
        "#": "99",
        "First": "Ann",
        "Last": "Mazur",
        "Club": "UVA",
        "Time": "5:53.21",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9765&mrid=3832987&fn=Ann&ln=Mazur",
        "Date": "02/24/2018"
    },
    {
        "#": "100",
        "First": "Meg",
        "Last": "Hall",
        "Club": "UVM",
        "Time": "5:53.31",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10002&mrid=3814380&fn=Meg&ln=Hall",
        "Date": "02/10/2018"
    },
    {
        "#": "101",
        "First": "Sarah",
        "Last": "Saunders",
        "Club": "UVA",
        "Time": "5:53.36",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9765&mrid=3833051&fn=Sarah&ln=Saunders",
        "Date": "02/24/2018"
    },
    {
        "#": "102",
        "First": "Clara",
        "Last": "Dresselhaus",
        "Club": "UCD",
        "Time": "5:53.43",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9794&mrid=3817921&fn=Clara&ln=Dresselhaus",
        "Date": "02/10/2018"
    },
    {
        "#": "103",
        "First": "Ellie",
        "Last": "Furuta",
        "Club": "NUSC",
        "Time": "5:53.98",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9792&mrid=3834911&fn=Ellie&ln=Furuta",
        "Date": "02/24/2018"
    },
    {
        "#": "104",
        "First": "Jenny",
        "Last": "Schuster",
        "Club": "UNCW",
        "Time": "5:54.29",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9664&mrid=3788739&fn=Jenny&ln=Schuster",
        "Date": "11/12/2017"
    },
    {
        "#": "105",
        "First": "Rachel",
        "Last": "Redmond",
        "Club": "UNCCH",
        "Time": "5:54.30",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9789&mrid=3818430&fn=Rachel&ln=Redmond",
        "Date": "02/10/2018"
    },
    {
        "#": "106",
        "First": "Polina",
        "Last": "Cherkez",
        "Club": "UNCCH",
        "Time": "5:54.45",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9789&mrid=3818369&fn=Polina&ln=Cherkez",
        "Date": "02/10/2018"
    },
    {
        "#": "107",
        "First": "Jennifer",
        "Last": "Hollander",
        "Club": "UF",
        "Time": "5:54.71",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9407&mrid=3745586&fn=Jennifer&ln=Hollander",
        "Date": "09/23/2017"
    },
    {
        "#": "108",
        "First": "Grace",
        "Last": "Hofmann",
        "Club": "WAKE",
        "Time": "5:54.87",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9667&mrid=3792466&fn=Grace&ln=Hofmann",
        "Date": "10/28/2017"
    },
    {
        "#": "109",
        "First": "Mackenzy",
        "Last": "Nutter",
        "Club": "CAZ",
        "Time": "5:54.96",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9982&mrid=3816099&fn=Mackenzy&ln=Nutter",
        "Date": "02/03/2018"
    },
    {
        "#": "110",
        "First": "Hannah",
        "Last": "Boyce",
        "Club": "NUSC",
        "Time": "5:55.19",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9637&mrid=3777618&fn=Hannah&ln=Boyce",
        "Date": "11/04/2017"
    },
    {
        "#": "111",
        "First": "Maddie",
        "Last": "Rogers",
        "Club": "NUSC",
        "Time": "5:55.28",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9792&mrid=3834978&fn=Maddie&ln=Rogers",
        "Date": "02/24/2018"
    },
    {
        "#": "112",
        "First": "Katie",
        "Last": "Kirsh",
        "Club": "FSU",
        "Time": "5:55.37",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9561&mrid=3777114&fn=Katie&ln=Kirsh",
        "Date": "10/07/2017"
    },
    {
        "#": "113",
        "First": "Victoria",
        "Last": "Moore",
        "Club": "PUSC",
        "Time": "5:55.47",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9831&mrid=3815484&fn=Victoria&ln=Moore",
        "Date": "02/03/2018"
    },
    {
        "#": "114",
        "First": "Ashley",
        "Last": "May",
        "Club": "UNCCH",
        "Time": "5:55.59",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10015&mrid=3822253&fn=Ashley&ln=May",
        "Date": "02/17/2018"
    },
    {
        "#": "115",
        "First": "Lauren",
        "Last": "DePiero",
        "Club": "VCS",
        "Time": "5:55.67",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9836&mrid=3822751&fn=Lauren&ln=DePiero",
        "Date": "02/17/2018"
    },
    {
        "#": "116",
        "First": "Alycen",
        "Last": "Wiacek",
        "Club": "JHU",
        "Time": "5:55.83",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9642&mrid=3778680&fn=Alycen&ln=Wiacek",
        "Date": "11/04/2017"
    },
    {
        "#": "117",
        "First": "Marley",
        "Last": "Dewey",
        "Club": "ISC",
        "Time": "5:55.99",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9554&mrid=3789568&fn=Marley&ln=Dewey",
        "Date": "11/11/2017"
    },
    {
        "#": "118",
        "First": "Elizabeth",
        "Last": "Witting",
        "Club": "DU",
        "Time": "5:56.17",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9550&mrid=3774765&fn=Elizabeth&ln=Witting",
        "Date": "10/07/2017"
    },
    {
        "#": "118",
        "First": "Elizabeth",
        "Last": "Witting",
        "Club": "DU",
        "Time": "5:56.17",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9550&mrid=3774990&fn=Elizabeth&ln=Witting",
        "Date": "10/07/2017"
    },
    {
        "#": "120",
        "First": "Jennifer",
        "Last": "Hollander",
        "Club": "FCSD",
        "Time": "5:56.26",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3954548&fn=Jennifer&ln=Hollander",
        "Date": "04/06/2018"
    },
    {
        "#": "121",
        "First": "Polina",
        "Last": "Cherkez",
        "Club": "UNC",
        "Time": "5:56.27",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9561&mrid=3777116&fn=Polina&ln=Cherkez",
        "Date": "10/07/2017"
    },
    {
        "#": "122",
        "First": "Sarah",
        "Last": "Saunders",
        "Club": "UVA",
        "Time": "5:57.06",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9611&mrid=3793874&fn=Sarah&ln=Saunders",
        "Date": "10/28/2017"
    },
    {
        "#": "123",
        "First": "Shannon",
        "Last": "Ellery",
        "Club": "GRIN",
        "Time": "5:57.56",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9844&mrid=3809827&fn=Shannon&ln=Ellery",
        "Date": "02/03/2018"
    },
    {
        "#": "124",
        "First": "Naomie",
        "Last": "Gutekunst",
        "Club": "ECS",
        "Time": "5:57.83",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9561&mrid=3777110&fn=Naomie&ln=Gutekunst",
        "Date": "10/07/2017"
    },
    {
        "#": "125",
        "First": "Morgan",
        "Last": "Weiss",
        "Club": "FGCU",
        "Time": "5:58.26",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9640&mrid=3835936&fn=Morgan&ln=Weiss",
        "Date": "02/24/2018"
    },
    {
        "#": "126",
        "First": "Anne",
        "Last": "Criddle",
        "Club": "KSUSC",
        "Time": "5:58.42",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9777&mrid=3849155&fn=Anne&ln=Criddle",
        "Date": "03/03/2018"
    },
    {
        "#": "127",
        "First": "Lillie",
        "Last": "Fehr",
        "Club": "MN",
        "Time": "5:58.51",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9844&mrid=3810075&fn=Lillie&ln=Fehr",
        "Date": "02/03/2018"
    },
    {
        "#": "128",
        "First": "Megan",
        "Last": "Jones",
        "Club": "UNC",
        "Time": "5:58.68",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9562&mrid=3793154&fn=Megan&ln=Jones",
        "Date": "10/13/2017"
    },
    {
        "#": "129",
        "First": "Sarah",
        "Last": "Saunders",
        "Club": "UVA",
        "Time": "5:58.99",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9825&mrid=3821176&fn=Sarah&ln=Saunders",
        "Date": "02/17/2018"
    },
    {
        "#": "130",
        "First": "Erin",
        "Last": "Geiszler",
        "Club": "ASU",
        "Time": "5:59.07",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9664&mrid=3787503&fn=Erin&ln=Geiszler",
        "Date": "11/12/2017"
    },
    {
        "#": "131",
        "First": "Denise",
        "Last": "Shealy",
        "Club": "COFC",
        "Time": "5:59.11",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9725&mrid=3827789&fn=Denise&ln=Shealy",
        "Date": "02/17/2018"
    },
    {
        "#": "132",
        "First": "Dorota",
        "Last": "Tou",
        "Club": "DUCS",
        "Time": "5:59.20",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9885&mrid=3808710&fn=Dorota&ln=Tou",
        "Date": "02/03/2018"
    },
    {
        "#": "133",
        "First": "Callie",
        "Last": "Kanim",
        "Club": "UDSC",
        "Time": "5:59.25",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9836&mrid=3822616&fn=Callie&ln=Kanim",
        "Date": "02/17/2018"
    },
    {
        "#": "134",
        "First": "Claudia",
        "Last": "Flores",
        "Club": "CSU",
        "Time": "5:59.31",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9958&mrid=3850107&fn=Claudia&ln=Flores",
        "Date": "03/02/2018"
    },
    {
        "#": "135",
        "First": "Amelia",
        "Last": "Brady",
        "Club": "AUCS",
        "Time": "5:59.36",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9789&mrid=3818079&fn=Amelia&ln=Brady",
        "Date": "02/10/2018"
    },
    {
        "#": "136",
        "First": "Lauren",
        "Last": "DePiero",
        "Club": "VCS",
        "Time": "5:59.45",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9726&mrid=3959305&fn=Lauren&ln=DePiero",
        "Date": "04/06/2018"
    },
    {
        "#": "137",
        "First": "Daniela",
        "Last": "Torrez",
        "Club": "UCF",
        "Time": "5:59.91",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9410&mrid=3791229&fn=Daniela&ln=Torrez",
        "Date": "11/11/2017"
    },
    {
        "#": "138",
        "First": "Rachel",
        "Last": "Redmond",
        "Club": "UNCCH",
        "Time": "6:00.05",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9795&mrid=3816503&fn=Rachel&ln=Redmond",
        "Date": "01/27/2018"
    },
    {
        "#": "139",
        "First": "Callie",
        "Last": "Kanim",
        "Club": "UDSC",
        "Time": "6:00.22",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10195&mrid=3839225&fn=Callie&ln=Kanim",
        "Date": "02/27/2018"
    },
    {
        "#": "140",
        "First": "Polly",
        "Last": "Creveling",
        "Club": "UTES",
        "Time": "6:00.57",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9636&mrid=3814908&fn=Polly&ln=Creveling",
        "Date": "11/11/2017"
    },
    {
        "#": "141",
        "First": "Abby",
        "Last": "Wuensch",
        "Club": "UF",
        "Time": "6:00.73",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9410&mrid=3790904&fn=Abby&ln=Wuensch",
        "Date": "11/11/2017"
    },
    {
        "#": "142",
        "First": "Megan",
        "Last": "Jones",
        "Club": "UNC",
        "Time": "6:01.19",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9739&mrid=3835742&fn=Megan&ln=Jones",
        "Date": "02/24/2018"
    },
    {
        "#": "143",
        "First": "Olivia",
        "Last": "Bear",
        "Club": "ASU",
        "Time": "6:01.74",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9725&mrid=3827597&fn=Olivia&ln=Bear",
        "Date": "02/17/2018"
    },
    {
        "#": "144",
        "First": "Eve",
        "Last": "Cook",
        "Club": "MSU",
        "Time": "6:01.84",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9554&mrid=3789744&fn=Eve&ln=Cook",
        "Date": "11/11/2017"
    },
    {
        "#": "145",
        "First": "Megan",
        "Last": "McCreary",
        "Club": "VTSC",
        "Time": "6:02.12",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9765&mrid=3833688&fn=Megan&ln=McCreary",
        "Date": "02/24/2018"
    },
    {
        "#": "146",
        "First": "Susanne",
        "Last": "Kusherick",
        "Club": "PSC",
        "Time": "6:02.16",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9834&mrid=3810473&fn=Susanne&ln=Kusherick",
        "Date": "02/03/2018"
    },
    {
        "#": "147",
        "First": "Caroline",
        "Last": "Wolek",
        "Club": "BROWN",
        "Time": "6:02.35",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10102&mrid=3815832&fn=Caroline&ln=Wolek",
        "Date": "10/21/2017"
    },
    {
        "#": "148",
        "First": "Caerwyn",
        "Last": "Hartten",
        "Club": "UMD",
        "Time": "6:02.43",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9642&mrid=3779392&fn=Caerwyn&ln=Hartten",
        "Date": "11/04/2017"
    },
    {
        "#": "149",
        "First": "Polina",
        "Last": "Cherkez",
        "Club": "UNCCH",
        "Time": "6:02.59",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9795&mrid=3816426&fn=Polina&ln=Cherkez",
        "Date": "01/27/2018"
    },
    {
        "#": "150",
        "First": "Cassie",
        "Last": "Frazier",
        "Club": "ISUSC",
        "Time": "6:02.97",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9578&mrid=3779659&fn=Cassie&ln=Frazier",
        "Date": "10/07/2017"
    },
    {
        "#": "151",
        "First": "Hannah",
        "Last": "Boyce",
        "Club": "NUSC",
        "Time": "6:03.18",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9792&mrid=3834892&fn=Hannah&ln=Boyce",
        "Date": "02/24/2018"
    },
    {
        "#": "152",
        "First": "Susanne",
        "Last": "Kusherick",
        "Club": "PSC",
        "Time": "6:03.58",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9837&mrid=3832240&fn=Susanne&ln=Kusherick",
        "Date": "02/24/2018"
    },
    {
        "#": "153",
        "First": "Jacqueline",
        "Last": "Foley",
        "Club": "UVM",
        "Time": "6:03.75",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10002&mrid=3814377&fn=Jacqueline&ln=Foley",
        "Date": "02/10/2018"
    },
    {
        "#": "154",
        "First": "Makenna",
        "Last": "Baldwin",
        "Club": "CLEM",
        "Time": "6:04.37",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10005&mrid=3829222&fn=Makenna&ln=Baldwin",
        "Date": "09/30/2017"
    },
    {
        "#": "155",
        "First": "Daniela",
        "Last": "Torrez",
        "Club": "UCF",
        "Time": "6:04.47",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9640&mrid=3836174&fn=Daniela&ln=Torrez",
        "Date": "02/24/2018"
    },
    {
        "#": "156",
        "First": "Maddie",
        "Last": "Rogers",
        "Club": "NUSC",
        "Time": "6:05.00",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10076&mrid=3815061&fn=Maddie&ln=Rogers",
        "Date": "02/10/2018"
    },
    {
        "#": "157",
        "First": "Claire",
        "Last": "Kim",
        "Club": "BROWN",
        "Time": "6:05.01",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10102&mrid=3815831&fn=Claire&ln=Kim",
        "Date": "10/21/2017"
    },
    {
        "#": "158",
        "First": "Amanda",
        "Last": "Civitello",
        "Club": "PU",
        "Time": "6:05.11",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10174&mrid=3824649&fn=Amanda&ln=Civitello",
        "Date": "10/22/2017"
    },
    {
        "#": "159",
        "First": "Camila",
        "Last": "Medrano",
        "Club": "GTSC",
        "Time": "6:05.22",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10279&mrid=3852338&fn=Camila&ln=Medrano",
        "Date": "03/06/2018"
    },
    {
        "#": "160",
        "First": "Susanne",
        "Last": "Kusherick",
        "Club": "PSC",
        "Time": "6:05.38",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9416&mrid=3773586&fn=Susanne&ln=Kusherick",
        "Date": "09/30/2017"
    },
    {
        "#": "161",
        "First": "Olivia",
        "Last": "Kruger",
        "Club": "PSC",
        "Time": "6:05.58",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9665&mrid=3786421&fn=Olivia&ln=Kruger",
        "Date": "11/11/2017"
    },
    {
        "#": "162",
        "First": "Lauren",
        "Last": "Depiero",
        "Club": "VU",
        "Time": "6:05.71",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9642&mrid=3779478&fn=Lauren&ln=Depiero",
        "Date": "11/04/2017"
    },
    {
        "#": "163",
        "First": "Brooke",
        "Last": "Targus",
        "Club": "CAZ",
        "Time": "6:06.00",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9982&mrid=3816110&fn=Brooke&ln=Targus",
        "Date": "02/03/2018"
    },
    {
        "#": "164",
        "First": "Kristen",
        "Last": "Wade",
        "Club": "NCSU",
        "Time": "6:06.16",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10252&mrid=3841382&fn=Kristen&ln=Wade",
        "Date": "02/24/2018"
    },
    {
        "#": "165",
        "First": "Kristen",
        "Last": "Wade",
        "Club": "NCSU",
        "Time": "6:06.41",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10015&mrid=3822234&fn=Kristen&ln=Wade",
        "Date": "02/17/2018"
    },
    {
        "#": "166",
        "First": "Makenna",
        "Last": "Baldwin",
        "Club": "CLEM",
        "Time": "6:06.57",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9821&mrid=3797230&fn=Makenna&ln=Baldwin",
        "Date": "11/05/2017"
    },
    {
        "#": "167",
        "First": "Emma",
        "Last": "Granados",
        "Club": "IUSC",
        "Time": "6:06.71",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9831&mrid=3815196&fn=Emma&ln=Granados",
        "Date": "02/03/2018"
    },
    {
        "#": "168",
        "First": "Claressa",
        "Last": "Ullmayer",
        "Club": "VCS",
        "Time": "6:07.00",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9632&mrid=3791819&fn=Claressa&ln=Ullmayer",
        "Date": "12/02/2017"
    },
    {
        "#": "169",
        "First": "Olivia",
        "Last": "Kruger",
        "Club": "PSC",
        "Time": "6:07.23",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9416&mrid=3773585&fn=Olivia&ln=Kruger",
        "Date": "09/30/2017"
    },
    {
        "#": "170",
        "First": "Carissa",
        "Last": "Hardy",
        "Club": "NCSU",
        "Time": "6:07.86",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9664&mrid=3788281&fn=Carissa&ln=Hardy",
        "Date": "11/12/2017"
    },
    {
        "#": "171",
        "First": "Sarah",
        "Last": "Krakowski",
        "Club": "AUB",
        "Time": "6:08.09",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10171&mrid=3835842&fn=Sarah&ln=Krakowski",
        "Date": "02/22/2018"
    },
    {
        "#": "172",
        "First": "Anna",
        "Last": "Ross",
        "Club": "USC",
        "Time": "6:08.25",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10005&mrid=3829218&fn=Anna&ln=Ross",
        "Date": "09/30/2017"
    },
    {
        "#": "173",
        "First": "Katherine",
        "Last": "Irwin",
        "Club": "GRIN",
        "Time": "6:08.47",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9844&mrid=3809862&fn=Katherine&ln=Irwin",
        "Date": "02/03/2018"
    },
    {
        "#": "174",
        "First": "Katherine",
        "Last": "Kuhn",
        "Club": "MSU",
        "Time": "6:08.65",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9554&mrid=3789762&fn=Katherine&ln=Kuhn",
        "Date": "11/11/2017"
    },
    {
        "#": "175",
        "First": "Sara",
        "Last": "Gorske",
        "Club": "CORN",
        "Time": "6:08.96",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10188&mrid=3863261&fn=Sara&ln=Gorske",
        "Date": "03/10/2018"
    },
    {
        "#": "176",
        "First": "Lindsey",
        "Last": "McKula",
        "Club": "VU",
        "Time": "6:09.00",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9642&mrid=3779525&fn=Lindsey&ln=McKula",
        "Date": "11/04/2017"
    },
    {
        "#": "177",
        "First": "Hannah",
        "Last": "Boyce",
        "Club": "NUSC",
        "Time": "6:09.10",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10076&mrid=3814990&fn=Hannah&ln=Boyce",
        "Date": "02/10/2018"
    },
    {
        "#": "177",
        "First": "Fiona",
        "Last": "Granados",
        "Club": "IUSC",
        "Time": "6:09.10",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9554&mrid=3789610&fn=Fiona&ln=Granados",
        "Date": "11/11/2017"
    },
    {
        "#": "179",
        "First": "Olivia",
        "Last": "Bear",
        "Club": "ASU",
        "Time": "6:09.13",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10228&mrid=3833922&fn=Olivia&ln=Bear",
        "Date": "10/21/2017"
    },
    {
        "#": "180",
        "First": "Lauren",
        "Last": "Czaja",
        "Club": "NDSC",
        "Time": "6:09.46",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9554&mrid=3789952&fn=Lauren&ln=Czaja",
        "Date": "11/11/2017"
    },
    {
        "#": "181",
        "First": "Daniela",
        "Last": "Torrez",
        "Club": "UCF",
        "Time": "6:09.48",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9725&mrid=3828286&fn=Daniela&ln=Torrez",
        "Date": "02/17/2018"
    },
    {
        "#": "182",
        "First": "Kristen",
        "Last": "Wade",
        "Club": "NCSU",
        "Time": "6:09.50",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9667&mrid=3792463&fn=Kristen&ln=Wade",
        "Date": "10/28/2017"
    },
    {
        "#": "183",
        "First": "Rachel",
        "Last": "Lynch",
        "Club": "UNC",
        "Time": "6:09.74",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9550&mrid=3774813&fn=Rachel&ln=Lynch",
        "Date": "10/07/2017"
    },
    {
        "#": "183",
        "First": "Rachel",
        "Last": "Lynch",
        "Club": "UNC",
        "Time": "6:09.74",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9550&mrid=3775038&fn=Rachel&ln=Lynch",
        "Date": "10/07/2017"
    },
    {
        "#": "185",
        "First": "Emma",
        "Last": "Buckley",
        "Club": "W&M",
        "Time": "6:09.95",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9868&mrid=3810181&fn=Emma&ln=Buckley",
        "Date": "02/03/2018"
    },
    {
        "#": "186",
        "First": "Elsa",
        "Last": "Borello",
        "Club": "UMICH",
        "Time": "6:10.08",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9676&mrid=3790446&fn=Elsa&ln=Borello",
        "Date": "12/02/2017"
    },
    {
        "#": "187",
        "First": "Carson",
        "Last": "Myers",
        "Club": "NDSC",
        "Time": "6:10.37",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10115&mrid=3832693&fn=Carson&ln=Myers",
        "Date": "02/23/2018"
    },
    {
        "#": "188",
        "First": "Samantha",
        "Last": "Wooten",
        "Club": "NCSU",
        "Time": "6:10.38",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9664&mrid=3788486&fn=Samantha&ln=Wooten",
        "Date": "11/12/2017"
    },
    {
        "#": "189",
        "First": "Sharon",
        "Last": "Chen",
        "Club": "USC",
        "Time": "6:10.58",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10063&mrid=3812498&fn=Sharon&ln=Chen",
        "Date": "12/02/2017"
    },
    {
        "#": "190",
        "First": "Brooke",
        "Last": "Dresden",
        "Club": "CMU",
        "Time": "6:10.69",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9665&mrid=3786106&fn=Brooke&ln=Dresden",
        "Date": "11/11/2017"
    },
    {
        "#": "191",
        "First": "Emily",
        "Last": "Winget",
        "Club": "CSOSU",
        "Time": "6:10.78",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9573&mrid=3794606&fn=Emily&ln=Winget",
        "Date": "10/14/2017"
    },
    {
        "#": "192",
        "First": "Jackie",
        "Last": "Foley",
        "Club": "UVM",
        "Time": "6:10.85",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10003&mrid=3843014&fn=Jackie&ln=Foley",
        "Date": "11/11/2017"
    },
    {
        "#": "193",
        "First": "Rachel",
        "Last": "Cook",
        "Club": "VCU",
        "Time": "6:11.53",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9664&mrid=3788914&fn=Rachel&ln=Cook",
        "Date": "11/12/2017"
    },
    {
        "#": "194",
        "First": "Natalie",
        "Last": "Paliulis",
        "Club": "UCONN",
        "Time": "6:12.09",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10244&mrid=3835414&fn=Natalie&ln=Paliulis",
        "Date": "11/12/2017"
    },
    {
        "#": "195",
        "First": "Stasia",
        "Last": "Pietraszun",
        "Club": "FSU",
        "Time": "6:12.11",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9561&mrid=3777115&fn=Stasia&ln=Pietraszun",
        "Date": "10/07/2017"
    },
    {
        "#": "196",
        "First": "Ellie",
        "Last": "Furuta",
        "Club": "NUSC",
        "Time": "6:12.45",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10076&mrid=3815007&fn=Ellie&ln=Furuta",
        "Date": "02/10/2018"
    },
    {
        "#": "197",
        "First": "Emma",
        "Last": "Granados",
        "Club": "IUSC",
        "Time": "6:12.48",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9554&mrid=3789607&fn=Emma&ln=Granados",
        "Date": "11/11/2017"
    },
    {
        "#": "198",
        "First": "Caroline",
        "Last": "Vogel",
        "Club": "UKCS",
        "Time": "6:12.54",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9554&mrid=3789729&fn=Caroline&ln=Vogel",
        "Date": "11/11/2017"
    },
    {
        "#": "199",
        "First": "Emilie",
        "Last": "Ritter",
        "Club": "TU",
        "Time": "6:12.58",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9642&mrid=3779072&fn=Emilie&ln=Ritter",
        "Date": "11/04/2017"
    },
    {
        "#": "200",
        "First": "Isabella",
        "Last": "Morin",
        "Club": "UGASC",
        "Time": "6:12.61",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9561&mrid=3777118&fn=Isabella&ln=Morin",
        "Date": "10/07/2017"
    },
    {
        "#": "201",
        "First": "Natalie",
        "Last": "DeLeon",
        "Club": "CSOSU",
        "Time": "6:12.94",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9820&mrid=3808183&fn=Natalie&ln=DeLeon",
        "Date": "02/03/2018"
    },
    {
        "#": "202",
        "First": "Izzy",
        "Last": "Greenhut",
        "Club": "CU",
        "Time": "6:12.95",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9562&mrid=3792986&fn=Izzy&ln=Greenhut",
        "Date": "10/13/2017"
    },
    {
        "#": "203",
        "First": "Lauren",
        "Last": "Roper",
        "Club": "UCONN",
        "Time": "6:13.16",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9637&mrid=3777738&fn=Lauren&ln=Roper",
        "Date": "11/04/2017"
    },
    {
        "#": "204",
        "First": "Natalie",
        "Last": "Thomas",
        "Club": "NCSU",
        "Time": "6:13.40",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9664&mrid=3788457&fn=Natalie&ln=Thomas",
        "Date": "11/12/2017"
    },
    {
        "#": "205",
        "First": "Christine",
        "Last": "Barba",
        "Club": "UDSC",
        "Time": "6:13.71",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9836&mrid=3822536&fn=Christine&ln=Barba",
        "Date": "02/17/2018"
    },
    {
        "#": "206",
        "First": "Lexi",
        "Last": "Spaulding",
        "Club": "PSC",
        "Time": "6:13.80",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9554&mrid=3790151&fn=Lexi&ln=Spaulding",
        "Date": "11/11/2017"
    },
    {
        "#": "207",
        "First": "Kali",
        "Last": "Kaiser",
        "Club": "UW",
        "Time": "6:14.47",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9732&mrid=3814036&fn=Kali&ln=Kaiser",
        "Date": "02/10/2018"
    },
    {
        "#": "208",
        "First": "Carly",
        "Last": "Siegle",
        "Club": "PSU",
        "Time": "6:14.52",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9570&mrid=3778072&fn=Carly&ln=Siegle",
        "Date": "10/07/2017"
    },
    {
        "#": "209",
        "First": "Kelsey",
        "Last": "Field",
        "Club": "NSUSC",
        "Time": "6:14.75",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9410&mrid=3791022&fn=Kelsey&ln=Field",
        "Date": "11/11/2017"
    },
    {
        "#": "210",
        "First": "Lysny",
        "Last": "Woodahl",
        "Club": "UF",
        "Time": "6:14.81",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9410&mrid=3790899&fn=Lysny&ln=Woodahl",
        "Date": "11/11/2017"
    },
    {
        "#": "211",
        "First": "Hannah",
        "Last": "Davis",
        "Club": "GRIN",
        "Time": "6:14.93",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9844&mrid=3809811&fn=Hannah&ln=Davis",
        "Date": "02/03/2018"
    },
    {
        "#": "212",
        "First": "Olivia",
        "Last": "Kruger",
        "Club": "PSC",
        "Time": "6:15.15",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9834&mrid=3810470&fn=Olivia&ln=Kruger",
        "Date": "02/03/2018"
    },
    {
        "#": "213",
        "First": "Emma",
        "Last": "Granados",
        "Club": "IUSC",
        "Time": "6:15.20",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10174&mrid=3824539&fn=Emma&ln=Granados",
        "Date": "10/22/2017"
    },
    {
        "#": "214",
        "First": "Claire",
        "Last": "Collett",
        "Club": "UKCS",
        "Time": "6:15.47",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9820&mrid=3808481&fn=Claire&ln=Collett",
        "Date": "02/03/2018"
    },
    {
        "#": "215",
        "First": "Caerwyn",
        "Last": "Hartten",
        "Club": "UMD",
        "Time": "6:15.93",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10015&mrid=3822325&fn=Caerwyn&ln=Hartten",
        "Date": "02/17/2018"
    },
    {
        "#": "216",
        "First": "Carissa",
        "Last": "Hardy",
        "Club": "NCSU",
        "Time": "6:16.46",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10015&mrid=3822208&fn=Carissa&ln=Hardy",
        "Date": "02/17/2018"
    },
    {
        "#": "217",
        "First": "Kristen",
        "Last": "Wade",
        "Club": "NCSU",
        "Time": "6:16.67",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9795&mrid=3816401&fn=Kristen&ln=Wade",
        "Date": "01/27/2018"
    },
    {
        "#": "218",
        "First": "Morgan",
        "Last": "Caramenico",
        "Club": "PSC",
        "Time": "6:16.93",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9416&mrid=3773488&fn=Morgan&ln=Caramenico",
        "Date": "09/30/2017"
    },
    {
        "#": "219",
        "First": "Natalie",
        "Last": "Paliulis",
        "Club": "UCONN",
        "Time": "6:17.23",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9637&mrid=3777727&fn=Natalie&ln=Paliulis",
        "Date": "11/04/2017"
    },
    {
        "#": "220",
        "First": "Samantha",
        "Last": "Stanley",
        "Club": "BU",
        "Time": "6:17.70",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10174&mrid=3824505&fn=Samantha&ln=Stanley",
        "Date": "10/22/2017"
    },
    {
        "#": "221",
        "First": "Lindsey",
        "Last": "McKula",
        "Club": "VCS",
        "Time": "6:17.86",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9632&mrid=3791769&fn=Lindsey&ln=McKula",
        "Date": "12/02/2017"
    },
    {
        "#": "222",
        "First": "Grace",
        "Last": "Hedin",
        "Club": "DU",
        "Time": "6:17.98",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9669&mrid=3792744&fn=Grace&ln=Hedin",
        "Date": "11/11/2017"
    },
    {
        "#": "223",
        "First": "Renee",
        "Last": "Schmitzer",
        "Club": "SRU",
        "Time": "6:18.07",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9834&mrid=3810831&fn=Renee&ln=Schmitzer",
        "Date": "02/03/2018"
    },
    {
        "#": "224",
        "First": "Katina",
        "Last": "Pappas",
        "Club": "UF",
        "Time": "6:18.08",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9407&mrid=3745650&fn=Katina&ln=Pappas",
        "Date": "09/23/2017"
    },
    {
        "#": "225",
        "First": "Kendal",
        "Last": "Crispin",
        "Club": "SSC",
        "Time": "6:18.24",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9765&mrid=3833538&fn=Kendal&ln=Crispin",
        "Date": "02/24/2018"
    },
    {
        "#": "226",
        "First": "Olivia",
        "Last": "Kruger",
        "Club": "PSC",
        "Time": "6:18.25",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9837&mrid=3832236&fn=Olivia&ln=Kruger",
        "Date": "02/24/2018"
    },
    {
        "#": "227",
        "First": "Erin",
        "Last": "Geiszler",
        "Club": "ASU",
        "Time": "6:18.27",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9725&mrid=3827616&fn=Erin&ln=Geiszler",
        "Date": "02/17/2018"
    },
    {
        "#": "228",
        "First": "Margeaux",
        "Last": "Pantano",
        "Club": "UDSC",
        "Time": "6:18.36",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9642&mrid=3779282&fn=Margeaux&ln=Pantano",
        "Date": "11/04/2017"
    },
    {
        "#": "229",
        "First": "Pim",
        "Last": "Silpacharn",
        "Club": "VTSC",
        "Time": "6:18.45",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9825&mrid=3821970&fn=Pim&ln=Silpacharn",
        "Date": "02/17/2018"
    },
    {
        "#": "229",
        "First": "Nicolle",
        "Last": "Anderson",
        "Club": "UCONN",
        "Time": "6:18.45",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10244&mrid=3835329&fn=Nicolle&ln=Anderson",
        "Date": "11/12/2017"
    },
    {
        "#": "231",
        "First": "Carly",
        "Last": "Siegle",
        "Club": "PSU",
        "Time": "6:18.47",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9642&mrid=3778867&fn=Carly&ln=Siegle",
        "Date": "11/04/2017"
    },
    {
        "#": "232",
        "First": "Megan",
        "Last": "Winter",
        "Club": "APP",
        "Time": "6:18.50",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10005&mrid=3829230&fn=Megan&ln=Winter",
        "Date": "09/30/2017"
    },
    {
        "#": "233",
        "First": "Nicole",
        "Last": "Kelly",
        "Club": "PSC",
        "Time": "6:18.55",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9837&mrid=3832227&fn=Nicole&ln=Kelly",
        "Date": "02/24/2018"
    },
    {
        "#": "234",
        "First": "Lily",
        "Last": "Tees",
        "Club": "CSU",
        "Time": "6:18.69",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9550&mrid=3774568&fn=Lily&ln=Tees",
        "Date": "10/07/2017"
    },
    {
        "#": "235",
        "First": "Allison",
        "Last": "Hoellrich",
        "Club": "MOFO",
        "Time": "6:18.77",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9551&mrid=3783989&fn=Allison&ln=Hoellrich",
        "Date": "10/28/2017"
    },
    {
        "#": "236",
        "First": "Hailey",
        "Last": "Bivens",
        "Club": "SSC",
        "Time": "6:19.19",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9825&mrid=3821778&fn=Hailey&ln=Bivens",
        "Date": "02/17/2018"
    },
    {
        "#": "237",
        "First": "Avamarie",
        "Last": "Ginocchio",
        "Club": "ICSC",
        "Time": "6:19.56",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10054&mrid=3840671&fn=Avamarie&ln=Ginocchio",
        "Date": "02/25/2018"
    },
    {
        "#": "238",
        "First": "Amy",
        "Last": "Choi",
        "Club": "MN",
        "Time": "6:19.81",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9554&mrid=3789814&fn=Amy&ln=Choi",
        "Date": "11/11/2017"
    },
    {
        "#": "239",
        "First": "Julia",
        "Last": "Muller",
        "Club": "ICSC",
        "Time": "6:21.11",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10054&mrid=3840684&fn=Julia&ln=Muller",
        "Date": "02/25/2018"
    },
    {
        "#": "240",
        "First": "Eileen",
        "Last": "Cunningham",
        "Club": "UVA",
        "Time": "6:21.17",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9825&mrid=3821070&fn=Eileen&ln=Cunningham",
        "Date": "02/17/2018"
    },
    {
        "#": "241",
        "First": "Olivia",
        "Last": "Bear",
        "Club": "ASU",
        "Time": "6:21.46",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9963&mrid=3809520&fn=Olivia&ln=Bear",
        "Date": "01/27/2018"
    },
    {
        "#": "242",
        "First": "Gabrielle",
        "Last": "Tauscheck",
        "Club": "W&M",
        "Time": "6:21.70",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9868&mrid=3810262&fn=Gabrielle&ln=Tauscheck",
        "Date": "02/03/2018"
    },
    {
        "#": "243",
        "First": "Manuela",
        "Last": "Jojoa-Portilla",
        "Club": "UAB",
        "Time": "6:21.99",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9619&mrid=3839994&fn=Manuela&ln=Jojoa-Portilla",
        "Date": "02/24/2018"
    },
    {
        "#": "244",
        "First": "Anna",
        "Last": "Eckerd",
        "Club": "VCU",
        "Time": "6:22.10",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9667&mrid=3792461&fn=Anna&ln=Eckerd",
        "Date": "10/28/2017"
    },
    {
        "#": "245",
        "First": "Marra",
        "Last": "Lopes",
        "Club": "FSU",
        "Time": "6:22.37",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9725&mrid=3828076&fn=Marra&ln=Lopes",
        "Date": "02/17/2018"
    },
    {
        "#": "246",
        "First": "Eileen",
        "Last": "Cunningham",
        "Club": "UVA",
        "Time": "6:22.59",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9658&mrid=3784673&fn=Eileen&ln=Cunningham",
        "Date": "10/07/2017"
    },
    {
        "#": "247",
        "First": "Eileen",
        "Last": "Cunningham",
        "Club": "UVA",
        "Time": "6:22.84",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9765&mrid=3832883&fn=Eileen&ln=Cunningham",
        "Date": "02/24/2018"
    },
    {
        "#": "248",
        "First": "Natalie",
        "Last": "Paliulis",
        "Club": "UCONN",
        "Time": "6:22.96",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10102&mrid=3815838&fn=Natalie&ln=Paliulis",
        "Date": "10/21/2017"
    },
    {
        "#": "249",
        "First": "Marie-Hélène",
        "Last": "Boudreau",
        "Club": "APP",
        "Time": "6:23.00",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10005&mrid=3829227&fn=Marie-H%C3%A9l%C3%A8ne&ln=Boudreau",
        "Date": "09/30/2017"
    },
    {
        "#": "250",
        "First": "Sarah",
        "Last": "Preleski",
        "Club": "UF",
        "Time": "6:23.02",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9407&mrid=3745671&fn=Sarah&ln=Preleski",
        "Date": "09/23/2017"
    },
    {
        "#": "251",
        "First": "Stephanie",
        "Last": "Saisi",
        "Club": "USC",
        "Time": "6:23.17",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10063&mrid=3812517&fn=Stephanie&ln=Saisi",
        "Date": "12/02/2017"
    },
    {
        "#": "251",
        "First": "Margeaux",
        "Last": "Pantano",
        "Club": "UDSC",
        "Time": "6:23.17",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9836&mrid=3822664&fn=Margeaux&ln=Pantano",
        "Date": "02/17/2018"
    },
    {
        "#": "253",
        "First": "Kailey",
        "Last": "Stankus",
        "Club": "ROWAN",
        "Time": "6:23.28",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9632&mrid=3791544&fn=Kailey&ln=Stankus",
        "Date": "12/02/2017"
    },
    {
        "#": "254",
        "First": "Jillien",
        "Last": "Zukaitis",
        "Club": "UGASC",
        "Time": "6:23.35",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9561&mrid=3777117&fn=Jillien&ln=Zukaitis",
        "Date": "10/07/2017"
    },
    {
        "#": "255",
        "First": "Nicolle",
        "Last": "Anderson",
        "Club": "UCONN",
        "Time": "6:23.76",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9637&mrid=3777682&fn=Nicolle&ln=Anderson",
        "Date": "11/04/2017"
    },
    {
        "#": "256",
        "First": "Megan",
        "Last": "Davis",
        "Club": "USU",
        "Time": "6:23.98",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9730&mrid=3822871&fn=Megan&ln=Davis",
        "Date": "02/17/2018"
    },
    {
        "#": "257",
        "First": "Annika",
        "Last": "Fagerholm",
        "Club": "UCONN",
        "Time": "6:24.29",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9570&mrid=3778377&fn=Annika&ln=Fagerholm",
        "Date": "10/07/2017"
    },
    {
        "#": "258",
        "First": "Natalie",
        "Last": "Paliulis",
        "Club": "UCONN",
        "Time": "6:24.32",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9570&mrid=3778414&fn=Natalie&ln=Paliulis",
        "Date": "10/07/2017"
    },
    {
        "#": "259",
        "First": "Emily",
        "Last": "Westropp",
        "Club": "SLU",
        "Time": "6:24.79",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9732&mrid=3813833&fn=Emily&ln=Westropp",
        "Date": "02/10/2018"
    },
    {
        "#": "260",
        "First": "Rachel",
        "Last": "Cook",
        "Club": "VCU",
        "Time": "6:24.82",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9667&mrid=3792460&fn=Rachel&ln=Cook",
        "Date": "10/28/2017"
    },
    {
        "#": "261",
        "First": "Jensen",
        "Last": "Hansen",
        "Club": "IUSC",
        "Time": "6:25.15",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9831&mrid=3815205&fn=Jensen&ln=Hansen",
        "Date": "02/03/2018"
    },
    {
        "#": "262",
        "First": "Annie",
        "Last": "Stankivicz",
        "Club": "CSOSU",
        "Time": "6:25.21",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9665&mrid=3786199&fn=Annie&ln=Stankivicz",
        "Date": "11/11/2017"
    },
    {
        "#": "263",
        "First": "Kaylee",
        "Last": "Thomas",
        "Club": "UKCS",
        "Time": "6:25.59",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9554&mrid=3789722&fn=Kaylee&ln=Thomas",
        "Date": "11/11/2017"
    },
    {
        "#": "264",
        "First": "Sophie",
        "Last": "Phillips",
        "Club": "GV",
        "Time": "6:25.72",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9818&mrid=3809167&fn=Sophie&ln=Phillips",
        "Date": "01/20/2018"
    },
    {
        "#": "265",
        "First": "Katrina",
        "Last": "Huff",
        "Club": "APP",
        "Time": "6:25.75",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10005&mrid=3829229&fn=Katrina&ln=Huff",
        "Date": "09/30/2017"
    },
    {
        "#": "266",
        "First": "Kaylee",
        "Last": "Thomas",
        "Club": "UKCS",
        "Time": "6:26.19",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9551&mrid=3784281&fn=Kaylee&ln=Thomas",
        "Date": "10/28/2017"
    },
    {
        "#": "267",
        "First": "Katrina",
        "Last": "Huff",
        "Club": "ASU",
        "Time": "6:26.43",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9664&mrid=3787515&fn=Katrina&ln=Huff",
        "Date": "11/12/2017"
    },
    {
        "#": "268",
        "First": "Sarah",
        "Last": "Eischen",
        "Club": "MIZZ",
        "Time": "6:26.44",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9416&mrid=3773412&fn=Sarah&ln=Eischen",
        "Date": "09/30/2017"
    },
    {
        "#": "269",
        "First": "Julia",
        "Last": "Telesca",
        "Club": "SYR",
        "Time": "6:27.12",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10054&mrid=3840758&fn=Julia&ln=Telesca",
        "Date": "02/25/2018"
    },
    {
        "#": "270",
        "First": "Nicolle",
        "Last": "Anderson",
        "Club": "UCONN",
        "Time": "6:27.38",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10102&mrid=3815837&fn=Nicolle&ln=Anderson",
        "Date": "10/21/2017"
    },
    {
        "#": "271",
        "First": "Allie",
        "Last": "Pierce",
        "Club": "UNCCH",
        "Time": "6:27.40",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9789&mrid=3818429&fn=Allie&ln=Pierce",
        "Date": "02/10/2018"
    },
    {
        "#": "272",
        "First": "Amber",
        "Last": "Pritchard",
        "Club": "UCF",
        "Time": "6:27.55",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9725&mrid=3828268&fn=Amber&ln=Pritchard",
        "Date": "02/17/2018"
    },
    {
        "#": "273",
        "First": "Sara",
        "Last": "Tonnesen",
        "Club": "NCSU",
        "Time": "6:27.63",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9664&mrid=3788461&fn=Sara&ln=Tonnesen",
        "Date": "11/12/2017"
    },
    {
        "#": "274",
        "First": "Nikki",
        "Last": "Thiry",
        "Club": "IUP",
        "Time": "6:28.09",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9665&mrid=3786283&fn=Nikki&ln=Thiry",
        "Date": "11/11/2017"
    },
    {
        "#": "275",
        "First": "Danielle",
        "Last": "Iuspa",
        "Club": "VOLS",
        "Time": "6:28.22",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10228&mrid=3834357&fn=Danielle&ln=Iuspa",
        "Date": "10/21/2017"
    },
    {
        "#": "276",
        "First": "Julia",
        "Last": "Perrone",
        "Club": "CNU",
        "Time": "6:28.31",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9825&mrid=3821010&fn=Julia&ln=Perrone",
        "Date": "02/17/2018"
    },
    {
        "#": "277",
        "First": "Caity",
        "Last": "Young",
        "Club": "PSU",
        "Time": "6:28.69",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9510&mrid=3779970&fn=Caity&ln=Young",
        "Date": "09/25/2017"
    },
    {
        "#": "278",
        "First": "Annie",
        "Last": "Hayes",
        "Club": "SYR",
        "Time": "6:28.88",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9572&mrid=3816618&fn=Annie&ln=Hayes",
        "Date": "10/21/2017"
    },
    {
        "#": "278",
        "First": "Audrie",
        "Last": "Flinsky",
        "Club": "CMU",
        "Time": "6:28.88",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9676&mrid=3790258&fn=Audrie&ln=Flinsky",
        "Date": "12/02/2017"
    },
    {
        "#": "280",
        "First": "Nikki",
        "Last": "Thiry",
        "Club": "IUP",
        "Time": "6:29.24",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9573&mrid=3794658&fn=Nikki&ln=Thiry",
        "Date": "10/14/2017"
    },
    {
        "#": "281",
        "First": "Anna",
        "Last": "Eckerd",
        "Club": "VCU",
        "Time": "6:29.40",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9789&mrid=3818638&fn=Anna&ln=Eckerd",
        "Date": "02/10/2018"
    },
    {
        "#": "282",
        "First": "Julia",
        "Last": "Perrone",
        "Club": "CNU",
        "Time": "6:29.78",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9868&mrid=3810155&fn=Julia&ln=Perrone",
        "Date": "02/03/2018"
    },
    {
        "#": "283",
        "First": "Natalie",
        "Last": "Paliulis",
        "Club": "UCONN",
        "Time": "6:30.10",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9792&mrid=3835122&fn=Natalie&ln=Paliulis",
        "Date": "02/24/2018"
    },
    {
        "#": "284",
        "First": "Sarah",
        "Last": "Perez",
        "Club": "AUCS",
        "Time": "6:30.32",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9789&mrid=3818107&fn=Sarah&ln=Perez",
        "Date": "02/10/2018"
    },
    {
        "#": "285",
        "First": "Christina",
        "Last": "Vick",
        "Club": "ROWAN",
        "Time": "6:30.34",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9632&mrid=3791556&fn=Christina&ln=Vick",
        "Date": "12/02/2017"
    },
    {
        "#": "286",
        "First": "Caroline",
        "Last": "Dyson",
        "Club": "VTSC",
        "Time": "6:30.39",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9765&mrid=3833604&fn=Caroline&ln=Dyson",
        "Date": "02/24/2018"
    },
    {
        "#": "287",
        "First": "Pooneh",
        "Last": "Kalhori",
        "Club": "UCLA",
        "Time": "6:30.65",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9845&mrid=3850827&fn=Pooneh&ln=Kalhori",
        "Date": "03/03/2018"
    },
    {
        "#": "288",
        "First": "Olivia",
        "Last": "Spinosa",
        "Club": "AUB",
        "Time": "6:30.77",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9821&mrid=3797181&fn=Olivia&ln=Spinosa",
        "Date": "11/05/2017"
    },
    {
        "#": "289",
        "First": "Allison",
        "Last": "Barnes",
        "Club": "VCU",
        "Time": "6:30.78",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9837&mrid=3832500&fn=Allison&ln=Barnes",
        "Date": "02/24/2018"
    },
    {
        "#": "290",
        "First": "Serena",
        "Last": "DiLiberti",
        "Club": "NUSC",
        "Time": "6:30.81",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10102&mrid=3815834&fn=Serena&ln=DiLiberti",
        "Date": "10/21/2017"
    },
    {
        "#": "291",
        "First": "Maria",
        "Last": "Piris",
        "Club": "UCF",
        "Time": "6:31.54",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9561&mrid=3777112&fn=Maria&ln=Piris",
        "Date": "10/07/2017"
    },
    {
        "#": "292",
        "First": "Rachelle",
        "Last": "Woodbury",
        "Club": "SDM",
        "Time": "6:31.87",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9636&mrid=3814776&fn=Rachelle&ln=Woodbury",
        "Date": "11/11/2017"
    },
    {
        "#": "293",
        "First": "Adrienne",
        "Last": "Herzog",
        "Club": "UO",
        "Time": "6:32.04",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10200&mrid=3860088&fn=Adrienne&ln=Herzog",
        "Date": "02/27/2018"
    },
    {
        "#": "294",
        "First": "Megan",
        "Last": "Welch",
        "Club": "NCSU",
        "Time": "6:32.20",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9664&mrid=3788480&fn=Megan&ln=Welch",
        "Date": "11/12/2017"
    },
    {
        "#": "295",
        "First": "Summer",
        "Last": "Aschenbrenner",
        "Club": "UF",
        "Time": "6:32.66",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9410&mrid=3790730&fn=Summer&ln=Aschenbrenner",
        "Date": "11/11/2017"
    },
    {
        "#": "296",
        "First": "Danielle",
        "Last": "Iuspa",
        "Club": "VOLS",
        "Time": "6:32.77",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9912&mrid=3828640&fn=Danielle&ln=Iuspa",
        "Date": "02/17/2018"
    },
    {
        "#": "297",
        "First": "Emi",
        "Last": "Zeger",
        "Club": "UCLA",
        "Time": "6:32.88",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9845&mrid=3850889&fn=Emi&ln=Zeger",
        "Date": "03/03/2018"
    },
    {
        "#": "298",
        "First": "Julianna",
        "Last": "Short",
        "Club": "UF",
        "Time": "6:32.95",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9410&mrid=3790878&fn=Julianna&ln=Short",
        "Date": "11/11/2017"
    },
    {
        "#": "299",
        "First": "Ingrid",
        "Last": "Kenyon",
        "Club": "UVA",
        "Time": "6:33.35",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9611&mrid=3793823&fn=Ingrid&ln=Kenyon",
        "Date": "10/28/2017"
    },
    {
        "#": "300",
        "First": "Stefani",
        "Last": "Scimeca",
        "Club": "ISC",
        "Time": "6:33.44",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9554&mrid=3789583&fn=Stefani&ln=Scimeca",
        "Date": "11/11/2017"
    },
    {
        "#": "301",
        "First": "Izzy",
        "Last": "Greenhut",
        "Club": "CU",
        "Time": "6:34.00",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9654&mrid=3792021&fn=Izzy&ln=Greenhut",
        "Date": "12/02/2017"
    },
    {
        "#": "302",
        "First": "Megan",
        "Last": "Woody",
        "Club": "UNCC",
        "Time": "6:34.10",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10015&mrid=3822306&fn=Megan&ln=Woody",
        "Date": "02/17/2018"
    },
    {
        "#": "303",
        "First": "Abby",
        "Last": "Hays",
        "Club": "NDSC",
        "Time": "6:34.70",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9554&mrid=3789961&fn=Abby&ln=Hays",
        "Date": "11/11/2017"
    },
    {
        "#": "304",
        "First": "Allison",
        "Last": "Pegram",
        "Club": "COFC",
        "Time": "6:34.90",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9963&mrid=3809590&fn=Allison&ln=Pegram",
        "Date": "01/27/2018"
    },
    {
        "#": "305",
        "First": "Ingrid",
        "Last": "Kenyon",
        "Club": "UVA",
        "Time": "6:35.11",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9658&mrid=3784730&fn=Ingrid&ln=Kenyon",
        "Date": "10/07/2017"
    },
    {
        "#": "306",
        "First": "Olivia",
        "Last": "Spinosa",
        "Club": "AU",
        "Time": "6:35.55",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9407&mrid=3745500&fn=Olivia&ln=Spinosa",
        "Date": "09/23/2017"
    },
    {
        "#": "307",
        "First": "Marlee",
        "Last": "Murray",
        "Club": "WFU",
        "Time": "6:36.00",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10005&mrid=3829224&fn=Marlee&ln=Murray",
        "Date": "09/30/2017"
    },
    {
        "#": "308",
        "First": "Megan",
        "Last": "Kowalski",
        "Club": "WCU",
        "Time": "6:36.16",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9642&mrid=3779603&fn=Megan&ln=Kowalski",
        "Date": "11/04/2017"
    },
    {
        "#": "309",
        "First": "Julia",
        "Last": "Telesca",
        "Club": "SYR",
        "Time": "6:36.55",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9982&mrid=3816147&fn=Julia&ln=Telesca",
        "Date": "02/03/2018"
    },
    {
        "#": "310",
        "First": "Jessica",
        "Last": "Fischer",
        "Club": "TU",
        "Time": "6:39.35",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9642&mrid=3779051&fn=Jessica&ln=Fischer",
        "Date": "11/04/2017"
    },
    {
        "#": "311",
        "First": "Amanda",
        "Last": "Morgan",
        "Club": "LUC",
        "Time": "6:39.81",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9416&mrid=3773376&fn=Amanda&ln=Morgan",
        "Date": "09/30/2017"
    },
    {
        "#": "312",
        "First": "Lindsey",
        "Last": "Foust",
        "Club": "CU",
        "Time": "6:39.91",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9669&mrid=3792782&fn=Lindsey&ln=Foust",
        "Date": "11/11/2017"
    },
    {
        "#": "313",
        "First": "Aliza",
        "Last": "Barnett",
        "Club": "UALB",
        "Time": "6:40.43",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10054&mrid=3840800&fn=Aliza&ln=Barnett",
        "Date": "02/25/2018"
    },
    {
        "#": "314",
        "First": "Katie",
        "Last": "Suppa",
        "Club": "ELON",
        "Time": "6:40.71",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9667&mrid=3792464&fn=Katie&ln=Suppa",
        "Date": "10/28/2017"
    },
    {
        "#": "315",
        "First": "Cristen",
        "Last": "Anderson",
        "Club": "UCLA",
        "Time": "6:40.86",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10063&mrid=3812358&fn=Cristen&ln=Anderson",
        "Date": "12/02/2017"
    },
    {
        "#": "316",
        "First": "Isabel",
        "Last": "Dritz",
        "Club": "CSU",
        "Time": "6:41.34",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9550&mrid=3774523&fn=Isabel&ln=Dritz",
        "Date": "10/07/2017"
    },
    {
        "#": "317",
        "First": "Emma",
        "Last": "Sharrett",
        "Club": "W&M",
        "Time": "6:41.74",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9664&mrid=3789325&fn=Emma&ln=Sharrett",
        "Date": "11/12/2017"
    },
    {
        "#": "318",
        "First": "Rachel",
        "Last": "Cook",
        "Club": "VCU",
        "Time": "6:42.11",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9913&mrid=3802054&fn=Rachel&ln=Cook",
        "Date": "09/08/2017"
    },
    {
        "#": "319",
        "First": "Sarah",
        "Last": "Preleski",
        "Club": "UF",
        "Time": "6:42.45",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9410&mrid=3790850&fn=Sarah&ln=Preleski",
        "Date": "11/11/2017"
    },
    {
        "#": "320",
        "First": "Rachel",
        "Last": "Eberenz",
        "Club": "UNCW",
        "Time": "6:42.77",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9664&mrid=3788684&fn=Rachel&ln=Eberenz",
        "Date": "11/12/2017"
    },
    {
        "#": "321",
        "First": "Sophie",
        "Last": "Dachauer",
        "Club": "UCI",
        "Time": "6:42.78",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10063&mrid=3812324&fn=Sophie&ln=Dachauer",
        "Date": "12/02/2017"
    },
    {
        "#": "322",
        "First": "Abigail",
        "Last": "Baker",
        "Club": "GWU",
        "Time": "6:43.78",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9611&mrid=3793568&fn=Abigail&ln=Baker",
        "Date": "10/28/2017"
    },
    {
        "#": "323",
        "First": "Sophie",
        "Last": "Dachauer",
        "Club": "UCI",
        "Time": "6:44.01",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9845&mrid=3850766&fn=Sophie&ln=Dachauer",
        "Date": "03/03/2018"
    },
    {
        "#": "324",
        "First": "Irene",
        "Last": "Wright",
        "Club": "UGASC",
        "Time": "6:44.02",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9561&mrid=3777119&fn=Irene&ln=Wright",
        "Date": "10/07/2017"
    },
    {
        "#": "325",
        "First": "Julia",
        "Last": "Telesca",
        "Club": "SYR",
        "Time": "6:44.44",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9572&mrid=3816645&fn=Julia&ln=Telesca",
        "Date": "10/21/2017"
    },
    {
        "#": "326",
        "First": "Rebecca",
        "Last": "Mangan",
        "Club": "UNCW",
        "Time": "6:44.63",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9664&mrid=3788729&fn=Rebecca&ln=Mangan",
        "Date": "11/12/2017"
    },
    {
        "#": "327",
        "First": "Ouzts",
        "Last": "Eleni",
        "Club": "WFRD",
        "Time": "6:45.21",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9821&mrid=3798921&fn=Ouzts&ln=Eleni",
        "Date": "11/05/2017"
    },
    {
        "#": "328",
        "First": "Ariel",
        "Last": "Falk",
        "Club": "CCU",
        "Time": "6:46.63",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10005&mrid=3829231&fn=Ariel&ln=Falk",
        "Date": "09/30/2017"
    },
    {
        "#": "329",
        "First": "Jessica",
        "Last": "Timczyk",
        "Club": "CMU",
        "Time": "6:47.20",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9665&mrid=3786137&fn=Jessica&ln=Timczyk",
        "Date": "11/11/2017"
    },
    {
        "#": "330",
        "First": "Hannah",
        "Last": "Stuck",
        "Club": "GV",
        "Time": "6:47.68",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9818&mrid=3809178&fn=Hannah&ln=Stuck",
        "Date": "01/20/2018"
    },
    {
        "#": "331",
        "First": "Hannah",
        "Last": "Kelly",
        "Club": "WVU",
        "Time": "6:48.15",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9665&mrid=3787022&fn=Hannah&ln=Kelly",
        "Date": "11/11/2017"
    },
    {
        "#": "332",
        "First": "Neerja",
        "Last": "Garikpati",
        "Club": "PSC",
        "Time": "6:48.34",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9416&mrid=3773529&fn=Neerja&ln=Garikpati",
        "Date": "09/30/2017"
    },
    {
        "#": "333",
        "First": "Elizabeth",
        "Last": "Gillette",
        "Club": "GMU",
        "Time": "6:48.62",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10259&mrid=3840315&fn=Elizabeth&ln=Gillette",
        "Date": "10/28/2017"
    },
    {
        "#": "333",
        "First": "Elizabeth",
        "Last": "Gillette",
        "Club": "GMU",
        "Time": "6:48.62",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9611&mrid=3793518&fn=Elizabeth&ln=Gillette",
        "Date": "10/28/2017"
    },
    {
        "#": "335",
        "First": "Samantha",
        "Last": "Constant",
        "Club": "CMU",
        "Time": "6:48.66",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9665&mrid=3786100&fn=Samantha&ln=Constant",
        "Date": "11/11/2017"
    },
    {
        "#": "336",
        "First": "Annie",
        "Last": "Loh",
        "Club": "CAZ",
        "Time": "6:49.03",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9982&mrid=3816088&fn=Annie&ln=Loh",
        "Date": "02/03/2018"
    },
    {
        "#": "337",
        "First": "Cassondra",
        "Last": "Henry",
        "Club": "CAZ",
        "Time": "6:49.28",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9982&mrid=3816085&fn=Cassondra&ln=Henry",
        "Date": "02/03/2018"
    },
    {
        "#": "338",
        "First": "Julianna",
        "Last": "Short",
        "Club": "UF",
        "Time": "6:49.34",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9407&mrid=3745681&fn=Julianna&ln=Short",
        "Date": "09/23/2017"
    },
    {
        "#": "339",
        "First": "Jennifer",
        "Last": "Quigley",
        "Club": "CU",
        "Time": "6:49.56",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9562&mrid=3793067&fn=Jennifer&ln=Quigley",
        "Date": "10/13/2017"
    },
    {
        "#": "340",
        "First": "Madison",
        "Last": "Boyd",
        "Club": "WVU",
        "Time": "6:50.23",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9658&mrid=3785198&fn=Madison&ln=Boyd",
        "Date": "10/07/2017"
    },
    {
        "#": "341",
        "First": "Maggie",
        "Last": "McMickle",
        "Club": "UF",
        "Time": "6:50.93",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9407&mrid=3745625&fn=Maggie&ln=McMickle",
        "Date": "09/23/2017"
    },
    {
        "#": "342",
        "First": "Savannah",
        "Last": "Moore",
        "Club": "UNC",
        "Time": "6:51.16",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9664&mrid=3788831&fn=Savannah&ln=Moore",
        "Date": "11/12/2017"
    },
    {
        "#": "343",
        "First": "Claire",
        "Last": "Rowcliffe",
        "Club": "VOLS",
        "Time": "6:51.45",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9912&mrid=3828653&fn=Claire&ln=Rowcliffe",
        "Date": "02/17/2018"
    },
    {
        "#": "344",
        "First": "Hope",
        "Last": "Bobbitt",
        "Club": "HPU",
        "Time": "6:51.50",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9821&mrid=3797925&fn=Hope&ln=Bobbitt",
        "Date": "11/05/2017"
    },
    {
        "#": "345",
        "First": "Jennifer",
        "Last": "Quigley",
        "Club": "CU",
        "Time": "6:51.56",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9654&mrid=3792076&fn=Jennifer&ln=Quigley",
        "Date": "12/02/2017"
    },
    {
        "#": "346",
        "First": "Jennifer",
        "Last": "Quigley",
        "Club": "CU",
        "Time": "6:51.86",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9550&mrid=3774925&fn=Jennifer&ln=Quigley",
        "Date": "10/07/2017"
    },
    {
        "#": "346",
        "First": "Jennifer",
        "Last": "Quigley",
        "Club": "CU",
        "Time": "6:51.86",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9550&mrid=3774700&fn=Jennifer&ln=Quigley",
        "Date": "10/07/2017"
    },
    {
        "#": "348",
        "First": "Katie",
        "Last": "Suppa",
        "Club": "ELON",
        "Time": "6:52.03",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10005&mrid=3829220&fn=Katie&ln=Suppa",
        "Date": "09/30/2017"
    },
    {
        "#": "349",
        "First": "Patricia",
        "Last": "Helbin",
        "Club": "CU",
        "Time": "6:52.71",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9550&mrid=3774900&fn=Patricia&ln=Helbin",
        "Date": "10/07/2017"
    },
    {
        "#": "349",
        "First": "Patricia",
        "Last": "Helbin",
        "Club": "CU",
        "Time": "6:52.71",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9550&mrid=3774675&fn=Patricia&ln=Helbin",
        "Date": "10/07/2017"
    },
    {
        "#": "351",
        "First": "Jennifer",
        "Last": "Quigley",
        "Club": "CU",
        "Time": "6:52.84",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9669&mrid=3792829&fn=Jennifer&ln=Quigley",
        "Date": "11/11/2017"
    },
    {
        "#": "352",
        "First": "Shelby",
        "Last": "Baugh",
        "Club": "GCU",
        "Time": "6:53.08",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10063&mrid=3812203&fn=Shelby&ln=Baugh",
        "Date": "12/02/2017"
    },
    {
        "#": "353",
        "First": "Emma",
        "Last": "Cvitanovich",
        "Club": "COFC",
        "Time": "6:53.14",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9725&mrid=3827755&fn=Emma&ln=Cvitanovich",
        "Date": "02/17/2018"
    },
    {
        "#": "354",
        "First": "Julia",
        "Last": "Slyer",
        "Club": "UB",
        "Time": "6:54.37",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10054&mrid=3840786&fn=Julia&ln=Slyer",
        "Date": "02/25/2018"
    },
    {
        "#": "355",
        "First": "Maddie",
        "Last": "Rogers",
        "Club": "COFC",
        "Time": "6:54.74",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9725&mrid=3827786&fn=Maddie&ln=Rogers",
        "Date": "02/17/2018"
    },
    {
        "#": "356",
        "First": "Claire",
        "Last": "Rowcliffe",
        "Club": "VOLS",
        "Time": "6:54.79",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10228&mrid=3834370&fn=Claire&ln=Rowcliffe",
        "Date": "10/21/2017"
    },
    {
        "#": "357",
        "First": "Kelly",
        "Last": "Riedesel",
        "Club": "KSU",
        "Time": "6:55.33",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10228&mrid=3834182&fn=Kelly&ln=Riedesel",
        "Date": "10/21/2017"
    },
    {
        "#": "358",
        "First": "Lian",
        "Last": "Mitzian",
        "Club": "UDSC",
        "Time": "6:56.70",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9831&mrid=3815519&fn=Lian&ln=Mitzian",
        "Date": "02/03/2018"
    },
    {
        "#": "359",
        "First": "Jordan",
        "Last": "Reeves",
        "Club": "NCSU",
        "Time": "6:57.01",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9664&mrid=3788411&fn=Jordan&ln=Reeves",
        "Date": "11/12/2017"
    },
    {
        "#": "360",
        "First": "Alexandra",
        "Last": "Cabanelas",
        "Club": "NSUSC",
        "Time": "6:57.17",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9410&mrid=3790999&fn=Alexandra&ln=Cabanelas",
        "Date": "11/11/2017"
    },
    {
        "#": "361",
        "First": "Mason",
        "Last": "Redmond",
        "Club": "CU",
        "Time": "6:58.42",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9816&mrid=3814251&fn=Mason&ln=Redmond",
        "Date": "02/10/2018"
    },
    {
        "#": "362",
        "First": "Jessica",
        "Last": "Roth",
        "Club": "DUKE",
        "Time": "6:59.36",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9664&mrid=3787670&fn=Jessica&ln=Roth",
        "Date": "11/12/2017"
    },
    {
        "#": "363",
        "First": "Hope",
        "Last": "Bobbit",
        "Club": "HPU",
        "Time": "6:59.42",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10005&mrid=3829225&fn=Hope&ln=Bobbit",
        "Date": "09/30/2017"
    },
    {
        "#": "364",
        "First": "Lindsey",
        "Last": "Wise",
        "Club": "APP",
        "Time": "6:59.78",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10005&mrid=3829228&fn=Lindsey&ln=Wise",
        "Date": "09/30/2017"
    },
    {
        "#": "365",
        "First": "Sarah",
        "Last": "Houghton",
        "Club": "UGASC",
        "Time": "7:00.56",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9830&mrid=3809003&fn=Sarah&ln=Houghton",
        "Date": "02/03/2018"
    },
    {
        "#": "366",
        "First": "Jordan",
        "Last": "Reeves",
        "Club": "NCSU",
        "Time": "7:01.24",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9795&mrid=3816366&fn=Jordan&ln=Reeves",
        "Date": "01/27/2018"
    },
    {
        "#": "367",
        "First": "Claire",
        "Last": "Rowcliffe",
        "Club": "VOLS",
        "Time": "7:01.56",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9821&mrid=3798904&fn=Claire&ln=Rowcliffe",
        "Date": "11/05/2017"
    },
    {
        "#": "368",
        "First": "Emma",
        "Last": "Sharrett",
        "Club": "W&M",
        "Time": "7:01.80",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9611&mrid=3793993&fn=Emma&ln=Sharrett",
        "Date": "10/28/2017"
    },
    {
        "#": "369",
        "First": "Makayla",
        "Last": "Lucero",
        "Club": "UNC",
        "Time": "7:01.94",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9550&mrid=3775036&fn=Makayla&ln=Lucero",
        "Date": "10/07/2017"
    },
    {
        "#": "369",
        "First": "Makayla",
        "Last": "Lucero",
        "Club": "UNC",
        "Time": "7:01.94",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9550&mrid=3774811&fn=Makayla&ln=Lucero",
        "Date": "10/07/2017"
    },
    {
        "#": "371",
        "First": "Kristine",
        "Last": "Spike",
        "Club": "TCNJ",
        "Time": "7:02.18",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9632&mrid=3791670&fn=Kristine&ln=Spike",
        "Date": "12/02/2017"
    },
    {
        "#": "372",
        "First": "Krystan",
        "Last": "Perry",
        "Club": "UNA",
        "Time": "7:02.35",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9821&mrid=3798322&fn=Krystan&ln=Perry",
        "Date": "11/05/2017"
    },
    {
        "#": "373",
        "First": "Alyssa",
        "Last": "Norden",
        "Club": "UTSC",
        "Time": "7:02.40",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9416&mrid=3774275&fn=Alyssa&ln=Norden",
        "Date": "09/30/2017"
    },
    {
        "#": "374",
        "First": "Kristine",
        "Last": "Spike",
        "Club": "TCNJ",
        "Time": "7:02.45",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9570&mrid=3778330&fn=Kristine&ln=Spike",
        "Date": "10/07/2017"
    },
    {
        "#": "375",
        "First": "Eleni",
        "Last": "Ouzts",
        "Club": "WOFF",
        "Time": "7:02.72",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10005&mrid=3829217&fn=Eleni&ln=Ouzts",
        "Date": "09/30/2017"
    },
    {
        "#": "376",
        "First": "Nina",
        "Last": "Song",
        "Club": "UCD",
        "Time": "7:02.95",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10063&mrid=3812310&fn=Nina&ln=Song",
        "Date": "12/02/2017"
    },
    {
        "#": "377",
        "First": "Lauren",
        "Last": "Hobbs",
        "Club": "UO",
        "Time": "7:02.97",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10200&mrid=3860090&fn=Lauren&ln=Hobbs",
        "Date": "02/27/2018"
    },
    {
        "#": "378",
        "First": "Anna",
        "Last": "Zhu",
        "Club": "GWU",
        "Time": "7:03.15",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10059&mrid=3840936&fn=Anna&ln=Zhu",
        "Date": "02/24/2018"
    },
    {
        "#": "379",
        "First": "Devan",
        "Last": "Parkerson",
        "Club": "MIZZ",
        "Time": "7:03.40",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9578&mrid=3779745&fn=Devan&ln=Parkerson",
        "Date": "10/07/2017"
    },
    {
        "#": "380",
        "First": "Natalie",
        "Last": "Lau",
        "Club": "RUCS",
        "Time": "7:03.57",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9570&mrid=3778274&fn=Natalie&ln=Lau",
        "Date": "10/07/2017"
    },
    {
        "#": "381",
        "First": "Alyssa",
        "Last": "Norden",
        "Club": "UTSC",
        "Time": "7:03.82",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9551&mrid=3784333&fn=Alyssa&ln=Norden",
        "Date": "10/28/2017"
    },
    {
        "#": "382",
        "First": "Perry",
        "Last": "Krystan",
        "Club": "UNA",
        "Time": "7:03.83",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10228&mrid=3834228&fn=Perry&ln=Krystan",
        "Date": "10/21/2017"
    },
    {
        "#": "383",
        "First": "Alexis",
        "Last": "Schussler",
        "Club": "IUSC",
        "Time": "7:05.22",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9554&mrid=3789648&fn=Alexis&ln=Schussler",
        "Date": "11/11/2017"
    },
    {
        "#": "384",
        "First": "Erica",
        "Last": "Winfrey",
        "Club": "UCF",
        "Time": "7:05.41",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9410&mrid=3791249&fn=Erica&ln=Winfrey",
        "Date": "11/11/2017"
    },
    {
        "#": "385",
        "First": "Alexis",
        "Last": "Schussler",
        "Club": "IUSC",
        "Time": "7:06.88",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10174&mrid=3824578&fn=Alexis&ln=Schussler",
        "Date": "10/22/2017"
    },
    {
        "#": "386",
        "First": "Pooneh",
        "Last": "Kalhori",
        "Club": "UCLA",
        "Time": "7:07.21",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10063&mrid=3812395&fn=Pooneh&ln=Kalhori",
        "Date": "12/02/2017"
    },
    {
        "#": "387",
        "First": "Jill",
        "Last": "Goben",
        "Club": "CCU",
        "Time": "7:07.28",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10005&mrid=3829233&fn=Jill&ln=Goben",
        "Date": "09/30/2017"
    },
    {
        "#": "388",
        "First": "Mallorie",
        "Last": "Smits",
        "Club": "BU",
        "Time": "7:07.94",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10174&mrid=3824502&fn=Mallorie&ln=Smits",
        "Date": "10/22/2017"
    },
    {
        "#": "389",
        "First": "Devan",
        "Last": "Parkerson",
        "Club": "MIZZ",
        "Time": "7:08.21",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9584&mrid=3785721&fn=Devan&ln=Parkerson",
        "Date": "10/28/2017"
    },
    {
        "#": "390",
        "First": "Elouise",
        "Last": "Filas",
        "Club": "UTSC",
        "Time": "7:09.02",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9416&mrid=3774241&fn=Elouise&ln=Filas",
        "Date": "09/30/2017"
    },
    {
        "#": "391",
        "First": "Lauren",
        "Last": "Scott",
        "Club": "CLEM",
        "Time": "7:09.31",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10005&mrid=3829221&fn=Lauren&ln=Scott",
        "Date": "09/30/2017"
    },
    {
        "#": "392",
        "First": "Devan",
        "Last": "Parkerson",
        "Club": "MIZZ",
        "Time": "7:11.64",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9579&mrid=3786004&fn=Devan&ln=Parkerson",
        "Date": "11/12/2017"
    },
    {
        "#": "393",
        "First": "Julie",
        "Last": "Keyes",
        "Club": "SDM",
        "Time": "7:13.26",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9636&mrid=3814732&fn=Julie&ln=Keyes",
        "Date": "11/11/2017"
    },
    {
        "#": "394",
        "First": "Skylar",
        "Last": "Valentin",
        "Club": "UF",
        "Time": "7:14.33",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9725&mrid=3828026&fn=Skylar&ln=Valentin",
        "Date": "02/17/2018"
    },
    {
        "#": "395",
        "First": "Mishell",
        "Last": "Sanchez",
        "Club": "UDSC",
        "Time": "7:14.38",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9836&mrid=3822690&fn=Mishell&ln=Sanchez",
        "Date": "02/17/2018"
    },
    {
        "#": "396",
        "First": "Makenna",
        "Last": "Evans",
        "Club": "CAZ",
        "Time": "7:15.64",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9982&mrid=3816073&fn=Makenna&ln=Evans",
        "Date": "02/03/2018"
    },
    {
        "#": "397",
        "First": "Devan",
        "Last": "Parkerson",
        "Club": "MIZZ",
        "Time": "7:16.74",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9831&mrid=3815334&fn=Devan&ln=Parkerson",
        "Date": "02/03/2018"
    },
    {
        "#": "398",
        "First": "Maddie",
        "Last": "Faris",
        "Club": "UC",
        "Time": "7:16.96",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9416&mrid=3773928&fn=Maddie&ln=Faris",
        "Date": "09/30/2017"
    },
    {
        "#": "399",
        "First": "Megan",
        "Last": "Zbinden",
        "Club": "NIU",
        "Time": "7:17.66",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9826&mrid=3894469&fn=Megan&ln=Zbinden",
        "Date": "03/24/2018"
    },
    {
        "#": "400",
        "First": "Emily",
        "Last": "White",
        "Club": "UNCG",
        "Time": "7:18.39",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10005&mrid=3829235&fn=Emily&ln=White",
        "Date": "09/30/2017"
    },
    {
        "#": "401",
        "First": "Anisha",
        "Last": "Mckendrick",
        "Club": "USU",
        "Time": "7:19.39",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9562&mrid=3793382&fn=Anisha&ln=Mckendrick",
        "Date": "10/13/2017"
    },
    {
        "#": "402",
        "First": "Lauren",
        "Last": "Giordoni",
        "Club": "CCU",
        "Time": "7:19.57",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10005&mrid=3829232&fn=Lauren&ln=Giordoni",
        "Date": "09/30/2017"
    },
    {
        "#": "403",
        "First": "Amy",
        "Last": "Stanfield",
        "Club": "UC34",
        "Time": "7:21.91",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9636&mrid=3814843&fn=Amy&ln=Stanfield",
        "Date": "11/11/2017"
    },
    {
        "#": "404",
        "First": "Olivia",
        "Last": "Rhodes",
        "Club": "LU",
        "Time": "7:23.47",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9664&mrid=3788114&fn=Olivia&ln=Rhodes",
        "Date": "11/12/2017"
    },
    {
        "#": "405",
        "First": "Maddie",
        "Last": "Faris",
        "Club": "UC",
        "Time": "7:25.57",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9551&mrid=3784156&fn=Maddie&ln=Faris",
        "Date": "10/28/2017"
    },
    {
        "#": "406",
        "First": "Devan",
        "Last": "Parkerson",
        "Club": "MIZZ",
        "Time": "7:25.89",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9416&mrid=3773439&fn=Devan&ln=Parkerson",
        "Date": "09/30/2017"
    },
    {
        "#": "407",
        "First": "Taylor",
        "Last": "Hernandez",
        "Club": "GCU",
        "Time": "7:26.07",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10063&mrid=3812229&fn=Taylor&ln=Hernandez",
        "Date": "12/02/2017"
    },
    {
        "#": "408",
        "First": "Samantha",
        "Last": "Routzan",
        "Club": "LU",
        "Time": "7:27.00",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9664&mrid=3788118&fn=Samantha&ln=Routzan",
        "Date": "11/12/2017"
    },
    {
        "#": "409",
        "First": "Jasmine",
        "Last": "Emtage",
        "Club": "UCLA",
        "Time": "7:28.07",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10063&mrid=3812381&fn=Jasmine&ln=Emtage",
        "Date": "12/02/2017"
    },
    {
        "#": "410",
        "First": "Anisha",
        "Last": "McKendrick",
        "Club": "OEVT",
        "Time": "7:28.26",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9636&mrid=3814877&fn=Anisha&ln=McKendrick",
        "Date": "11/11/2017"
    },
    {
        "#": "411",
        "First": "Kristine",
        "Last": "Spike",
        "Club": "TCNJ",
        "Time": "7:29.47",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9817&mrid=3850012&fn=Kristine&ln=Spike",
        "Date": "03/04/2018"
    },
    {
        "#": "412",
        "First": "Anita",
        "Last": "Coyle",
        "Club": "SDM",
        "Time": "7:30.42",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9636&mrid=3814699&fn=Anita&ln=Coyle",
        "Date": "11/11/2017"
    },
    {
        "#": "413",
        "First": "Isabelle",
        "Last": "Witteveen",
        "Club": "UVA",
        "Time": "7:30.73",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9611&mrid=3793915&fn=Isabelle&ln=Witteveen",
        "Date": "10/28/2017"
    },
    {
        "#": "413",
        "First": "Anisha",
        "Last": "McKendrick",
        "Club": "USU",
        "Time": "7:30.73",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10063&mrid=3812561&fn=Anisha&ln=McKendrick",
        "Date": "12/02/2017"
    },
    {
        "#": "415",
        "First": "Elana",
        "Last": "Neilly",
        "Club": "UNC",
        "Time": "7:32.79",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9550&mrid=3775046&fn=Elana&ln=Neilly",
        "Date": "10/07/2017"
    },
    {
        "#": "415",
        "First": "Elana",
        "Last": "Neilly",
        "Club": "UNC",
        "Time": "7:32.79",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9550&mrid=3774821&fn=Elana&ln=Neilly",
        "Date": "10/07/2017"
    },
    {
        "#": "417",
        "First": "Elana",
        "Last": "Neilly",
        "Club": "UNC",
        "Time": "7:32.80",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9669&mrid=3792893&fn=Elana&ln=Neilly",
        "Date": "11/11/2017"
    },
    {
        "#": "418",
        "First": "Elana",
        "Last": "Neilly",
        "Club": "UNC",
        "Time": "7:34.37",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9562&mrid=3793169&fn=Elana&ln=Neilly",
        "Date": "10/13/2017"
    },
    {
        "#": "419",
        "First": "Taylor",
        "Last": "Delgado",
        "Club": "UCF",
        "Time": "7:35.45",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9631&mrid=3785421&fn=Taylor&ln=Delgado",
        "Date": "10/28/2017"
    },
    {
        "#": "420",
        "First": "Sadie",
        "Last": "Scott",
        "Club": "WASHU",
        "Time": "7:36.80",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9579&mrid=3786089&fn=Sadie&ln=Scott",
        "Date": "11/12/2017"
    },
    {
        "#": "421",
        "First": "Erin",
        "Last": "Horn",
        "Club": "CMU",
        "Time": "7:37.17",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9676&mrid=3790269&fn=Erin&ln=Horn",
        "Date": "12/02/2017"
    },
    {
        "#": "422",
        "First": "Malina",
        "Last": "Milas",
        "Club": "ROWAN",
        "Time": "7:38.65",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9817&mrid=3849893&fn=Malina&ln=Milas",
        "Date": "03/04/2018"
    },
    {
        "#": "423",
        "First": "Katie",
        "Last": "Kirsh",
        "Club": "FSU",
        "Time": "7:39.39",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9410&mrid=3790941&fn=Katie&ln=Kirsh",
        "Date": "11/11/2017"
    },
    {
        "#": "424",
        "First": "Mai",
        "Last": "Curott",
        "Club": "UNA",
        "Time": "7:41.46",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9821&mrid=3798309&fn=Mai&ln=Curott",
        "Date": "11/05/2017"
    },
    {
        "#": "425",
        "First": "Anne-Tillery",
        "Last": "Melson",
        "Club": "ELON",
        "Time": "7:43.59",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9667&mrid=3792465&fn=Anne-Tillery&ln=Melson",
        "Date": "10/28/2017"
    },
    {
        "#": "426",
        "First": "Olivia",
        "Last": "Rhodes",
        "Club": "LWD",
        "Time": "7:47.74",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9825&mrid=3821695&fn=Olivia&ln=Rhodes",
        "Date": "02/17/2018"
    },
    {
        "#": "427",
        "First": "Sarah",
        "Last": "Cato",
        "Club": "UNCG",
        "Time": "7:47.80",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9664&mrid=3788628&fn=Sarah&ln=Cato",
        "Date": "11/12/2017"
    },
    {
        "#": "428",
        "First": "Kayla",
        "Last": "Chrisofferson",
        "Club": "CCU",
        "Time": "7:48.28",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9893&mrid=3836326&fn=Kayla&ln=Chrisofferson",
        "Date": "02/10/2018"
    },
    {
        "#": "429",
        "First": "Maddie",
        "Last": "Faris",
        "Club": "UCCS",
        "Time": "7:49.17",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9820&mrid=3808364&fn=Maddie&ln=Faris",
        "Date": "02/03/2018"
    },
    {
        "#": "430",
        "First": "Sarah",
        "Last": "Cato",
        "Club": "UNCG",
        "Time": "7:49.81",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9667&mrid=3792467&fn=Sarah&ln=Cato",
        "Date": "10/28/2017"
    },
    {
        "#": "431",
        "First": "Sarah",
        "Last": "Adamczyk",
        "Club": "OSU",
        "Time": "7:51.73",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10245&mrid=3835544&fn=Sarah&ln=Adamczyk",
        "Date": "02/17/2018"
    },
    {
        "#": "432",
        "First": "Wendy",
        "Last": "Simental",
        "Club": "GCU",
        "Time": "7:52.31",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10063&mrid=3812255&fn=Wendy&ln=Simental",
        "Date": "12/02/2017"
    },
    {
        "#": "433",
        "First": "Carolyn",
        "Last": "Lyman",
        "Club": "UTAH",
        "Time": "7:53.01",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9636&mrid=3814815&fn=Carolyn&ln=Lyman",
        "Date": "11/11/2017"
    },
    {
        "#": "434",
        "First": "Sarah",
        "Last": "Cato",
        "Club": "UNCG",
        "Time": "8:03.75",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10005&mrid=3829223&fn=Sarah&ln=Cato",
        "Date": "09/30/2017"
    },
    {
        "#": "435",
        "First": "Sarah",
        "Last": "Cato",
        "Club": "UNCG",
        "Time": "8:06.59",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9893&mrid=3836328&fn=Sarah&ln=Cato",
        "Date": "02/10/2018"
    },
    {
        "#": "436",
        "First": "Devyn",
        "Last": "Price",
        "Club": "UTSC",
        "Time": "8:09.92",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9551&mrid=3784337&fn=Devyn&ln=Price",
        "Date": "10/28/2017"
    },
    {
        "#": "437",
        "First": "Alexa",
        "Last": "Kluepfel",
        "Club": "UB",
        "Time": "8:11.22",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10054&mrid=3840771&fn=Alexa&ln=Kluepfel",
        "Date": "02/25/2018"
    },
    {
        "#": "438",
        "First": "Marcella",
        "Last": "Donatelli",
        "Club": "PSC",
        "Time": "8:11.98",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9416&mrid=3773507&fn=Marcella&ln=Donatelli",
        "Date": "09/30/2017"
    },
    {
        "#": "439",
        "First": "Sarah",
        "Last": "Cato",
        "Club": "UNCG",
        "Time": "8:13.56",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9963&mrid=3809764&fn=Sarah&ln=Cato",
        "Date": "01/27/2018"
    },
    {
        "#": "440",
        "First": "Julianna",
        "Last": "Ducker",
        "Club": "NCSU",
        "Time": "8:20.02",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9664&mrid=3788256&fn=Julianna&ln=Ducker",
        "Date": "11/12/2017"
    },
    {
        "#": "441",
        "First": "Cassidy",
        "Last": "Jones",
        "Club": "CCU",
        "Time": "8:24.01",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10005&mrid=3829234&fn=Cassidy&ln=Jones",
        "Date": "09/30/2017"
    },
    {
        "#": "442",
        "First": "Sarah",
        "Last": "Trippy",
        "Club": "MOFO",
        "Time": "8:26.56",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9551&mrid=3784039&fn=Sarah&ln=Trippy",
        "Date": "10/28/2017"
    },
    {
        "#": "443",
        "First": "Alexa",
        "Last": "Kluepfel",
        "Club": "UBUF",
        "Time": "8:38.83",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10188&mrid=3863303&fn=Alexa&ln=Kluepfel",
        "Date": "03/10/2018"
    },
    {
        "#": "444",
        "First": "Curott",
        "Last": "Mai",
        "Club": "UNA",
        "Time": "8:38.93",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=10228&mrid=3834233&fn=Curott&ln=Mai",
        "Date": "10/21/2017"
    },
    {
        "#": "445",
        "First": "Sky",
        "Last": "Wianecki",
        "Club": "NCSU",
        "Time": "8:42.74",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9664&mrid=3788483&fn=Sky&ln=Wianecki",
        "Date": "11/12/2017"
    },
    {
        "#": "446",
        "First": "Lynne",
        "Last": "Lund",
        "Club": "SUSA",
        "Time": "8:54.61",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9636&mrid=3814802&fn=Lynne&ln=Lund",
        "Date": "11/11/2017"
    },
    {
        "#": "447",
        "First": "Sky",
        "Last": "Wianecki",
        "Club": "NCSU",
        "Time": "8:57.64",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9667&mrid=3792462&fn=Sky&ln=Wianecki",
        "Date": "10/28/2017"
    },
    {
        "#": "448",
        "First": "Elizabeth",
        "Last": "Aucello",
        "Club": "MSUCS",
        "Time": "9:32.04",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9817&mrid=3849815&fn=Elizabeth&ln=Aucello",
        "Date": "03/04/2018"
    },
    {
        "#": "449",
        "First": "Jennifer",
        "Last": "Philion",
        "Club": "OEVT",
        "Time": "10:22.50",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9636&mrid=3814882&fn=Jennifer&ln=Philion",
        "Date": "11/11/2017"
    },
    {
        "#": "450",
        "First": "Devon",
        "Last": "Cantwell",
        "Club": "UTES",
        "Time": "10:49.61",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9636&mrid=3814901&fn=Devon&ln=Cantwell",
        "Date": "11/11/2017"
    },
    {
        "#": "451",
        "First": "Connie",
        "Last": "Larson",
        "Club": "OEVT",
        "Time": "11:05.47",
        "TimeLink": "https://www.swimphone.com/meets/splits.cfm?smid=9636&mrid=3814870&fn=Connie&ln=Larson",
        "Date": "11/11/2017"
    }
]];











function renderTable(data, containerId) {
  const container = document.getElementById(containerId);
  if (!data || data.length === 0) {
    container.textContent = "No data to display";
    return;
  }

  const table = document.createElement("table");

  // Create table head
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  // Use keys from the first object to define headers
  const headers = ["#", "First", "Last", "Club", "Time", "Date"];
  headers.forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement("tbody");
  data.forEach(item => {
    const row = document.createElement("tr");

    headers.forEach(key => {
      const td = document.createElement("td");

      if (key === "Time" && item["TimeLink"]) {
        const a = document.createElement("a");
        a.href = item["TimeLink"];
        a.textContent = item["Time"];
        a.target = "_blank";
        td.appendChild(a);
      } else {
        td.textContent = item[key] || "";
      }

      row.appendChild(td);
    });

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

// Call with jsonData[0]
renderTable(jsonData[0], "table-container");
