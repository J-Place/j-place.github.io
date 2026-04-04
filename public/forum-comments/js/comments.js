var getData = $.ajax({
    url: "https://j-place.github.io/forum-comments/assets/thread_2.json",
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
    var list = document.createElement("ul");
    list.classList.add('content-list');
    list.classList.add('threaded');
    for (i = 0; i < dataLocal.length; i++) {
        let item = document.createElement("li");
        if (dataLocal[i].ChildCount > 0) {
            item.innerHTML = dataLocal[i].body;
            list.appendChild(item);
            let childItems = dataLocal[i].children;
            for (j = 0; j < childItems.length; j++) {
                var childList = document.createElement("ul");
                let childItem = document.createElement("li");
                if (childItems[j].ChildCount > 0) {
                    childItem.innerHTML = childItems[j].body;
                    childList.appendChild(childItem);
                    item.appendChild(childList);
                    let grandChildItems = childItems[j].children;
                    var grandChildList = document.createElement("ul");
                    for (k = 0; k < grandChildItems.length; k++) {
                        let grandChildItem = document.createElement("li");
                        grandChildItem.innerHTML = grandChildItems[k].body;
                        grandChildList.appendChild(grandChildItem);
                        childItem.appendChild(grandChildList);
                    }
                } else if (childItems[j].ChildCount == 0) {
                    childItem.innerHTML = childItems[j].body;
                    childList.appendChild(childItem);
                    item.appendChild(childList);
                }
            }
            list.appendChild(item);
        } else if (dataLocal[i].ChildCount == 0) {
            item.innerHTML = dataLocal[i].body;
            list.appendChild(item);
        }
    }
    document.getElementById('comments').appendChild(list);
}