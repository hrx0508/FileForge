function Logo({ size = 30, textClass = "text-xl" }) {
  return (
    <span className="inline-flex items-center gap-2 font-extrabold tracking-tight">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        <path d="M21 2 7 17h8l-3 13 14-16h-8z" fill="url(#logo-g)" />
      </svg>
      <span className={textClass}>
        File<span className="text-[var(--accent)]">Forge</span>
      </span>
    </span>
  );
}

export default Logo;