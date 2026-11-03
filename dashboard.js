/* Dashboard page with separate tabs (uses components from common.js) */
try {
  if (!JSON.parse(localStorage.getItem("hp_user") || '""')) window.location.replace("login.html");
} catch (e) {}
rolloverDay();   // new day? save yesterday and start fresh
/* Q36 – tabs are shown with map() */
const TABS = [
  { id: "daily", t: "Daily Tracker" },
  { id: "wellness", t: "Wellness" },
  { id: "notes", t: "Health Notes" },
  { id: "insights", t: "Insights" },
  { id: "settings", t: "Settings" }
];
const DEFAULT_MEDS = [
  { id: 1, name: "Aspirin", dose: "81mg", freq: "Daily (Morning)", done: false, time: "" },
  { id: 2, name: "Vitamins", dose: "1 Tablet", freq: "Daily (Evening)", done: false, time: "" },
  { id: 3, name: "Ibuprofen", dose: "200mg", freq: "As Needed", done: false, time: "" }
];
const DEFAULT_TASKS = ["Morning Hydration (500ml)", "Eat Breakfast", "15-Minute Stretch", "Read for 30 min", "Cycle Tracker Log"]
  .map((name, i) => ({ id: i + 1, name, done: false }));


const Bar = ({ value }) => h("div", { className: "bar" }, h("i", { style: { width: value + "%" } }));
const Panel = ({ title, children }) => h("div", { className: "panel" }, h("h3", null, title), children);

/* Medication table with checkboxes and a progress bar */
function MedicationTracker({ meds, setMeds }) {
  const taken = meds.filter(m => m.done).length;
  const toggle = id => setMeds(meds.map(m => m.id !== id ? m : {
    ...m, done: !m.done,
    time: !m.done ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""
  }));
  const remove = id => setMeds(meds.filter(m => m.id !== id));
  return h(Panel, { title: "Medication Tracker" },
    h("div", { className: "tbl-wrap" },
      h("table", { className: "tbl" },
        h("thead", null, h("tr", null,
          ["Medication Name", "Dosage", "Frequency", "Status", "Time(s)", ""].map((t, i) => h("th", { key: i }, t)))),
        h("tbody", null, meds.map(m => h("tr", { key: m.id },
          h("td", null, m.name), h("td", null, m.dose), h("td", null, m.freq),
          h("td", null, h("input", { type: "checkbox", checked: m.done, onChange: () => toggle(m.id) })),
          h("td", null, m.time || "–"),
          h("td", null, h("button", { className: "x", title: "Remove", onClick: () => remove(m.id) }, "✕"))))))),
    meds.length === 0 && h("p", { className: "note" }, "No medication yet. Use Add Tracker."),
    h(Bar, { value: pct(taken, meds.length) }),
    h("p", { className: "note" }, "Daily Meds Taken: " + taken + " / " + meds.length + " (" + pct(taken, meds.length) + "%)"));
}

/* Daily routine checklist with a progress bar */
function RoutineTracker({ tasks, setTasks }) {
  const done = tasks.filter(t => t.done).length;
  const toggle = id => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  return h(Panel, { title: "Daily Routine Tracker" },
    tasks.map(t => h("label", { key: t.id, className: "task" + (t.done ? " done" : "") },
      h("input", { type: "checkbox", checked: t.done, onChange: () => toggle(t.id) }),
      h("span", null, t.name))),
    h(Bar, { value: pct(done, tasks.length) }),
    h("p", { className: "note" }, "Routine Progress: " + pct(done, tasks.length) + "% (" + done + "/" + tasks.length + ")"));
}

/* Add Tracker form: adds a medication or a routine task */
function AddTracker({ meds, setMeds, tasks, setTasks, onClose }) {
  const [type, setType] = useState("med");
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [freq, setFreq] = useState("Daily (Morning)");
  const add = () => {
    if (!name.trim()) return;
    const id = Date.now();
    if (type === "med") setMeds([...meds, { id, name: name.trim(), dose: dose || "-", freq, done: false, time: "" }]);
    else setTasks([...tasks, { id, name: name.trim(), done: false }]);
    onClose();
  };
  return h(Panel, { title: "Add Tracker" },
    h("div", { className: "two" },
      h("div", null, h("label", null, "Type"),
        h("select", { value: type, onChange: e => setType(e.target.value) },
          h("option", { value: "med" }, "Medication"), h("option", { value: "task" }, "Routine task"))),
      h("div", null, h("label", null, "Name"),
        h("input", { value: name, onChange: e => setName(e.target.value), placeholder: type === "med" ? "e.g. Vitamin D" : "e.g. Evening walk" })),
      type === "med" && h("div", null, h("label", null, "Dosage"),
        h("input", { value: dose, onChange: e => setDose(e.target.value), placeholder: "e.g. 1 Tablet" })),
      type === "med" && h("div", null, h("label", null, "Frequency"),
        h("select", { value: freq, onChange: e => setFreq(e.target.value) },
          ["Daily (Morning)", "Daily (Afternoon)", "Daily (Evening)", "As Needed"].map(f => h("option", { key: f }, f))))),
    h("div", { className: "row" },
      h(Button, { label: "Add", onClick: add }),
      h(Button, { label: "Cancel", variant: "ghost", onClick: onClose })));
}

function DailyTab({ meds, setMeds, tasks, setTasks }) {
  const [adding, setAdding] = useState(false);
  const resetDay = () => {
    setMeds(meds.map(m => ({ ...m, done: false, time: "" })));
    setTasks(tasks.map(t => ({ ...t, done: false })));
  };
  return h("div", null,
    h("div", { className: "bar-top" },
      h(Button, { label: "Add Tracker", icon: "plus", onClick: () => setAdding(!adding) }),
      h(Button, { label: "Start new day", variant: "ghost", onClick: resetDay })),
    adding && h(AddTracker, { meds, setMeds, tasks, setTasks, onClose: () => setAdding(false) }),
    h(MedicationTracker, { meds, setMeds }),
    h(RoutineTracker, { tasks, setTasks }));
}

/* Q38 – Counter with useState (Increment, Decrement, Reset) */
function WaterTracker() {
  const [glasses, setGlasses] = useLocalStorage("hp_water", 0);
  return h(Panel, { title: "Water Tracker" },
    h("div", { className: "center" },
      h("p", null, "Goal: 8 glasses (250 ml each), one every hour"),
      h("div", { className: "timer" }, glasses + " / 8"),
      h("p", { className: "note" }, glasses * 250 + " ml drunk today"),
      h("br"),
      h("div", { className: "row" },
        h(Button, { label: "Increment", icon: "plus", onClick: () => setGlasses(glasses + 1) }),
        h(Button, { label: "Decrement", variant: "ghost", onClick: () => setGlasses(Math.max(0, glasses - 1)) }),
        h(Button, { label: "Reset", variant: "ghost", onClick: () => setGlasses(0) }))));
}

/* Q40 – useEffect with a timer and cleanup */
function Meditation() {
  const [sec, setSec] = useState(600);
  const [run, setRun] = useState(false);
  useEffect(() => {
    if (!run || sec === 0) return;
    const id = setInterval(() => setSec(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [run, sec]);
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");
  return h(Panel, { title: "Meditation Session" },
    h("div", { className: "center" },
      h("p", null, "Focus on your breathing. Inhale deeply, exhale slowly."),
      h("div", { className: "timer" }, mm + ":" + ss),
      h("div", { className: "row" },
        h(Button, { label: run ? "Pause" : "Start Session", onClick: () => setRun(!run) }),
        h(Button, { label: "Reset", variant: "ghost", onClick: () => { setRun(false); setSec(600); } })),
      sec === 0 && h("p", { style: { marginTop: 14 } }, "🎉 Session complete. Well done!")));
}

/* Q33 – Props pass data into one reusable tracker */
function NoteTracker({ storageKey, fields, button }) {
  const empty = {};
  fields.forEach(f => { empty[f.key] = ""; });
  const [form, setForm] = useState(empty);
  const [entries, setEntries] = useLocalStorage(storageKey, []);
  const save = () => {
    if (!Object.values(form).some(v => v)) return;
    setEntries([form, ...entries]);
    setForm(empty);
  };
  const onChange = key => e => setForm({ ...form, [key]: e.target.value });
  return h("div", null,
    h("div", { className: "two" },
      fields.map(f =>
        h("div", { key: f.key, style: f.wide ? { gridColumn: "1 / -1" } : {} },
          h("label", null, f.label),
          f.type === "textarea"
            ? h("textarea", { rows: 3, placeholder: f.ph, value: form[f.key], onChange: onChange(f.key) })
            : h("input", { type: f.type || "text", placeholder: f.ph, value: form[f.key], onChange: onChange(f.key) })))),
    h(Button, { label: button, onClick: save }),
    h("ul", { className: "list" },
      entries.map((en, i) => h("li", { key: i }, fields.map(f => en[f.key]).filter(Boolean).join(" · ")))));
}

function PeriodTracker() {
  const [form, setForm] = useState({ start: "", len: "", sym: "" });
  const [entries, setEntries] = useLocalStorage("hp_cycle", []);
  const [error, setError] = useState("");
  const [permission, setPermission] = useState(() =>
    "Notification" in window ? Notification.permission : "unsupported");
  const [notificationMessage, setNotificationMessage] = useState("");
  const latest = Array.isArray(entries) ? entries[0] : null;
  const nextDate = nextPeriodDate(latest);
  const dateNumber = date => {
    const [year, month, day] = date.split("-").map(Number);
    return Date.UTC(year, month - 1, day);
  };
  const daysUntil = nextDate
    ? Math.round((dateNumber(nextDate) - dateNumber(dayKey())) / 86400000)
    : null;
  const displayDate = date => {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString();
  };
  const save = () => {
    if (form.start > dayKey()) {
      setError("The last period start date cannot be in the future.");
      return;
    }
    if (!form.start || !Number.isInteger(Number(form.len)) || !nextPeriodDate(form)) {
      setError("Enter a valid start date and cycle length (1–100 days).");
      return;
    }
    setEntries([{ ...form }, ...(Array.isArray(entries) ? entries : [])]);
    setForm({ start: "", len: "", sym: "" });
    setError("");
  };
  const enableNotifications = async () => {
    if (!("Notification" in window)) {
      setPermission("unsupported");
      setNotificationMessage("This browser does not support notifications.");
      return;
    }
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "granted") {
        setNotificationMessage("Reminder enabled. Keep the website open to receive it.");
        checkPeriodReminder();
      } else {
        setNotificationMessage("Notifications were not allowed. Check browser permissions and use localhost or HTTPS.");
      }
    } catch (e) {
      console.error("Could not enable period notifications.", e);
      setNotificationMessage("Could not enable notifications. Check your browser settings and try again.");
    }
  };
  return h("div", null,
    h("div", { className: "two" },
      h("div", null, h("label", null, "Last period start"),
        h("input", { type: "date", value: form.start, onChange: e => setForm({ ...form, start: e.target.value }) })),
      h("div", null, h("label", null, "Cycle length (days)"),
        h("input", { type: "number", min: 1, max: 100, value: form.len, placeholder: "e.g. 28",
          onChange: e => setForm({ ...form, len: e.target.value }) })),
      h("div", { style: { gridColumn: "1 / -1" } }, h("label", null, "Symptoms"),
        h("textarea", { rows: 3, placeholder: "Cramps, mood, flow...", value: form.sym,
          onChange: e => setForm({ ...form, sym: e.target.value }) }))),
    error && h("p", { className: "error" }, error),
    h(Button, { label: "Save Cycle Info", onClick: save }),
    nextDate && h("div", { className: "panel", style: { marginTop: 16 } },
      h("h3", null, "Next period estimate"),
      h("p", null, "Estimated start: " + displayDate(nextDate)),
      h("p", { className: "note" }, daysUntil > 0 ? "About " + daysUntil + " days away."
        : daysUntil === 0 ? "Estimated to start today."
        : "This estimate has passed. Update your last period start date."),
      h("p", { className: "note" }, "This is a calendar estimate based on your saved cycle length, not medical advice."),
      permission === "granted"
        ? h("p", { className: "note" }, "Period reminder notifications are enabled.")
        : h(Button, { label: "Enable period reminder", variant: "ghost", small: true, onClick: enableNotifications }),
      notificationMessage && h("p", { className: "note" }, notificationMessage),
      h("p", { className: "note" }, "A notification is sent one day before the estimate while this website is open (localhost or HTTPS).")),
    h("ul", { className: "list" },
      (Array.isArray(entries) ? entries : []).map((entry, i) =>
        h("li", { key: i }, [entry.start && "Start " + entry.start, entry.len && entry.len + "-day cycle",
          entry.sym].filter(Boolean).join(" · ")))));
}

const FORMS = {
  diet: { title: "Diet Planner", storageKey: "hp_diet", button: "Save Diet Log", fields: [
    { key: "meal", label: "Meal type", ph: "Breakfast, Lunch..." },
    { key: "plan", label: "Meal & nutrition plan", ph: "Foods, calories..." },
    { key: "note", label: "Personal notes", ph: "Allergies, mood after eating...", type: "textarea", wide: true }] },
  period: { title: "Period Tracker", storageKey: "hp_cycle", button: "Save Cycle Info", fields: [
    { key: "start", label: "Last period start", type: "date" },
    { key: "len", label: "Cycle length (days)", ph: "28", type: "number" },
    { key: "sym", label: "Symptoms", ph: "Cramps, mood, flow...", type: "textarea", wide: true }] },
  notes: { title: "Medical Notes", storageKey: "hp_notes", button: "Save Note", fields: [
    { key: "title", label: "Title / doctor", ph: "Dr. Smith checkup", wide: true },
    { key: "body", label: "Details", ph: "Prescriptions, advice...", type: "textarea", wide: true }] }
};
function NotesTab() {
  const [kind, setKind] = useState("diet");
  return h("div", null,
    h("div", { className: "pills" },
      Object.keys(FORMS).map(k => h("button", { key: k, className: kind === k ? "on" : "", onClick: () => setKind(k) }, FORMS[k].title))),
    h(Panel, { title: FORMS[kind].title }, kind === "period"
      ? h(PeriodTracker)
      : h(NoteTracker, { key: kind, ...FORMS[kind] })));
}

/* Insights: progress calculated from the other tabs */
function Insights({ meds, tasks }) {
  const [water] = useLocalStorage("hp_water", 0);
  const items = [
    { l: "Medication taken", v: pct(meds.filter(m => m.done).length, meds.length) },
    { l: "Daily routine", v: pct(tasks.filter(t => t.done).length, tasks.length) },
    { l: "Water goal", v: Math.min(100, pct(water, 8)) }
  ];
  const avg = Math.round(items.reduce((a, i) => a + i.v, 0) / items.length);
  const msg = avg >= 80 ? "Excellent day. Keep it up!" : avg >= 40 ? "Good progress. A few more habits to go." : "A fresh start. Begin with one small habit.";
  return h("div", null,
    h("div", { className: "stats" }, items.map(i => h("div", { className: "stat", key: i.l }, h("b", null, i.v + "%"), h("span", null, i.l)))),
    h(Panel, { title: "Today's Overview" },
      items.map(i => h("div", { key: i.l }, h("p", null, i.l), h(Bar, { value: i.v }))),
      h("p", { style: { marginTop: 14 } }, "Overall wellness score: " + avg + "%. " + msg)));
}

function Settings({ user, setUser, theme, setTheme, onLogout }) {
  const [name, setName] = useState(user);
  const [saved, setSaved] = useState(false);
  const resetAll = () => {
    if (!confirm("Delete all saved tracker data on this device?")) return;
    ["hp_meds_list", "hp_routine", "hp_water", "hp_diet", "hp_cycle", "hp_notes", "hp_history", "hp_day", "hp_period_notified"].forEach(k => localStorage.removeItem(k));
    window.location.reload();
  };
  return h(Panel, { title: "Settings" },
    h("label", null, "Your name"),
    h("input", { value: name, onChange: e => { setName(e.target.value); setSaved(false); } }),
    h("div", { className: "row", style: { justifyContent: "flex-start", marginBottom: 20 } },
      h(Button, { label: "Save name", onClick: () => { if (name.trim()) { setUser(name.trim()); setSaved(true); } } }),
      saved && h("span", { className: "note", style: { alignSelf: "center" } }, "Saved ✓")),
    h("label", null, "Theme"),
    h("div", { className: "pills", style: { marginTop: 8 } },
      ["light", "dark"].map(t => h("button", { key: t, className: theme === t ? "on" : "", onClick: () => setTheme(t) }, t === "light" ? "Light" : "Dark"))),
    h("div", { className: "row", style: { justifyContent: "flex-start" } },
      h(Button, { label: "Delete my data", variant: "ghost", onClick: resetAll }),
      h(Button, { label: "Log out", variant: "ghost", onClick: onLogout })));
}

function Dashboard() {
  usePeriodReminder();
  const [user, setUser] = useLocalStorage("hp_user", "");
  const [theme, setTheme] = useTheme();
  const fromUrl = window.location.hash.replace("#", "");
  const [tab, setTab] = useState(TABS.some(t => t.id === fromUrl) ? fromUrl : "daily");
  const [meds, setMeds] = useLocalStorage("hp_meds_list", DEFAULT_MEDS);
  const [tasks, setTasks] = useLocalStorage("hp_routine", DEFAULT_TASKS);

  /* Q41 – Lifecycle with hooks (tab opened / left) */
  useEffect(() => {
    console.log("Opened tab: " + tab);
    return () => console.log("Left tab: " + tab);
  }, [tab]);

  const logout = () => { setUser(""); window.location.href = "login.html"; };
  const pick = id => { setTab(id); history.replaceState(null, "", "#" + id); };
  const current = TABS.find(t => t.id === tab);

  let body;
  if (tab === "daily") body = h(DailyTab, { meds, setMeds, tasks, setTasks });
  else if (tab === "wellness") body = h("div", null, h(WaterTracker), h(Meditation));
  else if (tab === "notes") body = h(NotesTab);
  else if (tab === "insights") body = h(Insights, { meds, tasks });
  else body = h(Settings, { user, setUser, theme, setTheme, onLogout: logout });

  return h("div", null,
    h(Navbar, { theme, setTheme, user, onLogout: logout, links: [{ t: "Home", href: "index.html" }] }),
    h("div", { className: "dash" },
      h("aside", { className: "side" },
        h("div", null, TABS.map(t => h("button", { key: t.id, className: tab === t.id ? "on" : "", onClick: () => pick(t.id) }, t.t))),
        h("div", { className: "side-tip" }, h(DailyTip))),
      h("main", { className: "main" },
        h("div", { className: "eyebrow" }, user ? "Hello, " + user : "Hello"),
        h("h2", { className: "title" }, current.t),
        body)),
    h(Footer));
}
ReactDOM.createRoot(document.getElementById("root")).render(h(Dashboard));
