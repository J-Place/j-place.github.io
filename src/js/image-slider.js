(function () {
  const INTERVAL_MS = 4000;
  const root = document.querySelector('.image-slider');
  if (!root) return;

  const ul = root.querySelector('.image-slider__slider');
  const items = Array.from(root.querySelectorAll('.image-slider__slider-item'));
  const count = items.length;
  if (count < 2) return;

  function setSlidesOrder(refIndex) {
    let order = 1;
    let i = refIndex;
    for (let n = 0; n < count; n += 1) {
      if (i === count) i = 0;
      items[i].style.order = order;
      order += 1;
      i += 1;
    }
  }

  function getRefIndex() {
    const ref = ul.querySelector('.image-slider__slider-item.is-ref');
    if (!ref) return 0;
    return Number(ref.id.substring(ref.id.lastIndexOf('-') + 1));
  }

  function advance(reverse) {
    const current = getRefIndex();
    const next = reverse
      ? (current === 0 ? count - 1 : current - 1)
      : (current === count - 1 ? 0 : current + 1);

    ul.classList[reverse ? 'add' : 'remove']('is-reversing');

    items[current].classList.remove('is-ref');
    items[next].classList.add('is-ref');
    setSlidesOrder(next);

    ul.classList.remove('is-set');
    setTimeout(() => ul.classList.add('is-set'), 50);
  }

  // Init
  items[0].classList.add('is-ref');
  setSlidesOrder(0);
  ul.classList.add('is-set');

  const timer = setInterval(() => advance(false), INTERVAL_MS);

  root.querySelector('.image-slider__button-next').addEventListener('click', () => {
    clearInterval(timer);
    advance(false);
  });
  root.querySelector('.image-slider__button-previous').addEventListener('click', () => {
    clearInterval(timer);
    advance(true);
  });
})();
