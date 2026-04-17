(function () {
  // ── Selectors ─────────────────────────────────────────────────────────────
  var cardCompetition    = document.getElementById('cardCompetition');
  var membershipContainer = document.querySelector('.membership-length--container');
  var paymentFields      = document.querySelector('.registration-payment__fields');
  var paymentSummary     = document.querySelector('.js-payment-summary');
  var membershipTotalEl  = document.querySelector('.membership-length--total');
  var vsaTotalEl         = document.querySelector('.video-stroke-analysis--total');
  var donationTotalEl    = document.querySelector('.total-donations');
  var agreeCheckbox      = document.getElementById('agreeTerms');
  var agreeLabel         = document.getElementById('agreeTerms__label');
  var registerBtn        = document.getElementById('register-button');
  var strokeFocusDiv     = document.querySelector('.select-stroke-focus');
  var strokeSelect       = document.getElementById('stroke-video-analysis__focus');
  var sslInput           = document.querySelector("input[name='swimming-saves-lives']");
  var shffInput          = document.querySelector("input[name='swimming-hall-of-fame']");
  var lmscInput          = document.querySelector("input[name='lmsc']");

  // ── Helpers ───────────────────────────────────────────────────────────────
  function fmt(n) { return '$' + parseFloat(n || 0).toFixed(2); }
  function parseAmt(el) { return parseFloat((el && el.textContent || '').replace(/[^0-9.]/g, '')) || 0; }
  function inputVal(el) { return el ? parseFloat(el.value) || 0 : 0; }

  function selectedTile() {
    return document.querySelector('.membership-length--option.selected') || null;
  }

  // ── Payment visibility ────────────────────────────────────────────────────
  function hasPayableSelection() {
    var hasTile     = selectedTile() !== null;
    var hasDonation = [sslInput, shffInput, lmscInput].some(function (el) { return inputVal(el) > 0; });
    return hasTile || hasDonation;
  }

  function setPaymentVisible(visible) {
    if (paymentFields) paymentFields.style.display = visible ? '' : 'none';
  }

  // ── Variable terms ────────────────────────────────────────────────────────
  // Tier tiles carry data-terms-keys="key1,key2" — JS shows matching
  // production-class terms blocks and enables their checkboxes.
  var termsBlocks = {
    usmsPlus:    document.querySelector('.agree-usmsplus-terms'),
    competition: document.querySelector('.agree-terms-competition')
  };

  function updateVariableTerms() {
    var tile      = selectedTile();
    var activeKeys = new Set();
    if (tile) {
      var raw = tile.dataset.termsKeys || '';
      raw.split(',').forEach(function (k) { if (k) activeKeys.add(k.trim()); });
    }

    Object.keys(termsBlocks).forEach(function (key) {
      var block  = termsBlocks[key];
      if (!block) return;
      var active = activeKeys.has(key);
      block.style.display = active ? '' : 'none';
      var cb  = block.querySelector('input[type="checkbox"]');
      var lbl = block.querySelector('label');
      if (cb)  { cb.disabled = !active; if (!active) cb.checked = false; }
      if (lbl) lbl.classList.toggle('disabled', !active);
    });
  }

  // ── Agreement / submit ────────────────────────────────────────────────────
  function updateAgreement() {
    var hasTile = selectedTile() !== null;
    if (agreeLabel)    agreeLabel.classList.toggle('disabled', !hasTile);
    if (agreeCheckbox) { agreeCheckbox.disabled = !hasTile; if (!hasTile) agreeCheckbox.checked = false; }

    var allChecked = (function () {
      if (!agreeCheckbox || !agreeCheckbox.checked) return false;
      var varChecks = Object.values(termsBlocks).filter(function (b) {
        return b && b.style.display !== 'none';
      }).map(function (b) { return b.querySelector('input[type="checkbox"]'); }).filter(Boolean);
      return Array.from(varChecks).every(function (cb) { return cb.checked; });
    })();
    if (registerBtn) registerBtn.disabled = !(hasTile && allChecked);
  }

  var paymentCard = document.querySelector('.card.payment-info');
  if (paymentCard) {
    paymentCard.addEventListener('change', function (e) {
      if (e.target.type === 'checkbox') updateAgreement();
    });
  }

  // ── Payment summary (subtotals) ───────────────────────────────────────────
  function buildPaymentSummary() {
    if (!paymentSummary) return;
    paymentSummary.innerHTML = '';

    var membership = parseAmt(membershipTotalEl);
    var vsa        = parseAmt(vsaTotalEl);
    var donations  = inputVal(sslInput) + inputVal(shffInput) + inputVal(lmscInput);
    var total      = membership + vsa + donations;

    function addLine(label, amount, cls) {
      if (amount === 0 && cls !== 'total') return;
      var p = document.createElement('p');
      p.className = 'payment-info__line-item payment-info__line-item--' + cls;
      p.innerHTML = label + ': <span class="payment-info__line-item--price">' + fmt(amount) + '</span>';
      paymentSummary.appendChild(p);
    }

    addLine('USMS Membership Fee', membership, 'usms');
    addLine('Video Stroke Analysis', vsa, 'vsa');
    addLine('Total Donations', donations, 'donations');
    var totalP = document.createElement('p');
    totalP.className = 'payment-info__line-item payment-info__line-item--total';
    totalP.innerHTML = 'Total charge: <span class="payment-info__line-item--price">' + fmt(total) + '</span>';
    paymentSummary.appendChild(totalP);
  }

  // ── Donations ─────────────────────────────────────────────────────────────
  function updateDonationTotal() {
    var total = inputVal(sslInput) + inputVal(shffInput) + inputVal(lmscInput);
    if (donationTotalEl) donationTotalEl.textContent = fmt(total);
    buildPaymentSummary();
    setPaymentVisible(hasPayableSelection());
  }

  document.querySelectorAll('.btn-donate').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (sslInput) sslInput.value = parseFloat(this.value).toFixed(2);
      updateDonationTotal();
    });
  });
  [sslInput, shffInput, lmscInput].forEach(function (el) {
    if (el) el.addEventListener('change', updateDonationTotal);
    if (el) el.addEventListener('input', updateDonationTotal);
  });

  // ── VSA ───────────────────────────────────────────────────────────────────
  function resetVsa() {
    var priceEl = document.querySelector('.price-string__video-stroke-analysis');
    if (priceEl) priceEl.textContent = '';
    if (vsaTotalEl) vsaTotalEl.textContent = '$0.00';
    if (strokeSelect) strokeSelect.value = '-1';
    if (strokeFocusDiv) strokeFocusDiv.style.display = 'none';
    document.querySelectorAll('input[name="videoStrokeAnalysis"]').forEach(function (r) {
      r.checked = false;
      r.disabled = true;
      r.closest('label').classList.add('disabled');
    });
  }

  if (strokeFocusDiv) strokeFocusDiv.style.display = 'none';

  document.querySelectorAll('input[name="videoStrokeAnalysis"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (strokeFocusDiv) strokeFocusDiv.style.display = this.value === 'yes' ? '' : 'none';
      if (vsaTotalEl && this.value === 'no') { vsaTotalEl.textContent = '$0.00'; buildPaymentSummary(); }
      if (this.value === 'yes' && strokeSelect) strokeSelect.value = '-1';
    });
  });

  if (strokeSelect) {
    strokeSelect.addEventListener('change', function () {
      if (this.value === '-1') return;
      var tile = selectedTile();
      var vsaPrice = tile ? parseFloat(tile.dataset.vsaPrice || 0) : 110;
      if (vsaTotalEl) vsaTotalEl.textContent = fmt(vsaPrice);
      buildPaymentSummary();
    });
  }

  // ── Membership tile selection ─────────────────────────────────────────────
  function activateTile(col) {
    var tile = col && col.querySelector('.membership-length--option');
    if (tile) { tile.removeAttribute('aria-hidden'); tile.removeAttribute('disabled'); }
  }

  function deactivateTile(col) {
    var tile = col && col.querySelector('.membership-length--option');
    if (tile) {
      tile.setAttribute('aria-hidden', 'true');
      tile.setAttribute('disabled', '');
      var radio = tile.querySelector('input[type="radio"]');
      if (radio) radio.checked = false;
    }
  }

  function resetMembershipSelection() {
    document.querySelectorAll('.membership-length--option').forEach(function (t) { t.classList.remove('selected'); });
    document.querySelectorAll('input[name="length"]').forEach(function (r) { r.checked = false; });
    if (membershipTotalEl) membershipTotalEl.textContent = '$0.00';
    document.querySelectorAll('input[name="CompetitionMembership"]').forEach(function (r) { r.checked = false; });
    updateVariableTerms();
    setPaymentVisible(false);
  }

  if (membershipContainer) {
    membershipContainer.addEventListener('click', function (e) {
      var tile = e.target.closest('.membership-length--option');
      if (!tile || tile.hasAttribute('disabled')) return;

      document.querySelectorAll('.membership-length--option').forEach(function (t) { t.classList.remove('selected'); });
      tile.classList.add('selected');

      // Membership total
      var price = parseFloat(tile.dataset.price || 0);
      if (membershipTotalEl) membershipTotalEl.textContent = fmt(price);

      // Competition cert card
      var showsCert = tile.dataset.competitionEligible === 'true';
      if (cardCompetition) cardCompetition.style.display = showsCert ? 'block' : 'none';

      // VSA: update price label; reset or update total
      var vsaPrice   = parseFloat(tile.dataset.vsaPrice || 0);
      var priceEl    = document.querySelector('.price-string__video-stroke-analysis');
      var vsaSelected = document.querySelector('input[name="videoStrokeAnalysis"][value="yes"]:checked') !== null;

      if (vsaSelected) {
        if (priceEl) priceEl.textContent = vsaPrice === 0 ? ' for FREE!' : ' for $' + vsaPrice.toFixed(2);
        if (vsaTotalEl) vsaTotalEl.textContent = fmt(vsaPrice);
      } else {
        resetVsa();
        document.querySelectorAll('input[name="videoStrokeAnalysis"]').forEach(function (r) {
          r.disabled = false;
          r.closest('label').classList.remove('disabled');
        });
        if (priceEl) priceEl.textContent = vsaPrice === 0 ? ' for FREE!' : ' for $' + vsaPrice.toFixed(2);
      }

      updateVariableTerms();
      buildPaymentSummary();
      setPaymentVisible(hasPayableSelection());
      updateAgreement();
    });
  }

  // ── Participation radio — show/hide tier columns ──────────────────────────
  document.querySelectorAll('input[name="participationInfo"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (membershipContainer) membershipContainer.classList.remove('disabled');
      resetMembershipSelection();
      resetVsa();
      buildPaymentSummary();

      // Show/hide tier columns based on participation choice.
      // Columns are identified by data-col-id on the tier tile's parent col div
      // (set by registration-membership-options.njk via tier.colId).
      document.querySelectorAll('.membership-length--container > [id]').forEach(function (col) {
        var tile = col.querySelector('.membership-length--option');
        if (!tile) return;
        var showsCert = tile.dataset.competitionEligible === 'true';

        if (this.value === 'yes') {
          // Event participants: show event-license tiers, hide standard
          if (showsCert) {
            col.style.display = 'flex';
            activateTile(col);
          } else {
            col.style.display = 'none';
            deactivateTile(col);
          }
        } else {
          // Non-event participants: hide event-license tiers, show standard
          if (showsCert) {
            col.style.display = 'none';
            deactivateTile(col);
          } else {
            col.style.display = 'flex';
            activateTile(col);
          }
        }
        if (cardCompetition) cardCompetition.style.display = 'none';
      }.bind(this));
    });
  });

  // ── Coach interest ────────────────────────────────────────────────────────
  var coachInterestDiv = document.querySelector('.order-4.col-xs-12');
  if (coachInterestDiv) {
    coachInterestDiv.style.display = 'none';
    document.querySelectorAll('input[name="checkbox-interests-self-identified-coach"]').forEach(function (r) {
      r.addEventListener('change', function () {
        coachInterestDiv.style.display = this.value === 'false' ? '' : 'none';
      });
    });
  }

  // ── Club / LMSC selects ───────────────────────────────────────────────────
  var CLUBS = {
    florida: [
      { value: 'a0w3h000001KFKKAA4', text: 'Unattached - Will appear as (UC14)' },
      { value: 'a0w3h000001KEaWAAW', text: 'All Day Endurance Masters (ADEM)' },
      { value: 'a0w3h000001KEakAAG', text: 'ATAC Masters (ATAC)' },
      { value: 'a0wPO000000BYXpYAO', text: 'Avalon Swim Club (AVSC)' },
      { value: 'a0w3h000001KE3lAAG', text: 'Blue Dolfins Masters (BDO)' },
      { value: 'a0w3h000001KEajAAG', text: 'Blue Marlins Aquatic Club (BMAC)' },
      { value: 'a0w3h000003BrqcAAC', text: 'Bolles School Sharks Masters Swimming (BSS)' },
      { value: 'a0w3h000003bmDGAAY', text: 'BOLTS Masters (BOLTS)' },
      { value: 'a0wPO000000WTq5YAG', text: 'Carrollwood Village Masters Swim Team (CVMST)' },
      { value: 'a0wPO000000S3J7YAK', text: 'Champions Mojo Masters (CHAMP)' },
      { value: 'a0w3h000001KEDQAA4', text: 'Clearwater Aquatic Masters (CAM)' },
      { value: 'a0w3h000001KEctAAG', text: 'FAST Falcons (FLCNS)' },
      { value: 'a0w3h000001KEe5AAG', text: 'Florida Aquatic Combined Team (FACT)' },
      { value: 'a0w3h000001KEeAAAW', text: 'Florida League Of Aquatics (FLA)' },
      { value: 'a0w3h000001KEG7AAO', text: 'Forever Swimmers (4SWM)' },
      { value: 'a0w3h000001KEenAAG', text: 'Gator Swim Club (GSC)' },
      { value: 'a0w3h000001KEJ6AAO', text: 'Greater Tampa Swim Association (GTSA)' },
      { value: 'a0w3h000001KE5FAAW', text: 'Gulf Coast Swim Team Masters (GCST)' },
      { value: 'a0w3h000001KEeqAAG', text: 'Jacksonville Area Warrior Swimmers (JWS)' },
      { value: 'a0w3h000001KESRAA4', text: 'Julington Creek Masters (JCM)' },
      { value: 'a0w3h000001KEXYAA4', text: 'Lake Gators Swim Club (LG)' },
      { value: 'a0w3h000001KEMBAA4', text: 'Lake Highland Masters Swimming Club (LHM)' },
      { value: 'a0w3h000001KEbiAAG', text: 'Legends Masters Swim Club (LMSC)' },
      { value: 'a0wPO000000EKoTYAW', text: 'North Florida Swimming (NFS)' },
      { value: 'a0w3h000001KESMAA4', text: 'Palm Coast Piranha Club (PCSC)' },
      { value: 'a0w3h000001KEeyAAG', text: 'Sarasota Sharks Masters (SHARK)' },
      { value: 'a0w3h000001KEB6AAO', text: 'Sarasota Tsunami Masters (SRQM)' },
      { value: 'a0w3h000001KEXvAAO', text: 'Sea Dragon Aquatics Masters (SDAMS)' },
      { value: 'a0w3h000001KEaPAAW', text: 'Shanna and Bryan Glazer JCC (BGJCC)' },
      { value: 'a0w3h000001KEeuAAG', text: 'Southwest Florida Aquatics (SWFA)' },
      { value: 'a0w3h000001KEeDAAW', text: 'Space Coast Aquanauts (AQNT)' },
      { value: 'a0w3h000001KEf1AAG', text: 'Space Coast Masters (SPCO)' },
      { value: 'a0w3h000001KEHUAA4', text: 'St Augustine Reef Sharks (SARS)' },
      { value: 'a0w3h000001KEe8AAG', text: 'St Pete Masters Inc (SPM)' },
      { value: 'a0w3h000001KEexAAG', text: 'Sun City Center Sharks (SCCS)' },
      { value: 'a0w3h000001KEXxAAO', text: 'Suncoast YMCA Masters Swimming (SYMS)' },
      { value: 'a0w3h000001KESjAAO', text: 'Swamp Water Aquatics Gainesville (SWAG)' },
      { value: 'a0w3h000001KEeEAAW', text: 'Swim Florida Masters (SWIM)' },
      { value: 'a0w3h000001KEC7AAO', text: 'Swim Like A Pro (SLAP)' },
      { value: 'a0w3h000001KEWlAAO', text: 'Swim Melbourne Masters (MELB)' },
      { value: 'a0w3h000001KEWTAA4', text: 'Swim Out (SWOUT)' },
      { value: 'a0wPO0000006r6TYAQ', text: 'Swim Start (STRT)' },
      { value: 'a0wPO0000007HXBYA2', text: 'SwimRise Aquatics (SRA)' },
      { value: 'a0w3h000001KE6OAAW', text: 'T2 Naples Masters (T2NM)' },
      { value: 'a0wPO000000Q99JYAS', text: 'Tampa Elite Aquatics - Manta Rays (TEAM)' },
      { value: 'a0w3h000001KElGAAW', text: 'Tampa Tarpons Masters (TTM)' },
      { value: 'a0w3h000001KEemAAG', text: 'Tampa Y Swimming Masters (TYSM)' },
      { value: 'a0w3h000001KE2iAAG', text: 'Team Windfall (TWFL)' },
      { value: 'a0wPO000000p7vWYAQ', text: 'Torpedo Masters Club (TMC)' },
      { value: 'a0wPO000000BnrpYAC', text: 'Treasure Coast Aquatics (TCA)' },
      { value: 'a0w3h000001KEREAA4', text: 'Unagi (UNAGI)' },
      { value: 'a0w3h000003bl2qAAA', text: 'Villagers Masters Aquatic Squad (VMAS)' },
      { value: 'a0w3h000003bmTTAAY', text: 'Wahoos of Jacksonville (WAHOO)' },
      { value: 'a0w3h000004GoiWAAS', text: 'West Volusia (WVMS)' },
      { value: 'a0w3h000001KEOrAAO', text: 'YMCA of Southwest Florida Masters Hurricanes (SFYH)' }
    ]
  };

  var WORKOUT_GROUPS = {
    'a0w3h000001KFKKAA4': [{ value: 'wg1', text: 'Meet at Blue' }]
  };

  var lmscSelect        = document.getElementById('selectedLmsc');
  var clubSelect        = document.getElementById('selectedClub');
  var workoutGroupSelect = document.getElementById('selectedWorkoutgroup');
  var workoutGroupCol   = document.querySelector('.club-information__column');

  if (workoutGroupCol) workoutGroupCol.style.display = 'none';

  if (lmscSelect && clubSelect) {
    lmscSelect.addEventListener('change', function () {
      var clubs = CLUBS[this.value] || [];
      clubSelect.innerHTML = '<option selected value="-1">Select a club</option>';
      clubs.forEach(function (c) {
        var opt = document.createElement('option');
        opt.value = c.value;
        opt.textContent = c.text;
        clubSelect.appendChild(opt);
      });
      if (workoutGroupSelect) workoutGroupSelect.innerHTML = '<option selected value="-1">Select a workout group</option>';
      if (workoutGroupCol) workoutGroupCol.style.display = 'none';
    });
  }

  if (clubSelect && workoutGroupCol && workoutGroupSelect) {
    clubSelect.addEventListener('change', function () {
      var groups = WORKOUT_GROUPS[this.value] || [];
      workoutGroupSelect.innerHTML = '<option selected value="-1">Select a workout group</option>';
      groups.forEach(function (g) {
        var opt = document.createElement('option');
        opt.value = g.value;
        opt.textContent = g.text;
        workoutGroupSelect.appendChild(opt);
      });
      workoutGroupCol.style.display = groups.length > 0 ? '' : 'none';
    });
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  setPaymentVisible(false);
  buildPaymentSummary();
})();
