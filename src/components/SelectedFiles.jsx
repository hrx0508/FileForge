import { X } from "lucide-react";
import { formatBytes } from "../utils/fileUtils";

function SelectedFiles({ files, icon: Icon, onRemove, onClear }) {
  if (!files.length) return null;

  return (
    <div className="panel mt-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold">
          {files.length} file{files.length !== 1 ? "s" : ""} selected
        </span>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-medium text-[var(--muted)] hover:text-[var(--danger)]"
        >
          Clear all
        </button>
      </div>

      <ul className="divide-y divide-[var(--border)]">
        {files.map((file, index) => (
          <li
            key={`${file.name}-${file.lastModified}-${index}`}
            className="flex items-center gap-3 py-2.5"
          >
            <Icon size={16} className="shrink-0 text-[var(--muted)]" />
            <span className="min-w-0 flex-1 truncate text-sm">{file.name}</span>
            <span className="text-xs text-[var(--muted)]">{formatBytes(file.size)}</span>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-[var(--muted)] hover:text-[var(--danger)]"
              aria-label={`Remove ${file.name}`}
            >
              <X size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SelectedFiles;