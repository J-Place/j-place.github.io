var getData = $.ajax({
    url: "https://j-place.github.io/forum-comments/assets/thread_1.json",
    type: "GET",
    success: function (response) {
      var data = JSON.parse(getData.responseText);
      var dataLocal = data.data;
  
//      gtdMilestones = new List('gtdMilestones', options, dataLocal);

        console.log(dataLocal);
  
    },
    error: function (xhr) {
      console.log("Failed to load data.");
    },
  });