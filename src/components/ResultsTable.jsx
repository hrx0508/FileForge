import { Download, FileImage, FileText, Trash2 } from "lucide-react";
import { formatBytes } from "../utils/fileUtils";

function ResultsTable({ results, type, onDelete }) {
  if (!results.length) return null;

  const isImage = type === "image";
  const Icon = isImage ? FileImage : FileText;

  const handleDownload = (result) => {
    const link = document.createElement("a");
    link.href = result.url;
    link.download = result.outputName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h2 className="text-base font-semibold">Results</h2>
      </div>

      <ul className="divide-y divide-[var(--border)]">
        {results.map((result) => {
          const saved = result.savedPercent ?? 0;
          const meta = isImage
            ? result.width && `${result.width} × ${result.height}`
            : result.pageCount &&
              `${result.pageCount} page${result.pageCount !== 1 ? "s" : ""}`;

          return (
            <li
              key={result.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4"
            >
              <div className="flex min-w-0 flex-1 basis-[220px] items-center gap-3">
                <Icon size={18} className="shrink-0 text-[var(--muted)]" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {result.originalName}
                  </div>
                  <div className="mt-0.5 text-xs text-[var(--muted)]">
                    {formatBytes(result.originalSize)} →{" "}
                    {formatBytes(result.compressedSize)}
                    {meta ? ` · ${meta}` : ""}
                  </div>
                </div>
              </div>

              {result.targetMet === false ? (
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ background: "var(--warn-soft)", color: "var(--warn)" }}
                  title="This is the smallest size that could be reached."
                >
                  Target not reached
                </span>
              ) : (
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={
                    saved > 0
                      ? { background: "var(--success-soft)", color: "var(--success)" }
                      : { background: "var(--warn-soft)", color: "var(--warn)" }
                  }
                >
                  {saved > 0 ? `−${saved}%` : "No reduction"}
                </span>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload(result)}
                  className="btn btn-primary !px-3 !py-2 text-xs"
                >
                  <Download size={14} />
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(result.id)}
                  className="btn btn-ghost !px-2.5 !py-2 text-[var(--muted)] hover:!text-[var(--danger)]"
                  aria-label="Remove result"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ResultsTable;