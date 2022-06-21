// var heightHeader = 0;
// $('.personalize__content-column-header').each(function(){  
//         if($(this).height() > heightHeader){  
//         heightHeader = $(this).height();  
//     }
// });    
// $('.personalize__content-column-header').height(heightDescription);

// var heightDescription = 0;
// $('.personalize__content-column-description').each(function(){  
//         if($(this).height() > heightDescription){  
//         heightDescription = $(this).height();  
//     }
// });    
// $('.personalize__content-column-description').height(heightDescription);


// (function () {
//     equalHeight(false);
//   })();
   
//   window.onresize = function(){
//     equalHeight(true);
//   }
   
//   function equalHeight(resize) {
//     var elementsHeader = document.getElementsByClassName("personalize__content-column-header");
//     var elementsDescription = document.getElementsByClassName("personalize__content-column-description");
//     var allHeightsHeader = [];
//     var allHeightsDescription = [];
//     i = 0;
//     if(resize === true){
//       for(i = 0; i < elementsHeader.length; i++){
//         elementsHeader[i].style.height = 'auto';
//         elementsDescription[i].style.height = 'auto';
//       }
//     }
//     for(i = 0; i < elementsHeader.length; i++){
//       var elementHeightHeader = elementsHeader[i].clientHeight;
//       var elementHeightDescription = elementsDescription[i].clientHeight;
//       allHeightsHeader.push(elementHeightHeader);
//       allHeightsDescription.push(elementHeightDescription);
//     }
//     for(i = 0; i < elementsHeader.length; i++){
//       elementsHeader[i].style.height = Math.max.apply( Math, allHeightsHeader) + 'px';
//       elementsDescription[i].style.height = Math.max.apply( Math, allHeightsDescription) + 'px';
//       // if(resize === false){
//       //   elementsHeader[i].className = elementsHeader[i].className + " showXXX";
//       // }
//     }
//   }

$("#compareDetailsBtn").click(function() {
    var comparisonChart = document.getElementById("membershipComparison");
    var comparisonBtn = document.getElementById("compareDetailsBtn");
    var mediaMax480 = window.matchMedia("screen and (max-width:480px)").matches;
    if (comparisonChart.classList.contains("show")) {
        comparisonChart.classList.remove("show");
        comparisonBtn.classList.remove("open");          
        if ( mediaMax480 ) {
            // console.log("This is mobile view");
        } else {
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
    }
});

$('[data-toggle="popover"]').popover();