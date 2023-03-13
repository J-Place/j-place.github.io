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
    }, 450))
    switch (setSectionInputStatus(e, !1),
    e.parentElement.classList.add(".isEdit"),
    e.id) {
        case "event-type__content":
        case "event-information__content":
        case "contact-information__content":
        case "contact-information__content":
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
    console.log("Click Header" + nextSection);
    var e = t.target.parentNode
      , n = document.querySelector(".section__content.collapse.in");
    n && (sectionSaved(n) ? nextSection = null : (nextSection = e,
    t.stopPropagation(),
    t.preventDefault()),
    showSaveModal(n.querySelector("button.btn.save-section").onclick))
}),
$("#accordion .collapse").on("hide.bs.collapse", function(t) {
    var e = t.target;
    setSectionInputStatus(e, !0),
    e.parentElement.classList.remove("isEdit")
});
function getUrlParams(o) {
    var e = new URL(document.location).searchParams;
    return e.get(o)
}
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
// function findFormGroup(e) {
//     var t = e.parentNode;
//     return t.classList.contains("form-group") ? t : findFormGroup(t)
// }
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

        case "event-type__content":
        case "event-information__content":
        case "contact-information__content":
        case "contact-information__content":
        case "location-information__content":
        case "entry-information__content":
        case "accept-submit__content":
    
        t = compareSections(e)
    }
    return t
}

// function setSubmitStatus(e) {
//     e ? (document.querySelector(".section-payment__contact-pending").style.display = "none",
//     document.querySelector("#club-payment button#saveClubName") && (document.querySelector("#club-payment button#saveClubName").disabled = !1),
//     document.querySelector("#club-payment button#submit-button") && (document.querySelector("#club-payment button#submit-button").disabled = !1)) : (document.querySelector(".section-payment__contact-pending").style.display = "block",
//     document.querySelector("#club-payment button#saveClubName") && (document.querySelector("#club-payment button#saveClubName").disabled = !0),
//     document.querySelector("#club-payment button#submit-button") && (document.querySelector("#club-payment button#submit-button").disabled = !0))
// }
// var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
//     return typeof e
// }
// : function(e) {
//     return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
// }

;