document.addEventListener('DOMContentLoaded', () => {
  // ── Swimmer data (from wrapper data attributes) ───────────────────────────
  const wrapper         = document.querySelector('.renew__form-body.masters-addons');
  const vsaPrice        = wrapper ? parseFloat(wrapper.dataset.vsaPrice ?? '') : NaN;

  // ── Selectors ─────────────────────────────────────────────────────────────
  const productTotalEl  = document.querySelector('.total-product.card__total--amount');
  const totalChargeEl   = document.querySelector('.review-order__line-item--total .review-order__line-item--price');
  const reviewLineItems = document.querySelector('.js-review-line-items');
  const sslInput        = document.querySelector("input[name='swimming-saves-lives']");
  const shffInput       = document.querySelector("input[name='swimming-hall-of-fame']");
  const lmscInput       = document.querySelector("input[name='lmsc']");
  const agreeLabel      = document.getElementById('agreeTerms__label');
  const agreeCheckbox   = document.getElementById('agreeTerms');
  const submitBtn       = document.getElementById('register-button');
  const paymentFields   = document.querySelector('.addons-payment__fields');

  let productTotal = 0;

  // ── Payment section visibility ────────────────────────────────────────────
  function hasSelection() {
    const hasProduct  = document.querySelector('.add-on-products .product-option.selected') !== null;
    const hasDonation = [sslInput, shffInput, lmscInput].some(el => el && parseFloat(el.value) > 0);
    return hasProduct || hasDonation;
  }

  function setPaymentVisible(visible) {
    if (paymentFields) paymentFields.style.display = visible ? '' : 'none';
  }

  // ── Variable terms ────────────────────────────────────────────────────────
  // Each product tile may carry a data-terms-key attribute. When any product
  // with that key is selected, the matching .agree-terms-product--{key} block
  // is shown and its checkbox is enabled.
  function updateVariableTerms() {
    // Collect active terms keys from selected product tiles
    const activeKeys = new Set();
    document.querySelectorAll('.add-on-products .product-option.selected').forEach(tile => {
      const key = tile.dataset.termsKey;
      if (key) activeKeys.add(key);
    });

    document.querySelectorAll('.agree-terms-product').forEach(block => {
      // Derive key from the modifier class: agree-terms-product--{key}
      const modClass = Array.from(block.classList).find(c => c.startsWith('agree-terms-product--'));
      const key = modClass ? modClass.replace('agree-terms-product--', '') : null;
      const active = key && activeKeys.has(key);
      block.style.display = active ? '' : 'none';
      const cb  = block.querySelector('input[type="checkbox"]');
      const lbl = block.querySelector('label');
      if (cb) {
        cb.disabled = !active;
        if (!active) cb.checked = false;
      }
      if (lbl) lbl.classList.toggle('disabled', !active);
    });
  }

  // ── Locked tiles ─────────────────────────────────────────────────────────
  // A tile with data-requires-product="{key}" is locked (grayed out, not
  // clickable) until the tile with data-product-key="{key}" is selected.
  // If the required tile is deselected, the dependent tile is also deselected.
  function updateLockedTiles() {
    document.querySelectorAll('.add-on-products .product-option[data-requires-product]').forEach(tile => {
      const requiredKey  = tile.dataset.requiresProduct;
      const requiredTile = document.querySelector(`.add-on-products .product-option[data-product-key="${requiredKey}"]`);
      const satisfied    = requiredTile?.classList.contains('selected') ?? false;

      if (!satisfied && tile.classList.contains('selected')) {
        // Deselect this tile if its requirement was removed
        const addBtn   = tile.querySelector('.add-on');
        const priceEl  = tile.querySelector('.product-price');
        const tilePrice = parseFloat((priceEl?.textContent ?? '').replace(/[^0-9.]/g, '')) || 0;
        tile.classList.remove('selected');
        productTotal -= tilePrice;
        if (addBtn) addBtn.textContent = 'Add';
      }

      tile.toggleAttribute('disabled', !satisfied);
    });
  }

  // ── Agreement / Submit ────────────────────────────────────────────────────
  function updateAgreement() {
    const anySelected = document.querySelector('.add-on-products .product-option.selected') !== null;

    // Standard terms checkbox
    agreeLabel?.classList.toggle('disabled', !anySelected);
    if (agreeCheckbox) agreeCheckbox.disabled = !anySelected;
    if (!anySelected && agreeCheckbox) agreeCheckbox.checked = false;

    // Submit: all visible terms checkboxes must be checked
    const allChecked = (() => {
      if (!agreeCheckbox?.checked) return false;
      const variableChecks = document.querySelectorAll('.agree-terms-product:not([style*="display: none"]):not([style*="display:none"]) input[type="checkbox"]');
      return Array.from(variableChecks).every(cb => cb.checked);
    })();
    if (submitBtn) submitBtn.disabled = !(anySelected && allChecked);
  }

  // Listen for changes on all terms checkboxes (standard + variable)
  document.querySelector('.card.payment-info')?.addEventListener('change', e => {
    if (e.target.type === 'checkbox') updateAgreement();
  });

  // ── Review order line items ───────────────────────────────────────────────
  function buildReviewOrder() {
    if (!reviewLineItems) return;
    reviewLineItems.innerHTML = '';

    // Product line items
    document.querySelectorAll('.add-on-products .product-option.selected').forEach(tile => {
      const name  = tile.querySelector('.product-name')?.textContent?.trim() ?? '';
      const price = tile.querySelector('.product-price')?.textContent?.trim() ?? '';
      const p     = document.createElement('p');
      p.className = 'review-order__line-item review-order__line-item--bill-date';
      p.innerHTML = `${name} <span class="review-order__line-item--price">${price}</span>`;
      reviewLineItems.appendChild(p);
    });

    // Donation line items
    const donationMap = [
      { input: sslInput,  label: 'Adult Learn-to-Swim Grant Donation' },
      { input: shffInput, label: 'International Swimming Hall of Fame Donation' },
      { input: lmscInput, label: 'LMSC Donation' }
    ];
    donationMap.forEach(({ input, label }) => {
      const val = parseFloat(input?.value) || 0;
      if (val > 0) {
        const p = document.createElement('p');
        p.className = 'review-order__line-item review-order__line-item--bill-date';
        p.innerHTML = `${label} <span class="review-order__line-item--price">$${val.toFixed(2)}</span>`;
        reviewLineItems.appendChild(p);
      }
    });
  }

  // ── Totals ────────────────────────────────────────────────────────────────
  function donationTotal() {
    return [sslInput, shffInput, lmscInput].reduce((sum, el) => {
      return sum + (el ? parseFloat(el.value) || 0 : 0);
    }, 0);
  }

  function updateTotals() {
    const grand = productTotal + donationTotal();
    if (productTotalEl) productTotalEl.textContent = `$${productTotal.toFixed(2)}`;
    if (totalChargeEl)  totalChargeEl.textContent  = `$${grand.toFixed(2)}`;
  }

  function updateAll() {
    updateLockedTiles();
    updateTotals();
    buildReviewOrder();
    updateVariableTerms();
    setPaymentVisible(hasSelection());
    updateAgreement();
  }

  // ── Product option tiles ──────────────────────────────────────────────────
  document.querySelectorAll('.add-on-products .product-option').forEach(tile => {
    const addBtn     = tile.querySelector('.add-on');
    const priceEl    = tile.querySelector('.product-price');
    const hasStroke  = tile.querySelector('select[name="StrokeSelect"]') !== null;

    // VSA tiles: use vsaPrice from the swimmer's tier (data-vsa-price on wrapper).
    // Falls back to the product JSON price if vsaPrice is not set.
    let price;
    if (hasStroke && !isNaN(vsaPrice)) {
      price = vsaPrice;
      if (priceEl) priceEl.textContent = `$${vsaPrice.toFixed(2)}`;
    } else {
      price = parseFloat((priceEl?.textContent ?? '').replace(/[^0-9.]/g, '')) || 0;
    }

    const strokeSelect = tile.querySelector('select[name="StrokeSelect"]');

    if (strokeSelect) {
      strokeSelect.addEventListener('change', () => {
        if (addBtn) addBtn.disabled = strokeSelect.value === '0';
      });
    }

    addBtn?.addEventListener('click', () => {
      const isSelected = tile.classList.toggle('selected');
      productTotal += isSelected ? price : -price;
      if (addBtn) addBtn.textContent = isSelected ? 'Remove' : 'Add';
      if (!isSelected && strokeSelect) {
        strokeSelect.value = '0';
        addBtn.disabled = true;
      }
      updateAll();
    });
  });

  // ── Donations ─────────────────────────────────────────────────────────────
  document.querySelectorAll('.btn-donate').forEach(btn => {
    btn.addEventListener('click', () => {
      if (sslInput) sslInput.value = parseFloat(btn.value).toFixed(2);
      updateAll();
    });
  });

  [sslInput, shffInput, lmscInput].forEach(input => {
    input?.addEventListener('change', updateAll);
    input?.addEventListener('input', updateAll);
  });

  // ── Init ──────────────────────────────────────────────────────────────────
  updateLockedTiles();
  setPaymentVisible(false);
});
