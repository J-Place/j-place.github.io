"use strict";
!function() {
    "$:nomunge";
    var o, i = window.jQuery || window.Cowboy || (window.Cowboy = {});
    i.throttle = o = function(o, n, t, u) {
        function e() {
            function i() {
                r = +new Date,
                t.apply(w, v)
            }
            function e() {
                d = void 0
            }
            var w = this
              , c = +new Date - r
              , v = arguments;
            u && !d && i(),
            d && clearTimeout(d),
            void 0 === u && c > o ? i() : n !== !0 && (d = setTimeout(u ? e : i, void 0 === u ? o - c : o))
        }
        var d, r = 0;
        return "boolean" != typeof n && (u = t,
        t = n,
        n = void 0),
        i.guid && (e.guid = t.guid = t.guid || i.guid++),
        e
    }
    ,
    i.debounce = function(i, n, t) {
        return void 0 === t ? o(i, n, !1) : o(i, t, n !== !1)
    }
}(void 0);
"use strict";
var nextSection = null
  , currentSectionState = null
  , currentCallback = null
  , isRegionalClub = !1;
$("#accordion .collapse").on("show.bs.collapse", function(t) {
    var e = t.target;
    if (setTimeout(function() {
        window.scroll(0, FindPos(t.target.parentNode))
    }, 450),
    isRegionalClub && ("club-coach__content" === e.id || "club-location__content" === e.id || "gold-club__content" === e.id))
        return t.preventDefault(),
        t.stopPropagation(),
        !1;
    switch (setSectionInputStatus(e, !1),
    e.parentElement.classList.add("isEdit"),
    e.id) {
    case "club-coach__content":
        getCurrentCoaches();
        break;
    case "club-location__content":
        getCurrentLocations();
        break;
    case "gold-club__content":
        setGoldClubFlag();
        break;
    case "club-name__content":
    case "club-details__content":
    case "club-contact__content":
        currentSectionState = saveSectionState(e)
    }
    var n = $("#accordion").find(".in, .collapsing");
    n.each(function(t, e) {
        e !== nextSection && $(e).collapse("hide")
    })
}),
$("#accordion h3.section__header").on("click", function(t) {
    var e = t.target.parentNode
      , n = document.querySelector(".section__content.collapse.in");
    n && (sectionSaved(n) ? nextSection = null : (nextSection = e,
    t.stopPropagation(),
    t.preventDefault(),
    showSaveModal(n.querySelector("button.btn.save-section").onclick)))
}),
$("#accordion .collapse").on("hide.bs.collapse", function(t) {
    var e = t.target;
    setSectionInputStatus(e, !0),
    e.parentElement.classList.remove("isEdit")
});
"use strict";
"use strict";
function submitApproval(e) {
    if (e.preventDefault(),
    showLoadingOverlay(),
    !validateSectionsForPayment())
        return void hideLoadingOverlay();
    var r = new XMLHttpRequest
      , o = getUrlParams("clubId");
    return o ? (r.open("POST", "/apis/v1/clubweb/section/approve?clubId=" + o, !0),
    r.responseType = "json",
    r.onload = function() {
        200 === r.status ? r.response.error ? showErrorModal(r.response.error) : showApprovalMessageModal(r.response.data.message) : showErrorModal("Error sending approval")
    }
    ,
    r.send(),
    !1) : void 0
}
"use strict";
function autocompleteCoachById(e) {
    function t(t) {
        if (!(this.value.length < 5)) {
            var n, a, s = this.value;
            if (i(),
            !s)
                return !1;
            o = -1,
            n = document.createElement("DIV"),
            n.setAttribute("id", this.id + "autocomplete-list"),
            n.setAttribute("class", "autocomplete-items"),
            this.parentNode.appendChild(n);
            var r = new XMLHttpRequest;
            r.open("POST", "/apis/v1/coaches/id/" + s.toUpperCase(), !0),
            r.withCredentials = !0,
            r.onload = function() {
                if (200 === r.status) {
                    var t = JSON.parse(r.response);
                    coachesFromApi = [t.firstName + " " + t.lastName + "  " + t.city + ", " + t.state],
                    a = document.createElement("DIV"),
                    a.innerHTML = "<strong>" + coachesFromApi[0].substr(0, s.length) + "</strong>",
                    a.innerHTML += coachesFromApi[0].substr(s.length),
                    a.innerHTML += '<input type="hidden" value="' + coachesFromApi[0] + '">',
                    a.addEventListener("click", function(n) {
                        e.value = this.getElementsByTagName("input")[0].value,
                        setTimeout(function() {
                            e.value = ""
                        }, 500),
                        i(),
                        addCoach(t)
                    }),
                    n.appendChild(a)
                }
            }
            ,
            r.send()
        }
    }
    function n(e) {
        return e ? (a(e),
        o >= e.length && (o = 0),
        0 > o && (o = e.length - 1),
        void e[o].classList.add("autocomplete-active")) : !1
    }
    function a(e) {
        for (var t = 0; t < e.length; t++)
            e[t].classList.remove("autocomplete-active")
    }
    function i(t) {
        for (var n = document.getElementsByClassName("autocomplete-items"), a = 0; a < n.length; a++)
            t != n[a] && t != e && n[a].parentNode.removeChild(n[a])
    }
    if (e) {
        var o;
        $(e).keyup($.debounce(500, t)),
        e.addEventListener("keydown", function(e) {
            var t = document.getElementById(this.id + "autocomplete-list");
            t && (t = t.getElementsByTagName("div")),
            40 == e.keyCode ? (o++,
            n(t)) : 38 == e.keyCode ? (o--,
            n(t)) : 13 == e.keyCode && (e.preventDefault(),
            o > -1 && t && t[o].click())
        }),
        document.addEventListener("click", function(e) {
            i(e.target)
        })
    }
}
function autocompleteCoachesByName(e) {
    function t(t) {
        if (!(this.value.length < 3)) {
            var n, a, s = this.value;
            if (i(),
            !s)
                return !1;
            o = -1,
            n = document.createElement("DIV"),
            n.setAttribute("id", this.id + "autocomplete-list"),
            n.setAttribute("class", "autocomplete-items"),
            this.parentNode.appendChild(n);
            var r = new XMLHttpRequest;
            r.open("POST", "/apis/v1/coaches/name/" + s.toUpperCase(), !0),
            r.withCredentials = !0,
            r.onload = function() {
                if (200 === r.status) {
                    var t = JSON.parse(r.response)
                      , o = [];
                    coachesFromApi = t;
                    for (var l = 0; l < t.length; l++)
                        o.push(t[l].firstName + " " + t[l].lastName + "  " + t[l].city + ", " + t[l].state);
                    for (var u = function(t) {
                        if (-1 !== o[t].toUpperCase().indexOf(s.toUpperCase())) {
                            a = document.createElement("DIV");
                            var r = o[t].toUpperCase().indexOf(s.toUpperCase())
                              , l = o[t].substring(0, r)
                              , u = o[t].substring(r, r + s.length)
                              , c = o[t].substring(r + s.length);
                            a.innerHTML = l + "<strong>" + u + "</strong>" + c,
                            a.innerHTML += "<input type='hidden' value='" + o[t] + "'>",
                            a.addEventListener("click", function(n) {
                                e.value = this.getElementsByTagName("input")[0].value,
                                i(),
                                setCurrentCoach(coachesFromApi[t])
                            }),
                            n.appendChild(a)
                        }
                    }, c = 0; c < o.length; c++)
                        u(c)
                }
            }
            ,
            r.send()
        }
    }
    function n(e) {
        return e ? (a(e),
        o >= e.length && (o = 0),
        0 > o && (o = e.length - 1),
        void e[o].classList.add("autocomplete-active")) : !1
    }
    function a(e) {
        for (var t = 0; t < e.length; t++)
            e[t].classList.remove("autocomplete-active")
    }
    function i(t) {
        for (var n = document.getElementsByClassName("autocomplete-items"), a = 0; a < n.length; a++)
            t != n[a] && t != e && n[a].parentNode.removeChild(n[a])
    }
    if (e) {
        var o;
        $(e).keyup($.debounce(500, t)),
        e.addEventListener("keydown", function(e) {
            var t = document.getElementById(this.id + "autocomplete-list");
            t && (t = t.getElementsByTagName("div")),
            40 == e.keyCode ? (o++,
            n(t)) : 38 == e.keyCode ? (o--,
            n(t)) : 13 == e.keyCode && (e.preventDefault(),
            o > -1 && t && t[o].click())
        }),
        document.addEventListener("click", function(e) {
            i(e.target)
        })
    }
}
function autocompleteAltsById(e) {
    function t(t) {
        if (!(this.value.length < 5)) {
            var n, a, s = this.value;
            if (i(),
            !s)
                return !1;
            o = -1,
            n = document.createElement("DIV"),
            n.setAttribute("id", this.id + "autocomplete-list"),
            n.setAttribute("class", "autocomplete-items"),
            this.parentNode.appendChild(n);
            var r = new XMLHttpRequest;
            r.open("POST", "/apis/v1/alts/id/" + s.toUpperCase(), !0),
            r.withCredentials = !0,
            r.onload = function() {
                if (200 === r.status) {
                    var t = JSON.parse(r.response);
                    altsFromApi = [t.firstName + " " + t.lastName + "  " + t.city + ", " + t.state],
                    a = document.createElement("DIV"),
                    a.innerHTML = "<strong>" + altsFromApi[0].substr(0, s.length) + "</strong>",
                    a.innerHTML += altsFromApi[0].substr(s.length),
                    a.innerHTML += '<input type="hidden" value="' + altsFromApi[0] + '">',
                    a.addEventListener("click", function(n) {
                        e.value = this.getElementsByTagName("input")[0].value,
                        setTimeout(function() {
                            e.value = ""
                        }, 500),
                        i(),
                        addAlts(t)
                    }),
                    n.appendChild(a)
                }
            }
            ,
            r.send()
        }
    }
    function n(e) {
        return e ? (a(e),
        o >= e.length && (o = 0),
        0 > o && (o = e.length - 1),
        void e[o].classList.add("autocomplete-active")) : !1
    }
    function a(e) {
        for (var t = 0; t < e.length; t++)
            e[t].classList.remove("autocomplete-active")
    }
    function i(t) {
        for (var n = document.getElementsByClassName("autocomplete-items"), a = 0; a < n.length; a++)
            t != n[a] && t != e && n[a].parentNode.removeChild(n[a])
    }
    if (e) {
        var o;
        $(e).keyup($.debounce(500, t)),
        e.addEventListener("keydown", function(e) {
            var t = document.getElementById(this.id + "autocomplete-list");
            t && (t = t.getElementsByTagName("div")),
            40 == e.keyCode ? (o++,
            n(t)) : 38 == e.keyCode ? (o--,
            n(t)) : 13 == e.keyCode && (e.preventDefault(),
            o > -1 && t && t[o].click())
        }),
        document.addEventListener("click", function(e) {
            i(e.target)
        })
    }
}
function autocompleteAltsByName(e) {
    function t(t) {
        if (!(this.value.length < 3)) {
            var n, a, s = this.value;
            if (i(),
            !s)
                return !1;
            o = -1,
            n = document.createElement("DIV"),
            n.setAttribute("id", this.id + "autocomplete-list"),
            n.setAttribute("class", "autocomplete-items"),
            this.parentNode.appendChild(n);
            var r = new XMLHttpRequest;
            r.open("POST", "/apis/v1/alts/name/" + s.toUpperCase(), !0),
            r.withCredentials = !0,
            r.onload = function() {
                if (200 === r.status) {
                    var t = JSON.parse(r.response)
                      , o = [];
                    altsFromApi = t;
                    for (var l = 0; l < t.length; l++)
                        o.push(t[l].firstName + " " + t[l].lastName + "  " + t[l].city + ", " + t[l].state);
                    for (var u = function(t) {
                        if (-1 !== o[t].toUpperCase().indexOf(s.toUpperCase())) {
                            a = document.createElement("DIV");
                            var r = o[t].toUpperCase().indexOf(s.toUpperCase())
                              , l = o[t].substring(0, r)
                              , u = o[t].substring(r, r + s.length)
                              , c = o[t].substring(r + s.length);
                            a.innerHTML = l + "<strong>" + u + "</strong>" + c,
                            a.innerHTML += "<input type='hidden' value='" + o[t] + "'>",
                            a.addEventListener("click", function(n) {
                                e.value = this.getElementsByTagName("input")[0].value,
                                setTimeout(function() {
                                    e.value = ""
                                }, 500),
                                i(),
                                addAlts(altsFromApi[t])
                            }),
                            n.appendChild(a)
                        }
                    }, c = 0; c < o.length; c++)
                        u(c)
                }
            }
            ,
            r.send()
        }
    }
    function n(e) {
        return e ? (a(e),
        o >= e.length && (o = 0),
        0 > o && (o = e.length - 1),
        void e[o].classList.add("autocomplete-active")) : !1
    }
    function a(e) {
        for (var t = 0; t < e.length; t++)
            e[t].classList.remove("autocomplete-active")
    }
    function i(t) {
        for (var n = document.getElementsByClassName("autocomplete-items"), a = 0; a < n.length; a++)
            t != n[a] && t != e && n[a].parentNode.removeChild(n[a])
    }
    if (e) {
        var o;
        $(e).keyup($.debounce(500, t)),
        e.addEventListener("keydown", function(e) {
            var t = document.getElementById(this.id + "autocomplete-list");
            t && (t = t.getElementsByTagName("div")),
            40 == e.keyCode ? (o++,
            n(t)) : 38 == e.keyCode ? (o--,
            n(t)) : 13 == e.keyCode && (e.preventDefault(),
            o > -1 && t && t[o].click())
        }),
        document.addEventListener("click", function(e) {
            i(e.target)
        })
    }
}
function autocompleteContactsByName(e) {
    function t(t) {
        if (!(this.value.length < 3)) {
            var n, a, s = this.value;
            if (i(),
            !s)
                return !1;
            o = -1,
            n = document.createElement("DIV"),
            n.setAttribute("id", this.id + "autocomplete-list"),
            n.setAttribute("class", "autocomplete-items"),
            this.parentNode.appendChild(n);
            var r = new XMLHttpRequest;
            r.open("POST", "/apis/v1/coaches/name/" + s.toUpperCase(), !0),
            r.withCredentials = !0,
            r.onload = function() {
                if (200 === r.status) {
                    var t = JSON.parse(r.response)
                      , o = [];
                    contactsFromApi = t;
                    for (var l = 0; l < t.length; l++)
                        o.push(t[l].firstName + " " + t[l].lastName + "  " + t[l].city + ", " + t[l].state);
                    for (var u = function(t) {
                        if (-1 !== o[t].toUpperCase().indexOf(s.toUpperCase())) {
                            a = document.createElement("DIV");
                            var r = o[t].toUpperCase().indexOf(s.toUpperCase())
                              , l = o[t].substring(0, r)
                              , u = o[t].substring(r, r + s.length)
                              , c = o[t].substring(r + s.length);
                            a.innerHTML = l + "<strong>" + u + "</strong>" + c,
                            a.innerHTML += "<input type='hidden' value='" + o[t] + "'>",
                            a.addEventListener("click", function(n) {
                                e.value = this.getElementsByTagName("input")[0].value,
                                i(),
                                setCurrentContact(contactsFromApi[t])
                            }),
                            n.appendChild(a)
                        }
                    }, c = 0; c < o.length; c++)
                        u(c)
                }
            }
            ,
            r.send()
        }
    }
    function n(e) {
        return e ? (a(e),
        o >= e.length && (o = 0),
        0 > o && (o = e.length - 1),
        void e[o].classList.add("autocomplete-active")) : !1
    }
    function a(e) {
        for (var t = 0; t < e.length; t++)
            e[t].classList.remove("autocomplete-active")
    }
    function i(t) {
        for (var n = document.getElementsByClassName("autocomplete-items"), a = 0; a < n.length; a++)
            t != n[a] && t != e && n[a].parentNode.removeChild(n[a])
    }
    if (e) {
        var o;
        $(e).keyup($.debounce(500, t)),
        e.addEventListener("keydown", function(e) {
            var t = document.getElementById(this.id + "autocomplete-list");
            t && (t = t.getElementsByTagName("div")),
            40 == e.keyCode ? (o++,
            n(t)) : 38 == e.keyCode ? (o--,
            n(t)) : 13 == e.keyCode && (e.preventDefault(),
            o > -1 && t && t[o].click())
        }),
        document.addEventListener("click", function(e) {
            i(e.target)
        })
    }
}
"use strict";
function hideCoachConfirmation() {
    if (sectionCoach) {
        var e = sectionCoach.querySelector(".lookup-confirm");
        e && e.classList.remove("show")
    }
}
function clearInputValue() {
    if (sectionCoach) {
        var e = sectionCoach.querySelector("#lookupCoachName")
          , t = sectionCoach.querySelector("#lookupCoachId");
        e && t && (e.value = "",
        t.value = "")
    }
}
function hideCoachLookupInputs() {
    sectionCoach && (clearNonMemberCoachInputs(),
    $(".club-coach__not-member-container").hide())
}
function removeCoach(e) {
    e.preventDefault();
    var t = sectionCoach.querySelector(".list__container")
      , a = e.target.parentNode;
    t.classList.add("list__container--modified"),
    a.classList.add("list-item--fade-out"),
    setTimeout(function() {
        a.style.display = "absolute",
        a.parentNode.style.display = "none"
    }, 250)
}
function findParentList(e) {
    return e && e.parentNode.classList.contains("list--lookup") ? e.parentNode : findParentList(e.parentNode)
}
function findParentCoachItem(e) {
    return e && e.parentNode.classList.contains("list-item") ? e.parentNode : findParentCoachItem(e.parentNode)
}
function hideCoachNonMemberLookupInputs() {
    if (sectionCoach) {
        var e = document.querySelector(".coach-details__nonmember");
        e && (e.classList.remove("show"),
        $("#addCoachNonMemberBtn").show(),
        $("#cancelAddCoachNonMemberBtn").hide())
    }
}
function addCoach(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : !1
      , a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : !0;
    console.log(e, "coach");
    var o = document.querySelector(".section#coach .list__container .row");
    if (hideCoachConfirmation(),
    $(".coach-list__header").show(),
    $("#listCoachSettings").show(),
    document.getElementById("saveCoach").disabled = !1,
    o) {
        var c = document.createElement("div");
        c.className = "col-xs-12 col-sm-6 col-md-4";
        var n = document.createElement("div");
        t ? n.className = "list-item list-item--fade-out" : n.className = "list-item list-item--fade-out list-item--new";
        var r = document.createElement("button");
        r.innerHTML = "Remove",
        r.classList.add("list-item__delete"),
        r.addEventListener("click", removeCoach);
        var i = document.createElement("div");
        i.classList.add("coach-name"),
        i.innerHTML = e.firstName + " " + e.lastName;
        var s = document.createElement("div");
        s.classList.add("coach-phone"),
        s.innerHTML = e.phone;
        var l = document.createElement("div");
        l.classList.add("coach-email"),
        l.innerHTML = e.email;
        var d = document.createElement("div");
        d.classList.add("coach-location"),
        d.innerHTML = e.city + ", " + e.state;
        var h = document.createElement("div");
        h.classList.add("coach-id");
        var u = document.createElement("span");
        u.className = "coach-id__value",
        e.swimmerId.startsWith("L") && (h.style.display = "none"),
        u.innerHTML = e.swimmerId,
        h.innerHTML = "Member ID: ",
        h.appendChild(u);
        var m = "true";
        "undefined" != typeof e.validated && (m = e.validated);
        var C = document.createElement("div");
        C.classList.add("coach-validated"),
        C.innerHTML = "Account Pending";
        var v = document.createElement("div");
        v.classList.add("coach-certification"),
        v.setAttribute("style", "visibility:hidden; margin:0; height:1px;");
        var p = document.createElement("span");
        p.className = "coach-certification__value",
        p.innerHTML = e.certifications || "",
        v.innerHTML = coachCertText + " ",
        v.appendChild(p);
        var f = document.createElement("div");
        f.classList.add("coach-id__cert"),
        f.innerHTML = "USMS-Certified Coach ";
        var y = document.createElement("div");
        y.classList.add("coach-id__cert"),
        y.innerHTML = "" + altsCertInstructorText;
        var S = document.createElement("div");
        S.classList.add("head-coach__select");
        var L = document.createElement("input");
        L.type = "radio",
        L.name = "Head Coach",
        L.classList.add("radio-input--coach-list");
        var w = document.createElement("label");
        if (w.classList.add("radio-label--coach-list"),
        w.innerHTML = "" + headCoachText,
        S.appendChild(w),
        w.appendChild(L),
        n.appendChild(r),
        a && !e.swimmerId.startsWith("L") && n.appendChild(S),
        m || n.appendChild(C),
        n.appendChild(i),
        n.appendChild(s),
        n.appendChild(l),
        a && n.appendChild(d),
        a && n.appendChild(h),
        a && "undefined" != typeof e.certifications) {
            var q = e.certifications.split(",");
            ["1", "2", "3", "4", "7", "Level 1", "Level 2", "Level 3", "Level 4", "Level 7"].some(function(e) {
                return q.includes(e)
            }) && n.appendChild(f),
            (e.certifications.includes("Level 6") || e.certifications.includes("6")) && n.appendChild(y),
            n.appendChild(v)
        }
        var _ = document.createElement("div");
        _.classList.add("coach-title"),
        _.innerHTML = e.headCoach ? "HEAD COACH" : "COACH",
        n.appendChild(_),
        a && L.addEventListener("change", function(e) {
            for (var t = o.querySelectorAll(".list-item > .coach-title"), a = 0; a < t.length; a += 1)
                t[a].innerHTML = "COACH";
            var c = findParentCoachItem(e.target);
            c && (c.querySelector(".coach-title").innerHTML = e.target.checked ? "HEAD COACH" : "COACH")
        }),
        c.appendChild(n),
        o.appendChild(c),
        setTimeout(function() {
            n.classList.remove("list-item--fade-out")
        }, 250),
        latestCoach = null
    }
}
function checkCoachData(e) {
    if (e && e.length > 0) {
        var t = e.some(function(e) {
            return e.isMember
        })
          , a = e.some(function(e) {
            return !e.isMember
        });
        if (document.querySelector(".section-coach").classList.add("hasData"),
        t) {
            var o = document.querySelector(".section#coach .list__container");
            $(o).find(".coach-list__header").show(),
            $(o).find(".list__controls--settings").show()
        }
        if (a) {
            var c = document.querySelector(".section#coach .list__container--non-member");
            $(c).find(".coach-list__header").show(),
            $(c).find(".list__controls--settings").show()
        }
    } else
        document.querySelector(".section-coach").classList.remove("hasData"),
        $(".coach-list__header").hide(),
        $(sectionCoach).find(".list__controls--settings").hide()
}
function removeCurrentCoaches() {
    var e = document.querySelectorAll(".section#coach .list__container .row,.section#coach .list__container--non-member .row");
    if (e)
        for (var t = 0; t < e.length; t += 1) {
            var a = e[t].querySelectorAll(".list-item");
            if (a)
                for (; e[t].firstChild; )
                    e[t].removeChild(e[t].firstChild)
        }
}
function getCurrentCoaches() {
    var e = getUrlParams("clubId");
    if ("undefined" != typeof e && e) {
        removeCurrentCoaches();
        var t = new XMLHttpRequest;
        t.open("GET", "/apis/v1/clubweb/coaches/" + e, !0),
        t.withCredentials = !0,
        t.onload = function() {
            if (200 === t.status) {
                var e = JSON.parse(t.response);
                if (e.error && !e.data)
                    showErrorModal(e.error);
                else {
                    setGoldClubFlag(e.data);
                    for (var a = 0; a < e.data.length; a += 1)
                        addCoach(e.data[a], !0, e.data[a].isMember);
                    checkCoachData(e.data)
                }
            } else
                showErrorModal("Error updating coaches")
        }
        ,
        t.send()
    }
}
function editCoach() {
    setSectionInputStatus(sectionCoach, !1)
}
function cancelCoachList() {
    var e = sectionCoach.querySelector(".list")
      , t = sectionCoach.querySelectorAll(".list-item--fade-out");
    if (t.length >= 1)
        for (var a = 0; a < t.length; a += 1)
            t[a].classList.remove("list-item--fade-out");
    setTimeout(function() {
        for (var e = 0; e < t.length; e += 1)
            t[e].parentNode.style.display = "block"
    }, 250),
    e.classList.remove("edit-list"),
    document.getElementById("saveCoach").disabled = !1
}
function cancelCoach() {
    setSectionInputStatus(sectionCoach, !0),
    cancelCoachList(),
    clearInputValue();
    var e = sectionCoach.querySelectorAll(".list-item--new");
    if (e)
        for (var t = 0; t < e.length; t += 1)
            e[0].parentNode.removeChild(e[0])
}
function editCoachList() {
    for (var e = document.querySelectorAll(".section#coach .list"), t = 0; t < e.length; t += 1)
        e[0].classList.contains("edit-list") ? (e[0].classList.remove("edit-list"),
        cancelCoachList(),
        document.getElementById("saveCoach").disabled = !1) : (e[0].classList.add("edit-list"),
        $("#saveCoachList").show(),
        document.getElementById("saveCoach").disabled = !0)
}
function getCoaches() {
    var e = []
      , t = document.querySelectorAll(".section#coach .list__container .row,.section#coach .list__container--non-member .row");
    if (t)
        for (var a = 0; a < t.length; a += 1) {
            var o = t[a].querySelectorAll(".list-item");
            if (o)
                for (var c = 0; c < o.length; c += 1) {
                    var n = o[c]
                      , r = null !== n.querySelector(".coach-id__value")
                      , i = n.querySelector('input[type="radio"]') ? n.querySelector('input[type="radio"]').checked : !1;
                    if (r) {
                        var s = n.querySelector(".coach-certification__value")
                          , l = "";
                        null != s && (l = n.querySelector(".coach-certification__value").innerHTML),
                        e.push({
                            firstName: n.querySelector(".coach-name").innerHTML.split(" ")[0].trim(),
                            lastName: n.querySelector(".coach-name").innerHTML.split(" ")[1].trim(),
                            phone: n.querySelector(".coach-phone").innerHTML,
                            email: n.querySelector(".coach-email").innerHTML,
                            city: n.querySelector(".coach-location").innerHTML.split(",")[0].trim(),
                            state: n.querySelector(".coach-location").innerHTML.split(",")[1].trim(),
                            swimmerId: n.querySelector(".coach-id__value").innerHTML,
                            certifications: l,
                            headCoach: i,
                            isMember: r
                        })
                    } else
                        e.push({
                            firstName: n.querySelector(".coach-name").innerHTML.split(" ")[0].trim(),
                            lastName: n.querySelector(".coach-name").innerHTML.split(" ")[1].trim(),
                            phone: n.querySelector(".coach-phone").innerHTML,
                            email: n.querySelector(".coach-email").innerHTML,
                            certifications: null,
                            headCoach: !1,
                            isMember: r
                        })
                }
        }
    return e
}
function clearNonMemberCoachInputs() {
    document.querySelector("#newCoachFirstName").value = "",
    setInputStatus(document.querySelector("#newCoachFirstName"), !0),
    document.querySelector("#newCoachLastName").value = "",
    setInputStatus(document.querySelector("#newCoachLastName"), !0),
    document.querySelector("#newCoachEmailPrimary").value = "",
    setInputStatus(document.querySelector("#newCoachEmailPrimary"), !0),
    document.querySelector("#newCoachPhonePrimary").value = "",
    setInputStatus(document.querySelector("#newCoachPhonePrimary"), !0),
    document.querySelector("#newCoachCity").value = "",
    setInputStatus(document.querySelector("#newCoachCity"), !0),
    $("#newCoachState").val("Select State")
}
function showCoachConfirmation() {
    if (sectionCoach) {
        var e = sectionCoach.querySelector(".lookup-confirm");
        e && e.classList.add("show")
    }
}
function setCurrentCoach(e) {
    if (latestCoach = e,
    sectionCoach) {
        var t = sectionCoach.querySelector(".lookup-confirm--name");
        t && (t.innerHTML = e.firstName + " " + e.lastName)
    }
    showCoachConfirmation()
}
function AlreadyAHeadCoach() {
    for (var e = sectionCoach.querySelectorAll(".coach-title"), t = 0; t < e.length; t += 1)
        if ("head coach" === e[t].innerHTML.toLowerCase())
            return !0;
    return !1
}
function ShowHeadCoachError() {
    sectionCoach.querySelector(".coach-error").classList.add("coach-error--shown"),
    sectionCoach.querySelector(".coach-error > .help-block").classList.add("has-error")
}
function HideHeadCoachError() {
    sectionCoach.querySelector(".coach-error").classList.remove("coach-error--shown"),
    sectionCoach.querySelector(".coach-error > .help-block").classList.remove("has-error")
}
function setTitle(e, t) {
    e.preventDefault(),
    null !== latestCoach && ("head-coach" === t && AlreadyAHeadCoach() ? (ShowHeadCoachError(),
    setTimeout(function() {
        HideHeadCoachError()
    }, 5e3)) : (HideHeadCoachError(),
    latestCoach.headCoach = "head-coach" === t,
    hideCoachConfirmation(),
    clearInputValue(),
    addCoach(latestCoach)))
}
function getCoachById(e) {
    var t = new XMLHttpRequest;
    t.open("POST", "/apis/v1/coaches/id/" + e, !0),
    t.setRequestHeader("Content-type", "application/json;charset=UTF-8"),
    t.withCredentials = !0,
    t.onload = function() {
        if (200 === t.status) {
            var e = JSON.parse(t.response);
            return coachesFromApi.push(e.firstName + " " + e.lastName + " " + e.city + " " + e.state),
            coachesFromApi
        }
        return showErrorModal("Error retrieving coach information"),
        null
    }
    ,
    t.send()
}
function getCoachesByName(e) {
    var t = new XMLHttpRequest;
    t.open("POST", "/apis/v1/coaches/name/" + e, !0),
    t.onload = function() {
        200 !== t.status && showErrorModal("Error getting coaches")
    }
    ,
    t.send()
}
function postCoachUpdate(e) {
    var t = getCoaches();
    checkCoachData(t);
    var a = new XMLHttpRequest;
    a.open("POST", "/apis/v1/clubweb/update-coaches", !0),
    a.setRequestHeader("Content-type", "application/json;charset=UTF-8"),
    a.withCredentials = !0,
    a.onload = function() {
        if (hideLoadingOverlay(),
        200 === a.status) {
            var o = JSON.parse(a.response)
              , c = e.querySelector(".list__container .row, .list__container--non-member .row")
              , n = c.querySelectorAll(".list-item")
              , r = c.querySelectorAll(".list-item--fade-out");
            o.error ? showErrorModal(o.error) : (e.classList.remove("edit-list"),
            document.getElementById("saveCoach").disabled = !1,
            n.length === r.length && setTimeout(function() {
                $(e).find(".coach-list__header").hide()
            }, 250),
            0 === t.length ? $("#coach").removeClass("hasData") : $("#coach").addClass("hasData"))
        } else
            showErrorModal("Error saving coaches")
    }
    ,
    a.send(JSON.stringify({
        clubId: getUrlParams("clubId"),
        coaches: t
    }))
}
function saveCoachList(e) {
    showLoadingOverlay();
    for (var t = findParentList(e.target), a = t.querySelectorAll(".list-item--new"), o = 0; o < a.length; o += 1)
        a[o].classList.remove("list-item--new");
    for (var c = t.querySelectorAll(".list-item--fade-out"), n = 0; n < c.length; n += 1)
        c[n].parentNode.parentNode.removeChild(c[n].parentNode);
    postCoachUpdate(t)
}
function saveCoach() {
    setSectionInputStatus(sectionCoach, !0),
    showLoadingOverlay();
    for (var e = sectionCoach.querySelectorAll(".list-item--new"), t = 0; t < e.length; t += 1)
        e[t].classList.remove("list-item--new");
    for (var a = sectionCoach.querySelectorAll(".list-item--fade-out"), o = 0; o < a.length; o += 1)
        a[o].parentNode.parentNode.removeChild(a[o].parentNode);
    var c = getCoaches();
    checkCoachData(c),
    0 === c.length ? $("#coach").removeClass("hasData") : $("#coach").addClass("hasData");
    var n = new XMLHttpRequest;
    n.open("POST", "/apis/v1/clubweb/update-coaches", !0),
    n.setRequestHeader("Content-type", "application/json;charset=UTF-8"),
    n.withCredentials = !0,
    n.onload = function() {
        if (hideLoadingOverlay(),
        200 === n.status) {
            sectionCoach.classList.remove("isEdit");
            var e = JSON.parse(n.response);
            e.error ? showErrorModal(e.error) : (cancelCoach(),
            closeSaveModal(),
            nextSection ? ($(nextSection).find(".section__content").collapse("show"),
            nextSection = null) : (setSectionInputStatus(document.querySelector("#club-location"), !1),
            $("#club-location .section__content").collapse("show")))
        } else
            showErrorModal("Error saving coaches")
    }
    ,
    n.send(JSON.stringify({
        clubId: getUrlParams("clubId"),
        coaches: c
    }))
}
function validateNotMemberCoachForm() {
    var e = document.querySelector("#newCoachFirstName")
      , t = document.querySelector("#newCoachLastName")
      , a = document.querySelector("#newCoachPhonePrimary")
      , o = document.querySelector("#newCoachEmailPrimary")
      , c = document.querySelector("#newCoachCity")
      , n = document.querySelector("#newCoachState");
    validateField(e),
    validateField(t),
    validateField(a),
    validateField(o),
    validateField(c),
    validateField(n);
    var r = document.querySelector(".club-coach__not-member-container");
    return sectionContainsErrors(r) ? (window.scroll(0, FindPos(r.querySelectorAll("span.help-block.has-error")[0])),
    !1) : !0
}
function handleAddCoachButton() {
    if (validateNotMemberCoachForm()) {
        showLoadingOverlay();
        var e = document.querySelector("#newCoachEmailPrimary").value;
        if (checkContactExists(e)) {
            var t = buildCoachContact();
            showLoadingOverlay(),
            addNewNonmemberCoach(t, handlePostNonmemberAddSuccess)
        } else
            hideLoadingOverlay()
    }
}
function showNewCoachInputs() {
    $(".club-coach__not-member-container").show(),
    document.querySelector(".club-coach__not-member-container").style.visibility = "visible",
    clearNonMemberCoachInputs()
}
function buildCoachContact() {
    var e = document.querySelector("#newCoachFirstName")
      , t = document.querySelector("#newCoachLastName")
      , a = document.querySelector("#newCoachPhonePrimary")
      , o = document.querySelector("#newCoachEmailPrimary")
      , c = document.querySelector("#newCoachCity")
      , n = document.querySelector("#newCoachState")
      , r = {
        swimmerId: "",
        firstName: e.value,
        lastName: t.value,
        email: o.value,
        phone: a.value,
        city: c.value,
        state: n.value,
        validated: !1
    };
    return r
}
function addNewNonmemberCoach(e, t) {
    var a = new XMLHttpRequest
      , o = new FormData;
    o.append("firstName", e.firstName),
    o.append("lastName", e.lastName),
    o.append("email", e.email),
    o.append("phoneNumber", e.phone),
    o.append("city", e.city),
    o.append("state", e.state),
    a.open("POST", "/apis/v1/account/club/", !0),
    a.withCredentials = !0,
    a.onload = function() {
        var o = a.status;
        if (200 === o) {
            var c = JSON.parse(a.response);
            c.data ? (e.swimmerId = c.data,
            t(e)) : (showErrorModal(c.error),
            hideLoadingOverlay())
        } else
            showErrorModal("Error saving club information"),
            hideLoadingOverlay()
    }
    ,
    a.send(o)
}
function handlePostNonmemberAddSuccess(e) {
    hideLoadingOverlay(),
    console.log(e),
    $(".club-coach__not-member-container").hide(),
    e.validated = !1,
    addCoach(e, !0, !0)
}
var coachesFromApi = []
  , latestCoach = null
  , sectionCoach = document.querySelector(".section .section-coach");
!function() {
    $('input[name="coachPhone"]').mask("000-000-0000"),
    $('input[name="newCoachPhonePrimary"]').mask("000-000-0000"),
    getCurrentCoaches(),
    autocompleteCoachById(document.getElementById("lookupCoachId")),
    autocompleteCoachesByName(document.getElementById("lookupCoachName"))
}();
"use strict";
function toggleContactSection(e, t) {
    "show" === e ? (document.querySelector(".club-contact__" + t + "-container").style.display = "block",
    document.querySelector(".club-contact__" + t + "-container").style.visibility = "visible") : (document.querySelector(".club-contact__" + t + "-container").style.display = "none",
    document.querySelector(".club-contact__" + t + "-container").style.visibility = "hidden")
}
function getContact() {
    var e = null
      , t = document.querySelector(".section#club-contact .list__container .row");
    if (t) {
        var c = t.querySelectorAll(".list-item");
        if (c)
            for (var n = 0; n < c.length; n += 1)
                e = {
                    firstName: c[n].querySelector(".contact-name").innerHTML.split(" ")[0].trim(),
                    city: c[n].querySelector(".contact-location") ? c[n].querySelector(".contact-location").innerHTML.split(",")[0] : "",
                    state: c[n].querySelector(".contact-location") ? c[n].querySelector(".contact-location").innerHTML.split(",")[1].trim() : "",
                    lastName: c[n].querySelector(".contact-name").innerHTML.split(" ")[1].trim(),
                    phone: c[n].querySelector(".contact-phone").innerHTML,
                    email: c[n].querySelector(".contact-email").innerHTML,
                    swimmerId: c[n].querySelector(".contact-id__value") ? c[n].querySelector(".contact-id__value").innerHTML : ""
                }
    }
    return e
}
function editContact() {
    setSectionInputStatus(sectionClubContact, !1),
    sectionClubContact.classList.add("isEdit")
}
function handleBlur(e) {
    validateField(e)
}
function cancelContact() {
    setSectionInputStatus(sectionClubContact, !0),
    sectionClubContact.classList.remove("isEdit")
}
function hideContactConfirmation() {
    if (sectionClubContact) {
        var e = sectionClubContact.querySelector(".lookup-confirm");
        e && (document.querySelector("#lookupContactName").value = "",
        e.classList.remove("show"))
    }
}
function removeContact(e) {
    e.preventDefault();
    var t = sectionClubContact.querySelector(".list__container");
    t.classList.add("list__container--modified");
    for (var c = sectionClubContact.querySelectorAll(".list-item__delete"), n = function(e) {
        var t = c[e].parentNode;
        t.classList.add("list-item--fade-out"),
        setTimeout(function() {
            $(".club-privacy").hide(),
            t.style.display = "absolute",
            t.parentNode.style.display = "none"
        }, 250)
    }, o = 0; o < c.length; o += 1)
        n(o)
}
function showContactConfirmation() {
    if (sectionClubContact) {
        var e = sectionClubContact.querySelector(".lookup-confirm");
        e && e.classList.add("show")
    }
}
function setCurrentContact(e) {
    if (latestContact = e,
    sectionClubContact) {
        var t = sectionClubContact.querySelector(".lookup-confirm--name");
        t && (t.innerHTML = "Add " + e.firstName + " " + e.lastName)
    }
    showContactConfirmation()
}
function clearContactInputs() {
    document.querySelector("#newContactFirstName").value = "",
    setInputStatus(document.querySelector("#newContactFirstName"), !0),
    document.querySelector("#newContactLastName").value = "",
    setInputStatus(document.querySelector("#newContactLastName"), !0),
    document.querySelector("#newContactEmailPrimary").value = "",
    setInputStatus(document.querySelector("#newContactEmailPrimary"), !0),
    document.querySelector("#newContactPhonePrimary").value = "",
    setInputStatus(document.querySelector("#newContactPhonePrimary"), !0),
    document.querySelector("#newContactCity").value = "",
    setInputStatus(document.querySelector("#newContactCity"), !0),
    $("#newContactState").val("Select State")
}
function hideContactLookupInputs() {
    $(".club-contact__other-container").hide(),
    $(".club-contact__not-member-container").hide(),
    $(".club-contact__add-new").hide(),
    clearContactInputs(),
    hideContactConfirmation()
}
function showNewContactInputs() {
    $(".club-contact__not-member-container").show(),
    document.querySelector(".club-contact__not-member-container").style.visibility = "visible"
}
function cancelContactList() {
    var e = sectionClubContact.querySelector(".list")
      , t = sectionClubContact.querySelectorAll(".list-item--fade-out");
    if (t.length >= 1)
        for (var c = 0; c < t.length; c += 1)
            t[c].classList.remove("list-item--fade-out");
    setTimeout(function() {
        for (var e = 0; e < t.length; e += 1)
            t[e].parentNode.style.display = "block",
            $(".club-privacy").show()
    }, 250),
    e.classList.remove("edit-list"),
    document.getElementById("saveContact").disabled = !1
}
function editContactList() {
    var e = document.querySelector(".section#club-contact .list");
    e.classList.contains("edit-list") ? (e.classList.remove("edit-list"),
    cancelContactList(),
    document.getElementById("saveContact").disabled = !1) : (e.classList.add("edit-list"),
    $("#saveContactList").show(),
    document.getElementById("saveContact").disabled = !0);
    var t = sectionClubContact.querySelector('input[name="ContactType"]:checked');
    getContact() || "contactOther" !== t.value || (toggleContactSection("show", "other"),
    toggleContactSection("hide", "not-member"),
    document.querySelector("#lookupContactName").focus())
}
function removeCurrentContacts() {
    var e = document.querySelector(".section#club-contact .list__container .row");
    if (e) {
        var t = e.querySelectorAll(".list-item");
        if (t)
            for (; e.firstChild; )
                e.removeChild(e.firstChild)
    }
}
function uncheckContactTypeRadios() {
    radioContactTypeCurrent.checked = !1,
    radioContactTypeOther.checked = !1
}
function confirmCurrentContact(e) {
    document.querySelector("#confirmCurrentContact").style.display = "none",
    document.querySelector("#saveContact").disabled = !1,
    $(".contact-type-form").hide(),
    $('.club-privacy input[type="checkbox"]').removeAttr("checked"),
    $(".club-privacy").show(),
    $(".contact-list__header").show()
}
function addContact(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : ""
      , c = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : !0
      , n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : !1;
    latestContact = null,
    c && removeCurrentContacts();
    var o = document.querySelector(".section#club-contact .list__container .row");
    if (hideContactLookupInputs(),
    $("#listContactSettings").show(),
    o) {
        var a = document.createElement("div");
        a.className = "col-xs-12 col-sm-6 col-md-4 contact-column";
        var r = document.createElement("div");
        n ? r.className = "list-item list-item--fade-out" : r.className = "list-item list-item--fade-out list-item--new";
        var i = document.createElement("button");
        i.innerHTML = "Remove",
        i.classList.add("list-item__delete"),
        i.addEventListener("click", removeContact);
        var l = document.createElement("div");
        l.classList.add("contact-name"),
        l.innerHTML = e.firstName + " " + e.lastName;
        var u = document.createElement("div");
        u.classList.add("contact-phone"),
        u.innerHTML = e.phone;
        var d = document.createElement("div");
        d.classList.add("contact-email"),
        d.innerHTML = e.email;
        var s = document.createElement("div");
        s.classList.add("contact-location"),
        s.innerHTML = e.city + ", " + e.state;
        var m = document.createElement("div");
        m.classList.add("coach-validated"),
        m.innerHTML = "Account Pending";
        var y = GetBoolean(e.isMember)
          , C = document.createElement("div");
        C.classList.add("contact-id"),
        y || (C.style.display = "none");
        var v = document.createElement("input");
        v.type = "hidden",
        v.className = "contact-isMember",
        v.value = e.isMember,
        r.appendChild(v);
        var h = document.createElement("span");
        if (h.className = "contact-id__value",
        h.innerHTML = e.swimmerId,
        C.innerHTML = memberIdText + " ",
        C.appendChild(h),
        r.appendChild(i),
        "" !== t) {
            var p = document.createElement("div");
            p.classList.add("contact-header"),
            p.innerHTML = "" + t,
            r.appendChild(p)
        }
        var S = !0;
        "undefined" != typeof e.validated && (S = GetBoolean(e.validated)),
        S || r.appendChild(m),
        setSubmitStatus(S),
        r.appendChild(l),
        e.city && e.state && r.appendChild(s),
        r.appendChild(u),
        r.appendChild(d),
        r.appendChild(C),
        a.appendChild(r),
        o.appendChild(a),
        setTimeout(function() {
            r.classList.remove("list-item--fade-out")
        }, 250),
        !S || unvalidatedContactOnPage() ? document.querySelector(".contact-list__awaiting__message").style.display = "block" : document.querySelector(".contact-list__awaiting__message").style.display = "none"
    }
}
function addNewNonmemberContact(e) {
    var t = new XMLHttpRequest
      , c = new FormData;
    c.append("firstName", e.firstName),
    c.append("lastName", e.lastName),
    c.append("email", e.email),
    c.append("phoneNumber", e.phone),
    c.append("city", e.city),
    c.append("state", e.state),
    t.open("POST", "/apis/v1/account/club/", !0),
    t.withCredentials = !0,
    t.onload = function() {
        hideLoadingOverlay();
        var c = t.status;
        if (200 === c) {
            var n = JSON.parse(t.response);
            n.data ? (e.swimmerId = n.data,
            addContact(e),
            $(".list__header").show(),
            $(".contact-type-form").hide(),
            showNewContact_RecentlyAdded(),
            document.querySelector("#saveContact").disabled = !1,
            $('.club-privacy input[type="checkbox"]').removeAttr("checked"),
            $(".club-privacy").show()) : showErrorModal(n.error)
        } else
            showErrorModal("Error saving club information")
    }
    ,
    t.send(c)
}
function validateNotMemberForm() {
    var e = document.querySelector("#newContactFirstName")
      , t = document.querySelector("#newContactLastName")
      , c = document.querySelector("#newContactPhonePrimary")
      , n = document.querySelector("#newContactEmailPrimary")
      , o = document.querySelector("#newContactCity")
      , a = document.querySelector("#newContactState");
    validateField(e),
    validateField(t),
    validateField(c),
    validateField(n),
    validateField(o),
    validateField(a);
    var r = document.querySelector(".club-contact__not-member-container");
    return sectionContainsErrors(r) ? (window.scroll(0, FindPos(r.querySelectorAll("span.help-block.has-error")[0])),
    !1) : !0
}
function buildContact() {
    var e = document.querySelector("#newContactFirstName")
      , t = document.querySelector("#newContactLastName")
      , c = document.querySelector("#newContactPhonePrimary")
      , n = document.querySelector("#newContactEmailPrimary")
      , o = document.querySelector("#newContactCity")
      , a = document.querySelector("#newContactState")
      , r = {
        swimmerId: "",
        firstName: e.value,
        lastName: t.value,
        email: n.value,
        phone: c.value,
        city: o.value,
        state: a.value,
        validated: !1,
        isMember: !1
    };
    hideContactLookupInputs(),
    addNewNonmemberContact(r)
}
function checkContactExists(e) {
    showLoadingOverlay();
    var t = new XMLHttpRequest;
    return t.open("GET", "/apis/v1/account/swimmerexists?email=" + e, !0),
    t.withCredentials = !0,
    t.onload = function() {
        if (200 === t.status) {
            var e = JSON.parse(t.response);
            return e.error ? (hideLoadingOverlay(),
            showErrorModal(e.error),
            !1) : e.data ? (hideLoadingOverlay(),
            !1) : !0
        }
        return hideLoadingOverlay(),
        showErrorModal("" + errorSavingContactText),
        !1
    }
    ,
    t.send(),
    !0
}
function handleAddContactButton() {
    if (validateNotMemberForm()) {
        var e = document.querySelector("#newContactEmailPrimary").value;
        checkContactExists(e) && buildContact()
    }
}
function checkInitContactData() {
    document.querySelector("#confirmCurrentContact").style.display = "none";
    var e = sectionClubContact.querySelector('input[name="ContactType"]:checked');
    if (!e)
        return document.querySelector(".section#club-contact").classList.remove("hasData"),
        $(".contact-list__header").hide(),
        void $("#listContactSettings").hide();
    if (e.value) {
        var t = {
            swimmerId: document.querySelector("#contactSwimmerId").value,
            firstName: document.querySelector("#contactFirstName").value,
            lastName: document.querySelector("#contactLastName").value,
            email: document.querySelector("#contactEmail").value,
            phone: document.querySelector("#contactPhone").value,
            validated: document.querySelector("#contactValidated").value,
            isMember: document.querySelector("#contactIsMember").value,
            city: document.querySelector("#contactCity").value,
            state: document.querySelector("#contactState").value
        }
          , c = GetBoolean(t.validated);
        if (c ? addContact(t, "", !1) : addContact(t, "" + awaitingContactText, !1),
        !c) {
            var n = {
                swimmerId: document.querySelector("#currentSwimmerId").value,
                firstName: document.querySelector("#currentFirstName").value,
                lastName: document.querySelector("#currentLastName").value,
                email: document.querySelector("#currentEmail").value,
                phone: document.querySelector("#currentPhone").value,
                validated: document.querySelector("#currentValidated").value,
                isMember: document.querySelector("#currentIsMember").value,
                city: document.querySelector("#currentCity").value,
                state: document.querySelector("#currentState").value
            };
            addContact(n, "" + currentContactText, !1)
        }
        document.querySelector(".section#club-contact").classList.add("hasData"),
        $(".contact-list__header").show(),
        $(".contact-type-form").hide(),
        $("#listContactSettings").show(),
        document.querySelector("#saveContact").disabled = !1
    } else
        document.querySelector(".section#club-contact").classList.remove("hasData"),
        $(".contact-list__header").hide(),
        $("#listContactSettings").hide(),
        uncheckContactTypeRadios(),
        $(".contact-type-form").show()
}
function checkContactDataValid() {
    var e = sectionClubContact.querySelector('input[name="ContactType"]:checked');
    e.value ? (document.querySelector(".section#club-contact").classList.add("hasData"),
    $(".contact-list__header").show(),
    $("#listContactSettings").show()) : (document.querySelector(".section#club-contact").classList.remove("hasData"),
    $(".contact-list__header").hide(),
    $("#listContactSettings").hide())
}
function setContactTitle(e) {
    e.preventDefault(),
    $(".contact-type-form").hide(),
    $(".club-contact__add-new").hide(),
    hideContactConfirmation(),
    addContact(latestContact),
    $(".contact-list__header").show();
    var t = document.querySelector(".section#club-contact .list");
    t.classList.remove("edit-list"),
    $('.club-privacy input[type="checkbox"]').removeAttr("checked"),
    $(".club-privacy").show(),
    document.querySelector("#saveContact").disabled = !1
}
function handleContactType(e) {
    switch (validateField(radioContactTypeCurrent),
    clearContactInputs(),
    document.querySelector("#lookupContactName").value = "",
    e.target.value) {
    case "contactCurrent":
        if ($(".contact-list__header").hide(),
        toggleContactSection("hide", "other"),
        toggleContactSection("hide", "not-member"),
        document.querySelector("#confirmCurrentContact").style.display = "block",
        document.querySelector(".club-contact__add-new").style.display = "none",
        !document.querySelector("#currentSwimmerId").value)
            return document.querySelector("#newContactFirstName").value = document.querySelector("#currentFirstName").value,
            document.querySelector("#newContactLastName").value = document.querySelector("#currentLastName").value,
            document.querySelector("#newContactEmailPrimary").value = document.querySelector("#currentEmail").value,
            document.querySelector("#newContactPhonePrimary").value = document.querySelector("#currentPhone").value,
            document.querySelector("#currentCity").value && document.querySelector("#currentState") && (document.querySelector("#newContactCity").value = document.querySelector("#currentCity").value,
            document.querySelector("#newContactState").value = document.querySelector("#currentState").value),
            void (document.querySelector("#newContactEmailPrimary").disabled = !0);
        var t = {
            firstName: document.querySelector("#currentFirstName").value,
            lastName: document.querySelector("#currentLastName").value,
            swimmerId: document.querySelector("#currentSwimmerId").value,
            email: document.querySelector("#currentEmail").value,
            phone: document.querySelector("#currentPhone").value,
            validated: document.querySelector("#currentValidated").value,
            city: document.querySelector("#currentCity").value,
            state: document.querySelector("#currentState").value,
            isMember: document.querySelector("#currentIsMember").value
        };
        setCurrentContact(t),
        addContact(t);
        break;
    case "contactOther":
        toggleContactSection("show", "other"),
        toggleContactSection("hide", "not-member"),
        document.getElementById("lookupContactName").focus(),
        document.querySelector("#confirmCurrentContact").style.display = "none",
        document.querySelector(".club-contact__add-new").style.display = "block"
    }
}
function handleContactConfirmation(e) {
    $("#modalContactConfirmation").modal("hide"),
    handleContactType(e)
}
function saveContactList() {
    for (var e = sectionClubContact.querySelectorAll(".list-item--new"), t = 0; t < e.length; t += 1)
        e[t].classList.remove("list-item--new");
    for (var c = sectionClubContact.querySelectorAll(".list-item--fade-out"), n = 0; n < c.length; n += 1)
        c[n].parentNode.parentNode.removeChild(c[n].parentNode);
    var o = document.querySelector(".section#club-contact .list");
    o.classList.remove("edit-list"),
    o.querySelector(".list__container").classList.remove("list__container--modified"),
    sectionClubContact.querySelectorAll(".list-item").length > 0 ? document.querySelector(".section#club-contact").classList.add("hasData") : (document.querySelector(".section#club-contact").classList.remove("hasData"),
    $(".contact-list__header").hide(),
    $("#listContactSettings").hide(),
    uncheckContactTypeRadios(),
    $(".contact-type-form").show())
}
function validateSectionContact() {
    return validateField(radioContactTypeCurrent),
    sectionContainsErrors(sectionClubContact) ? (hideLoadingOverlay(),
    window.scroll(0, FindPos(sectionClubContact.querySelectorAll("span.help-block.has-error")[0])),
    !1) : !!getContact()
}
function saveContact(e) {
    if (e.preventDefault(),
    showLoadingOverlay(),
    !validateSectionContact())
        return hideLoadingOverlay(),
        void showErrorModal("" + contactRequiredText);
    checkContactDataValid();
    var t = new XMLHttpRequest
      , c = new FormData
      , n = getContact();
    c.append("ContactSwimmerID", n.swimmerId),
    c.append("ContactFirstName", n.firstName),
    c.append("ContactLastName", n.lastName),
    c.append("ContactEmailPrimary", n.email.toLowerCase()),
    c.append("ContactPhonePrimary", n.phone),
    c.append("ContactCity", n.city),
    c.append("ContactState", n.state);
    var o = document.querySelector('input[type="radio"][name="ContactType"]:checked').value.replace("contact", "");
    c.append("ContactType", o),
    c.append("DisplayName", document.querySelector("#privacyName").checked),
    c.append("DisplayEmail", document.querySelector("#privacyEmail").checked),
    c.append("DisplayPhone", document.querySelector("#privacyPhone").checked);
    var a = getUrlParams("clubId");
    c.append("clubId", a),
    t.open("POST", "/apis/v1/clubweb/section/contact", !0),
    t.withCredentials = !0,
    t.onload = function() {
        if (hideLoadingOverlay(),
        200 === t.status) {
            var e = JSON.parse(t.response);
            if (e.error)
                showErrorModal(e.error);
            else if (setSectionInputStatus(document.querySelector("#club-contact"), !0),
            sectionClubContact.classList.remove("isEdit"),
            cancelContact(),
            nextSection)
                $(nextSection).find(".section__content").collapse("show"),
                nextSection = null;
            else {
                var c = document.querySelector("#regionalClub");
                c && c.checked && $("#club-contact .section__content").collapse("hide"),
                setSectionInputStatus(document.querySelector("#contact"), !1),
                $("#coach .section__content").collapse("show")
            }
        } else
            showErrorModal("" + errorSavingContactText)
    }
    ,
    t.send(c)
}
function showNewContact_RecentlyAdded() {
    showNewContactMessage(),
    $("#contact__recentlyadded").show(),
    hideNewContact_RecentlyAdded(),
    hideNewContact_RecentlyAdded()
}
function showNewContact_RecentlyAdded_Valid() {
    showNewContactMessage(),
    hideNewContact_RecentlyAdded(),
    $("#contact__recentlyadded-valid").show(),
    hideNewContact_RecentlyAdded()
}
function showNewContact_RecentlyAdded_Invalid() {
    showNewContactMessage(),
    hideNewContact_RecentlyAdded(),
    hideNewContact_RecentlyAdded(),
    $("#contact__recentlyadded-invalid").show()
}
function hideNewContact_RecentlyAdded() {
    $("#contact__recentlyadded").hide()
}
function hideNewContact_RecentlyAdded_Valid() {
    $("#contact__recentlyadded-valid").hide()
}
function hideNewContact_RecentlyAdded_Invalid() {
    $("#contact__recentlyadded-invalid").hide()
}
function showNewContactMessage() {
    $(".club-contact__current-message").show()
}
function handleCancelAddContact() {
    hideContactLookupInputs(),
    uncheckContactTypeRadios()
}
function GetBoolean(e) {
    var t = !0;
    return t = "boolean" == typeof e ? e : "true" === e.toLowerCase()
}
function unvalidatedContactOnPage() {
    var e = sectionClubContact.querySelector(".coach-validated");
    return !!e
}
var sectionClubContact = document.querySelector("#club-contact")
  , radioContactTypeCurrent = document.querySelector("#contactTypeCurrent")
  , radioContactTypeOther = document.querySelector("#contactTypeOther")
  , googlePlaceContact = null
  , contactsFromApi = []
  , latestContact = null;
!function() {
    radioContactTypeCurrent.addEventListener("click", handleContactType),
    radioContactTypeOther.addEventListener("click", handleContactType),
    autocompleteContactsByName(document.getElementById("lookupContactName")),
    $('input[name="ContactPhonePrimary"]').mask("000-000-0000"),
    $('input[name="NewContactPhonePrimary"]').mask("000-000-0000"),
    checkInitContactData()
}();
"use strict";
"use strict";
function urlExists(e, t) {
    try {
        fetch(e, {
            mode: "no-cors"
        }).then(function(e) {
            return t("opaque" === e.type),
            !0
        })["catch"](function(e) {
            return t(!1),
            !1
        })
    } catch (i) {
        return t(!1),
        !1
    }
    return !0
}
function handleRegionalClubChange(e) {
    var t = e.target.checked;
    isRegionalClub = t,
    setRegionalClubSections(t),
    t && $("#modalClubDetails").modal("show")
}
function setRegionalClubSections(e) {
    e ? (document.querySelector(".section#coach").classList.add("section--disabled"),
    document.querySelector(".section#club-location").classList.add("section--disabled"),
    document.querySelector(".section#gold-club").classList.add("section--disabled")) : (document.querySelector(".section#coach").classList.remove("section--disabled"),
    document.querySelector(".section#club-location").classList.remove("section--disabled"),
    document.querySelector(".section#gold-club").classList.remove("section--disabled"))
}
function checkDetailsData() {
    clubDetailsDescription && clubDetailsPractice && "" !== clubDetailsDescription.value && "" !== clubDetailsPractice.value && sectionClubDetails.classList.add("hasData")
}
function editDetails() {
    setSectionInputStatus(sectionClubDetails, !1),
    sectionClubDetails.classList.add("isEdit")
}
function UploadFile(e) {
    var t = e.target.files
      , i = this
      , a = $(this).val()
      , n = a.substring(a.lastIndexOf(".") + 1).toLowerCase()
      , s = t[0].size
      , l = e.target.dataset.fileSize;
    if (t && t.length > 0 && ("gif" === n || "jpg" === n || "jpeg" === n || "png" === n) && l >= s) {
        setInputStatus(i, !0);
        var o = new FileReader;
        if (o.onload = function(e) {
            i.parentNode.parentNode.querySelector(".upload-thumbnail").style.backgroundImage = 'url("' + e.target.result + '")'
        }
        ,
        o.readAsDataURL(i.files[0]),
        void 0 !== window.FormData) {
            for (var r = new FormData, c = 0; c < t.length; c++)
                r.append("file" + c, t[c]);
            var u = getUrlParams("clubId")
              , d = "file-1" === i.id ? "logo" : "photo";
            $.ajax({
                type: "POST",
                url: "/apis/v1/clubweb/image/upload/photo?clubId=" + u + "&type=" + d,
                contentType: !1,
                processData: !1,
                data: r,
                success: function(e) {},
                error: function(e, t, i, a) {
                    var n = "Error " + t + " " + i + " " + a;
                    e.responseText && "{" === e.responseText[0] && (n = JSON.parse(e.responseText).Message),
                    showErrorModal(n)
                }
            })
        } else
            showErrorModal("This browser doesn't support HTML5 file uploads!")
    } else
        setInputStatus(i, !1)
}
function cancelDetails() {
    setSectionInputStatus(document.querySelector("#club-details"), !0),
    sectionClubDetails.classList.remove("isEdit")
}
function validateSectionDetails() {
    return validateField(clubDetailsDescription),
    validateField(clubDetailsPractice),
    validateField(totalSwimmers),
    newMemberNotification && newMemberNotification.value && validateField(newMemberNotification),
    inputFacebook && inputFacebook.value && validateField(inputFacebook),
    inputTwitter && inputTwitter.value && validateField(inputTwitter),
    inputUrlInstagram && inputUrlInstagram.value && validateField(inputUrlInstagram),
    usmsLiabilityInsurance && validateField(usmsLiabilityInsurance),
    usaSwimmingAffiliate && validateField(usaSwimmingAffiliate),
    lgbtqFocus && validateField(lgbtqFocus),
    sectionContainsErrors(sectionClubDetails) ? (hideLoadingOverlay(),
    window.scroll(0, FindPos(sectionClubDetails.querySelectorAll("span.help-block.has-error")[0])),
    !1) : !0
}
function commitSave() {
    if (sectionContainsErrors(sectionClubDetails))
        return hideLoadingOverlay(),
        window.scroll(0, FindPos(sectionClubDetails.querySelectorAll("span.help-block.has-error")[0])),
        !1;
    checkDetailsData();
    var e = new XMLHttpRequest
      , t = document.getElementById("form-details")
      , i = new FormData(t);
    i.append("clubDescription", clubDetailsDescription.value),
    i.append("practiceDetails", clubDetailsPractice.value);
    var a = getUrlParams("clubId");
    i.append("clubId", a),
    e.open("POST", "/apis/v1/clubweb/section/detail", !0),
    e.withCredentials = !0,
    e.onload = function() {
        if (hideLoadingOverlay(),
        200 === e.status) {
            var t = JSON.parse(e.response);
            t.error ? showErrorModal(t.error) : (setSectionInputStatus(document.querySelector("#club-contact"), !0),
            sectionClubDetails.classList.remove("isEdit"),
            cancelDetails(),
            nextSection ? ($(nextSection).find(".section__content").collapse("show"),
            nextSection = null) : (setSectionInputStatus(document.querySelector("#club-contact"), !1),
            $("#club-contact .section__content").collapse("show")))
        } else
            showErrorModal("Error saving details")
    }
    ,
    e.send(i)
}
function validateWebsiteUrl() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : !1
      , t = inputClubUrl.value
      , i = document.querySelector("span.clubWebsite-icon > i.fa");
    if ("" === t)
        return setInputStatus(inputClubUrl, !0),
        inputClubUrl.classList.remove("has-success"),
        inputClubUrl.classList.remove("has-error"),
        e && commitSave(),
        !0;
    inputClubUrl.classList.remove("has-success"),
    inputClubUrl.classList.remove("has-error"),
    i.classList.remove("fa-check"),
    i.classList.remove("fa-times");
    var a = urlExists(t, function(t) {
        setInputStatus(inputClubUrl, t),
        t ? (i.classList.add("fa-check"),
        i.classList.remove("fa-times")) : (i.classList.remove("fa-check"),
        i.classList.add("fa-times")),
        inputClubUrl.classList.add(t ? "has-success" : "has-error"),
        e && commitSave()
    });
    return a
}
function handleCancelModal() {
    $("#modalClubDetails").modal("hide")
}
function saveDetails(e) {
    e.preventDefault(),
    showLoadingOverlay(),
    validateSectionDetails() && commitSave()
}
function removeClubPhoto(e) {
    var t = getUrlParams("clubId")
      , i = new XMLHttpRequest;
    i.open("POST", "/apis/v1/imageweb/remove/photo?clubId=" + t + "&type=" + e, !0),
    i.withCredentials = !0,
    i.onload = function() {
        if (200 === i.status) {
            var t = JSON.parse(i.response);
            if (t.data) {
                var a = document.querySelector(".input-group.club-" + ("photo" === e ? "background" : "logo") + " .upload-thumbnail");
                a && (a.style.backgroundImage = "")
            } else
                showErrorModal(t.error)
        } else
            showErrorModal("Error removing club image")
    }
    ,
    i.send()
}
var sectionClubDetails = document.querySelector("#club-details")
  , clubDetailsDescription = document.querySelector("#clubDescription")
  , totalSwimmers = document.querySelector("#totalSwimmers")
  , clubDetailsPractice = document.querySelector("#practiceDetails")
  , clubDetailsLogo = document.querySelector("#file-1")
  , clubDetailsPhoto = document.querySelector("#file-2")
  , inputFacebook = document.querySelector("#socialFacebook")
  , inputTwitter = document.querySelector("#socialTwitter")
  , inputUrlInstagram = document.querySelector("#socialInstagram")
  , inputClubUrl = document.querySelector("#clubWebsite")
  , regionalClub = document.querySelector("#regionalClub")
  , newMemberNotification = document.querySelector("#newMemberNotification")
  , usmsLiabilityInsuranceAnsweredYes = document.querySelector("#usmsLiabilityInsuranceAnsweredYes")
  , usmsLiabilityInsuranceAnsweredNo = document.querySelector("#usmsLiabilityInsuranceAnsweredNo")
  , usmsLiabilityInsurance = document.querySelector('input[name="usmsLiabilityInsurance"]')
  , usaSwimmingAffiliateAnsweredYes = document.querySelector("#usaSwimmingAffiliateAnsweredYes")
  , usaSwimmingAffiliateAnsweredNo = document.querySelector("#usaSwimmingAffiliateAnsweredNo")
  , usaSwimmingAffiliate = document.querySelector('input[name="usaSwimmingAffiliate"]')
  , isOperationalInPerson = document.querySelector("#isOperationalInPerson")
  , notOperationalInPerson = document.querySelector("#notOperationalInPerson")
  , operationalInPerson = document.querySelector('input[name="operationalInPerson"]')
  , lgbtqFocusAnsweredYes = document.querySelector("#lgbtqFocusAnsweredYes")
  , lgbtqFocusAnsweredNo = document.querySelector("#lgbtqFocusAnsweredNo")
  , lgbtqFocus = document.querySelector('input[name="lgbtqFocus"]');
!function() {
    checkDetailsData(),
    clubDetailsDescription && clubDetailsDescription.addEventListener("change", function() {
        validateField(clubDetailsDescription)
    }),
    clubDetailsPractice && clubDetailsPractice.addEventListener("change", function() {
        validateField(clubDetailsPractice)
    }),
    totalSwimmers && totalSwimmers.addEventListener("change", function() {
        validateField(totalSwimmers)
    }),
    clubDetailsLogo && clubDetailsLogo.addEventListener("change", UploadFile),
    clubDetailsPhoto && clubDetailsPhoto.addEventListener("change", UploadFile),
    regionalClub && (regionalClub.addEventListener("change", handleRegionalClubChange),
    isRegionalClub = regionalClub.checked,
    setRegionalClubSections(regionalClub.checked)),
    usmsLiabilityInsuranceAnsweredYes && usmsLiabilityInsuranceAnsweredYes.addEventListener("click", function() {
        validateField(usmsLiabilityInsuranceAnsweredYes)
    }),
    usmsLiabilityInsuranceAnsweredNo && usmsLiabilityInsuranceAnsweredNo.addEventListener("click", function() {
        validateField(usmsLiabilityInsuranceAnsweredNo)
    }),
    usaSwimmingAffiliateAnsweredYes && usaSwimmingAffiliateAnsweredYes.addEventListener("click", function() {
        validateField(usaSwimmingAffiliateAnsweredYes)
    }),
    usaSwimmingAffiliateAnsweredNo && usaSwimmingAffiliateAnsweredNo.addEventListener("click", function() {
        validateField(usaSwimmingAffiliateAnsweredNo)
    }),
    isOperationalInPerson && isOperationalInPerson.addEventListener("click", function() {
        validateField(isOperationalInPerson)
    }),
    notOperationalInPerson && notOperationalInPerson.addEventListener("click", function() {
        validateField(notOperationalInPerson)
    }),
    lgbtqFocusAnsweredYes && lgbtqFocusAnsweredYes.addEventListener("click", function() {
        validateField(lgbtqFocusAnsweredYes)
    }),
    lgbtqFocusAnsweredNo && lgbtqFocusAnsweredNo.addEventListener("click", function() {
        validateField(lgbtqFocusAnsweredNo)
    }),
    newMemberNotification && newMemberNotification.addEventListener("change", function() {
        "" === newMemberNotification.value ? setInputStatus(newMemberNotification, !0) : validateField(newMemberNotification)
    })
}();
"use strict";
function setGoldClubFlag() {
    var e = getUrlParams("clubId");
    if ("undefined" == typeof e || !e)
        return void updatesClubCoachCertifications(!1);
    var o = new XMLHttpRequest;
    o.open("GET", "/apis/v1/clubweb/coaches/" + getUrlParams("clubId"), !0),
    o.withCredentials = !0,
    o.onload = function() {
        if (200 === o.status) {
            var e = JSON.parse(o.response);
            if (e.error && !e.data)
                showErrorModal(e.error);
            else {
                var t = e.data
                  , l = !1;
                if (0 !== t.length)
                    for (var i = 0; i < t.length; i += 1)
                        if (t[i].certifications) {
                            l = !0;
                            break
                        }
                l ? (updatesClubCoachCertifications(!0),
                hasCoach = !0) : (updatesClubCoachCertifications(!1),
                hasCoach = !1)
            }
        } else
            showErrorModal("Error updating coaches")
    }
    ,
    o.send()
}
function updatesClubCoachCertifications(e) {
    if (sectionGoldClub) {
        for (var o = sectionGoldClub.querySelector('input[id="certifiedCoachYes"]'), t = sectionGoldClub.querySelector('input[id="certifiedCoachNo"]'), l = sectionGoldClub.querySelectorAll('input[name="certifiedCoach"]'), i = 0; i < l.length; i += 1)
            l[i].addEventListener("click", function() {
                validateCertifiedCoach()
            });
        e ? (o.checked = !0,
        t.disabled = !0) : (o.checked = !1,
        t.checked = !0)
    }
}
function checkGoldClubData() {
    var e = sectionGoldClub.querySelectorAll('input[type="radio"]:checked');
    e.length > 0 && sectionGoldClub.classList.add("hasData")
}
function editGoldClub(e) {
    e.preventDefault(),
    setSectionInputStatus(sectionGoldClub, !1)
}
function cancelGoldClub() {
    setSectionInputStatus(sectionGoldClub, !0)
}
function showCoachSection() {
    $("#coach .section__content").collapse("show"),
    window.scroll(0, FindPos(document.querySelector("#coach")));
    var e = sectionGoldClub.querySelector(".help-block--addCoach");
    cancelGoldClub(),
    e.classList.remove("has-error")
}
function validateCertifiedCoach() {
    var e = sectionGoldClub.querySelector(".help-block--addCoach")
      , o = sectionGoldClub.querySelector('input[id="certifiedCoachYes"]')
      , t = sectionGoldClub.querySelector('input[id="certifiedCoachNo"]');
    return hasCoach === !1 && o.checked === !0 ? (e.classList.add("has-error"),
    hideLoadingOverlay(),
    window.scroll(0, FindPos(sectionGoldClub.querySelector(".club-more-info .radio-group-header"))),
    !1) : hasCoach === !1 && t.checked === !0 ? (e.classList.remove("has-error"),
    window.scroll(0, FindPos(sectionGoldClub.querySelector(".club-more-info .radio-group-header"))),
    !0) : !0
}
function validateGoldClubs() {
    var e = document.querySelector('input[name="certifiedCoach"]');
    validateField(e);
    var o = document.querySelector('input[name="freeTrialMembership"]');
    validateField(o);
    var t = document.querySelector('input[name="requireMembership"]');
    validateField(t);
    var l = document.querySelector('input[name="tryMastersSwimmingWeek"]');
    validateField(l);
    var i = document.querySelector('input[name="usmsRegistrationOnWebsite"]');
    validateField(i);
    var a = document.querySelector('input[name="usmsLogoOnWebsite"]');
    validateField(a);
    var r = document.querySelector('input[name="fitnessSeriesEvents"]');
    return validateField(r),
    sectionContainsErrors(sectionGoldClub) ? (hideLoadingOverlay(),
    window.scroll(0, FindPos(sectionGoldClub.querySelectorAll("span.help-block.has-error")[0])),
    !1) : !0
}
function saveGold(e) {
    if (e.preventDefault(),
    showLoadingOverlay(),
    validateGoldClubs() && validateCertifiedCoach()) {
        var o = new XMLHttpRequest
          , t = document.getElementById("form-gold")
          , l = new FormData(t)
          , i = getUrlParams("clubId");
        return l.append("clubId", i),
        sectionGoldClub.classList.add("hasData"),
        o.open("POST", "/apis/v1/clubweb/section/gold", !0),
        o.withCredentials = !0,
        o.onload = function() {
            if (hideLoadingOverlay(),
            200 === o.status) {
                var e = JSON.parse(o.response);
                e.error ? showErrorModal(e.error) : (setSectionInputStatus(document.querySelector("#gold-club"), !0),
                cancelGoldClub(),
                nextSection ? ($(nextSection).find(".section__content").collapse("show"),
                nextSection = null) : $("#gold-club .section__content").collapse("hide"))
            } else
                showErrorModal("Error saving gold club")
        }
        ,
        o.send(l),
        !1
    }
}
var sectionGoldClub = document.querySelector("#gold-club");
!function() {
    if (sectionGoldClub) {
        checkGoldClubData();
        for (var e = sectionGoldClub.querySelectorAll('input[type="radio"]'), o = function(o) {
            e[o].addEventListener("click", function() {
                validateField(e[o])
            }),
            updatesClubCoachCertifications()
        }, t = 0; t < e.length; t += 1)
            o(t)
    }
}();
var hasCoach = !1;
"use strict";
function getAddress(e) {
    for (var s = "", a = "", n = "", o = "", t = "", r = e.geometry.location.lat(), c = e.geometry.location.lng(), d = 0; d < e.address_components.length; d += 1)
        switch (e.address_components[d].types[0]) {
        case "locality":
            s = e.address_components[d].short_name;
            break;
        case "street_number":
            t = e.address_components[d].short_name;
            break;
        case "route":
            o = e.address_components[d].long_name;
            break;
        case "administrative_area_level_1":
            a = {
                short_name: e.address_components[d].short_name,
                long_name: e.address_components[d].long_name
            };
            break;
        case "postal_code":
            n = e.address_components[d].short_name;
            break;
        case "country":
            n = e.address_components[d].short_name
        }
    return {
        city: s,
        state: a,
        zip: n,
        address: t + " " + o,
        lat: r,
        lng: c
    }
}
"use strict";
function saveClubToRegistration(e, n, t) {
    var o = "/apis/v1/registration/joinnow/save/"
      , i = new XMLHttpRequest;
    i.open("POST", o, !0),
    i.setRequestHeader("Content-type", "application/json;charset=UTF-8"),
    i.withCredentials = !0,
    i.onload = function() {
        var e = JSON.parse(i.response);
        200 === i.status && e.data ? window.location.href = e.data : showErrorModal("Error saving registration")
    }
    ,
    i.send(JSON.stringify({
        clubid: e,
        lmscid: n,
        wogid: t
    }))
}
function handleJoinNowClick(e) {
    e.preventDefault();
    var n = document.querySelector('input[name="clubId"]')
      , t = document.querySelector('input[name="lmscId"]')
      , o = document.querySelector('input[name="wogId"]')
      , i = null
      , a = null
      , r = null;
    n && (i = n.value),
    t && (a = t.value),
    o && (r = o.value),
    saveClubToRegistration(i, a, r)
}
document.querySelector(".club__join-now") && document.querySelector(".club__join-now").addEventListener("click", handleJoinNowClick);
"use strict";
function handleConfigurationLengthChange() {
    var e = configurationLength.options[configurationLength.selectedIndex].innerHTML;
    "Other" === e ? document.querySelector(".input-group--configurationOtherLength").classList.remove("fade") : document.querySelector(".input-group--configurationOtherLength").classList.add("fade")
}
function isValidAddress() {
    var e = locationAddressStreet.value;
    return e.endsWith("USA") && 4 === e.split(",").length ? (setInputStatus(locationAddressStreet, !0),
    !0) : (setInputStatus(locationAddressStreet, !1),
    !1)
}
function updateLocationFields(e) {
    locationAddressStreetGoogle.value = e.address,
    locationAddressCity.value = e.city,
    locationAddressState.value = e.state.short_name,
    locationAddressZip.value = e.zip,
    locationAddressLat.value = e.lat,
    locationAddressLng.value = e.lng
}
function handleLocationPlaceChanged() {
    var e = googlePlaceLocation.getPlace();
    if (void 0 === e)
        return setInputStatus(locationAddressStreet, !1),
        void showErrorModal("Error while calling Google Places api, place not found");
    if (!e.geometry)
        return void setInputStatus(locationAddressStreet, !1);
    if (!e.address_components)
        return void setInputStatus(locationAddressStreet, !1);
    var t = getAddress(e);
    updateLocationFields(t),
    isValidAddress()
}
function editLocation() {
    sectionLocation.classList.add("isEdit"),
    setSectionInputStatus(sectionLocation, !1)
}
function checkLocationData() {
    var e = document.querySelector(".list-item:not(.list-item--fade-out) .location-name");
    e && "" !== e.value ? (document.querySelector(".section-location").classList.add("hasData"),
    $("#editLocationBtn").show()) : (document.querySelector(".section-location").classList.remove("hasData"),
    $("#editLocationBtn").hide())
}
function discardLocationEdit() {
    for (var e = sectionLocation.querySelectorAll(".list-item--removed"), t = sectionLocation.querySelectorAll(".list-item--new"), o = 0; o < e.length; o += 1)
        e[o].classList.remove("list-item--removed"),
        e[o].classList.remove("list-item--fade-out");
    for (var n = 0; n < t.length; n += 1)
        t[n].parentNode.parentNode.removeChild(t[n])
}
function clearLocationInputs() {
    if (locationDetails) {
        locationAddressCity.value = "",
        locationName.value = "",
        locationAddressState.value = "",
        locationAddressZip.value = "",
        locationAddressStreet.value = "",
        locationType.value = "",
        locationTypeOtherInput.value = "";
        for (var e = document.querySelectorAll('.location-type--indoor input[type="checkbox"]:checked'), t = 0; t < e.length; t += 1)
            e[t].checked = !1;
        for (var o = document.querySelectorAll('.location-type--outdoor input[type="checkbox"]:checked'), n = 0; n < o.length; n += 1)
            o[n].checked = !1;
        var a = document.querySelector('.location-type--openwater input[type="radio"]:checked');
        a && (a.checked = !1),
        setInputStatus(locationName, !0),
        setInputStatus(locationAddressStreet, !0),
        setInputStatus(locationType, !0)
    }
}
function hideLocationDetails() {
    locationDetails && (clearLocationInputs(),
    locationDetails.classList.remove("show"))
}
function hideLocationInputs() {
    var e = sectionLocation.querySelector(".location-inputs");
    if (e && locationDetails && (clearLocationInputs(),
    $("#addLocationBtn").show(),
    $("#cancelAddLocationBtn").hide(),
    $("#doneEditLocationBtn").hide(),
    $("#cancelAddLocationBtnFooter").hide(function() {
        window.scroll(0, FindPos(document.querySelector("#club-location")))
    }),
    document.getElementById("saveLocation").disabled = !1,
    e.classList.remove("show"),
    locationDetails.classList.remove("show"),
    $(".locations-list__header").hide(),
    $(".locations-list__header").css("display", "none"),
    locationType.disabled = !1,
    editingLocation)) {
        var t = document.querySelector('.location-id--value[value="' + editingLocation + '"]').parentNode;
        t.querySelector(".location-add-venue").style.display = "block",
        t.querySelector(".location-name").style.display = "block",
        t.querySelector(".location-address-street").style.display = "block",
        t.querySelector(".list__controls").style.display = "inline-block",
        t.querySelector(".venue__list .list__controls") && (t.querySelector(".venue__list .list__controls").style.display = "block"),
        editingLocation = null
    }
}
function hideLocatinEditInputs() {
    hideLocationInputs()
}
function cancelLocationList() {
    var e = sectionLocation.querySelector(".list")
      , t = sectionLocation.querySelectorAll(".list-item--fade-out");
    if (t.length >= 1)
        for (var o = 0; o < t.length; o += 1)
            t[o].classList.remove("list-item--fade-out");
    setTimeout(function() {
        for (var e = 0; e < t.length; e += 1)
            t[e].parentNode.style.display = "block"
    }, 250),
    e.classList.remove("edit-list"),
    document.getElementById("saveLocation").disabled = !1,
    document.getElementById("addLocationBtn").disabled = !1
}
function cancelLocationEdit() {
    hideLocationDetails(),
    sectionLocation.classList.remove("isEdit"),
    cancelLocationList(),
    setSectionInputStatus(sectionLocation, !0);
    for (var e = sectionLocation.querySelectorAll(".list-item--new"), t = 0; t < e.length; t += 1)
        e[0].parentNode.removeChild(e[0]),
        document.getElementById("saveLocation").disabled = !1
}
function removeCurrentLocations() {
    var e = document.querySelector(".section#club-location .list__container .row");
    if (e) {
        var t = e.querySelectorAll(".list-item");
        if (t)
            for (; e.firstChild; )
                e.removeChild(e.firstChild)
    }
}
function handleUsmsVerifiedChange(e) {
    e.target.checked ? document.querySelector(".usms-verified-form").classList.remove("usms-verified-form--fade") : document.querySelector(".usms-verified-form").classList.add("usms-verified-form--fade")
}
function handleCableCourseChange(e) {
    e.target.checked ? document.querySelector(".list-venue-form__cable-course-form").classList.remove("list-venue-form__cable-course-form--fade") : document.querySelector(".list-venue-form__cable-course-form").classList.add("list-venue-form__cable-course-form--fade")
}
function handleAddVenue(e, t) {
    handleCancelVenue(),
    handleCancelConfiguration(),
    hideLocationInputs(),
    currentLocationId = e.querySelector(".location-id--value").value,
    document.querySelector("div.list-venue-form").classList.remove("list-venue-form__fade"),
    currentLocation = e,
    e.classList.remove("has-error"),
    currentLocation.querySelector(".location-add-venue").style.display = "none",
    document.querySelector("#venueName").focus(),
    document.querySelector("#editLocationBtn").style.display = "none",
    document.querySelector("div.list-configuration-form").classList.add("list-configuration-form__fade"),
    document.querySelector("#venueIsOpenWater").value = e.querySelector(".location-isOpenWater--value").value,
    t.isOpenWater ? (document.querySelector(".input-group--openWaterType").classList.remove("fade"),
    document.querySelector(".input-group--poolType").classList.add("fade"),
    document.querySelector(".input-group--bulkhead").classList.add("fade"),
    document.querySelector(".input-group--venueCableCourse").classList.remove("fade")) : (document.querySelector(".input-group--poolType").classList.remove("fade"),
    document.querySelector(".input-group--openWaterType").classList.add("fade"),
    document.querySelector(".input-group--venueCableCourse").classList.add("fade"),
    document.querySelector(".input-group--bulkhead").classList.remove("fade"))
}
function removeLocation(e) {
    var t = sectionLocation.querySelector(".list__container");
    t.classList.add("list__container--modified"),
    e.classList.remove("has-error"),
    e.classList.add("list-item--fade-out"),
    setTimeout(function() {
        e.style.display = "absolute",
        e.parentNode.style.display = "none"
    }, 250),
    closeConfirmationModal()
}
function handleRemoveLocation(e) {
    showConfirmationModal("This will delete your existing pool(s) and configuration(s). Are you sure you want to continue?", function() {
        removeLocation(e)
    })
}
function getSelectValueFromOptionInnerHTML(e, t) {
    if (!e || !t)
        return -1;
    for (var o = -1, n = 0; n < e.options.length; n += 1)
        if (e.options[n].innerHTML === t) {
            o = n;
            break
        }
    return -1 !== o ? e.options[o].value : -1
}
function handleEditLocation(e) {
    var t = sectionLocation.querySelector(".location-inputs");
    $(".locations-list__header").hide(),
    $("#addLocationBtn").hide();
    var o = e;
    o.classList.remove("has-error"),
    o.querySelector("p.location-name").style.display = "none",
    o.querySelector("p.location-address-street").style.display = "none",
    o.querySelector(".list__controls").style.displey = "none",
    o.querySelector(".location-name").style.displey = "none",
    o.querySelector(".location-address-street").style.displey = "none",
    o.querySelector(".list__controls").style.display = "none",
    o.querySelector(".location-add-venue").style.display = "none",
    locationName.value = o.querySelector("p.location-name").innerHTML,
    locationAddressStreet.value = o.querySelector(".location-address--value").value + ", " + o.querySelector(".location-city--value").value + ", " + o.querySelector(".location-state--value").value + ", USA",
    locationAddressStreetGoogle.value = o.querySelector(".location-address--value").value,
    locationAddressLat.value = o.querySelector(".location-lat--value").value,
    locationAddressLng.value = o.querySelector(".location-lng--value").value,
    editingLocation = e.querySelector(".location-id--value").value,
    locationType.value = o.querySelector(".location-type--value").value,
    locationType.disabled = !0,
    $("#cancelAddLocationBtn").show(),
    $("#cancelAddLocationBtnFooter").show(),
    t.classList.add("show"),
    locationDetails.classList.add("show"),
    locationName.focus()
}
function editExistingLocation(e) {
    var t = document.querySelector('.location-id--value[value="' + e.locationId + '"').parentNode;
    e.city && (t.querySelector(".location-city--value").value = e.city),
    e.address && (t.querySelector(".location-address--value").value = e.address),
    e.state && (t.querySelector(".location-state--value").value = e.state),
    e.zip && (t.querySelector(".location-zip--value").value = e.zip),
    t.querySelector(".location-type--value").value = e.locationType,
    t.querySelector(".location-lng--value").value = e.lng,
    t.querySelector(".location-lat--value").value = e.lat,
    t.querySelector(".location-name").innerHTML = locationName.value,
    t.querySelector(".location-address-street").innerHTML = locationAddressStreet.value
}
function addLocation(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : !1
      , o = document.querySelector(".section#club-location .list__container .row");
    if ($("#listLocationSettings").show(),
    !o)
        return null;
    var n = document.createElement("div");
    n.className = "col-xs-12";
    var a = document.createElement("div");
    t ? a.className = "list-item list-item--fade-out" : a.className = "list-item list-item--fade-out list-item--new";
    var i = document.createElement("div");
    i.className = "list__controls";
    var l = document.createElement("button");
    l.innerHTML = "Edit",
    l.className = "btn btn-link list-item__edit",
    l.addEventListener("click", function() {
        return handleEditLocation(a)
    });
    var r = document.createElement("button");
    r.innerHTML = "Remove",
    r.className = "btn btn-link list-item__delete",
    r.addEventListener("click", function() {
        return handleRemoveLocation(a)
    }),
    i.appendChild(l),
    i.appendChild(r);
    var c = document.createElement("p");
    c.className = "location-name text-bold",
    c.innerHTML = e.name;
    var u = document.createElement("p");
    u.classList.add("location-address-street"),
    u.innerHTML = e.address + " | " + e.city + ", " + e.state + " " + e.zip;
    var s = document.createElement("button");
    s.className = "location-add-venue btn btn-small btn-outline",
    e.isOpenWater ? s.innerHTML = '<span><i class="fa fa-plus"></i></span>' + addVenueButtonText : s.innerHTML = '<span><i class="fa fa-plus"></i></span>' + addPoolButtonText,
    s.addEventListener("click", function() {
        handleAddVenue(a, e)
    });
    var d = document.createElement("input");
    d.setAttribute("type", "hidden"),
    d.className = "location-name--value",
    d.value = e.name;
    var v = document.createElement("input");
    v.setAttribute("type", "hidden"),
    v.className = "location-address--value",
    v.value = e.address;
    var m = document.createElement("input");
    m.setAttribute("type", "hidden"),
    m.className = "location-id--value",
    m.value = e.locationId;
    var p = document.createElement("input");
    p.setAttribute("type", "hidden"),
    p.className = "location-city--value",
    p.value = e.city;
    var f = document.createElement("input");
    f.setAttribute("type", "hidden"),
    f.className = "location-lat--value",
    f.value = e.lat;
    var y = document.createElement("input");
    y.setAttribute("type", "hidden"),
    y.className = "location-lng--value",
    y.value = e.lng;
    var h = document.createElement("input");
    h.setAttribute("type", "hidden"),
    h.className = "location-state--value",
    h.value = e.state;
    var g = document.createElement("input");
    g.setAttribute("type", "hidden"),
    g.className = "location-type--value",
    g.value = e.locationType;
    var L = document.createElement("input");
    L.setAttribute("type", "hidden"),
    L.className = "location-isOpenWater--value",
    L.value = e.isOpenWater;
    var S = document.createElement("input");
    S.setAttribute("type", "hidden"),
    S.className = "location-zip--value",
    S.value = e.zip;
    var C = document.createElement("div");
    C.classList.add("venue__list");
    var b = document.createElement("div");
    b.className = "list__controls";
    var q = document.createElement("button");
    q.className = "btn btn-link",
    q.innerHTML = "Edit";
    var E = document.createElement("button");
    E.className = "btn btn-link",
    E.innerHTML = "Remove",
    b.appendChild(q),
    b.appendChild(E);
    var _ = document.createElement("span");
    return _.className = "help-block",
    _.innerHTML = locationMissingPool,
    a.appendChild(m),
    a.appendChild(v),
    a.appendChild(p),
    a.appendChild(h),
    a.appendChild(S),
    a.appendChild(g),
    a.appendChild(y),
    a.appendChild(f),
    a.appendChild(L),
    a.appendChild(i),
    a.appendChild(c),
    a.appendChild(u),
    a.appendChild(_),
    a.appendChild(s),
    a.appendChild(C),
    n.appendChild(a),
    o.appendChild(n),
    setTimeout(function() {
        a.classList.remove("list-item--fade-out")
    }, 250),
    a
}
function handleAddConfiguration(e) {
    handleCancelVenue(),
    handleCancelConfiguration(),
    hideLocationInputs(),
    document.querySelector(".list-configuration-form").classList.remove("list-configuration-form__fade"),
    document.querySelector("div.list-venue-form").classList.add("list-venue-form__fade"),
    currentVenue = e,
    e.classList.remove("has-error"),
    configurationName.focus()
}
function handleCancelConfiguration() {
    editingPoolConfiguration = null,
    document.querySelector(".list-configuration-form").classList.add("list-configuration-form__fade"),
    configurationName.value = "",
    configurationOtherLength.value = "",
    configurationUsmsVerified.checked = !1,
    configurationUsmsVerifiedDate.value = "",
    document.querySelector(".usms-verified-form").classList.add("usms-verified-form--fade"),
    configurationLength.value = "",
    configurationLanes.value = "",
    document.querySelector(".input-group--configurationOtherLength").classList.add("fade")
}
function validateConfigurationFields() {
    validateField(configurationName),
    validateField(configurationLanes),
    validateField(configurationLength);
    var e = configurationLength.options[configurationLength.selectedIndex].innerHTML;
    "Other" === e && validateField(configurationOtherLength),
    configurationUsmsVerified.checked && validateField(configurationUsmsVerifiedDate)
}
function editPoolConfiguration(e) {
    var t = document.querySelector('.configuration-poolConfiguration-id[value="' + e.poolConfigurationId + '"]').parentNode;
    t && (t.querySelector("p.configuration-title").innerHTML = e.name + " - " + (e.otherLength || e.length) + ", " + e.lanes + " Lanes",
    t.querySelector(".configuration-name").value = e.name,
    t.querySelector(".configuration-lanes").value = e.lanes,
    t.querySelector(".configuration-length").value = e.length,
    t.querySelector(".configuration-otherLength").value = e.otherLength,
    t.querySelector(".configuration-usmsVerified").value = e.usmsVerified,
    t.querySelector(".configuration-usmsVerifiedDate").value = e.usmsVerifiedDate)
}
function removePoolConfiguration(e) {
    showLoadingOverlay();
    var t = new XMLHttpRequest;
    t.open("DELETE", "/apis/v1/clubweb/poolConfiguration/remove?poolConfigurationId=" + e, !0),
    t.setRequestHeader("Content-type", "application/json;charset=UTF-8"),
    t.withCredentials = !0,
    t.onload = function() {
        if (closeConfirmationModal(),
        hideLoadingOverlay(),
        200 === t.status) {
            var o = JSON.parse(t.response);
            o.error ? showErrorModal(o.error) : o.data && (document.querySelector('.configuration-poolConfiguration-id[value="' + e + '"]').parentNode.classList.add("fade"),
            document.querySelector('.configuration-poolConfiguration-id[value="' + e + '"]').parentNode.remove())
        } else
            showErrorModal("Error removing pool configuration")
    }
    ,
    t.send()
}
function handleRemovePoolConfiguration(e) {
    var t = e.querySelector(".configuration-poolConfiguration-id").value;
    showConfirmationModal("Are you sure you want to delete this configuration?", function() {
        removePoolConfiguration(t)
    })
}
function removePool(e) {
    showLoadingOverlay(),
    e.classList.remove("has-error");
    var t = new XMLHttpRequest
      , o = e.querySelector(".pool-id").value;
    t.open("DELETE", "/apis/v1/clubweb/pool/remove?poolId=" + o, !0),
    t.setRequestHeader("Content-type", "application/json;charset=UTF-8"),
    t.withCredentials = !0,
    t.onload = function() {
        if (closeConfirmationModal(),
        hideLoadingOverlay(),
        200 === t.status) {
            var e = JSON.parse(t.response);
            e.error ? showErrorModal(e.error) : e.data && (document.querySelector('.pool-id[value="' + o + '"]').parentNode.classList.add("fade"),
            document.querySelector('.pool-id[value="' + o + '"]').parentNode.remove())
        } else
            showErrorModal("Error removing pool")
    }
    ,
    t.send()
}
function handleRemovePool(e) {
    showConfirmationModal("This will remove your existing configuration(s). Are you sure you want to continue?", function() {
        removePool(e)
    })
}
function handleEditPoolConfiguration(e) {
    if (document.querySelector("div.list-venue-form").classList.add("list-venue-form__fade"),
    document.querySelector(".list-configuration-form").classList.remove("list-configuration-form__fade"),
    e) {
        configurationName.value = e.querySelector(".configuration-name").value,
        configurationOtherLength.value = e.querySelector(".configuration-otherLength").value,
        configurationLength.value = getSelectValueFromOptionInnerHTML(configurationLength, e.querySelector(".configuration-length").value),
        configurationUsmsVerified.checked = "true" === e.querySelector(".configuration-usmsVerified").value,
        configurationLanes.value = e.querySelector(".configuration-lanes").value,
        configurationUsmsVerified.checked ? (configurationUsmsVerifiedDate.value = e.querySelector(".configuration-usmsVerifiedDate").value,
        document.querySelector(".usms-verified-form").classList.remove("usms-verified-form--fade")) : document.querySelector(".usms-verified-form").classList.add("usms-verified-form--fade"),
        configurationOtherLength.value.length > 0 && document.querySelector(".input-group--configurationOtherLength").classList.remove("fade"),
        editingPoolConfiguration = e.querySelector(".configuration-poolConfiguration-id").value;
        var t = e.querySelector(".configuration-pool-id").value;
        currentVenue = document.querySelector('.pool-id[value="' + t + '"]').parentNode
    }
}
function addPoolConfiguration(e) {
    var t = currentVenue.querySelector(".configuration__list")
      , o = document.createElement("div");
    o.className = "configuration__list--item";
    var n = document.createElement("p");
    n.className = "configuration-title",
    n.innerHTML = e.name + " - " + (e.otherLength || e.length) + ", " + e.lanes + " Lanes";
    var a = document.createElement("div");
    a.className = "list__controls";
    var i = document.createElement("button");
    i.className = "btn btn-link configuration-remove-button",
    i.innerHTML = "" + removeText,
    i.addEventListener("click", function() {
        handleRemovePoolConfiguration(o)
    });
    var l = document.createElement("button");
    l.innerHTML = "" + editText,
    l.className = "btn btn-link configuration-edit-button",
    l.addEventListener("click", function() {
        handleEditPoolConfiguration(o)
    }),
    a.appendChild(l),
    a.appendChild(i);
    var r = document.createElement("input");
    r.value = e.name,
    r.className = "configuration-name",
    r.setAttribute("type", "hidden");
    var c = document.createElement("input");
    c.value = e.lanes,
    c.className = "configuration-lanes",
    c.setAttribute("type", "hidden");
    var u = document.createElement("input");
    u.value = e.length,
    u.className = "configuration-length",
    u.setAttribute("type", "hidden");
    var s = document.createElement("input");
    s.value = e.otherLength,
    s.className = "configuration-otherLength",
    s.setAttribute("type", "hidden");
    var d = document.createElement("input");
    d.value = e.usmsVerified,
    d.className = "configuration-usmsVerified",
    d.setAttribute("type", "hidden");
    var v = document.createElement("input");
    v.value = e.usmsVerifiedDate,
    v.className = "configuration-usmsVerifiedDate",
    v.setAttribute("type", "hidden");
    var m = document.createElement("input");
    m.value = e.poolId,
    m.className = "configuration-pool-id",
    m.setAttribute("type", "hidden");
    var p = document.createElement("input");
    p.value = e.poolConfigurationId,
    p.className = "configuration-poolConfiguration-id",
    p.setAttribute("type", "hidden"),
    o.appendChild(a),
    o.appendChild(n),
    o.appendChild(r),
    o.appendChild(c),
    o.appendChild(m),
    o.appendChild(p),
    o.appendChild(u),
    o.appendChild(s),
    o.appendChild(d),
    o.appendChild(v),
    t.appendChild(o)
}
function handleSaveConfiguration() {
    if (validateConfigurationFields(),
    sectionContainsErrors(sectionLocation))
        return void window.scroll(0, FindPos(sectionLocation.querySelectorAll("span.help-block.has-error")[0]));
    if (currentVenue) {
        var e = {
            name: document.querySelector("#configurationName").value,
            lanes: document.querySelector("#configurationLanes").value,
            length: document.querySelector("#configurationLength").value,
            otherLength: document.querySelector("#configurationOtherLength").value,
            usmsVerified: document.querySelector("#usmsVerified").checked,
            usmsVerifiedDate: document.querySelector("#usmsVerifiedDate").value,
            poolId: currentVenue.querySelector(".pool-id").value,
            poolConfigurationId: editingPoolConfiguration
        }
          , t = new XMLHttpRequest;
        t.open("POST", "/apis/v1/clubweb/poolConfiguration/add", !0),
        t.setRequestHeader("Content-type", "application/json;charset=UTF-8"),
        t.withCredentials = !0,
        t.onload = function() {
            if (hideLoadingOverlay(),
            200 === t.status) {
                var e = JSON.parse(t.response);
                e.error ? showErrorModal(e.error) : (editingPoolConfiguration ? editPoolConfiguration(e.data) : addPoolConfiguration(e.data),
                handleCancelConfiguration())
            } else
                showErrorModal("Error saving pool")
        }
        ,
        t.send(JSON.stringify(e))
    } else
        console.error("currentVenue not found")
}
function handleEditPool(e) {
    if (document.querySelector("div.list-configuration-form").classList.add("list-configuration-form__fade"),
    editingPool = e.querySelector(".pool-id").value,
    currentLocationId = e.querySelector(".location-id").value,
    currentLocation = document.querySelector('.location-id--value[value="' + currentLocationId + '"]').parentNode,
    venueNameInput.value = e.querySelector(".venue-name").innerHTML,
    venueBulkheadCheckbox.checked = "true" === e.querySelector(".venue-bulkhead").value,
    document.querySelector("div.list-venue-form").classList.remove("list-venue-form__fade"),
    document.querySelector("#venueName").focus(),
    document.querySelector("#venueIsOpenWater").value = e.querySelector(".venue-isOpenWater").value,
    "true" === e.querySelector(".venue-isOpenWater").value) {
        var t = "true" === e.querySelector(".venue-cableCourse").value;
        venueCableCourseCheckbox.checked = t,
        t && document.querySelector(".list-venue-form__cable-course-form").classList.remove("list-venue-form__cable-course-form--fade"),
        venueCableCourseSelect.value = e.querySelector(".venue-cableCourseUnit").value,
        venueCableCourseInput.value = Number(e.querySelector(".venue-cableCourseValue").value),
        venueOpenWaterSelect.value = e.querySelector(".venue-subType").value,
        document.querySelector(".input-group--openWaterType").classList.remove("fade"),
        document.querySelector(".input-group--poolType").classList.add("fade"),
        document.querySelector(".input-group--venueCableCourse").classList.remove("fade"),
        document.querySelector(".input-group--bulkhead").classList.add("fade")
    } else
        venuePoolSelect.value = e.querySelector(".venue-subType").value,
        document.querySelector(".input-group--poolType").classList.remove("fade"),
        document.querySelector(".input-group--openWaterType").classList.add("fade"),
        document.querySelector(".input-group--venueCableCourse").classList.add("fade"),
        document.querySelector(".input-group--bulkhead").classList.remove("fade"),
        document.querySelector(".list-venue-form__cable-course-form").classList.add("list-venue-form__cable-course-form--fade")
}
function addPool(e) {
    var t = document.createElement("div");
    t.classList.add("venue__list--item");
    var o = document.createElement("div");
    o.className = "list__controls";
    var n = document.createElement("button");
    n.className = "btn btn-link venue-remove-button",
    n.innerHTML = "" + removeText,
    n.addEventListener("click", function() {
        handleRemovePool(t)
    });
    var a = document.createElement("button");
    a.innerHTML = "" + editText,
    a.className = "btn btn-link venue-edit-button",
    a.addEventListener("click", function() {
        handleEditPool(t)
    });
    var i = document.createElement("div");
    i.classList.add("configuration__list");
    var l = document.createElement("p");
    l.className = "venue-name",
    l.innerHTML = e.name;
    var r = document.createElement("p");
    r.className = "venue-type",
    r.innerHTML = "(" + e.subTypeName + ")";
    var c = document.createElement("input");
    c.value = e.cableCourse,
    c.className = "venue-cableCourse",
    c.setAttribute("type", "hidden");
    var u = document.createElement("input");
    u.value = e.cableCourseDistance,
    u.className = "venue-cableCourseValue",
    u.setAttribute("type", "hidden");
    var s = document.createElement("input");
    s.value = e.cableCourseUnit,
    s.className = "venue-cableCourseUnit",
    s.setAttribute("type", "hidden");
    var d = document.createElement("input");
    d.className = "pool-id",
    d.value = e.poolId,
    d.setAttribute("type", "hidden");
    var v = document.createElement("input");
    v.className = "location-id",
    v.value = e.locationId,
    v.setAttribute("type", "hidden");
    var m = document.createElement("input");
    m.className = "venue-bulkhead",
    m.value = e.bulkhead,
    m.setAttribute("type", "hidden");
    var p = document.createElement("input");
    p.className = "venue-isOpenWater",
    p.value = e.isOpenWater,
    p.setAttribute("type", "hidden");
    var f = document.createElement("input");
    f.className = "venue-subType",
    f.value = e.subType,
    f.setAttribute("type", "hidden");
    var y = document.createElement("button");
    y.className = "location-add-configuration btn btn-small btn-outline",
    y.innerHTML = '<span><i class="fa fa-plus"></i></span>' + addConfigurationText,
    y.addEventListener("click", function() {
        handleAddConfiguration(t)
    });
    var h = document.createElement("div");
    h.className = "list__controls";
    var g = document.createElement("button");
    g.className = "btn btn-link",
    g.innerHTML = "Edit";
    var L = document.createElement("button");
    L.className = "btn btn-link",
    L.innerHTML = "Remove",
    h.appendChild(g),
    h.appendChild(L);
    var S = document.createElement("span");
    return S.className = "help-block",
    S.innerHTML = poolMissingConfiguration,
    o.appendChild(a),
    o.appendChild(n),
    t.appendChild(o),
    t.appendChild(l),
    t.appendChild(r),
    e.isOpenWater || t.appendChild(S),
    t.appendChild(i),
    e.isOpenWater || t.appendChild(y),
    t.appendChild(c),
    t.appendChild(u),
    t.appendChild(s),
    t.appendChild(d),
    t.appendChild(v),
    t.appendChild(m),
    t.appendChild(p),
    t.appendChild(f),
    currentLocation.querySelector(".venue__list").appendChild(t),
    t
}
function editPool(e) {
    var t = document.querySelector('.pool-id[value="' + e.poolId + '"]').parentNode;
    t && (t.querySelector(".venue-name").innerHTML = e.name,
    t.querySelector(".venue-type").innerHTML = "(" + e.subTypeName + ")",
    t.querySelector(".venue-cableCourse").value = e.cableCourse,
    t.querySelector(".venue-cableCourseUnit").value = e.cableCourseUnit,
    t.querySelector(".venue-cableCourseValue").value = e.cableCourseDistance,
    t.querySelector(".venue-bulkhead").value = e.bulkhead,
    t.querySelector(".venue-subType").value = e.subType)
}
function validateVenueFields() {
    validateField(venueNameInput);
    var e = document.querySelector("#venueIsOpenWater").value;
    "true" === e ? validateField(venueOpenWaterSelect) : validateField(venuePoolSelect),
    venueCableCourseCheckbox.checked && (validateField(venueCableCourseInput),
    validateField(venueCableCourseSelect))
}
function validateLocationsFields() {
    isValidAddress() || setInputStatus(locationAddressStreet, !1),
    "" === locationAddressStreet.value && validateField(locationAddressStreet),
    validateField(locationName),
    validateField(locationType)
}
function handleSavePool() {
    if (validateVenueFields(),
    sectionContainsErrors(sectionLocation))
        return void window.scroll(0, FindPos(sectionLocation.querySelectorAll("span.help-block.has-error")[0]));
    var e = document.querySelector("#venueIsOpenWater").value
      , t = "";
    t = "true" === e ? venueOpenWaterSelect.options[venueOpenWaterSelect.selectedIndex].value : venuePoolSelect.options[venuePoolSelect.selectedIndex].value;
    var o = {
        name: venueNameInput.value,
        isOpenWater: e,
        subType: t,
        bulkhead: venueBulkheadCheckbox.checked,
        cableCourse: venueCableCourseCheckbox.checked,
        cableCourseDistance: venueCableCourseInput.value,
        cableCourseUnit: venueCableCourseSelect.value,
        clubId: getUrlParams("clubId"),
        locationId: currentLocationId,
        poolId: editingPool
    };
    if (currentLocation) {
        var n = new XMLHttpRequest;
        n.open("POST", "/apis/v1/clubweb/pool/add", !0),
        n.setRequestHeader("Content-type", "application/json;charset=UTF-8"),
        n.withCredentials = !0,
        n.onload = function() {
            if (hideLoadingOverlay(),
            200 === n.status) {
                var e = JSON.parse(n.response);
                if (e.error)
                    showErrorModal(e.error);
                else if (editingPool)
                    editPool(e.data),
                    handleCancelVenue();
                else {
                    var t = addPool(e.data);
                    handleCancelVenue(),
                    e.data.isOpenWater || handleAddConfiguration(t)
                }
            } else
                showErrorModal("Error saving pool")
        }
        ,
        n.send(JSON.stringify(o))
    } else
        console.log("no currentLocation")
}
function getCurrentLocations() {
    hideEditLocationInputs();
    var e = getUrlParams("clubId");
    if ("undefined" != typeof getUrlParams("clubId")) {
        removeCurrentLocations();
        var t = new XMLHttpRequest;
        e && (t.open("GET", "/apis/v1/clubweb/locations/" + (e || ""), !0),
        t.withCredentials = !0,
        t.onload = function() {
            if (200 === t.status) {
                for (var e = JSON.parse(t.response), o = 0; o < e.length; o += 1)
                    if (currentLocation = addLocation(e[o], !0),
                    e[o].pools)
                        for (var n = 0; n < e[o].pools.length; n += 1) {
                            currentVenue = addPool(e[o].pools[n]);
                            for (var a = 0; a < e[o].pools[n].configurations.length; a += 1)
                                addPoolConfiguration(e[o].pools[n].configurations[a])
                        }
                currentLocation = null,
                currentVenue = null
            } else
                showErrorModal("Error retrieving locations");
            setTimeout(function() {
                checkLocationData()
            }, 300)
        }
        ,
        t.send())
    }
}
function getLocations() {
    var e = []
      , t = document.querySelector(".section#club-location .list__container .row");
    if (t) {
        var o = t.querySelectorAll(".list-item");
        if (o)
            for (var n = 0; n < o.length; n += 1) {
                var a = o[n];
                e.push({
                    name: a.querySelector(".location-name").innerHTML,
                    state: a.querySelector(".location-state--value").value,
                    city: a.querySelector(".location-city--value").value,
                    zip: a.querySelector(".location-zip--value").value,
                    lat: a.querySelector(".location-lat--value").value,
                    lng: a.querySelector(".location-lng--value").value,
                    address: a.querySelector(".location-address--value").value,
                    locationType: a.querySelector(".location-type--value").value,
                    locationId: a.querySelector(".location-id--value").value,
                    isOpenWater: a.querySelector(".location-isOpenWater--value").value
                })
            }
    }
    return e
}
function getCheckboxesChecked(e) {
    var t = [];
    if (!e)
        return t;
    for (var o = e.querySelectorAll('input[type="checkbox"]:checked'), n = 0; n < o.length; n += 1)
        t.push(o[n].value);
    return t
}
function saveLocationEdit() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : !0
      , t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
    showLoadingOverlay(),
    hideEditLocationInputs(),
    handleCancelConfiguration(),
    handleCancelVenue();
    for (var o = sectionLocation.querySelectorAll(".list-item--fade-out"), n = 0; n < o.length; n += 1)
        o[n].parentNode.parentNode.removeChild(o[n].parentNode);
    for (var a = sectionLocation.querySelectorAll(".list-item--new"), i = 0; i < a.length; i += 1)
        a[i].classList.remove("list-item--new");
    if (!t && !validateLocations())
        return sectionLocation.classList.add("isEdit"),
        $("#club-location .section__content").collapse("show"),
        hideLoadingOverlay(),
        showEditLocationInputs(),
        void showErrorModal(locationMissingInformation);
    e && setSectionInputStatus(sectionLocation, !0),
    hideLocationInputs();
    var l = getLocations();
    checkLocationData();
    var r = new XMLHttpRequest;
    r.open("POST", "/apis/v1/clubweb/location/save", !0),
    r.setRequestHeader("Content-type", "application/json;charset=UTF-8"),
    r.withCredentials = !0,
    r.onload = function() {
        if (hideLoadingOverlay(),
        200 === r.status) {
            var o = JSON.parse(r.response);
            o.error ? showErrorModal(o.error) : e ? (closeSaveModal(),
            sectionLocation.classList.remove("isEdit"),
            sectionLocation.querySelector(".list__container").classList.remove("list__container--modified"),
            cancelLocationEdit(),
            nextSection ? ($(nextSection).find(".section__content").collapse("show"),
            nextSection = null) : $("#gold-club .section__content").collapse("show")) : !function() {
                for (var e = document.querySelectorAll(".list.locations > .list__container .list-item"), n = function(t) {
                    var n = o.data.filter(function(o) {
                        return o.name === e[t].querySelector("p.location-name").innerHTML
                    });
                    n && n.length > 0 && (e[t].querySelector(".location-id--value").value = n[0].locationId)
                }, a = 0; a < e.length; a += 1)
                    n(a);
                t && t()
            }()
        } else
            showErrorModal("Error saving location")
    }
    ,
    r.send(JSON.stringify({
        clubId: getUrlParams("clubId"),
        locations: l
    }))
}
function handleAddLocation() {
    if (locationType.disabled = !1,
    validateLocationsFields(),
    sectionContainsErrors(sectionLocation))
        return void window.scroll(0, FindPos(sectionLocation.querySelectorAll("span.help-block.has-error")[0]));
    var e = {
        name: locationName.value,
        state: locationAddressState.value,
        city: locationAddressCity.value,
        zip: locationAddressZip.value,
        address: sectionLocation.querySelector("input#locationAddressStreet--google").value,
        lat: sectionLocation.querySelector("input#locationAddressLat").value,
        lng: sectionLocation.querySelector("input#locationAddressLng").value,
        locationType: locationType.value,
        description: sectionLocation.querySelector("input#locationTypeOther").value,
        locationId: editingLocation,
        isOpenWater: "Open Water" === locationType.options[locationType.selectedIndex].innerHTML
    };
    if (editingLocation) {
        var t = document.querySelector('.location-id--value[value="' + editingLocation + '"]').parentNode;
        t.querySelector(".list__controls").style.display = "inline-block",
        t.querySelector(".venue__list .list__controls") && (t.querySelector(".venue__list .list__controls").style.display = "block"),
        t.querySelector("p.location-name").style.display = "block",
        t.querySelector("p.location-address-street").style.display = "block",
        t.querySelector(".location-add-venue").style.display = "block",
        editExistingLocation(e),
        hideLocationInputs(),
        editingLocation = null
    } else {
        var o = addLocation(e);
        setTimeout(function() {
            saveLocationEdit(!1, function() {
                return handleAddVenue(o, e)
            }),
            checkLocationData(),
            showEditLocationInputs()
        }, 300)
    }
}
function handleTypeClick(e) {
    "{DA4AD338-1F22-4760-92E7-EB1A35F09959}" === e.target.value ? locationTypeOther.parentNode.classList.add("show") : locationTypeOther.parentNode.classList.remove("show")
}
function editLocationList() {
    for (var e = document.querySelectorAll(".section#club-location .list"), t = 0; t < e.length; t += 1)
        e[0].classList.contains("edit-list") ? (e[0].classList.remove("edit-list"),
        cancelLocationList(),
        document.getElementById("saveLocation").disabled = !1,
        document.getElementById("addLocationBtn").disabled = !1) : (e[0].classList.add("edit-list"),
        $("#saveLocationsList").show(),
        document.getElementById("saveLocation").disabled = !0,
        document.getElementById("addLocationBtn").disabled = !0)
}
function handleCancelVenue() {
    editingPool = null,
    document.querySelector("div.list-venue-form").classList.add("list-venue-form__fade"),
    currentLocation && ($(".location-add-venue").css("display", "block"),
    currentLocationId = null,
    currentLocation = null),
    venueNameInput.value = "",
    venueBulkheadCheckbox.checked = !1,
    venueCableCourseCheckbox.checked = !1,
    venueCableCourseSelect.value = "",
    venuePoolSelect.value = "",
    venueCableCourseInput.value = 0,
    openWaterTypeSelect.value = "",
    document.querySelector(".list-venue-form__cable-course-form").classList.add("list-venue-form__cable-course-form--fade")
}
function showLocationInputs() {
    if (handleCancelVenue(),
    handleCancelConfiguration(),
    sectionLocation) {
        document.getElementById("saveLocation").disabled = !0;
        var e = sectionLocation.querySelector(".location-inputs");
        e && locationDetails && ($(".locations-list__header").hide(),
        $("#addLocationBtn").hide(),
        $("#cancelAddLocationBtn").show(),
        $("#cancelAddLocationBtnFooter").show(),
        e.classList.add("show"),
        locationDetails.classList.add("show"),
        locationName.focus())
    }
}
function saveLocationList() {
    showLoadingOverlay();
    for (var e = sectionLocation.querySelectorAll(".list-item--fade-out"), t = 0; t < e.length; t += 1)
        e[t].parentNode.parentNode.removeChild(e[t].parentNode);
    for (var o = sectionLocation.querySelectorAll(".list-item--new"), n = 0; n < o.length; n += 1)
        o[n].classList.remove("list-item--new");
    var a = getLocations();
    checkLocationData(),
    $("#club-location").addClass("hasData");
    var i = new XMLHttpRequest;
    i.open("POST", "/apis/v1/clubweb/location/save", !0),
    i.setRequestHeader("Content-type", "application/json;charset=UTF-8"),
    i.withCredentials = !0,
    i.onload = function() {
        if (hideLoadingOverlay(),
        200 === i.status) {
            var e = JSON.parse(i.response)
              , t = sectionLocation.querySelector(".list");
            e.error ? showErrorModal(e.error) : (t.classList.remove("edit-list"),
            document.getElementById("saveLocation").disabled = !1,
            document.getElementById("addLocationBtn").disabled = !1)
        } else
            showErrorModal("Error saving location")
    }
    ,
    i.send(JSON.stringify({
        clubId: getUrlParams("clubId"),
        locations: a
    }))
}
function validateLocations() {
    var e = getLocations();
    if (!(0 !== e.length || regionalClub && regionalClub.checked))
        return !1;
    for (var t = 0; t < e.length; t += 1) {
        var o = sectionLocation.querySelector('input.location-id--value[value="' + e[t].locationId + '"]').parentNode;
        if (!o.querySelector(".venue__list--item"))
            return o.classList.add("has-error"),
            !1;
        if ("false" === e[t].isOpenWater)
            for (var n = o.querySelectorAll(".venue__list--item"), a = 0; a < n.length; a += 1)
                if (!n[a].querySelector(".configuration__list--item"))
                    return n[a].classList.add("has-error"),
                    !1
    }
    return !0
}
function showEditLocationInputs() {
    handleCancelConfiguration(),
    handleCancelVenue(),
    $(".list-item").addClass("is-edit"),
    $(".venue__list").removeClass("is-edit"),
    $(".location-add-venue").css("display", "block"),
    $(".location-add-configuration").css("display", "block"),
    $(".configuration__list").addClass("is-edit"),
    $(".list__controls").css("display", "inline-block"),
    $(".venue__list .list__controls").css("display", "block"),
    document.querySelector(".list.locations").classList.add("edit-list"),
    document.querySelector("#doneEditLocationBtn").style.display = "inline-block",
    document.querySelector("#editLocationBtn").style.display = "none"
}
function hideEditLocationInputs() {
    document.querySelector("#club-location .list.locations").classList.remove("edit-list"),
    document.querySelector("#club-location #doneEditLocationBtn").style.display = "none",
    $("#club-location .list-item").removeClass("is-edit"),
    $("#club-location .venue__list").removeClass("is-edit"),
    $("#club-location .location-add-venue").css("display", "none"),
    $("#club-location .location-add-configuration").css("display", "none"),
    $("#club-location .configuration__list").removeClass("is-edit"),
    $("#club-location .list__controls").css("display", "none"),
    checkLocationData()
}
var sectionLocation = document.querySelector(".section#club-location")
  , locationDetails = document.querySelector(".location-details")
  , locationName = document.querySelector("#locationName")
  , locationAddressStreet = document.getElementById("locationAddressStreet")
  , locationAddressCity = document.getElementById("locationAddressCity")
  , locationAddressState = document.getElementById("locationAddressState")
  , locationAddressZip = document.getElementById("locationAddressZip")
  , locationAddressStreetGoogle = document.getElementById("locationAddressStreet--google")
  , locationAddressLat = document.getElementById("locationAddressLat")
  , locationAddressLng = document.getElementById("locationAddressLng")
  , locationType = document.getElementById("locationType")
  , locationTypeOther = document.querySelector(".location-type--other")
  , locationTypeOtherInput = document.querySelector("#locationTypeOther")
  , venueNameInput = document.getElementById("venueName")
  , venuePoolSelect = document.getElementById("poolType")
  , venueOpenWaterSelect = document.getElementById("openWaterType")
  , venueCableCourseCheckbox = document.getElementById("venueCableCourse")
  , venueBulkheadCheckbox = document.getElementById("bulkhead")
  , venueCableCourseInput = document.getElementById("venueCableCourseValue")
  , venueCableCourseSelect = document.getElementById("venueCableCourseUnit")
  , configurationName = document.getElementById("configurationName")
  , configurationLanes = document.getElementById("configurationLanes")
  , configurationLength = document.getElementById("configurationLength")
  , configurationOtherLength = document.getElementById("configurationOtherLength")
  , configurationUsmsVerified = document.getElementById("usmsVerified")
  , configurationUsmsVerifiedDate = document.getElementById("usmsVerifiedDate")
  , openWaterTypeSelect = document.getElementById("openWaterType")
  , googlePlaceLocation = null
  , currentLocation = null
  , currentLocationId = null
  , currentVenue = null
  , editingLocation = null
  , editingPool = null
  , editingPoolConfiguration = null;
!function() {
    if (getCurrentLocations(),
    google) {
        var e = {
            componentRestrictions: {
                country: "us"
            },
            types: ["address"]
        };
        googlePlaceLocation = new google.maps.places.Autocomplete(locationAddressStreet,e),
        googlePlaceLocation.addListener("place_changed", handleLocationPlaceChanged),
        venueNameInput.addEventListener("input", function() {
            validateField(venueNameInput)
        }),
        venueCableCourseInput.addEventListener("input", function() {
            validateField(venueCableCourseInput)
        }),
        configurationName.addEventListener("input", function() {
            validateField(configurationName)
        }),
        configurationLanes.addEventListener("input", function() {
            validateField(configurationLanes)
        }),
        configurationOtherLength.addEventListener("input", function() {
            validateField(configurationOtherLength)
        }),
        configurationUsmsVerifiedDate.addEventListener("input", function() {
            validateField(configurationUsmsVerifiedDate)
        }),
        configurationLength.addEventListener("change", function() {
            handleConfigurationLengthChange()
        }),
        venueCableCourseSelect.addEventListener("change", function() {
            validateField(venueCableCourseSelect)
        }),
        venueOpenWaterSelect.addEventListener("change", function() {
            validateField(venueOpenWaterSelect)
        }),
        $('input[name="usmsVerifiedDate"]').mask("99/99/9999", {
            placeholder: "MM/DD/YYYY"
        })
    }
}();
"use strict";
function handleAbbrKeyPress(e) {
    return " " === e.key || "Spacebar" === e.key ? (e.preventDefault(),
    !1) : !0
}
function triggerChangeOnLmsc(e) {
    if ("createEvent"in document) {
        var t = document.createEvent("HTMLEvents");
        t.initEvent("change", !1, !0),
        e.dispatchEvent(t)
    } else
        e.fireEvent("onchange")
}
function addClubs(e) {
    var t = document.querySelector("select#selectClub");
    if (t && e && 0 !== e.length) {
        var a = t.value;
        a = a.replace("}", "").replace("{", "").toLowerCase(),
        t.innerHTML = "";
        for (var n = 0; n < e.length; n += 1) {
            var l = document.createElement("option");
            l.value = e[n].id,
            e[n].abbreviation ? l.innerHTML = e[n].name + " (" + e[n].abbreviation + ")" : l.innerHTML = "" + e[n].name,
            t.appendChild(l)
        }
        t.querySelector('option[value="' + a + '"]') && (t.value = a)
    }
}
function handleLmscChange() {
    var e = document.querySelector("#selectLmsc");
    validateField(e),
    document.querySelector('input[name="isWog"]') && getClubPricing();
    var t = document.querySelector("select#selectClub");
    if (t) {
        var a = new XMLHttpRequest;
        a.open("GET", "/apis/v1/clubsweb/v2/lmsc/" + e.value, !0),
        a.withCredentials = !0,
        a.onload = function() {
            var e = a.status;
            if (200 === e) {
                var t = JSON.parse(a.response);
                t.data ? addClubs(t.data.length > 0 ? t.data : [{
                    name: "Select Club",
                    id: ""
                }]) : showErrorModal(t.error)
            } else
                showErrorModal("Error updating clubs")
        }
        ,
        a.send()
    }
}
function editClubName(e) {
    e.preventDefault()
}
function cancelName() {}
function checkClubAbbr() {
    var e = new XMLHttpRequest
      , t = getUrlParams("wog")
      , a = document.querySelector("#clubAbbr");
    document.querySelector("#selectLmsc"),
    getUrlParams("clubId");
    return t ? e.open("GET", "/apis/v1/wogweb/abr/" + a.value, !0) : e.open("GET", "/apis/v1/club/abr/" + a.value, !0),
    e.withCredentials = !0,
    e.onload = function() {
        if (200 === e.status) {
            var t = JSON.parse(e.response);
            t.data || ($("#modalClubName").modal("show"),
            a.focus())
        } else
            showErrorModal("Error checking Club Abbreviation")
    }
    ,
    e.send(),
    !1
}
function validateSectionName() {
    var e = document.querySelector("#selectLmsc")
      , t = document.querySelector("#selectClub")
      , a = document.querySelector("#clubName")
      , n = document.querySelector("#clubAbbr");
    return validateField(e),
    validateField(a),
    validateField(n),
    t && validateField(t),
    sectionClubName.querySelector("span.has-error") ? (hideLoadingOverlay(),
    window.scroll(0, FindPos(sectionClubName.querySelectorAll("span.help-block.has-error")[0])),
    !1) : !0
}
function saveName(e) {
    if (e.preventDefault(),
    showLoadingOverlay(),
    validateSectionName()) {
        sectionClubName.classList.add("hasData");
        var t = document.querySelector("#selectLmsc")
          , a = document.querySelector("#selectClub")
          , n = document.querySelector("#clubName")
          , l = document.querySelector("#clubAbbr")
          , r = new XMLHttpRequest
          , o = (document.getElementById("form-name"),
        new FormData)
          , c = getUrlParams("clubId")
          , u = getUrlParams("wog");
        o.append("clubName", n.value),
        o.append("clubAbbr", l.value),
        o.append("selectLmsc", t.value),
        a && (o.append("selectClub", a.value),
        o.append("wog", u)),
        r.open("POST", "/apis/v1/clubweb/section/name?clubId=" + c, !0),
        r.withCredentials = !0,
        r.onload = function() {
            hideLoadingOverlay();
            var e = r.status;
            if (200 === e) {
                var n = JSON.parse(r.response);
                if (n.data) {
                    var o = n.data.clubName
                      , c = n.data.id
                      , u = "" + window.location.origin + window.location.pathname + "?clubId=" + c;
                    t && t.value && (t.disabled = !0),
                    a && a.value && (a.disabled = !0),
                    l && l.value && (l.disabled = !0),
                    history.replaceState({}, o, u),
                    cancelName(),
                    document.getElementById("clubItemId") && (document.getElementById("clubItemId").value = c),
                    nextSection ? ($(nextSection).find(".section__content").collapse("show"),
                    nextSection = null) : $("#club-details .section__content").collapse("show")
                } else {
                    var i = n.error;
                    i.includes("workout group abbreviation") && (l.disabled = !1),
                    showErrorModal(n.error),
                    hideLoadingOverlay()
                }
            } else
                showErrorModal("Error saving club information"),
                hideLoadingOverlay()
        }
        ,
        r.send(o)
    }
}
var sectionClubName = document.querySelector("#club-name");
!function() {
    var e = document.querySelector("#selectLmsc")
      , t = document.querySelector("#selectClub")
      , a = document.querySelector("#clubName")
      , n = document.querySelector("#clubAbbr");
    e.addEventListener("change", handleLmscChange),
    e.value && a.value && n.value ? (document.querySelector("#club-name").classList.add("hasData"),
    setTimeout(function() {
        window.scroll(0, FindPos(document.querySelector(".club-edit__introduction")))
    }, 750)) : ($(sectionClubName).find(".section__content").collapse("show"),
    sectionClubName.classList.add(".isEdit")),
    a.addEventListener("input", function() {
        validateField(a)
    }),
    n.addEventListener("input", function() {
        validateField(n)
    }),
    n.addEventListener("change", function() {
        checkClubAbbr()
    }),
    n.addEventListener("keypress", function(e) {
        handleAbbrKeyPress(e)
    }),
    e && e.value && (triggerChangeOnLmsc(e),
    e.disabled = !0),
    t && t.value && (t.disabled = !0),
    n && n.value && (n.disabled = !0),
    currentSectionState = saveSectionState(sectionClubName)
}();
"use strict";
function hideAgreementError() {
    document.querySelector(".help-block--agreeTerms").classList.remove("has-error")
}
function showAgreementError() {
    document.querySelector(".help-block--agreeTerms").classList.add("has-error")
}
function checkAgreement() {
    var e = document.querySelector(".payment-info");
    e && (e.querySelector('input[name="agree-terms"]').checked ? hideAgreementError() : showAgreementError())
}
function showPaymentError(e) {
    document.querySelector("#modalPayment .modal-body > p") ? (document.querySelector("#modalPayment .modal-body > p").innerHTML = e,
    $("#modalPayment").modal("show")) : showErrorModal(e)
}
function ValidatePaymentForm() {
    var e = document.querySelector(".payment-info");
    return e ? (validateField(e.querySelector('input[name="cardName"]')),
    validateField(e.querySelector('input[name="cardNumber"]')),
    validateField(e.querySelector('input[name="cardCode"]')),
    validateField(e.querySelector('input[name="expiration"]')),
    validateField(e.querySelector('input[name="cardZip"]')),
    checkAgreement(),
    0 === e.querySelectorAll("span.help-block.has-error").length) : !1
}
function setClubExpYear() {
    var e = document.querySelector(".agree-terms--year")
      , t = new XMLHttpRequest;
    t.open("GET", "/apis/v1/clubweb/regyear", !0),
    t.withCredentials = !0,
    t.onload = function() {
        if (200 === t.status) {
            var a = JSON.parse(t.response);
            if (!a.error) {
                var r = Number(a.data);
                if (!e)
                    return;
                e && (e.innerHTML = r)
            }
        }
    }
    ,
    t.send()
}
function editPayment(e) {
    e.preventDefault();
    var t = document.querySelector("#club-payment");
    setSectionInputStatus(t, !1)
}
function submitPayment() {
    var e = document.querySelector(".payment-info");
    if (!e)
        return void hideLoadingOverlay();
    var t = new XMLHttpRequest
      , a = new FormData
      , r = getUrlParams("clubId");
    a.append("BillingName", e.querySelector('input[name="cardName"]').value),
    a.append("BillingZip", e.querySelector('input[name="cardZip"]').value),
    a.append("BillingAmount", e.querySelector('input[name="billingAmount"]').value),
    a.append("Nonce", e.querySelector('input[name="dataValue"]').value),
    a.append("ClubID", r),
    a.append("ClubItemId", e.querySelector('input[name="clubItemId"]').value),
    t.open("POST", "/apis/v1/clubweb/payment/save", !0),
    t.withCredentials = !0,
    t.onload = function() {
        if (200 === t.status) {
            var e = JSON.parse(t.response);
            e.error ? (hideLoadingOverlay(),
            showPaymentError(e.error)) : window.location.href = e.data.confirmationPage
        } else
            hideLoadingOverlay(),
            showPaymentError("Error sending payment")
    }
    ,
    t.send(a)
}
function getClubPricing() {
    var e = new XMLHttpRequest
      , t = new FormData
      , a = document.querySelector('select[name="SelectLmsc"]').value;
    a && (t.append("SelectedLmsc", a),
    document.querySelector('input[name="isWog"]') ? t.append("IsWog", document.querySelector('input[name="isWog"]').value || !1) : t.append("IsWog", !1),
    e.open("POST", "/apis/v1/clubweb/getpricing", !0),
    e.withCredentials = !0,
    e.onload = function() {
        if (200 === e.status) {
            var t = JSON.parse(e.response);
            if (t.error)
                showPaymentError(t.error);
            else {
                var a = Number(t.data.UsmsCost)
                  , r = Number(t.data.LmscCost)
                  , n = a + r;
                document.querySelector(".section-payment .section-payment__usms-cost").innerHTML = "$" + n.toFixed(2)
            }
        } else
            showPaymentError("Error updating pricing")
    }
    ,
    e.send(t))
}
function responseHandler(e) {
    var t = document.querySelector(".payment-info");
    if (!t)
        return void hideLoadingOverlay();
    var a = "";
    if ("Error" === e.messages.resultCode) {
        for (var r = 0; r < e.messages.message.length; r += 1) {
            var n = e.messages.message[r];
            switch (n.code) {
            case "E_WC_05":
                setInputStatus(t.querySelector('input[name="cardNumber"]'), !1),
                a += n.text;
                break;
            case "E_WC_06":
            case "E_WC_07":
            case "E_WC_08":
                setInputStatus(t.querySelector('input[name="expiration"]'), !1),
                a += n.text;
                break;
            case "E_WC_15":
                setInputStatus(t.querySelector('input[name="cardCode"]'), !1),
                a += n.text;
                break;
            default:
                a += n.text
            }
        }
        return hideLoadingOverlay(),
        void showPaymentError(a)
    }
    e && e.opaqueData && e.opaqueData.dataDescriptor && e.opaqueData.dataValue ? (t.querySelector('input[name="dataDesc"]').value = e.opaqueData.dataDescriptor,
    t.querySelector('input[name="dataValue"]').value = e.opaqueData.dataValue,
    submitPayment()) : hideLoadingOverlay()
}
function getSecureData() {
    var e = document.querySelector(".payment-info");
    if (!e)
        return !1;
    var t = e.querySelector('input[name="expiration"]').value
      , a = t.substring(0, t.indexOf("/"))
      , r = t.substring(t.indexOf("/") + 1);
    return {
        cardData: {
            cardNumber: e.querySelector('input[name="cardNumber"]').value,
            month: a,
            year: r,
            cardCode: e.querySelector('input[name="cardCode"]').value,
            cardZip: e.querySelector('input[name="cardZip"]').value
        },
        authData: {
            clientKey: e.querySelector('input[name="clientKey"]').value,
            apiLoginID: e.querySelector('input[name="loginId"]').value
        }
    }
}
function handleAgreementChange(e) {
    document.querySelector('input[name="agree-terms"]').checked ? hideAgreementError() : showAgreementError()
}
function validateSectionsForPayment() {
    var e = document.querySelector(".section__content.collapse.in");
    if (e) {
        var t = !1;
        switch (e.id) {
        case "club-name__content":
            t = compareSections(e);
            break;
        case "club-details__content":
            t = compareSections(e);
            break;
        case "club-contact__content":
            t = compareSections(e)
        }
        if (!t)
            return hideLoadingOverlay(),
            showSaveModal(e.querySelector("button.btn.save-section").onclick),
            !1
    }
    return validateSectionName() ? validateSectionDetails() ? validateSectionContact() && validateContactStatus() ? regionalClub && regionalClub.checked ? !0 : validateGoldClubs() ? validateLocations() ? !0 : (hideLoadingOverlay(),
    $("#club-location .section__content").collapse("show"),
    !1) : (hideLoadingOverlay(),
    $("#gold-club .section__content").collapse("show"),
    !1) : (hideLoadingOverlay(),
    $("#club-contact .section__content").collapse("show"),
    !1) : (hideLoadingOverlay(),
    $("#club-details .section__content").collapse("show"),
    !1) : (hideLoadingOverlay(),
    $("#club-name .section__content").collapse("show"),
    !1)
}
function validateContactStatus() {
    document.querySelector(".section-payment__contact-pending").style.display = "block";
    var e = 0 === document.querySelectorAll("#club-contact .list-item div.coach-validated").length;
    return setSubmitStatus(e),
    e
}
function submitCreditCard(e) {
    if (e.preventDefault(),
    showLoadingOverlay(),
    !validateSectionsForPayment())
        return void hideLoadingOverlay();
    if (ValidatePaymentForm()) {
        var t = getSecureData();
        t ? Accept.dispatchData(t, responseHandler) : hideLoadingOverlay()
    } else {
        var a = document.querySelector(".payment-info");
        a.querySelectorAll("input.has-error")[0] && (window.scroll(0, FindPos(a.querySelectorAll("input.has-error")[0])),
        hideLoadingOverlay())
    }
}
!function() {
    $('input[name="expiration"]').mask("09/09"),
    setClubExpYear(),
    document.querySelector('input[name="isWog"]') && getClubPricing()
}();
"use strict";
function getUrlParams(o) {
    var e = new URL(document.location).searchParams;
    return e.get(o)
}
function setSectionInputStatus(o, e) {
    if (o && "club-name__content" !== o.id) {
        for (var n = o.querySelectorAll("input"), t = 0; t < n.length; t++)
            n[t].disabled = e;
        for (var a = o.querySelectorAll("button"), l = 0; l < a.length; l++)
            -1 === a[l].className.indexOf("section__edit-btn") && (a[l].disabled = e);
        for (var r = o.querySelectorAll("select"), d = 0; d < r.length; d++)
            r[d].disabled = e;
        for (var i = o.querySelectorAll("textarea"), c = 0; c < i.length; c++)
            i[c].disabled = e
    }
}
function FindPos(o) {
    if (("undefined" == typeof o ? "undefined" : _typeof(o)) || !o)
        return 0;
    var e = 0;
    if (o.offsetParent)
        do
            e += o.offsetTop;
        while (o = o.offsetParent);
    return e
}
function showSaveModal(o) {
    o ? (currentCallback = o,
    $("#modalSaveSection").modal("show")) : console.error("No callback function set for save modal")
}
function closeSaveModal() {
    $("#modalSaveSection").modal("hide")
}
function closeConfirmationModal() {
    $("#modalConfirmation").modal("hide")
}
function showConfirmationModal(o, e) {
    document.querySelector("#modalConfirmation .modal-body p").innerHTML = o,
    e && $("#modalConfirmation button.btn-success").on("click", e),
    $("#modalConfirmation").modal("show")
}
function showMessageModal(o) {
    document.querySelector("#modalMessage .modal-body p").innerHTML = o,
    $("#modalMessage").modal("show")
}
function showApprovalMessageModal(o) {
    document.querySelector("#modalMessageApproval .modal-body p").innerHTML = o,
    $("#modalMessageApproval").modal("show")
}
function closeMessageModal() {
    document.querySelector("#modalMessage .modal-body p").innerHTML = "",
    $("#modalMessage").modal("hide")
}
function closeApprovalMessageModal() {
    document.querySelector("#modalMessageApproval .modal-body p").innerHTML = "",
    $("#modalMessageApproval").modal("hide"),
    location.replace("/club-central/club-dashboard/")
}
function showLoadingOverlay() {
    var o = document.querySelector(".loading");
    o && (o.style.display = "flex"),
    setTimeout(function() {
        hideLoadingOverlay()
    }, 45e3)
}
function hideLoadingOverlay() {
    var o = document.querySelector(".loading");
    o && (o.style.display = "none")
}
function scrollLoginBegin() {
    document.querySelector(".form-complete-message") && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && $([document.documentElement, document.body]).animate({
        scrollTop: $(".form-complete-message").offset().top
    }, 250)
}
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
    return typeof o
}
: function(o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o
}
;
$(window).on("load", function() {
    $('[data-toggle="tooltip"]').tooltip(),
    $('[data-toggle="popover"]').popover(),
    scrollLoginBegin()
});
"use strict";
function findFormGroup(e) {
    var t = e.parentNode;
    return t.classList.contains("form-group") ? t : findFormGroup(t)
}
function sectionContainsErrors(e) {
    return e ? null !== e.querySelector("span.has-error") : (console.error("[sectionContainsErrors] - Section is undefined or null"),
    !0)
}
function setInputStatus(e, t) {
    e.classList.remove("has-success"),
    e.classList.remove("has-error");
    try {
        if (t) {
            if (e.classList.add("has-success"),
            e.parentNode.classList.contains("form-group") && (e.parentNode.classList.remove("has-error"),
            e.parentNode.classList.add("has-success")),
            "loginEmail" === e.id || "loginGuestEmail" === e.id)
                return e.parentNode.querySelector("span.help-block").classList.remove("has-error"),
                void e.parentNode.querySelector("span.help-block").classList.add("has-success");
            "file" === e.type ? e.parentNode.parentNode.querySelector("span.help-block").classList.remove("has-error") : document.querySelector("span.help-block--" + e.name) && document.querySelector("span.help-block--" + e.name).classList.remove("has-error")
        } else {
            if (e.classList.add("has-error"),
            e.parentNode.classList.contains("form-group") && (e.parentNode.classList.add("has-error"),
            e.parentNode.classList.remove("has-success")),
            "loginEmail" === e.id || "loginGuestEmail" === e.id)
                return e.parentNode.querySelector("span.help-block").classList.add("has-error"),
                void e.parentNode.querySelector("span.help-block").classList.remove("has-success");
            "file" === e.type ? e.parentNode.parentNode.querySelector("span.help-block").classList.add("has-error") : document.querySelector("span.help-block--" + e.name) && document.querySelector("span.help-block--" + e.name).classList.add("has-error")
        }
    } catch (a) {
        console.error(a)
    }
}
function isValidUrl(e) {
    var t = /[-a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?/gi;
    return t.test(e)
}
function isValidEmail(e) {
    var t = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return t.test(String(e).toLowerCase())
}
function isValidPhone(e) {
    var t = /^[0-9]{3}-?[0-9]{3}-?[0-9]{4}$/;
    return t.test(e)
}
function IsValidZip(e) {
    var t = /^\d{5}([-\s]\d{4})?$/;
    return t.test(e)
}
function IsValidCvv(e) {
    var t = /^\d{3,4}$/;
    return t.test(e)
}
function IsValidExpiration(e) {
    var t = /^[0-9]{1,2}\/[0-9]{1,2}$/;
    if (!t.test(e))
        return !1;
    var a = e.substring(0, e.indexOf("/"))
      , n = e.substring(e.indexOf("/") + 1)
      , r = (new Date).getMonth()
      , o = Number((new Date).getFullYear().toString().substring(2))
      , l = new Date(o,r)
      , i = new Date(n,a - 1);
    return i >= l
}
function IsValidCardNumber(e) {
    var t = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})|(?:3\d{15})$/;
    return t.test(e)
}
function ValidateSocialUrl(e) {
    var t = isValidUrl("www.test.com/" + e.value);
    return setInputStatus(e, t),
    t
}
function ValidateUrl(e) {
    var t = isValidUrl(e.value);
    return setInputStatus(e, t),
    t
}
function ValidateTextArea(e) {
    var t = e.value.length > 0;
    return setInputStatus(e, t),
    t
}
function ValidatePhone(e) {
    var t = isValidPhone(e.value);
    return setInputStatus(e, t),
    t
}
function ValidateText(e) {
    var t = !1;
    return t = e.minLength ? -1 === e.minLength ? e.value.length > 0 : e.value.length >= e.minLength && e.value.length <= e.maxLength : e.value.length > 0,
    setInputStatus(e, t),
    t
}
function ValidateEmail(e) {
    var t = isValidEmail(e.value);
    setInputStatus(e, t)
}
function ValidateSelect(e) {
    var t = "-1" !== e.value && "" !== e.value;
    setInputStatus(e, t)
}
function ValidateZip(e) {
    setInputStatus(e, IsValidZip(e.value))
}
function ValidateCardCode(e) {
    setInputStatus(e, IsValidCvv(e.value))
}
function ValidateExpiration(e) {
    setInputStatus(e, IsValidExpiration(e.value))
}
function ValidateCardNumber(e) {
    setInputStatus(e, IsValidCardNumber(e.value))
}
function ValidateRadio(e) {
    var t = null !== document.querySelector("input[name=" + e.name + "]:checked");
    setInputStatus(e, t)
}
function validateField(e) {
    if (!e)
        return !1;
    switch (e.type) {
    case "text":
        "socialFacebook" === e.id || "socialTwitter" === e.id || "socialInstagram" === e.id ? ValidateSocialUrl(e) : "cardNumber" === e.id ? ValidateCardNumber(e) : "cardCode" === e.id ? ValidateCardCode(e) : "cardZip" === e.id ? ValidateZip(e) : "expiration" === e.id ? ValidateExpiration(e) : -1 !== e.id.toLowerCase().indexOf("phone") ? ValidatePhone(e) : ValidateText(e);
        break;
    case "textarea":
        ValidateTextArea(e);
        break;
    case "email":
        ValidateEmail(e);
        break;
    case "select-one":
        ValidateSelect(e);
        break;
    case "radio":
        ValidateRadio(e);
        break;
    case "tel":
        ValidatePhone(e);
        break;
    case "url":
        ValidateUrl(e);
        break;
    default:
        ValidateText(e)
    }
}
function handleInputBlur(e) {
    validateField(e)
}
function showErrorModal(e) {
    document.querySelector("#modalError .modal-body > p").innerHTML = e,
    $("#modalError").modal("show")
}
function closeErrorModal() {
    document.querySelector("#modalError .modal-body > p").innerHTML = "",
    $("#modalError").modal("hide")
}
function deepEqual(e, t) {
    if ("object" === ("undefined" == typeof e ? "undefined" : _typeof(e)) && null !== e && "object" === ("undefined" == typeof t ? "undefined" : _typeof(t)) && null !== t) {
        var a = [0, 0];
        for (var n in e)
            a[0] += 1;
        for (var r in t)
            a[1] += 1;
        if (a[0] - a[1] !== 0)
            return !1;
        for (var o in e)
            if (!(o in t && deepEqual(e[o], t[o])))
                return !1;
        for (var l in t)
            if (!(l in e && deepEqual(t[l], e[l])))
                return !1;
        return !0
    }
    return e === t
}
function compareSections(e) {
    var t = saveSectionState(e);
    return deepEqual(currentSectionState, t)
}
function saveSectionState(e) {
    if (!e)
        return null;
    for (var t = {
        inputs: [],
        selects: [],
        textareas: []
    }, a = e.querySelectorAll('input:not([type="file"])'), n = e.querySelectorAll("select"), r = e.querySelectorAll("textarea"), o = 0; o < a.length; o += 1) {
        var l = a[o];
        t.inputs.push({
            name: l.name,
            id: l.id,
            value: l.value,
            checked: l.checked,
            type: l.type
        })
    }
    for (var i = 0; i < n.length; i += 1) {
        var s = n[i];
        t.selects.push({
            name: s.name,
            id: s.id,
            value: s.value.replace("{", "").replace("}", "").toUpperCase()
        })
    }
    for (var u = 0; u < r.length; u += 1) {
        var c = r[u];
        t.textareas.push({
            name: c.name,
            id: c.id,
            value: c.value
        })
    }
    return t
}
function sectionSaved(e) {
    var t = !1;
    switch (e.id) {
    case "club-location__content":
        t = validateLocations();
        break;
    case "club-contact__content":
        t = null === e.querySelector(".list-item--new,.list__container--modified,.location-details.show,.edit-list") && null !== e.querySelector(".list-item:not(.list-item--new)");
        break;
    case "club-name__content":
    case "club-details__content":
    case "gold-club__content":
        t = compareSections(e)
    }
    return t
}
function setSubmitStatus(e) {
    e ? (document.querySelector(".section-payment__contact-pending").style.display = "none",
    document.querySelector("#club-payment button#saveClubName") && (document.querySelector("#club-payment button#saveClubName").disabled = !1),
    document.querySelector("#club-payment button#submit-button") && (document.querySelector("#club-payment button#submit-button").disabled = !1)) : (document.querySelector(".section-payment__contact-pending").style.display = "block",
    document.querySelector("#club-payment button#saveClubName") && (document.querySelector("#club-payment button#saveClubName").disabled = !0),
    document.querySelector("#club-payment button#submit-button") && (document.querySelector("#club-payment button#submit-button").disabled = !0))
}
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e
}
: function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
}
;
//# sourceMappingURL=../../maps/Scripts/Club/club2.js.map
