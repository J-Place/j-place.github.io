function autocompleteCoachById(inp) {
  if (!inp) return;
  var currentFocus;

  function keyUpCallback(e) {
    if (this.value.length < 5) return;
    var a, b, i, val = this.value;
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;

    a = document.createElement('DIV');
    a.setAttribute('id', this.id + 'autocomplete-list');
    a.setAttribute('class', 'autocomplete-items');
    this.parentNode.appendChild(a);
    const xhr = new XMLHttpRequest();

    xhr.open('POST', '/apis/v1/coaches/id/' + val.toUpperCase(), true);
    xhr.withCredentials = true;
    xhr.onload = function () {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.response);
        coachesFromApi = [response.firstName + ' ' + response.lastName + '  ' + response.city + ', ' + response.state];
        b = document.createElement('DIV');
        b.innerHTML = '<strong>' + coachesFromApi[0].substr(0, val.length) + '</strong>';
        b.innerHTML += coachesFromApi[0].substr(val.length);
        b.innerHTML += '<input type="hidden" value="' + coachesFromApi[0] + '">';
        b.addEventListener('click', function (e) {
          inp.value = this.getElementsByTagName('input')[0].value;
          setTimeout(function() {
              inp.value = '';
            },
            500);
          closeAllLists();
          addCoach(response);
        });
        a.appendChild(b);
      }
    };
    xhr.send();
  }

  $(inp).keyup($.debounce(500, keyUpCallback));

  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) { //up
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

function autocompleteCoachesByName(inp) {
  if (!inp) return;
  var currentFocus;

  function keyUpCallback(e) {
    if (this.value.length < 3) return;
    var a, b, i, val = this.value;
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);
    const xhr = new XMLHttpRequest();

    xhr.open('POST', '/apis/v1/coaches/name/' + val.toUpperCase(), true);
    xhr.withCredentials = true;
    xhr.onload = function() {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.response);
        const arr = [];
        coachesFromApi = response;
        for (let i = 0; i < response.length; i++) {
          arr.push(response[i].firstName +
            ' ' +
            response[i].lastName +
            '  ' +
            response[i].city +
            ', ' +
            response[i].state);
        }
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            b = document.createElement("DIV");
            const startIndex = arr[i].toUpperCase().indexOf(val.toUpperCase());
            const prefix = arr[i].substring(0, startIndex);
            const match = arr[i].substring(startIndex, startIndex + val.length);
            const sufix = arr[i].substring(startIndex + val.length);

            b.innerHTML = `${prefix}<strong>${match}</strong>${sufix}`;
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            b.addEventListener("click",
              function (e) {
                inp.value = this.getElementsByTagName("input")[0].value;
                closeAllLists();
                setCurrentCoach(coachesFromApi[i]);
              });
            a.appendChild(b);
          }
        }
      }
    }
    xhr.send();
  }

  $(inp).keyup($.debounce(500, keyUpCallback));
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) { //up
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

function autocompleteAltsById(inp) {
  if (!inp) return;
  var currentFocus;
  function keyUpCallback(e) {
    if (this.value.length < 5) return;
    var a, b, i, val = this.value;
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;
    a = document.createElement('DIV');
    a.setAttribute('id', this.id + 'autocomplete-list');
    a.setAttribute('class', 'autocomplete-items');
    this.parentNode.appendChild(a);
    const xhr = new XMLHttpRequest();

    xhr.open('POST', '/apis/v1/alts/id/' + val.toUpperCase(), true);
    xhr.withCredentials = true;
    xhr.onload = function () {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.response);
        altsFromApi = [response.firstName + ' ' + response.lastName + '  ' + response.city + ', ' + response.state];
        b = document.createElement('DIV');
        b.innerHTML = '<strong>' + altsFromApi[0].substr(0, val.length) + '</strong>';
        b.innerHTML += altsFromApi[0].substr(val.length);
        b.innerHTML += '<input type="hidden" value="' + altsFromApi[0] + '">';
        b.addEventListener('click', function (e) {
          inp.value = this.getElementsByTagName('input')[0].value;
          setTimeout(function () {
            inp.value = '';
          },
            500);
          closeAllLists();
          addAlts(response);
        });
        a.appendChild(b);
      } else {
      }
    };
    xhr.send();
  }

  $(inp).keyup($.debounce(500, keyUpCallback));

  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) { //up
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

function autocompleteAltsByName(inp) {
  if (!inp) return;
  var currentFocus;
  function keyUpCallback(e) {
    if (this.value.length < 3) return;
    var a, b, i, val = this.value;
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);
    const xhr = new XMLHttpRequest();

    xhr.open('POST', '/apis/v1/alts/name/' + val.toUpperCase(), true);
    xhr.withCredentials = true;
    xhr.onload = function () {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.response);
        const arr = [];
        altsFromApi = response;
        for (let i = 0; i < response.length; i++) {
          arr.push(response[i].firstName +
            ' ' +
            response[i].lastName +
            '  ' +
            response[i].city +
            ', ' +
            response[i].state);
        }
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            b = document.createElement("DIV");
            const startIndex = arr[i].toUpperCase().indexOf(val.toUpperCase());
            const prefix = arr[i].substring(0, startIndex);
            const match = arr[i].substring(startIndex, startIndex + val.length);
            const sufix = arr[i].substring(startIndex + val.length);
            b.innerHTML = `${prefix}<strong>${match}</strong>${sufix}`;
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            b.addEventListener("click", function (e) {
                inp.value = this.getElementsByTagName("input")[0].value;
                setTimeout(function () {
                  inp.value = '';
                },
                  500);
                closeAllLists();
                addAlts(altsFromApi[i]);
              });
            a.appendChild(b);
          }
        }
      }
    }
    xhr.send();
  }

  $(inp).keyup($.debounce(500, keyUpCallback));
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) { //up
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

function autocompleteContactsByName(inp) {
  if (!inp) return;
  var currentFocus;
  function keyUpCallback(e) {
    if (this.value.length < 3) return;
    var a, b, i, val = this.value;
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);
    const xhr = new XMLHttpRequest();

    xhr.open('POST', '/apis/v1/coaches/name/' + val.toUpperCase(), true);
    xhr.withCredentials = true;
    xhr.onload = function() {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.response);
        const arr = [];
        contactsFromApi = response;
        for (let i = 0; i < response.length; i++) {
          arr.push(response[i].firstName +
            ' ' +
            response[i].lastName +
            '  ' +
            response[i].city +
            ', ' +
            response[i].state);
        }
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            b = document.createElement("DIV");
            const startIndex = arr[i].toUpperCase().indexOf(val.toUpperCase());
            const prefix = arr[i].substring(0, startIndex);
            const match = arr[i].substring(startIndex, startIndex + val.length);
            const sufix = arr[i].substring(startIndex + val.length);

            b.innerHTML = `${prefix}<strong>${match}</strong>${sufix}`;
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            b.addEventListener("click",
              function (e) {
                inp.value = this.getElementsByTagName("input")[0].value;
                closeAllLists();
                setCurrentContact(contactsFromApi[i]);
              });
            a.appendChild(b);
          }
        }
      }
    }
    xhr.send();
  }

  $(inp).keyup($.debounce(500, keyUpCallback));
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) { //up
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}
