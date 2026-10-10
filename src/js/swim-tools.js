// Swim Tools: minimize/expand, pin/unpin and drag-to-reorder each tool card.
// All three are per-viewer conveniences, remembered in localStorage when
// available.
(function () {
  var COLLAPSED_KEY = 'swimTools.collapsed';
  var PINNED_KEY = 'swimTools.pinned'; // ids, in pinned-section order
  var ORDER_KEY = 'swimTools.order';   // { groupId: [ids] }

  function read(key, fallback) {
    try {
      var value = JSON.parse(localStorage.getItem(key));
      return value == null ? fallback : value;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  function toggleInList(list, id, on) {
    list = list.filter(function (x) { return x !== id; });
    if (on) list.push(id);
    return list;
  }

  function titleOf(widget) {
    return widget.querySelector('.swim-widget__title').textContent.trim();
  }

  var pinnedSection = document.getElementById('pinned');
  var pinnedGrid = pinnedSection && pinnedSection.querySelector('[data-pinned-grid]');

  // A grid holds tool cells, plus hidden slots marking where pinned tools
  // return to when unpinned.
  function idOf(el) {
    return el.getAttribute('data-slot') || el.querySelector('.swim-widget').id;
  }

  function cellOf(id) {
    var widget = document.getElementById(id);
    return widget && widget.closest('.swim-tools__cell');
  }

  // ---------- Collapse ----------

  function setCollapsed(widget, collapsed) {
    var toggle = widget.querySelector('.swim-widget__toggle');
    widget.classList.toggle('is-collapsed', collapsed);
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.setAttribute('aria-label', (collapsed ? 'Expand ' : 'Minimize ') + titleOf(widget));
  }

  // ---------- Pin ----------

  function setPinned(widget, pinned) {
    var pin = widget.querySelector('.swim-widget__pin');
    var cell = widget.closest('.swim-tools__cell');
    widget.classList.toggle('is-pinned', pinned);
    pin.setAttribute('aria-pressed', String(pinned));
    pin.setAttribute('aria-label', (pinned ? 'Unpin ' : 'Pin ') + titleOf(widget) + (pinned ? '' : ' to top'));

    if (pinned && cell.parentNode !== pinnedGrid) {
      var slot = document.createElement('div');
      slot.className = 'swim-tools__slot';
      slot.hidden = true;
      slot.setAttribute('data-slot', widget.id);
      cell.parentNode.insertBefore(slot, cell);
      pinnedGrid.appendChild(cell);
    } else if (!pinned && cell.parentNode === pinnedGrid) {
      var home = document.querySelector('.swim-tools__slot[data-slot="' + widget.id + '"]');
      home.parentNode.replaceChild(cell, home);
    }
    pinnedSection.hidden = !pinnedGrid.children.length;
  }

  // ---------- Order ----------

  var order = read(ORDER_KEY, {});

  function saveOrder(grid) {
    var ids = Array.prototype.map.call(grid.children, idOf);
    if (grid === pinnedGrid) {
      write(PINNED_KEY, ids);
    } else {
      order[grid.closest('.swim-tools__group').id] = ids;
      write(ORDER_KEY, order);
    }
  }

  function siblingCell(cell, dir) {
    var el = dir < 0 ? cell.previousElementSibling : cell.nextElementSibling;
    while (el && !el.classList.contains('swim-tools__cell')) {
      el = dir < 0 ? el.previousElementSibling : el.nextElementSibling;
    }
    return el;
  }

  // Pointer drag (mouse, touch and pen). The card reorders live under the
  // pointer, within its own grid only. Move/up listen on the document rather
  // than via pointer capture: moving the card in the DOM drops the capture.
  var drag = null;

  function startDrag(e) {
    if (e.button !== 0) return;
    var cell = e.currentTarget.closest('.swim-tools__cell');
    drag = { cell: cell, grid: cell.parentNode, x: e.clientX, y: e.clientY };
    drag.frame = requestAnimationFrame(autoScroll);
    cell.classList.add('is-dragging');
    document.body.classList.add('swim-tools--dragging');
    document.addEventListener('pointermove', moveDrag);
    document.addEventListener('pointerup', endDrag);
    document.addEventListener('pointercancel', endDrag);
    e.preventDefault();
  }

  function reorderAt(x, y) {
    var under = document.elementFromPoint(x, y);
    var over = under && under.closest('.swim-tools__cell');
    if (!over || over === drag.cell || over.parentNode !== drag.grid) return;

    var r = over.getBoundingClientRect();
    // Full-width (stacked) cards compare vertically, side-by-side horizontally.
    var stacked = r.width > drag.grid.getBoundingClientRect().width * 0.9;
    var after = stacked ? y > r.top + r.height / 2 : x > r.left + r.width / 2;
    var ref = after ? over.nextSibling : over;
    if (ref !== drag.cell && ref !== drag.cell.nextSibling) drag.grid.insertBefore(drag.cell, ref);
  }

  function moveDrag(e) {
    if (!drag) return;
    drag.x = e.clientX;
    drag.y = e.clientY;
    reorderAt(drag.x, drag.y);
  }

  // Scroll while the pointer is held near the top or bottom edge, so cards
  // off screen (stacked on mobile) can still be reached.
  var EDGE = 60;

  function autoScroll() {
    if (!drag) return;
    var dy = 0;
    if (drag.y < EDGE) dy = -(EDGE - drag.y) / 3;
    else if (drag.y > window.innerHeight - EDGE) dy = (drag.y - (window.innerHeight - EDGE)) / 3;
    if (dy) {
      window.scrollBy(0, dy);
      reorderAt(drag.x, drag.y);
    }
    drag.frame = requestAnimationFrame(autoScroll);
  }

  function endDrag() {
    if (!drag) return;
    cancelAnimationFrame(drag.frame);
    drag.cell.classList.remove('is-dragging');
    document.body.classList.remove('swim-tools--dragging');
    document.removeEventListener('pointermove', moveDrag);
    document.removeEventListener('pointerup', endDrag);
    document.removeEventListener('pointercancel', endDrag);
    saveOrder(drag.grid);
    drag = null;
  }

  function keyMove(e) {
    var dir = { ArrowUp: -1, ArrowLeft: -1, ArrowDown: 1, ArrowRight: 1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    var cell = e.currentTarget.closest('.swim-tools__cell');
    var sibling = siblingCell(cell, dir);
    if (!sibling) return;
    cell.parentNode.insertBefore(cell, dir < 0 ? sibling : sibling.nextSibling);
    saveOrder(cell.parentNode);
    e.currentTarget.focus();
  }

  // ---------- Wire up ----------

  // Saved group order first, so pinned tools leave their slot in the right place.
  document.querySelectorAll('.swim-tools__group:not(.swim-tools__pinned) .swim-tools__grid').forEach(function (grid) {
    var saved = order[grid.closest('.swim-tools__group').id] || [];
    saved.forEach(function (id) {
      var cell = cellOf(id);
      if (cell && cell.parentNode === grid) grid.appendChild(cell);
    });
  });

  var collapsed = read(COLLAPSED_KEY, []);

  document.querySelectorAll('.swim-widget').forEach(function (widget) {
    var toggle = widget.querySelector('.swim-widget__toggle');
    var pin = widget.querySelector('.swim-widget__pin');
    var move = widget.querySelector('.swim-widget__move');

    if (toggle) {
      setCollapsed(widget, collapsed.indexOf(widget.id) !== -1);
      toggle.addEventListener('click', function () {
        var now = !widget.classList.contains('is-collapsed');
        setCollapsed(widget, now);
        collapsed = toggleInList(collapsed, widget.id, now);
        write(COLLAPSED_KEY, collapsed);
      });
    }

    if (pin && pinnedGrid) {
      pin.addEventListener('click', function () {
        setPinned(widget, !widget.classList.contains('is-pinned'));
        saveOrder(pinnedGrid);
        pin.focus();
      });
    }

    if (move) {
      move.setAttribute('aria-label', 'Reorder ' + titleOf(widget) + '. Drag, or use the arrow keys.');
      move.addEventListener('pointerdown', startDrag);
      move.addEventListener('keydown', keyMove);
    }
  });

  // Restore pins in their saved order.
  if (pinnedGrid) {
    read(PINNED_KEY, []).forEach(function (id) {
      var widget = document.getElementById(id);
      if (widget && widget.classList.contains('swim-widget')) setPinned(widget, true);
    });
  }
})();
