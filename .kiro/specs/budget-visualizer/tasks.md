# Tasks — Expense & Budget Visualizer

## Status Legend
- ✅ Done
- 🔄 In Progress
- ⬜ Not Started

---

## Phase 1 — Project Setup

- ✅ **TASK-01** Create project folder structure (`css/`, `js/`, `.kiro/`)
- ✅ **TASK-02** Create `index.html` with semantic HTML skeleton
- ✅ **TASK-03** Create `css/style.css` with CSS variable tokens (light + dark theme)
- ✅ **TASK-04** Create `js/app.js` with state variables and DOM references
- ✅ **TASK-05** Add Chart.js CDN link to `index.html`

---

## Phase 2 — Core Features (MVP)

- ✅ **TASK-06** Build input form UI (Item Name, Amount, Type, Category)
- ✅ **TASK-07** Implement form validation (all fields required, amount > 0)
- ✅ **TASK-08** Implement `addTransaction()` — create transaction object, push to state, reset form
- ✅ **TASK-09** Implement `renderTransactions()` — build list items from state array
- ✅ **TASK-10** Implement delete functionality with event delegation
- ✅ **TASK-11** Implement `renderBalance()` — compute and display total, income, expense
- ✅ **TASK-12** Implement `renderChart()` — aggregate expenses by category, render doughnut chart
- ✅ **TASK-13** Implement chart empty state when no expenses exist

---

## Phase 3 — Data Persistence

- ✅ **TASK-14** Implement `persist()` — save all state to LocalStorage
- ✅ **TASK-15** Implement `hydrate()` — load all state from LocalStorage on init
- ✅ **TASK-16** Call `persist()` on every state mutation (add, delete, limit, theme, categories)

---

## Phase 4 — Optional Challenges

- ✅ **TASK-17** Custom categories — add/save new category, rebuild `<select>`, persist to LocalStorage
- ✅ **TASK-18** Monthly summary — aggregate by month, render in toggleable panel
- ✅ **TASK-19** Sort transactions — implement 5 sort modes via `<select>` dropdown
- ✅ **TASK-20** Spending limit — set/clear limit, show banner and highlight items over limit
- ✅ **TASK-21** Dark/light mode toggle — apply theme class to `<body>`, rebuild chart, persist preference

---

## Phase 5 — Polish & Deployment

- ✅ **TASK-22** Add CSS animations (fadeUp on new items, shake on limit banner)
- ✅ **TASK-23** Make layout responsive (mobile-first, breakpoints at 360px and 480px)
- ✅ **TASK-24** Escape all user input with `safeHTML()` before rendering
- ✅ **TASK-25** Write `.kiro/steering/project.md` with project context
- ✅ **TASK-26** Write `.kiro/specs/` (requirements, design, tasks)
- ✅ **TASK-27** Create `.kiro/hooks/` for session context and save reminders
- ⬜ **TASK-28** Commit all files using GitHub Desktop
- ⬜ **TASK-29** Push repository to GitHub
- ⬜ **TASK-30** Enable GitHub Pages (Settings → Pages → Branch: main / root)
- ⬜ **TASK-31** Submit GitHub Repo URL + GitHub Pages URL + AWS Builder ID on Paperform
