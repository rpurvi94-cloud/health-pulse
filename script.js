/* Login gate: if nobody is logged in, open the separate login page first */
try {
  if (!JSON.parse(localStorage.getItem("hp_user") || '""')) window.location.replace("login.html");
} catch (e) {}

/* Home page (uses Icon, Button, useLocalStorage, HeroArt, DailyTip, Navbar, Footer from common.js) */

/* Q30 – Function component: Welcome message */
function Welcome({ user }) {
  return h("h1", null, "Welcome" + (user ? ", " + user : "") + " to ", h("span", null, "HealthPulse"));
}

/* Q32 + Q37 – Class component with state and setState() */
class QuoteBox extends React.Component {
  constructor(props) { super(props); this.state = { i: 0 }; this.next = this.next.bind(this); }
  next() { this.setState({ i: (this.state.i + 1) % this.props.quotes.length }); }
  render() {
    return h("div", { className: "quote-card" },
      h("div", { className: "eyebrow" }, "Daily Motivation"),
      h("p", { className: "quote" }, "“" + this.props.quotes[this.state.i] + "”"),
      h(Button, { label: "Next quote", variant: "ghost", small: true, onClick: this.next }));
  }
}

/* Q36 – map() to display lists. Each card opens its tab on the dashboard page */
const TRACKERS = [
  { tab: "wellness", icon: "lotus", name: "Meditation", text: "Guided timer to calm your mind." },
  { tab: "wellness", icon: "water", name: "Water", text: "Hydration goal and counter." },
  { tab: "notes", icon: "leaf", name: "Diet Planner", text: "Plan meals with personal notes." },
  { tab: "daily", icon: "pill", name: "Medication", text: "Doses, status and time taken." },
  { tab: "notes", icon: "cal", name: "Period Tracker", text: "Cycle dates and symptom notes." },
  { tab: "notes", icon: "note", name: "Medical Notes", text: "Keep doctor notes in one place." }
];
const WHY = [
  { icon: "heart", t: "Health is forgotten first", d: "When life gets busy, water, medicine and rest are the first things we skip." },
  { icon: "pill", t: "Missed medication is risky", d: "Reminders help people take the right dose at the right time." },
  { icon: "steth", t: "Better doctor visits", d: "Notes and symptoms in one place make check-ups clearer and easier." }
];
const GOALS = [
  { n: "8", l: "glasses of water a day" },
  { n: "30", l: "minutes of activity" },
  { n: "10", l: "minutes of calm breathing" }
];

/* App */
function App() {
  const [user, setUser] = useLocalStorage("hp_user", "");
  const [theme, setTheme] = useTheme();
  const quotes = [
    "Take care of your body. It's the only place you have to live.",
    "Small steps every day lead to big changes.",
    "Rest is productive. Your health comes first."
  ];
  const go = id => () => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth" }); };
  const openDash = tab => () => { window.location.href = "dashboard.html" + (tab ? "#" + tab : ""); };

  return h("div", null,
    h(Navbar, { theme, setTheme, user, onLogout: () => { setUser(""); window.location.href = "login.html"; },
      links: [{ t: "Why", go: go("why") }, { t: "Wellness", go: go("goals") }, { t: "Trackers", href: "dashboard.html" }] }),

    h("section", { className: "hero" },
      h("div", { className: "container" },
        h("div", null,
          h("div", { className: "eyebrow" }, "Personal Healthcare Companion"),
          h(Welcome, { user }),
          h("p", null, "Medication reminders, hydration, diet, mindfulness and cycle tracking, all in one calm place."),
          h("div", { className: "hero-actions" },
            h(Button, { label: "Open Trackers", onClick: openDash("daily") })),
          h(QuoteBox, { quotes }),
          h(DailyTip)),
        h(HeroArt))),

    h("section", { className: "why", id: "why" },
      h("div", { className: "container" },
        h("div", { className: "eyebrow" }, "Our Motivation"),
        h("h2", { className: "title" }, "Why I created this website"),
        h("div", { className: "why-box" },
          "I noticed how easily people, including me and my family, forget to drink water, take medicine on time or " +
          "note down what a doctor said. Good health is built from small daily habits, so I created HealthPulse to make " +
          "those habits simple, visible and stress-free, in one place anyone can use."),
        h("div", { className: "grid3" },
          WHY.map(w => h("div", { className: "card", key: w.t },
            h("div", { className: "ico" }, h(Icon, { name: w.icon })),
            h("h3", null, w.t), h("p", null, w.d)))))),

    h("div", { className: "band", id: "goals" },
      h("div", { className: "container" },
        h("div", { className: "grid3" },
          GOALS.map(g => h("div", { key: g.l }, h("b", null, g.n), h("span", null, g.l)))))),

    h("section", { id: "trackers" },
      h("div", { className: "container" },
        h("div", { className: "eyebrow" }, "Care Tools"),
        h("h2", { className: "title" }, "Track everything seamlessly"),
        h("p", { className: "sub" }, "Pick a tracker to open it on your dashboard. Your data stays saved in your own browser."),
        h("div", { className: "grid3" },
          TRACKERS.map(t => h("div", { className: "card click", key: t.name, onClick: openDash(t.tab) },
            h("div", { className: "ico" }, h(Icon, { name: t.icon })),
            h("h3", null, t.name), h("p", null, t.text)))))),

    h(Footer));
}
ReactDOM.createRoot(document.getElementById("root")).render(h(App));