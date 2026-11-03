# HealthPulse 🩺

**A personal healthcare companion website** for tracking medication, daily routines, water, meditation, diet, cycle and medical notes, all in one calm place.

Built with HTML, CSS and JavaScript, using React components loaded from a CDN (no installation or build step needed).

> ⚠️ HealthPulse is a personal tracking tool. It is **not** a substitute for professional medical advice.

---

## Why I created this

When life gets busy, health is the first thing we forget. People skip water, miss medicines and lose track of what the doctor said. Missed medication can be risky. HealthPulse makes these small daily habits simple, visible and stress-free, in one place anyone can use.

## Features

- **Separate login page** with Log in / Sign up tabs (demo login)
- **Home page** with a live progress card:
  - today's score ring and progress bars
  - a "What you did yesterday" summary
  - a 7-day progress graph
- **Dashboard with separate tabs**
  - **Daily Tracker:** medication table (tick, time taken, progress bar), daily routine checklist, *Add Tracker*, *Start new day*
  - **Wellness:** water counter and a 10-minute meditation timer
  - **Health Notes:** diet planner, period tracker and medical notes
  - **Insights:** daily wellness score
  - **Settings:** change name, switch theme, delete data, log out
- **Light and dark theme**
- **Responsive design** for phone, tablet and desktop
- **Daily tip** fetched from a public API
- Data is saved in the browser, so it is still there when you come back

## Tech stack

| Part | Used for |
|---|---|
| HTML | Page structure (3 small pages) |
| CSS | Design, layout, light/dark theme, responsive rules |
| JavaScript + React (CDN) | Components, state and hooks |
| `localStorage` + JSON | Saving data in the browser |
| [Advice Slip API](https://api.adviceslip.com/) | Daily tip |

## Project structure

```
healthpulse/
├── index.html        # Home page shell
├── login.html        # Login page shell
├── dashboard.html    # Dashboard page shell
├── styles.css        # All styles (colors, layout, dark theme, responsive)
├── common.js         # Shared: icons, Button, useLocalStorage, Navbar, Footer, history helpers
├── script.js         # Home page (welcome, quote box, live progress card)
├── login.js          # Login page
├── dashboard.js      # Dashboard tabs
└── images/
    └── health.png    # Illustration used on the login page
```

## Getting started

1. **Download or clone** the project:
   ```bash
   git clone https://github.com/rpurvi94-cloud/healthpulse.git
   cd healthpulse
   ```
2. **Open it with a local server** (recommended): in VS Code, install the **Live Server** extension, right-click `index.html` and choose **Open with Live Server**.
3. Log in with **any name and a password of 4+ characters** (demo login).

An internet connection is needed for the React scripts and the daily tip.

## How it works

- Each page is a small HTML file that loads React from a CDN, then `common.js`, then the page's own script.
- Data (medicines, routine, water, notes, theme, name) is saved with a custom `useLocalStorage` hook, which stores values as **JSON text** in the browser.
- Each day's totals are saved in `hp_history`. When a new day starts, the old day is kept for the graph and "yesterday" summary, and trackers are reset.

## React concepts demonstrated

| Concept | Where |
|---|---|
| Function component | `Welcome` in `script.js` |
| Arrow function component | `Footer` in `common.js` |
| Class component and `setState()` | `QuoteBox` in `script.js` |
| Props | `Button`, `Panel`, `NoteTracker` |
| Icons | `Icon` component (inline SVG) |
| `map()` to render lists | Cards, tabs, tables, graph bars |
| `useState` counter (increment, decrement, reset) | `WaterTracker` in `dashboard.js` |
| Theme switcher | `useTheme` in `common.js` |
| `useEffect` | Meditation timer, live progress card |
| Lifecycle with hooks (mount / unmount) | Tab open/close log in `Dashboard` |
| Custom hook | `useLocalStorage` in `common.js` |
| Fetching from an API with `useEffect` | `DailyTip` in `common.js` |
| Responsive layout with CSS | `styles.css` media queries |

## Known limitations

- The login is a **demo only** and is not secure. A real version needs a backend.
- Data lives in your browser only. It does not sync between devices, and clearing browser data erases it.
- The new-day reset happens when the site is opened, not exactly at midnight.
- Reminders are visual only. There are no push notifications yet.

## Future improvements

- Real accounts with a backend and database
- Browser notifications for medication and water reminders
- Predicted next date in the period tracker
- Export data as PDF or CSV

## License

MIT. Free to use and modify.

## Author

**<PURVI RAJPUT>**, [GitHub](https://github.com/rpurvi94-cloud)
