# Design — Expense & Budget Visualizer

## Architecture Overview
Single-page application. All logic lives in one Vanilla JS file (`js/app.js`). No build step, no bundler, no framework. The page loads directly in a browser.

```
index.html
│
├── <link> css/style.css        — all styles, CSS variables for theming
└── <script> js/app.js          — all logic (state, DOM, events, chart, storage)
    │
    ├── STATE                   — transactions[], categories[], spendingLimit, darkMode
    ├── LOCAL STORAGE           — persist() / hydrate()
    ├── RENDER LAYER            — renderBalance(), renderTransactions(), renderChart(), renderMonthly()
    ├── EVENT HANDLERS          — form submit, delete, sort, theme toggle, limit, monthly toggle
    └── INIT                    — hydrate() → rebuildCategorySelect() → renderAll()
```

---

## Data Model

### Transaction object
```js
{
  id:       string,   // crypto.randomUUID() or Date.now().toString()
  name:     string,   // item name (user input, escaped on render)
  amount:   number,   // positive float
  type:     'income' | 'expense',
  category: string,   // from categories[] array
  date:     string,   // ISO 8601 timestamp
}
```

### LocalStorage keys
| Key               | Value                        |
|-------------------|------------------------------|
| `bt_transactions` | JSON array of Transaction    |
| `bt_categories`   | JSON array of strings        |
| `bt_limit`        | number (0 = no limit)        |
| `bt_theme`        | `'dark'` \| `'light'`        |

---

## UI Layout (Mobile-first, max-width 680px)

```
┌─────────────────────────────────┐
│  💸 Budget Tracker       🌙/☀️  │  ← sticky header
├─────────────────────────────────┤
│       TOTAL BALANCE             │  ← gradient card
│    Income ↑    │    Expense ↓   │
├─────────────────────────────────┤
│  ⚠️ Limit warning banner        │  ← hidden unless exceeded
├─────────────────────────────────┤
│  ADD TRANSACTION                │  ← form card
│  [Item Name        ]            │
│  [Amount] [Type ▼ ]             │
│  [Category        ▼]            │
│  [Custom cat input] (hidden)    │
│  + Add Custom Category          │
│  [      Add Transaction      ]  │
├─────────────────────────────────┤
│  SPENDING LIMIT                 │
│  [Amount] [Set]                 │
├─────────────────────────────────┤
│  TRANSACTIONS        [Sort ▼]   │
│  📅 Monthly Summary             │
│  ┌─ monthly panel (hidden) ───┐ │
│  │ Month     +income  −expense│ │
│  └────────────────────────────┘ │
│  ┌─ tx item ──────────────────┐ │
│  │ 🍔 Lunch  Food  16 Sep     │ │
│  │               − Rp 25.000 🗑│ │
│  └────────────────────────────┘ │
│  (scrollable, max-height 420px) │
├─────────────────────────────────┤
│  SPENDING BY CATEGORY           │
│        [ doughnut chart ]       │
│    Food ■  Transport ■  Fun ■   │
└─────────────────────────────────┘
```

---

## Theming
CSS custom properties (`--clr-*`) defined on `:root` for light mode, overridden on `body.dark`. JS toggles the `dark` / `light` class on `<body>`.

Key colour tokens:
- `--clr-primary`: `#6c63ff` — accent / buttons / links
- `--clr-income`:  `#10b981` — green for income amounts
- `--clr-expense`: `#ef4444` — red for expense amounts
- `--clr-warn`:    `#f59e0b` — amber for limit warnings

---

## Chart
- Library: **Chart.js 4.4.0** (CDN, UMD build)
- Type: `doughnut`
- Data source: expense transactions only, aggregated by category
- Updates: `chartInstance.destroy()` then re-create on every data change
- Theme-aware: `borderColor` and legend `color` switch based on `darkMode` flag

---

## Security
All user-provided strings (item name, category name) are passed through `safeHTML()` before being injected into `innerHTML`:
```js
function safeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
```

---

## File Responsibilities

| File | Responsibility |
|------|---------------|
| `index.html` | Semantic HTML structure, CDN script tag for Chart.js, links to CSS and JS |
| `css/style.css` | All visual styling — layout, colours, dark mode, animations, responsive breakpoints |
| `js/app.js` | All logic — state management, LocalStorage, DOM rendering, event handling, chart |
| `.kiro/steering/project.md` | Project context and constraints for Kiro AI |
| `.kiro/specs/budget-visualizer/requirements.md` | Functional and non-functional requirements |
| `.kiro/specs/budget-visualizer/design.md` | This file — architecture and design decisions |
| `.kiro/specs/budget-visualizer/tasks.md` | Implementation task breakdown |
