# Requirements — Expense & Budget Visualizer

## Introduction
A mobile-friendly single-page web app that helps users track daily spending. Users can add transactions, view their balance, see spending history, and visualize expenses by category in a chart.

---

## Requirements

### REQ-1: Input Form
- **REQ-1.1** The form must include: Item Name (text), Amount (number), Type (Income/Expense), and Category (select)
- **REQ-1.2** All fields must be validated — the form must not submit if any field is empty or amount is not a positive number
- **REQ-1.3** On successful submit, the transaction is added to the list and the form resets
- **REQ-1.4** Users must be able to add custom categories beyond the default three (Food, Transport, Fun)

### REQ-2: Transaction List
- **REQ-2.1** All transactions must be displayed in a scrollable list
- **REQ-2.2** Each item must show: item name, amount (formatted as Rp), category badge, type, and date
- **REQ-2.3** Each item must have a delete button that removes it immediately
- **REQ-2.4** Users must be able to sort transactions by: newest, oldest, amount (high/low), category (A–Z)

### REQ-3: Total Balance
- **REQ-3.1** Total balance must be displayed prominently at the top
- **REQ-3.2** Total income and total expense must be shown as subtotals
- **REQ-3.3** Balance must update automatically when a transaction is added or deleted
- **REQ-3.4** Balance amount must visually indicate negative balance (red tint)

### REQ-4: Visual Chart
- **REQ-4.1** A doughnut/pie chart must show spending distribution by category
- **REQ-4.2** Chart must only include expense transactions (not income)
- **REQ-4.3** Chart must update automatically when transactions change
- **REQ-4.4** Tooltips must show category name, amount (Rp), and percentage
- **REQ-4.5** An empty state message must appear when there are no expenses

### REQ-5: Data Persistence
- **REQ-5.1** All transactions must be saved to LocalStorage
- **REQ-5.2** Custom categories must be saved to LocalStorage
- **REQ-5.3** Spending limit must be saved to LocalStorage
- **REQ-5.4** Theme preference (dark/light) must be saved to LocalStorage
- **REQ-5.5** All data must be restored on page reload

### REQ-6: Spending Limit
- **REQ-6.1** Users must be able to set a spending limit (Rp amount)
- **REQ-6.2** A warning banner must appear at the top when total expenses exceed the limit
- **REQ-6.3** Individual transactions that exceed the limit must be highlighted in amber
- **REQ-6.4** Users must be able to clear the spending limit

### REQ-7: Monthly Summary
- **REQ-7.1** A toggleable monthly summary panel must be available in the transaction section
- **REQ-7.2** It must show total income and total expense per calendar month
- **REQ-7.3** Months must be sorted newest first

### REQ-8: Theme
- **REQ-8.1** The app must support both light and dark mode
- **REQ-8.2** A toggle button in the header must switch between modes
- **REQ-8.3** The chart must update its colours to match the active theme

### REQ-9: Non-Functional Requirements
- **REQ-9.1** The app must work on Chrome, Firefox, Edge, and Safari
- **REQ-9.2** The app must be responsive and mobile-friendly (min width: 320px)
- **REQ-9.3** No backend or server is required — fully client-side
- **REQ-9.4** No JavaScript frameworks (React, Vue, Angular, etc.)
- **REQ-9.5** User input must be escaped before rendering to prevent XSS
- **REQ-9.6** Only 1 CSS file allowed inside `css/`
- **REQ-9.7** Only 1 JS file allowed inside `js/`
