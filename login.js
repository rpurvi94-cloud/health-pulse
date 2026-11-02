/* Separate login page (uses components from common.js) */
function LoginPage() {
  const [theme, setTheme] = useTheme();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    if (!name.trim() || pass.length < 4) return setErr("Enter your name and a password of 4+ characters.");
    if (mode === "signup" && !email.includes("@")) return setErr("Enter a valid email address.");
    localStorage.setItem("hp_user", JSON.stringify(name.trim()));
    window.location.href = "index.html";
  };

  return h("div", null,
    h(Navbar, { theme, setTheme, user: "", hideAuth: true, links: [{ t: "← Back to home", href: "index.html" }] }),
    h("div", { className: "login-wrap" },
      h("div", { className: "login-side" },
        h(HeroArt),
        h("h2", null, "Care for yourself, every day."),
        h("ul", null,
          h("li", null, "Medication and hydration reminders"),
          h("li", null, "Diet, meditation and cycle tracking"),
          h("li", null, "Private notes for doctor visits"))),
      h("div", { className: "login-form" },
        h("div", { className: "login-card" },
          h("h2", null, mode === "login" ? "Welcome back" : "Create your account"),
          h("p", { className: "note" }, "Demo only: any name and a password of 4+ characters works."),
          h("div", { className: "tabs" },
            h("button", { className: mode === "login" ? "on" : "", onClick: () => { setMode("login"); setErr(""); } }, "Log in"),
            h("button", { className: mode === "signup" ? "on" : "", onClick: () => { setMode("signup"); setErr(""); } }, "Sign up")),
          h("label", null, "Full name"),
          h("input", { value: name, onChange: e => setName(e.target.value), placeholder: "Your name" }),
          mode === "signup" && h("div", null,
            h("label", null, "Email"),
            h("input", { type: "email", value: email, onChange: e => setEmail(e.target.value), placeholder: "you@example.com" })),
          h("label", null, "Password"),
          h("input", { type: "password", value: pass, onChange: e => setPass(e.target.value), placeholder: "••••" }),
          err && h("p", { className: "error" }, err),
          h(Button, { label: mode === "login" ? "Log In" : "Create account", icon: "lock", onClick: submit })))),
    h(Footer));
}
ReactDOM.createRoot(document.getElementById("root")).render(h(LoginPage));