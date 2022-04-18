
// var compareDetailsTable = document.getElementById(compareDetails);
// var compareDetailsBtn = document.getElementById(compareDetailsBtn);
// document.getElementById(compareDetailsBtn).click(function() {
    // document.getElementById(compareDetails).style.display = 'block';
    // document.getElementById( 'elemtId' ).style.display = 'none';
// });


$(function () {
    $('[data-toggle="popover"]').popover()
});

function handleShowDetails() {
    var comparisonChart = document.getElementById("membershipComparison");
    var comparisonBtn = document.getElementById("compareDetailsBtn");
    // var membershipOverview = document.getElementById("membershipOverview");

    
    var mediaMax480 = window.matchMedia("screen and (max-width:480px)").matches;

    if (comparisonChart.classList.contains("show")) {
        comparisonChart.classList.remove("show");
        comparisonBtn.classList.remove("open");
        
        if ( mediaMax480 ) {
            console.log("This is mobile view");
        } else {
            console.log("This is desktop and tablet view");
            // window.scroll(0, 300);
            window.scrollTo({top: 0, behavior: "smooth"});
            document.getElementById("showDetails").scrollIntoView({behavior: "smooth"});
            document.getElementById("membershipOverview").scrollIntoView({behavior: "smooth"}); 
        }
    } else {
        comparisonChart.classList.add("show");
        comparisonBtn.classList.add("open");
        if ( mediaMax480 ) {

        } else {
            document.getElementById("showDetails").scrollIntoView({behavior: "smooth"});
            document.getElementById("membershipOverview").scrollIntoView({behavior: "smooth"});     
        }
        // membershipOverview.classList.add('is-fixed');
        // var pageFooter = document.querySelector('footer-content');
    }
}


// window.addEventListener("scroll", () => {
//     var tableShown = document.getElementById('membershipComparison');
//     var membershipOverview = document.getElementById('membershipOverview');
//     var showDetailsButton = document.getElementById('showDetails');
//     var pageFooter = document.querySelector('.footer-content');
//     const pageFooterPosition = pageFooter.scrollTop;
//     const currentScroll = window.pageYOffset;
//     console.log(currentScroll);
//     console.log(pageFooterPosition);

//     if (tableShown.classList.contains('show')) {
//         if (currentScroll >= 344) {
//             membershipOverview.classList.add('is-fixed');
//             showDetailsButton.classList.add('is-fixed');
//         } else if (currentScroll < 344) {
//             membershipOverview.classList.remove('is-fixed');
//             showDetailsButton.classList.remove('is-fixed');
//         } 
        
//         if (currentScroll >= 2265) {
//             membershipOverview.classList.add('is-fixed-footer');
//             showDetailsButton.classList.add('is-fixed-footer');
//         }

//         if (currentScroll < 2265) {
//             membershipOverview.classList.remove('is-fixed-footer');
//             showDetailsButton.classList.remove('is-fixed-footer');
//         }
//     }
// }); 

// }