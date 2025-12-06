import { useState, useEffect, useRef } from "react";
import { auth } from "../firebase";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const user = auth.currentUser;
  const menuRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const systemTheme = prefersDark ? "dark" : "light";
    const currentTheme = saved || systemTheme;
    setTheme(currentTheme);
    applyTheme(currentTheme);
  }, []);

  const applyTheme = (mode) => {
    const root = document.documentElement;

    if (mode === "light") {
      root.style.setProperty("--bg-start", "#f9f9f9");
      root.style.setProperty("--bg-end", "#eaeaea");
      root.style.setProperty("--container-bg", "#ffffff");
      root.style.setProperty("--text", "#222");
      root.style.setProperty("--primary", "#0078ff");
      root.style.setProperty("--primary-hover", "#005fcc");
      root.style.setProperty("--danger", "#e63946");
      root.style.setProperty("--danger-hover", "#c72d39");
      root.style.setProperty("--danger-hover-2", "#c72d39");
      root.style.setProperty("--border-muted", "#555");
      root.style.setProperty("--muted-dark", "#ddd");
      root.style.setProperty("--muted-light", "#f5f5f5");
      root.style.setProperty("--muted-darker", "#e0e0e0");
      root.style.setProperty("--light-border", "#ccc");
      root.style.setProperty("--muted-gray", "#777");
      root.style.setProperty("--muted-gray-2", "#aaa");
    } else {
      root.style.setProperty("--bg-start", "#333");
      root.style.setProperty("--bg-end", "#242424");
      root.style.setProperty("--container-bg", "#333333");
      root.style.setProperty("--text", "#ffffff");
      root.style.setProperty("--primary", "#ff8c00");
      root.style.setProperty("--primary-hover", "#ff7a00");
      root.style.setProperty("--danger", "#dc143c");
      root.style.setProperty("--danger-hover", "#c92643");
      root.style.setProperty("--danger-hover-2", "#c72440");
      root.style.setProperty("--border-muted", "#bbb");
      root.style.setProperty("--muted-dark", "#444");
      root.style.setProperty("--muted-light", "#eeeeee");
      root.style.setProperty("--muted-darker", "#3b3b3b");
      root.style.setProperty("--light-border", "#ddd");
      root.style.setProperty("--muted-gray", "#555");
      root.style.setProperty("--muted-gray-2", "#aaa");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="avatar-container" ref={menuRef}>
      <button className="avatar-btn" onClick={() => setMenuOpen(!menuOpen)}>
        {user?.email?.[0]?.toUpperCase() || "U"}
      </button>

      {menuOpen && (
        <div className="dropdown-menu">
          <p className="user-email">{user?.email}</p>

          <button
            style={{
              background: "var(--primary)",
              marginBottom: "0.5em",
              border: "none",
              color: "var(--container-bg)",
              borderRadius: "6px",
              padding: "0.5em",
              cursor: "pointer",
            }}
            onClick={toggleTheme}
          >
            {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>

          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}
