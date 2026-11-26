import {
  BarChart3,
  CheckCircle2,
  Download,
  FileText,
  Image as ImageIcon,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { formatBytes } from "../utils/fileUtils";

function ResultsTable({ results, type, onDelete, onReset }) {
  const isImage = type === "image";
  const hasResults = results.length > 0;

  return (
    <section className="card mt-6 p-5 sm:p-6">
      <h2 className="flex items-center gap-2 text-base font-bold">
        {hasResults ? (
          <CheckCircle2 size={20} className="text-[var(--accent)]" />
        ) : (
          <BarChart3 size={20} className="text-[var(--accent)]" />
        )}
        Your Results
      </h2>

      {!hasResults ? (
        <div className="flex flex-col items-center py-8 text-center text-sm text-[var(--muted)]">
          <div className="mb-3 grid h-16 w-16 place-items-center rounded-2xl border border-dashed border-[var(--drop-border)] bg-[var(--surface)] text-[var(--accent)]">
            {isImage ? <ImageIcon size={28} /> : <FileText size={28} />}
          </div>
          {isImage
            ? "Compress an image to see the results here!"
            : "Compress a PDF to see the results here!"}
        </div>
      ) : (
        <>
          <ul className="mt-4 space-y-3">
            {results.map((r) => {
              const saved = r.savedPercent ?? 0;
              const meta = isImage
                ? r.width && `${r.width} × ${r.height}`
                : r.pageCount && `${r.pageCount} page${r.pageCount !== 1 ? "s" : ""}`;

              return (
                <li
                  key={r.id}
                  className="flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
                >
                  {isImage ? (
                    <img
                      src={r.url}
                      alt=""
                      className="h-14 w-14 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="grid h-14 w-12 shrink-0 place-items-center rounded-lg bg-[var(--accent-soft)]">
                      <span className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                        PDF
                      </span>
                    </div>
                  )}

                  <div className="min-w-0 flex-1 basis-[200px]">
                    <div className="truncate text-sm font-semibold">{r.outputName}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm">
                      <span className="text-[var(--muted)]">{formatBytes(r.originalSize)}</span>
                      <span className="text-[var(--muted)]">→</span>
                      <span className="font-semibold">{formatBytes(r.compressedSize)}</span>
                      {r.targetMet === false ? (
                        <span className="text-xs font-semibold" style={{ color: "var(--warn)" }}>
                          Target not reached
                        </span>
                      ) : saved > 0 ? (
                        <span className="text-xs font-semibold" style={{ color: "var(--success)" }}>
                          ↓ {saved}%
                        </span>
                      ) : (
                        <span className="text-xs font-semibold" style={{ color: "var(--warn)" }}>
                          No reduction
                        </span>
                      )}
                    </div>
                    {meta && <div className="mt-0.5 text-xs text-[var(--muted)]">{meta}</div>}
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={r.url}
                      download={r.outputName}
                      className="btn btn-primary !px-4 !py-2 !text-sm"
                    >
                      <Download size={15} />
                      Download
                    </a>
                    <button
                      type="button"
                      onClick={() => onDelete(r.id)}
                      className="grid h-9 w-9 place-items-center rounded-full text-[var(--muted)] transition hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
                      aria-label="Remove result"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex justify-center">
            <button type="button" onClick={onReset} className="btn btn-ghost !py-2 !text-sm">
              <RefreshCw size={15} />
              Compress Another File
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default ResultsTable;