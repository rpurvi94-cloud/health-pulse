/* Shared by all pages */
const { useState, useEffect, createElement: h } = React;

/* Q35 – Icons (inline SVG instead of react-icons) */
const PATHS = {
  heart: "M12 21s-7-4.4-9.3-9A5.3 5.3 0 0 1 12 6a5.3 5.3 0 0 1 9.3 6C19 16.6 12 21 12 21z",
  water: "M12 2s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12z",
  leaf: "M5 19c0-9 5-14 15-14 0 10-5 15-14 15M5 19l7-7",
  pill: "M10.5 20.5a5 5 0 0 1-7-7l10-10a5 5 0 0 1 7 7zM8.5 8.5l7 7",
  cal: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  note: "M6 3h12v18H6zM9 8h6M9 12h6M9 16h4",
  lotus: "M12 4c3 3 3 9 0 13-3-4-3-10 0-13zM3 10c5 0 8 3 9 7M21 10c-5 0-8 3-9 7",
  sun: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 1v3M12 20v3M1 12h3M20 12h3",
  moon: "M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z",
  plus: "M9 3h6v6h6v6h-6v6H9v-6H3V9h6z",
  lock: "M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4",
  steth: "M6 3v6a5 5 0 0 0 10 0V3M11 14v2a4 4 0 0 0 8 0v-1M19 13a2 2 0 1 0 0 .01"
};
const Icon = ({ name, size = 22 }) =>
  h("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
             strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" },
    h("path", { d: PATHS[name] }));

/* Q34 – Button component, label changed using props */
const Button = ({ label, onClick, variant = "primary", icon, small }) =>
  h("button", { className: "btn " + variant + (small ? " small" : ""), onClick },
    icon && h(Icon, { name: icon, size: 16 }), label);

/* Q42 – Custom hook */
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; }
    catch (e) { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }, [key, value]);
  return [value, setValue];
}

/* Healthcare illustration: uses images/health.png, falls back to a drawn heart + ECG */
const FallbackArt = () =>
  h("svg", { viewBox: "0 0 400 300" },
    h("rect", { width: 400, height: 300, fill: "#ffffff" }),
    h("circle", { cx: 200, cy: 130, r: 105, fill: "#cce7e0" }),
    h("path", { className: "pulse", fill: "#ba3b4e",
      d: "M200 215 C120 160 105 120 130 95 C155 72 188 85 200 108 C212 85 245 72 270 95 C295 120 280 160 200 215Z" }),
    h("path", { className: "ecg", fill: "none", stroke: "#1c5b6a", strokeWidth: 5, strokeLinecap: "round", strokeLinejoin: "round",
      d: "M20 150 H120 L145 150 L162 100 L190 205 L215 120 L232 150 H380" }),
    h("rect", { x: 316, y: 28, width: 14, height: 46, rx: 4, fill: "#1c5b6a" }),
    h("rect", { x: 300, y: 44, width: 46, height: 14, rx: 4, fill: "#1c5b6a" }));

const HeroArt = () => {
  const [ok, setOk] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const handleError = () => {
    if (!attempted) {
      setAttempted(true);
      setOk(false);
    }
  };

  return h("div", { className: "art" },
    ok
      ? h("img", {
          src: "images/health.png",
          alt: "Medicines, timer and heart",
          onError: handleError,
          style: { maxWidth: "100%", display: "block" }
        })
      : h(FallbackArt));
};

/* Q39 – Theme switcher (light / dark), shared by all pages */
function useTheme() {
  const [theme, setTheme] = useLocalStorage("hp_theme", "light");
  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);
  return [theme, setTheme];
}

/* Navbar – props decide the links and buttons */
const Navbar = ({ theme, setTheme, user, onLogout, links, hideAuth }) =>
  h("div", null,
    h("div", { className: "topbar" }, "Your health, our priority · Reminders, tracking and notes in one place"),
    h("header", null,
      h("div", { className: "container nav" },
        h("a", { className: "logo", href: "index.html" },
          h("div", { className: "logo-icon" }, h(Icon, { name: "plus", size: 18 })), h("span", null, "Health", h("b", null, "Pulse"))),
        h("nav", null,
          (links || []).map(l => h("a", { className: "link", key: l.t, onClick: l.go, href: l.href }, l.t)),
          h(Button, { variant: "ghost", small: true, icon: theme === "light" ? "moon" : "sun",
                      label: theme === "light" ? "Dark" : "Light",
                      onClick: () => setTheme(theme === "light" ? "dark" : "light") }),
          !hideAuth && (user
            ? h(Button, { small: true, variant: "ghost", label: "Log out", onClick: onLogout })
            : h(Button, { small: true, label: "Log In", onClick: () => { window.location.href = "login.html"; } }))))));

/* Q31 – Arrow function component */
const Footer = () => h("footer", null,
  "© 2026 HealthPulse · This app is for personal tracking and is not a substitute for professional medical advice.");

/* Q43 + Q40 – Fetch from an external API using useEffect (shared) */
function DailyTip() {
  const [tip, setTip] = useState("Loading tip...");
  useEffect(() => {
    fetch("https://api.adviceslip.com/advice")
      .then(r => r.json())
      .then(d => setTip(d.slip.advice))
      .catch(() => setTip("Small daily habits create lasting health."));
  }, []);
  return h("p", { className: "note", style: { marginTop: 12 } }, "💡 Tip from the web: " + tip);
}