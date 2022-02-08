let mobile = window.matchMedia('(max-width: 575px)');
let items = document.querySelectorAll('.article-stepper .carousel .carousel-item')
if (mobile.matches == false) {
    items.forEach((el) => {
    const minPerSlide = 4
    let next = el.nextElementSibling
    for (var i=1; i<minPerSlide; i++) {
        if (!next) {
                // wrap carousel by using first child
            next = items[0]
            }
        let cloneChild = next.cloneNode(true)
        el.appendChild(cloneChild.children[0])
        next = next.nextElementSibling
    }
    })
}
