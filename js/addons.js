document.addEventListener('DOMContentLoaded', () => {
  // ── Selectors ─────────────────────────────────────────────────────────────
  const productTotalEl = document.querySelector('.total-product.card__total--amount');
  const totalChargeEl = document.querySelector('.review-order__line-item--price');
  const sslInput = document.querySelector("input[name='swimming-saves-lives']");
  const shffInput = document.querySelector("input[name='swimming-hall-of-fame']");
  const lmscInput = document.querySelector("input[name='lmsc']");
  const agreeLabel = document.getElementById('agreeTerms__label');
  const agreeCheckbox = document.getElementById('agreeTerms');
  const submitBtn = document.getElementById('register-button');

  let productTotal = 0;

  // ── Terms visibility ─────────────────────────────────────────────────────
  const usmsPlusTerms = document.querySelector('.agree-usmsplus-terms');
  const competitionTerms = document.querySelector('.form-group.agree-terms-competition');

  if (usmsPlusTerms) usmsPlusTerms.style.display = 'none';
  if (competitionTerms) competitionTerms.style.display = 'none';

  function updateTermsVisibility() {
    const checkedRadio = document.querySelector('input[name="length"]:checked');
    const val = checkedRadio?.value ?? '';
    if (usmsPlusTerms) usmsPlusTerms.style.display = val === 'usmsPlus' ? '' : 'none';
    if (competitionTerms) competitionTerms.style.display = val === 'competition' ? '' : 'none';
  }

  // ── Agreement / Submit ────────────────────────────────────────────────────
  function updateAgreement() {
    const anySelected = document.querySelector('.add-on-products .product-option.selected') !== null;
    agreeLabel?.classList.toggle('disabled', !anySelected);
    if (agreeCheckbox) agreeCheckbox.disabled = !anySelected;
    if (!anySelected && agreeCheckbox) agreeCheckbox.checked = false;
    if (submitBtn) submitBtn.disabled = !(anySelected && agreeCheckbox?.checked);
  }

  agreeCheckbox?.addEventListener('change', () => {
    if (submitBtn) submitBtn.disabled = !agreeCheckbox.checked;
  });

  // ── Totals ────────────────────────────────────────────────────────────────
  function donationTotal() {
    return [sslInput, shffInput, lmscInput].reduce((sum, el) => {
      return sum + (el ? parseFloat(el.value) || 0 : 0);
    }, 0);
  }

  function updateTotals() {
    const grand = productTotal + donationTotal();
    productTotalEl.textContent = `$${productTotal}.00`;
    totalChargeEl.textContent = `$${grand.toFixed(2)}`;
  }

  // ── Product option tiles ──────────────────────────────────────────────────
  document.querySelectorAll('.add-on-products .product-option').forEach(tile => {
    const addBtn = tile.querySelector('.add-on');
    const priceText = tile.querySelector('.product-price')?.textContent ?? '';
    const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
    const strokeSelect = tile.querySelector('select[id="strokeSelect"]');

    // Tiles with a stroke select: enable Add only when a stroke is chosen
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
      updateTotals();
      updateAgreement();
      updateTermsVisibility();
    });
  });


  // ── Donations ─────────────────────────────────────────────────────────────
  document.querySelectorAll('.btn-donate').forEach(btn => {
    btn.addEventListener('click', () => {
      if (sslInput) sslInput.value = parseFloat(btn.value).toFixed(2);
      updateTotals();
    });
  });

  [sslInput, shffInput, lmscInput].forEach(input => {
    input?.addEventListener('change', updateTotals);
  });
});
