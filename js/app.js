/* ================================================
   BUDGET TRACKER — app.js
   Vanilla JS · No frameworks · LocalStorage
   ================================================ */

'use strict';

/* ──────────────────────────────────────────────
   STATE
   ────────────────────────────────────────────── */
let transactions  = [];   // { id, name, amount, type, category, date }
let categories    = ['Food', 'Transport', 'Fun'];
let spendingLimit = 0;    // 0 = no limit set
let darkMode      = false;
let chartInstance = null;

/* ──────────────────────────────────────────────
   DOM REFERENCES
   ────────────────────────────────────────────── */
const qs = id => document.getElementById(id);

// Form
const elItemName       = qs('itemName');
const elAmount         = qs('amount');
const elTxType         = qs('txType');
const elCategory       = qs('category');
const elCustomCatField = qs('customCatField');
const elCustomCatInput = qs('customCatInput');
const elAddCatBtn      = qs('addCatBtn');
const elFormError      = qs('formError');
const elSubmitBtn      = qs('submitBtn');

// Balance
const elTotalBalance   = qs('totalBalance');
const elTotalIncome    = qs('totalIncome');
const elTotalExpense   = qs('totalExpense');

// Limit
const elLimitBanner    = qs('limitBanner');
const elLimitBannerVal = qs('limitBannerVal');
const elLimitInput     = qs('limitInput');
const elSetLimitBtn    = qs('setLimitBtn');
const elLimitInfo      = qs('limitInfo');
const elLimitInfoVal   = qs('limitInfoVal');
const elClearLimitBtn  = qs('clearLimitBtn');

// Transactions
const elTxList         = qs('txList');
const elTxEmpty        = qs('txEmpty');
const elSortSelect     = qs('sortSelect');
const elMonthlyToggle  = qs('monthlyToggleBtn');
const elMonthlyPanel   = qs('monthlyPanel');

// Chart
const elSpendChart     = qs('spendChart');
const elChartEmpty     = qs('chartEmpty');

// Theme
const elThemeToggle    = qs('themeToggle');

/* ──────────────────────────────────────────────
   CATEGORY HELPERS
   ────────────────────────────────────────────── */
const BUILT_IN_META = {
  Food:      { emoji: '🍔', badge: 'badge-Food'      },
  Transport: { emoji: '🚌', badge: 'badge-Transport' },
  Fun:       { emoji: '🎉', badge: 'badge-Fun'       },
};

function getCatMeta(cat) {
  return BUILT_IN_META[cat] ?? { emoji: '📦', badge: 'badge-custom' };
}

function rebuildCategorySelect() {
  const prev = elCategory.value;
  elCategory.innerHTML = '<option value="">— Select category —</option>';
  categories.forEach(cat => {
    const { emoji } = getCatMeta(cat);
    const opt = document.createElement('option');
    opt.value       = cat;
    opt.textContent = `${emoji} ${cat}`;
    elCategory.appendChild(opt);
  });
  if (categories.includes(prev)) elCategory.value = prev;
}

/* ──────────────────────────────────────────────
   LOCAL STORAGE
   ────────────────────────────────────────────── */
const STORAGE_KEYS = {
  tx:    'bt_transactions',
  cats:  'bt_categories',
  limit: 'bt_limit',
  theme: 'bt_theme',
};

function persist() {
  localStorage.setItem(STORAGE_KEYS.tx,    JSON.stringify(transactions));
  localStorage.setItem(STORAGE_KEYS.cats,  JSON.stringify(categories));
  localStorage.setItem(STORAGE_KEYS.limit, spendingLimit);
  localStorage.setItem(STORAGE_KEYS.theme, darkMode ? 'dark' : 'light');
}

function hydrate() {
  const rawTx    = localStorage.getItem(STORAGE_KEYS.tx);
  const rawCats  = localStorage.getItem(STORAGE_KEYS.cats);
  const rawLimit = localStorage.getItem(STORAGE_KEYS.limit);
  const rawTheme = localStorage.getItem(STORAGE_KEYS.theme);

  if (rawTx)    transactions  = JSON.parse(rawTx);
  if (rawCats)  categories    = JSON.parse(rawCats);
  if (rawLimit) spendingLimit = parseFloat(rawLimit) || 0;
  if (rawTheme === 'dark') applyTheme(true, false); // don't re-persist on load
}

/* ──────────────────────────────────────────────
   FORMATTING
   ────────────────────────────────────────────── */
function fmtRp(n) {
  return 'Rp\u00a0' + Math.abs(n).toLocaleString('id-ID');
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

function monthKey(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(key) {
  const [y, m] = key.split('-');
  return new Date(parseInt(y), parseInt(m) - 1, 1)
    .toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

function safeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/* ──────────────────────────────────────────────
   BALANCE
   ────────────────────────────────────────────── */
function calcTotals() {
  let income = 0, expense = 0;
  transactions.forEach(tx => {
    if (tx.type === 'income') income  += tx.amount;
    else                      expense += tx.amount;
  });
  return { income, expense, balance: income - expense };
}

function renderBalance() {
  const { income, expense, balance } = calcTotals();

  elTotalBalance.textContent  = fmtRp(balance);
  elTotalBalance.style.color  = balance < 0 ? '#fca5a5' : '';
  elTotalIncome.textContent   = fmtRp(income);
  elTotalExpense.textContent  = fmtRp(expense);

  // Limit warning
  if (spendingLimit > 0 && expense > spendingLimit) {
    elLimitBannerVal.textContent = fmtRp(spendingLimit);
    elLimitBanner.classList.remove('hidden');
  } else {
    elLimitBanner.classList.add('hidden');
  }
}

/* ──────────────────────────────────────────────
   TRANSACTION LIST
   ────────────────────────────────────────────── */
function sortedTransactions() {
  const arr = [...transactions];
  switch (elSortSelect.value) {
    case 'oldest':      return arr.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'amount-desc': return arr.sort((a, b) => b.amount - a.amount);
    case 'amount-asc':  return arr.sort((a, b) => a.amount - b.amount);
    case 'category':    return arr.sort((a, b) => a.category.localeCompare(b.category));
    default:            return arr.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}

function renderTransactions() {
  const list = sortedTransactions();

  if (list.length === 0) {
    elTxList.innerHTML = '';
    elTxEmpty.classList.remove('hidden');
    elTxList.appendChild(elTxEmpty);
    return;
  }

  elTxEmpty.classList.add('hidden');
  elTxList.innerHTML = '';

  list.forEach(tx => {
    const { emoji, badge } = getCatMeta(tx.category);
    const overLimit = spendingLimit > 0 && tx.type === 'expense' && tx.amount > spendingLimit;
    const sign      = tx.type === 'income' ? '+' : '−';

    const li = document.createElement('li');
    li.className  = `tx-item${overLimit ? ' over-limit' : ''}`;
    li.dataset.id = tx.id;

    li.innerHTML = `
      <span class="tx-emoji" aria-hidden="true">${emoji}</span>
      <div class="tx-body">
        <p class="tx-name">${safeHTML(tx.name)}</p>
        <div class="tx-meta">
          <span class="tx-badge ${safeHTML(badge)}">${safeHTML(tx.category)}</span>
          <span class="tx-date">${fmtDate(tx.date)}</span>
          ${overLimit ? '<span class="tx-over-tag">⚠ over limit</span>' : ''}
        </div>
      </div>
      <span class="tx-amount ${tx.type}">${sign} ${fmtRp(tx.amount)}</span>
      <button class="tx-del" data-id="${safeHTML(tx.id)}"
        aria-label="Delete transaction ${safeHTML(tx.name)}" title="Delete">🗑</button>
    `;
    elTxList.appendChild(li);
  });
}

/* ──────────────────────────────────────────────
   CHART
   ────────────────────────────────────────────── */
const PALETTE = [
  '#6c63ff','#ef4444','#10b981','#f59e0b',
  '#3b82f6','#ec4899','#8b5cf6','#14b8a6',
  '#f97316','#06b6d4','#84cc16','#a78bfa',
];

function renderChart() {
  const expenses = transactions.filter(tx => tx.type === 'expense');

  if (expenses.length === 0) {
    elSpendChart.classList.add('hidden');
    elChartEmpty.classList.remove('hidden');
    if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
    return;
  }

  elSpendChart.classList.remove('hidden');
  elChartEmpty.classList.add('hidden');

  // Aggregate by category
  const totals = {};
  expenses.forEach(tx => { totals[tx.category] = (totals[tx.category] || 0) + tx.amount; });

  const labels = Object.keys(totals);
  const data   = labels.map(k => totals[k]);
  const colors = labels.map((_, i) => PALETTE[i % PALETTE.length]);

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(elSpendChart, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: darkMode ? '#171921' : '#ffffff',
        hoverOffset: 10,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color:    darkMode ? '#e8eaf2' : '#111827',
            padding:  16,
            boxWidth: 12,
            borderRadius: 4,
            font: { size: 12 },
          },
        },
        tooltip: {
          callbacks: {
            label(ctx) {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct   = ((ctx.parsed / total) * 100).toFixed(1);
              return ` ${ctx.label}: ${fmtRp(ctx.parsed)} (${pct}%)`;
            },
          },
        },
      },
    },
  });
}

/* ──────────────────────────────────────────────
   MONTHLY SUMMARY
   ────────────────────────────────────────────── */
function renderMonthly() {
  if (transactions.length === 0) {
    elMonthlyPanel.innerHTML = '<p style="color:var(--clr-text-muted);font-size:.85rem">No data yet.</p>';
    return;
  }

  const map = {};
  transactions.forEach(tx => {
    const k = monthKey(tx.date);
    if (!map[k]) map[k] = { income: 0, expense: 0 };
    if (tx.type === 'income') map[k].income  += tx.amount;
    else                      map[k].expense += tx.amount;
  });

  const keys = Object.keys(map).sort((a, b) => b.localeCompare(a));

  let html = '<h3>Monthly Summary</h3>';
  keys.forEach(k => {
    const { income, expense } = map[k];
    html += `
      <div class="month-row">
        <span class="month-name">${monthLabel(k)}</span>
        <span class="month-numbers">
          <span class="month-inc">+${fmtRp(income)}</span>
          <span class="month-exp">−${fmtRp(expense)}</span>
        </span>
      </div>`;
  });
  elMonthlyPanel.innerHTML = html;
}

/* ──────────────────────────────────────────────
   RENDER ALL
   ────────────────────────────────────────────── */
function renderAll() {
  renderBalance();
  renderTransactions();
  renderChart();
  if (!elMonthlyPanel.classList.contains('hidden')) renderMonthly();
}

/* ──────────────────────────────────────────────
   ADD TRANSACTION
   ────────────────────────────────────────────── */
function addTransaction() {
  const name     = elItemName.value.trim();
  const rawAmt   = elAmount.value.trim();
  const type     = elTxType.value;
  const category = elCategory.value;

  // Validation
  if (!name || !rawAmt || !category) {
    elFormError.textContent = '⚠️ Please fill in all fields.';
    elFormError.classList.remove('hidden');
    return;
  }

  const amount = parseFloat(rawAmt);
  if (isNaN(amount) || amount <= 0) {
    elFormError.textContent = '⚠️ Amount must be a positive number.';
    elFormError.classList.remove('hidden');
    return;
  }

  elFormError.classList.add('hidden');

  transactions.unshift({
    id:       crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name,
    amount,
    type,
    category,
    date:     new Date().toISOString(),
  });

  persist();
  renderAll();

  // Reset inputs
  elItemName.value = '';
  elAmount.value   = '';
  elTxType.value   = 'expense';
  elCategory.value = '';
  elItemName.focus();
}

/* ──────────────────────────────────────────────
   DELETE TRANSACTION
   ────────────────────────────────────────────── */
function deleteTransaction(id) {
  transactions = transactions.filter(tx => tx.id !== id);
  persist();
  renderAll();
}

/* ──────────────────────────────────────────────
   CUSTOM CATEGORY
   ────────────────────────────────────────────── */
function toggleCustomCatField() {
  const hidden = elCustomCatField.classList.contains('hidden');
  if (hidden) {
    elCustomCatField.classList.remove('hidden');
    elCustomCatInput.focus();
    elAddCatBtn.textContent = '✕ Cancel';
  } else {
    elCustomCatField.classList.add('hidden');
    elCustomCatInput.value  = '';
    elAddCatBtn.textContent = '＋ Add Custom Category';
  }
}

function saveCustomCategory() {
  const name = elCustomCatInput.value.trim();
  if (!name) return;

  if (categories.some(c => c.toLowerCase() === name.toLowerCase())) {
    alert(`Category "${name}" already exists.`);
    return;
  }

  categories.push(name);
  persist();
  rebuildCategorySelect();
  elCategory.value = name;

  // Close the input
  elCustomCatField.classList.add('hidden');
  elCustomCatInput.value  = '';
  elAddCatBtn.textContent = '＋ Add Custom Category';
}

/* ──────────────────────────────────────────────
   SPENDING LIMIT
   ────────────────────────────────────────────── */
function setLimit() {
  const val = parseFloat(elLimitInput.value);
  if (isNaN(val) || val <= 0) {
    alert('Enter a valid positive number for the spending limit.');
    return;
  }
  spendingLimit = val;
  persist();

  elLimitInfoVal.textContent = fmtRp(spendingLimit);
  elLimitInfo.classList.remove('hidden');
  elLimitInput.value = '';
  renderAll();
}

function clearLimit() {
  spendingLimit = 0;
  persist();
  elLimitInfo.classList.add('hidden');
  elLimitBanner.classList.add('hidden');
  renderTransactions(); // re-render to remove over-limit highlights
}

/* ──────────────────────────────────────────────
   THEME
   ────────────────────────────────────────────── */
function applyTheme(dark, save = true) {
  darkMode = dark;
  document.body.classList.toggle('dark',  darkMode);
  document.body.classList.toggle('light', !darkMode);
  elThemeToggle.textContent = darkMode ? '☀️' : '🌙';
  elThemeToggle.title       = darkMode ? 'Switch to light mode' : 'Switch to dark mode';
  if (save) persist();
}

function toggleTheme() {
  applyTheme(!darkMode);
  // Rebuild chart so legend/border colours update to match theme
  if (chartInstance) renderChart();
}

/* ──────────────────────────────────────────────
   EVENT LISTENERS
   ────────────────────────────────────────────── */

// Submit button
elSubmitBtn.addEventListener('click', addTransaction);

// Enter key on text / number inputs
[elItemName, elAmount].forEach(el =>
  el.addEventListener('keydown', e => { if (e.key === 'Enter') addTransaction(); })
);

// Clear form error on user input
[elItemName, elAmount, elCategory].forEach(el =>
  el.addEventListener('input', () => elFormError.classList.add('hidden'))
);

// Delete via event delegation
elTxList.addEventListener('click', e => {
  const btn = e.target.closest('.tx-del');
  if (btn) deleteTransaction(btn.dataset.id);
});

// Sort
elSortSelect.addEventListener('change', renderTransactions);

// Custom category
elAddCatBtn.addEventListener('click', toggleCustomCatField);
elCustomCatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') saveCustomCategory();
});
elCustomCatInput.addEventListener('blur', () => {
  if (elCustomCatInput.value.trim()) saveCustomCategory();
});

// Spending limit
elSetLimitBtn.addEventListener('click', setLimit);
elLimitInput.addEventListener('keydown', e => { if (e.key === 'Enter') setLimit(); });
elClearLimitBtn.addEventListener('click', clearLimit);

// Monthly summary
elMonthlyToggle.addEventListener('click', () => {
  const isHidden = elMonthlyPanel.classList.contains('hidden');
  elMonthlyPanel.classList.toggle('hidden', !isHidden);
  elMonthlyToggle.textContent = isHidden ? '📅 Hide Summary' : '📅 Monthly Summary';
  if (isHidden) renderMonthly();
});

// Theme toggle
elThemeToggle.addEventListener('click', toggleTheme);

/* ──────────────────────────────────────────────
   INIT
   ────────────────────────────────────────────── */
function init() {
  hydrate();
  rebuildCategorySelect();

  if (spendingLimit > 0) {
    elLimitInfoVal.textContent = fmtRp(spendingLimit);
    elLimitInfo.classList.remove('hidden');
  }

  renderAll();
}

init();
