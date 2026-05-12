function handleYearChange(year) {
  var allIssues = document.querySelectorAll('.magazine-issue');
  allIssues.forEach(function(issue) {
    if (issue.getAttribute('data-year') === year) {
      issue.style.display = 'block';
      issue.classList.remove('fade');
    } else {
      issue.style.display = 'none';
      issue.classList.add('fade');
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var widget   = document.querySelector('.year-select');
  var trigger  = widget.querySelector('.year-select__trigger');
  var valueEl  = widget.querySelector('.year-select__value');
  var list     = widget.querySelector('.year-select__list');
  var options  = Array.from(list.querySelectorAll('.year-select__option'));
  var focusIdx = 0;

  function open() {
    widget.classList.add('year-select--open');
    var sel = list.querySelector('.is-selected');
    focusIdx = sel ? options.indexOf(sel) : 0;
    setFocus(focusIdx);
    widget.setAttribute('aria-expanded', 'true');
  }

  function close() {
    widget.classList.remove('year-select--open');
    options.forEach(function(o) { o.classList.remove('is-focused'); });
    widget.setAttribute('aria-expanded', 'false');
  }

  function select(opt) {
    options.forEach(function(o) { o.classList.remove('is-selected'); });
    opt.classList.add('is-selected');
    valueEl.textContent = opt.dataset.value;
    handleYearChange(opt.dataset.value);
    close();
  }

  function setFocus(idx) {
    options.forEach(function(o) { o.classList.remove('is-focused'); });
    if (options[idx]) options[idx].classList.add('is-focused');
  }

  trigger.addEventListener('click', function() {
    widget.classList.contains('year-select--open') ? close() : open();
  });

  options.forEach(function(opt, i) {
    opt.addEventListener('mouseenter', function() { focusIdx = i; setFocus(i); });
    opt.addEventListener('click', function() { select(opt); });
  });

  widget.addEventListener('keydown', function(e) {
    var isOpen = widget.classList.contains('year-select--open');
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      isOpen ? select(options[focusIdx]) : open();
    } else if (e.key === 'Escape') {
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) { open(); return; }
      focusIdx = Math.min(focusIdx + 1, options.length - 1);
      setFocus(focusIdx);
      options[focusIdx].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusIdx = Math.max(focusIdx - 1, 0);
      setFocus(focusIdx);
      options[focusIdx].scrollIntoView({ block: 'nearest' });
    }
  });

  document.addEventListener('click', function(e) {
    if (!widget.contains(e.target)) close();
  });
});
