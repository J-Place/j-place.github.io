(function () {
  const INTERVAL_MS = 5000;

  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const slides = Array.from(document.querySelectorAll('.carousel__slide'));
  const slideCount = slides.length;
  if (slideCount < 2) return;

  // Clone first slide and append so wrap-around always animates left
  carousel.appendChild(slides[0].cloneNode(true));

  const navItems = Array.from(document.querySelectorAll('.carousel-nav__item'));
  let pos = 0;

  function setNavActive(id) {
    document.querySelector('.carousel-nav__item--active').classList.remove('carousel-nav__item--active');
    document.querySelector(`#carousel-nav__item-${id}`).classList.add('carousel-nav__item--active');
  }

  function slideTo(index, instant) {
    if (instant) carousel.style.transition = 'none';
    carousel.style.left = `-${index * 100}%`;
    if (!instant) setNavActive(index % slideCount);
  }

  function next() {
    pos += 1;
    slideTo(pos, false);
    if (pos === slideCount) {
      carousel.addEventListener('transitionend', function reset() {
        carousel.removeEventListener('transitionend', reset);
        pos = 0;
        slideTo(0, true);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          carousel.style.transition = '';
        }));
      });
    }
  }

  setInterval(next, INTERVAL_MS);

  navItems.forEach(item => {
    item.querySelector('.carousel-nav__item-button').addEventListener('click', function () {
      const id = Number(item.id.substring(item.id.lastIndexOf('-') + 1));
      pos = id;
      slideTo(id, false);
    });
  });

  const prevBtn = document.querySelector('.carousel-previous-button');
  const nextBtn = document.querySelector('.carousel-next-button');
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      const logicalPos = pos % slideCount;
      pos = logicalPos === 0 ? slideCount - 1 : logicalPos - 1;
      slideTo(pos, false);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', next);
  }
})();
