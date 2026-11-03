/* Login gate: if nobody is logged in, open the separate login page first */
try {
  if (!JSON.parse(localStorage.getItem("hp_user") || '""')) window.location.replace("login.html");
} catch (e) {}
rolloverDay();   // new day? save yesterday and start fresh
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
/* Live progress card: today's numbers, yesterday's summary and a 7-day graph.
   It re-reads the saved data every second and when another tab changes it. */
const DEMO_YEST = { md: 2, mt: 3, td: 4, tt: 5, water: 6 };
const DEMO_SCORES = [62, 70, 48, 85, 78];   // sample scores for the days before yesterday

const MiniBar = ({ value }) => h("div", { className: "bar" }, h("i", { style: { width: value + "%" } }));

function ProgressCard() {
  const [now, setNow] = useState(new Date());
  const [demo, setDemo] = useState(false);
  useEffect(() => {
    const refresh = () => setNow(new Date());
    const id = setInterval(refresh, 1000);
    window.addEventListener("storage", refresh);
    return () => { clearInterval(id); window.removeEventListener("storage", refresh); };
  }, []);

  const today = summarize();
  const todayScore = scoreOf(today);
  const hist = readJSON("hp_history", {});

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    let snap = i === 0 ? today : hist[dayKey(d)];
    let score = snap ? scoreOf(snap) : null;
    if (demo && i > 0) {
      snap = i === 1 ? DEMO_YEST : null;
      score = i === 1 ? scoreOf(DEMO_YEST) : DEMO_SCORES[6 - i];
    }
    days.push({ key: dayKey(d), label: i === 0 ? "Today" : d.toLocaleDateString([], { weekday: "short" }), snap, score });
  }
  const ys = days[5].snap;
  const yDone = ys ? ys.md + ys.td + ys.water : 0;
  const hasPast = days.slice(0, 6).some(d => d.score !== null && (d.snap ? d.snap.md + d.snap.td + d.snap.water > 0 : true));
  const diff = ys && yDone > 0 ? todayScore - scoreOf(ys) : null;

  const rows = [
    { l: "Medication", a: today.md, b: today.mt, y: ys && ys.mt ? ys.md + "/" + ys.mt : "–" },
    { l: "Daily routine", a: today.td, b: today.tt, y: ys && ys.tt ? ys.td + "/" + ys.tt : "–" },
    { l: "Water (glasses)", a: today.water, b: WATER_GOAL, y: ys ? ys.water + "/" + WATER_GOAL : "–" }
  ];
  const C = 2 * Math.PI * 34;

  return h("div", { className: "pc" },
    h("div", { className: "pc-head" },
      h("div", { className: "eyebrow" }, "Your Progress"),
      h("span", { className: "live" }, h("i"), "Live · " + now.toLocaleTimeString())),

    h("div", { className: "pc-top" },
      h("svg", { width: 86, height: 86, viewBox: "0 0 86 86" },
        h("circle", { cx: 43, cy: 43, r: 34, fill: "none", stroke: "var(--line)", strokeWidth: 9 }),
        h("circle", { cx: 43, cy: 43, r: 34, fill: "none", stroke: "var(--brand)", strokeWidth: 9, strokeLinecap: "round",
          strokeDasharray: (C * todayScore / 100) + " " + C, transform: "rotate(-90 43 43)" }),
        h("text", { x: 43, y: 49, textAnchor: "middle", fontSize: 20, fontWeight: 700, fill: "var(--text)" }, todayScore + "%")),
      h("div", null,
        h("h3", null, "Today's score"),
        h("p", { className: "note" }, diff === null ? "Tick your trackers to see your progress grow."
          : diff > 0 ? "▲ " + diff + "% ahead of yesterday" : diff < 0 ? "▼ " + Math.abs(diff) + "% behind yesterday" : "Same as yesterday"))),

    rows.map(r => h("div", { className: "pc-row", key: r.l },
      h("div", { className: "pc-line" }, h("span", null, r.l), h("b", null, r.a + "/" + r.b),
        h("small", null, "Yesterday " + r.y)),
      h(MiniBar, { value: Math.min(100, pct(r.a, r.b)) }))),

    h("div", { className: "pc-yest" },
      h("b", null, "What you did yesterday"),
      yDone > 0
        ? h("p", null, "You took " + ys.md + "/" + ys.mt + " medicines, completed " + ys.td + "/" + ys.tt +
            " routine tasks and drank " + ys.water + "/" + WATER_GOAL + " glasses of water (score " + scoreOf(ys) + "%).")
        : h("p", { className: "note" }, "Nothing was recorded yesterday. Use your trackers today and tomorrow you'll see it here.")),

    h("div", { className: "chart" },
      days.map((d, i) => h("div", { className: "col" + (i === 6 ? " today" : ""), key: d.key,
          title: d.label + ": " + (d.score === null ? "no data" : d.score + "%") },
        h("span", { className: "val" }, d.score === null ? "–" : d.score),
        h("div", { className: "barv" }, h("i", { style: { height: (d.score || 0) + "%" } })),
        h("small", null, d.label)))),

    (!hasPast || demo) && h("div", { className: "center", style: { marginTop: 12 } },
      h(Button, { label: demo ? "Hide sample data" : "Preview with sample data", variant: "ghost", small: true, onClick: () => setDemo(!demo) }),
      demo && h("p", { className: "note" }, "Sample data only. Not saved.")));
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
  usePeriodReminder();
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
        h(ProgressCard))),

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
