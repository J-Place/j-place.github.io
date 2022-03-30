
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



function handleTableDetails() {
    var comparisonChart = document.getElementById("membershipComparison");
    if (comparisonChart.classList.contains("show")) {
        comparisonChart.classList.remove("show");
    } else {
        comparisonChart.classList.add("show");
    }
    // alert("click");
    // document.getElementById("compareDetails").style.height = '100%';
    // document.getElementById("compareDetails").style.display = 'block';
}








// onclick="handleTableDetails()"