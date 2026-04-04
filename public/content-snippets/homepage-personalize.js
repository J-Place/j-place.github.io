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
    }
  }