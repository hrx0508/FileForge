export function ImageIllustration({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ill-img" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#6340ec" />
        </linearGradient>
      </defs>
      <rect x="10" y="16" width="84" height="66" rx="10" fill="#ede8ff" stroke="#8b6cff" strokeWidth="3" />
      <circle cx="34" cy="36" r="7" fill="#c4b5fd" />
      <path d="M14 76 42 48 58 64 70 54 92 76Z" fill="url(#ill-img)" />
      <circle cx="88" cy="86" r="20" fill="#6340ec" />
      <path d="M88 76v16M81 86l7 7 7-7" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PdfIllustration({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <path
        d="M30 10H72L96 34V96a8 8 0 0 1-8 8H30a8 8 0 0 1-8-8V18a8 8 0 0 1 8-8Z"
        fill="#eef0ff"
        stroke="#8b9cff"
        strokeWidth="3"
      />
      <path d="M72 10v18a6 6 0 0 0 6 6h18" fill="#c7d2fe" />
      <rect x="34" y="66" width="38" height="5" rx="2.5" fill="#c7d2fe" />
      <rect x="34" y="78" width="26" height="5" rx="2.5" fill="#c7d2fe" />
      <rect x="8" y="34" width="46" height="24" rx="5" fill="#ef4444" />
      <text
        x="31"
        y="52"
        textAnchor="middle"
        fontSize="15"
        fontWeight="800"
        fill="#fff"
        fontFamily="Inter, system-ui, sans-serif"
      >
        PDF
      </text>
      <circle cx="88" cy="88" r="20" fill="#4f46e5" />
      <path d="M88 78v16M81 88l7 7 7-7" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}