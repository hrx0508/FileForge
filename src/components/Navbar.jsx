import { Home, Moon, Sun } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";

const linkClass = ({ isActive }) =>
  `flex items-center gap-1.5 border-b-2 px-1 py-2 text-sm font-medium transition ${
    isActive
      ? "border-[var(--accent)] text-[var(--accent-text)]"
      : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
  }`;

function Navbar({ theme, onToggleTheme }) {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const choose = (next) => {
    if (theme !== next) onToggleTheme();
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur" style={{ background: "var(--header-bg)" }}>
      <div className="mx-auto flex h-16 w-[92%] max-w-[1000px] items-center justify-between gap-3">
        <Link to="/" aria-label="FileForge home">
          <Logo />
        </Link>

        {!isHome && (
          <nav className="flex items-center gap-4 sm:gap-6">
            <NavLink to="/" end className={linkClass}>
              <Home size={15} />
              <span className="hidden sm:inline">Home</span>
            </NavLink>
            <NavLink to="/image-compressor" className={linkClass}>
              <span className="sm:hidden">Images</span>
              <span className="hidden sm:inline">Image Compress</span>
            </NavLink>
            <NavLink to="/pdf-compressor" className={linkClass}>
              <span className="sm:hidden">PDF</span>
              <span className="hidden sm:inline">PDF Compress</span>
            </NavLink>
          </nav>
        )}

        <div className="theme-toggle" role="group" aria-label="Theme">
          <button
            type="button"
            aria-pressed={theme === "light"}
            aria-label="Light theme"
            onClick={() => choose("light")}
          >
            <Sun size={16} />
          </button>
          <button
            type="button"
            aria-pressed={theme === "dark"}
            aria-label="Dark theme"
            onClick={() => choose("dark")}
          >
            <Moon size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;