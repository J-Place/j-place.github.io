var getData = $.ajax({
    url: "https://j-place.github.io/forum-comments/assets/thread_1.json",
    type: "GET",
    success: function (response) {
        var data = JSON.parse(getData.responseText);
        var dataLocal = data.replies;
        renderList(dataLocal);
    },
    error: function (xhr) {
      console.log("Failed to load data.");
    },
  });

  

//   for (let i of dataLocal) {
//     let item = document.createElement("li");
//     item.innerHTML = i;
//     list.appendChild(item);
//   }

function renderList(dataLocal) {
    console.log(dataLocal);
    var list = document.createElement("ul");
    list.classList.add('content-list');
    list.classList.add('threaded');
    for (i = 0; i < dataLocal.length; i++) {
        let item = document.createElement("li");
        item.innerHTML = dataLocal[i].body;
        list.appendChild(item);  
    }
    document.getElementById('comments').appendChild(list);
}