import { useState, useEffect } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Phone,
  BarChart2,
  Moon,
  Sun,
  GraduationCap,
} from "lucide-react";
import Dashboard from "./pages/Dashboard";
import CallLogs from "./pages/CallLogs";
import Analytics from "./pages/Analytics";

export default function App() {
  const [dark, setDark] = useState(() => {
    // Default to dark mode
    const stored = localStorage.getItem("theme");
    return stored !== null ? stored === "dark" : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const navItem = (to, Icon, label) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
          isActive
            ? "bg-brand-500 text-white shadow-sm"
            : "text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
        }`
      }
    >
      <Icon size={16} />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex">
      {/* SIDEBAR */}
      <aside className="w-64 min-h-screen bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col p-4 shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-8 mt-2">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shrink-0">
            <GraduationCap size={18} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 leading-tight">
              Delhi Model School
            </p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">
              Admission Portal
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest px-2 mb-2">
            Menu
          </p>
          {navItem("/", LayoutDashboard, "Dashboard")}
          {navItem("/calls", Phone, "Call Logs")}
          {navItem("/analytics", BarChart2, "Analytics")}
        </nav>

        {/* Theme + Info */}
        <div className="border-t border-gray-200 dark:border-zinc-800 pt-4 mt-4 space-y-3">
          <button
            onClick={() => setDark(!dark)}
            className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors w-full px-2"
            aria-label="Toggle color theme"
          >
            {dark ? <Moon size={14} /> : <Sun size={14} />}
            {dark ? "Dark mode" : "Light mode"}
          </button>
          <div className="px-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-zinc-400">Agent live on Bolna</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calls" element={<CallLogs />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>
    </div>
  );
}
