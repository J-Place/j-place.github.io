"use strict";

function toggleMobileNav() {
    var t = document.getElementById("navList"),
        s = window.screen.height;
    if (mobile && t.classList.contains("show")) t.classList.remove("show"), document.querySelector(".article-nav-title").classList.remove("open"), document.querySelector("body").style.overflow = "scroll";
    else {
        if (!mobile || t.classList.contains("show")) return !1;
        t.classList.add("show"), document.querySelector(".article-nav-title").classList.add("open"), document.querySelector("body").style.overflow = "hidden"
    }
    document.querySelector("#navList").style.maxHeight = s - 50 + "px"
}
var mobile = window.matchMedia("screen and (max-width:991px)").matches;
mobile && document.querySelector(".article-nav") && document.querySelector(".article-nav").classList.add("mobile"), document.addEventListener("DOMContentLoaded", function() {
    function t() {
        for (var t = c ? document.querySelectorAll(".section div + div h2, .section div + div h3") : document.querySelectorAll(".section div + div h2"), s = 0; s < t.length; s++) {
            var e = t[s].innerText,
                i = e = e.replace(/\s/g, "").replace(/[!"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}~]/g, "");
            t[s].id = i
        }
    }
    function s() {
        for (var t = c ? document.querySelectorAll(".section div + div h2, .section div + div h3") : document.querySelectorAll(".section div + div h2"), s = "", e = function(e) {
            return navList.some(function(s) {
                return s.Href === t[e].id
            }) ? (o = t[e], n = o.offsetParent.getBoundingClientRect().top, l = n + t[e].offsetTop, r = "", l < window.screenTop + 90 ? r = " active" : l > window.screenTop ? r = "" : l >= -100 && 100 >= l && (r = " active"), void(s += '<li class="' + t[e].tagName + "link" + r + '"><a href="#' + t[e].id + '">' + t[e].innerHTML + "</a></li>")) : "continue"
        }, i = 0; i < t.length; i++) {
            var o, n, l, r;
            e(i)
        }
        document.getElementById("navList").innerHTML = s
    }
    function e() {
        mobile ? (window.scrollY < v && (i.style.top = "0px", i.classList.remove("sticky-start"), i.classList.remove("sticky-end")), window.scrollY >= v && (i.style.top = "0px", i.classList.add("sticky-start"), i.classList.remove("sticky-end")), !i.classList.contains("sticky-start") && !i.classList.contains("sticky-end") && window.scrollY >= v && window.scrollY <= u && (i.classList.add("sticky-start"), i.style.top = "0px"), !i.classList.contains("sticky-start") && i.classList.contains("sticky-end") && window.scrollY >= v && window.scrollY <= u + n && (i.classList.add("sticky-start"), i.classList.remove("sticky-end"), i.style.top = "0px"), i.classList.contains("sticky-start") && window.scrollY >= v && window.scrollY >= u - n - n && (i.classList.remove("sticky-start"), i.classList.add("sticky-end"), i.style.top = "0px")) : mobile || (window.scrollY < v && !i.classList.contains("sticky-start") && (i.style.top = "0px"), window.scrollY < v && i.classList.contains("sticky-start") && (i.classList.remove("sticky-start"), i.style.top = "0px"), window.scrollY >= v && window.scrollY <= u && !i.classList.contains("sticky-start") && !i.classList.contains("sticky-end") && (i.classList.add("sticky-start"), i.style.top = "0px"), window.scrollY >= v && window.scrollY <= u - n && !i.classList.contains("sticky-start") && i.classList.contains("sticky-end") && (i.classList.add("sticky-start"), i.classList.remove("sticky-end"), i.style.top = "0px"), window.scrollY >= u - n - 140 && i.classList.contains("sticky-start") && (i.classList.remove("sticky-start"), i.classList.add("sticky-end"), i.style.top = "0px"))
    }
    var i = document.querySelector(".article-nav");
    if (i) {
        for (var o = i.classList.contains("article-nav--Scroll"), c = i.classList.contains("article-nav--DisplayH3"), n = i.offsetHeight, l = document.querySelectorAll("h2"), r = null, a = function(t) {
            return navList.some(function(s) {
                return s.href === l[t].id
            }) ? (r = l[t], "break") : void 0
        }, d = 0; d < l.length; d += 1) {
            var y = a(d);
            if ("break" === y) break
        }
        r || (r = document.querySelector("h2"));
        var v = o ? r.offsetTop : i.offsetTop,
            u = document.querySelector("footer").offsetTop;
        window.scrollY >= v && window.scrollY <= u && (i.classList.add("sticky-start"), i.classList.remove("sticky-end")), mobile && (i.style.top = "30px"), t(), window.addEventListener("scroll", s), s();
        var w = document.querySelector("#navList"),
            m = document.querySelector(".article-nav-title");
        document.body.addEventListener("click", function(t) {
            return mobile && window.scrollY < v - 70 && document.querySelector(".section").scrollIntoView(), mobile && window.scrollY < v && m.contains(t.target) && (i.style.top = "0px"), mobile && w.contains(t.target) ? void toggleMobileNav() : !1
        }), window.addEventListener("scroll", e), e()
    }
});
"use strict";

//# sourceMappingURL=../../maps/Scripts/SwimmerMagazine/swimmerMagazine.js.map