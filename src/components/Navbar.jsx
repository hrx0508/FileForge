import { FileImage, FileText, Moon, ShieldCheck, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-[var(--accent-soft)] text-[var(--accent-text)]"
      : "text-[var(--muted)] hover:text-[var(--text)]"
  }`;

function Navbar({ theme, onToggleTheme }) {
  const next = theme === "light" ? "dark" : "light";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur">
      <div className="mx-auto flex h-16 w-[92%] max-w-[900px] items-center justify-between gap-3">
        <NavLink to="/image-compressor" className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--accent)] text-[var(--on-accent)]">
            <FileImage size={17} />
          </div>
          <span className="text-base font-bold tracking-tight">FileForge</span>
        </NavLink>

        <nav className="flex items-center gap-1">
          <NavLink to="/image-compressor" className={linkClass}>
            <FileImage size={15} />
            Images
          </NavLink>
          <NavLink to="/pdf-compressor" className={linkClass}>
            <FileText size={15} />
            PDF
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 text-xs font-medium text-[var(--muted)] md:flex">
            <ShieldCheck size={14} />
            Private &amp; local
          </div>
          <button
            type="button"
            onClick={onToggleTheme}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] text-[var(--muted)] transition hover:text-[var(--text)]"
            aria-label={`Switch to ${next} theme`}
            title={`Switch to ${next} theme`}
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;