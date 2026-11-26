import { Info } from "lucide-react";

function Field({ label, info, children, className = "" }) {
  return (
    <div className={`panel ${className}`}>
      <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold">
        {label}
        {info && (
          <span title={info} className="text-[var(--muted)]">
            <Info size={13} />
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export default Field;