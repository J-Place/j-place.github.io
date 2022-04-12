
// var compareDetailsTable = document.getElementById(compareDetails);
// var compareDetailsBtn = document.getElementById(compareDetailsBtn);

// alert("click");
// console.log(compareDetailsBtn);
// document.getElementById(compareDetailsBtn).click(function() {
    // alert("click");
    // console.log('Test');
    // document.getElementById(compareDetails).style.display = 'block';
    // document.getElementById( 'elemtId' ).style.display = 'none';
// });



function handleShowDetails() {
    var comparisonChart = document.getElementById("membershipComparison");
    var comparisonBtn = document.getElementById("compareDetailsBtn");
    var membershipOverview = document.getElementById("membershipOverview");

    if (comparisonChart.classList.contains("show")) {
        comparisonChart.classList.remove("show");
        comparisonBtn.classList.remove("open");
        // membershipOverview.scrollIntoView({behavior: "smooth"});
        window.scrollTo({top: 0, behavior: "smooth"});
        // document.body.scrollTop = document.documentElement.scrollTop = 0;
    } else {
        comparisonChart.classList.add("show");
        comparisonBtn.classList.add("open");
        document.getElementById("showDetails").scrollIntoView({behavior: "smooth"});
    }
    // alert("click");
    // document.getElementById("compareDetails").style.height = '100%';
    // document.getElementById("compareDetails").style.display = 'block';
}


if (comparisonChart.classList.contains("show-filters")) {
    alert("Hola");
}







// onclick="handleTableDetails()"