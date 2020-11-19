function getEventResults() {

    const xhr = new XMLHttpRequest();
  
    xhr.open('GET', 'https://763a048a-2a06-44c5-a12f-f004327581ab.mock.pstmn.io/get', true);
    xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.response);
            createHtml(response);
        return;
    }
        return null;
    };
    xhr.send();
}
getEventResults();



function createHtml() {
    console.log(response);
    console.log(response[0].name);
}
createHtml();





// /* List.js is required to make this table work. */

// var options = {
//     valueNames: [ { data: ['timestamp'] }, { data: ['status'] }, 'jSortNumber', 'jSortName', 'jSortTotal' ],
//     page: 2,
//     pagination: {
//       innerWindow: 1,
//       left: 0,
//       right: 0,
//       paginationClass: "pagination",
//       }
//   };




//   var tableList = new List('tableID', options);  

//       $('.jPaginateNext').on('click', function(){
//           var list = $('.pagination').find('li');
//           $.each(list, function(position, element){
//               if($(element).is('.active')){
//                   $(list[position+1]).trigger('click');
//               }
//           })
//       });

//       $('.jPaginateBack').on('click', function(){
//           var list = $('.pagination').find('li');
//           $.each(list, function(position, element){
//               if($(element).is('.active')){
//                   $(list[position-1]).trigger('click');
//               }
//           })
//       });