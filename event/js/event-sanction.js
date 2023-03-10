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
  , currentCallback = null;
$("#accordion .collapse").on("show.bs.collapse", function(t) {
    var e = t.target;
    if (setTimeout(function() {
        window.scroll(0, FindPos(t.target.parentNode))
    }, 450))
    switch (setSectionInputStatus(e, !1),
    e.parentElement.classList.add("isEdit"),
    e.id) {
    case "event-type__content":
    case "event-information__content":
        // getCurrentLocations();
        // break;
    case "contact-information__content":
        // setGoldClubFlag();
        // break;
    case "location-information__content":
    case "entry-information__content":
    case "accept-submit__content":
        currentSectionState = saveSectionState(e)
    }
    var n = $("#accordion").find(".in, .collapsing");
    n.each(function(t, e) {
        e !== nextSection && $(e).collapse("hide")
    })
}),
$("#accordion h3.section__header").on("click", function(t) {
    console.log("Click Header");
    var e = t.target.parentNode
      , n = document.querySelector(".section__content.collapse.in");
    n && (sectionSaved(n) ? nextSection = null : (nextSection = e,
    t.stopPropagation(),
    t.preventDefault()
    // showSaveModal(n.querySelector("button.btn.save-section").onclick))
    ))
}),
$("#accordion .collapse").on("hide.bs.collapse", function(t) {
    var e = t.target;
    setSectionInputStatus(e, !0),
    e.parentElement.classList.remove("isEdit")
});
"use strict";
function setSectionInputStatus(o, e) {
    if (o && "event-type__content" !== o.id) {
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
"use strict";
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
    return typeof o
}
: function(o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o
}
;
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
    case "event-type__content":
        // t = validateLocations();
        // break;
    case "event-information__content":
        // t = null === e.querySelector(".list-item--new,.list__container--modified,.location-details.show,.edit-list") && null !== e.querySelector(".list-item:not(.list-item--new)");
        // break;
    case "contact-information__content":
    case "location-information__content":
    case "entry-information__content":
        // t = compareSections(e)
    case "accept-submit__content":
    }
    return t
}
