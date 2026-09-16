# Expense & Budget Visualizer — Project Steering

## Project Overview
This is a mobile-friendly Expense & Budget Visualizer web app built for RevoU Coding Camp (Batch 14, September 26 — Ronaldo).

The app helps users track their daily spending by showing total balance, transaction history, and a visual chart of spending by category.

## Tech Stack
- **HTML** — page structure (`index.html`)
- **CSS** — styling, mobile-first, dark/light mode (`css/style.css`)
- **Vanilla JavaScript** — all logic, no frameworks (`js/app.js`)
- **Chart.js** — doughnut chart via CDN
- **LocalStorage** — client-side data persistence

## Folder Structure
```
CodingCamp-14September26-Ronaldo/
├── index.html          # Main HTML page
├── css/
│   └── style.css       # Single CSS file (rule: only 1 CSS file)
├── js/
│   └── app.js          # Single JS file (rule: only 1 JS file)
└── .kiro/
    └── steering/
        └── project.md  # This file
```

## MVP Features
- Input form with validation (Item Name, Amount, Category, Type)
- Scrollable transaction list with delete functionality
- Auto-updating total balance (income and expense breakdown)
- Doughnut pie chart by category using Chart.js

## Optional Challenges Implemented (all 5)
1. Custom categories — users can add their own categories
2. Monthly summary view — toggleable monthly income/expense breakdown
3. Sort transactions — by newest, oldest, amount ↑↓, category A–Z
4. Spending limit highlight — highlights transactions and shows banner when exceeded
5. Dark/light mode toggle — theme saved to localStorage

## Constraints
- No backend server
- No frameworks (React, Vue, etc.)
- All data stored in browser LocalStorage only
- Must work on Chrome, Firefox, Edge, Safari
- Mobile-friendly / responsive layout

## Code Guidelines
- Keep `css/style.css` as the only CSS file
- Keep `js/app.js` as the only JS file
- Use semantic HTML elements
- Escape user input before rendering to prevent XSS
- Use CSS custom properties (variables) for theming
