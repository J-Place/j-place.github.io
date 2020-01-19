function getLatestSwims() {
    showLoadingOverlay();
    const xhr = new XMLHttpRequest();
  
    xhr.open('GET', '/swimFeedJP.json?ver=1', true);
    // xhr.open('GET', '/swimFeedJP.json?asd=1', true);
    xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    // xhr.withCredentials = true;
    xhr.onload = function () {
      if (xhr.status === 200) {
        hideLoadingOverlay();
        const response = JSON.parse(xhr.response);
        allSwims = response.swims;
        const stripped = { ...response, swims: response.swims.slice(0, (perPage - 1) * currentPage++) };
        createSwimsHtml(stripped);
        return;
      }
      console.log("Error retrieving swim information");
      return null;
    };
    xhr.send();
  }