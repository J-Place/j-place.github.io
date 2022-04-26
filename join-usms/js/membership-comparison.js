







var heightHeader = 0;
$('.personalize__content-column-header').each(function(){  
        if($(this).height() > heightHeader){  
        heightHeader = $(this).height();  
    }
});    
$('.personalize__content-column-header').height(heightDescription);

var heightDescription = 0;
$('.personalize__content-column-description').each(function(){  
        if($(this).height() > heightDescription){  
        heightDescription = $(this).height();  
    }
});    
$('.personalize__content-column-description').height(heightDescription);






(function () {
    equalHeight(false);
  })();
   
  window.onresize = function(){
    equalHeight(true);
  }
   
  function equalHeight(resize) {
    var elementsHeader = document.getElementsByClassName("personalize__content-column-header");
    var elementsDescription = document.getElementsByClassName("personalize__content-column-description");
    var allHeightsHeader = [];
    var allHeightsDescription = [];
    i = 0;
    if(resize === true){
      for(i = 0; i < elementsHeader.length; i++){
        elementsHeader[i].style.height = 'auto';
        elementsDescription[i].style.height = 'auto';
      }
    }
    for(i = 0; i < elementsHeader.length; i++){
      var elementHeightHeader = elementsHeader[i].clientHeight;
      var elementHeightDescription = elementsDescription[i].clientHeight;
      allHeightsHeader.push(elementHeightHeader);
      allHeightsDescription.push(elementHeightDescription);
    }
    for(i = 0; i < elementsHeader.length; i++){
      elementsHeader[i].style.height = Math.max.apply( Math, allHeightsHeader) + 'px';
      elementsDescription[i].style.height = Math.max.apply( Math, allHeightsDescription) + 'px';
      // if(resize === false){
      //   elementsHeader[i].className = elementsHeader[i].className + " showXXX";
      // }
    }
  }



  


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