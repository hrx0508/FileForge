import { useEffect, useRef, useState } from "react";
import { FileText, Loader2, RotateCcw } from "lucide-react";

import Hero from "../components/Hero";
import DropZone from "../components/DropZone";
import SelectedFiles from "../components/SelectedFiles";
import Segmented from "../components/Segmented";
import TargetSize, { toTargetKB } from "../components/TargetSize";
import Stats from "../components/Stats";
import ResultsTable from "../components/ResultsTable";

import { compressPdf } from "../utils/pdfCompressorUtils";
import { filterPdfFiles, revokeObjectUrl } from "../utils/fileUtils";
import { usePageTitle } from "../hooks/usePageTitle";

const PRESETS = [
  { value: 30, label: "Smallest", hint: "Strongest compression. Images drop to about 90 DPI, fine for screens." },
  { value: 60, label: "Balanced", hint: "Good size reduction with images that still look clean." },
  { value: 90, label: "Best quality", hint: "Light compression. Good for documents you may print." },
];

function PdfCompressor() {
  usePageTitle("Compress PDFs");

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [quality, setQuality] = useState(60);
  const [target, setTarget] = useState({ enabled: false, amount: "", unit: "MB" });
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState("");

  const resultsRef = useRef(results);
  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  useEffect(() => {
    return () => resultsRef.current.forEach((r) => revokeObjectUrl(r.url));
  }, []);

  const addFiles = (files) => {
    setError("");
    const pdfFiles = filterPdfFiles(files);

    if (!pdfFiles.length) {
      setError("Please select valid PDF files.");
      return;
    }

    setSelectedFiles((current) => {
      const keyOf = (f) => `${f.name}-${f.size}-${f.lastModified}`;
      const existing = new Set(current.map(keyOf));
      return [...current, ...pdfFiles.filter((f) => !existing.has(keyOf(f)))];
    });
  };

  const removeSelectedFile = (index) =>
    setSelectedFiles((current) => current.filter((_, i) => i !== index));

  const clearAll = () => {
    results.forEach((r) => revokeObjectUrl(r.url));
    setSelectedFiles([]);
    setResults([]);
    setTarget({ enabled: false, amount: "", unit: "MB" });
    setError("");
  };

  const targetKB = toTargetKB(target);

  const handleCompress = async () => {
    if (!selectedFiles.length || isCompressing) return;

    setIsCompressing(true);
    setError("");

    try {
      const compressed = [];
      for (const file of selectedFiles) {
        compressed.push(await compressPdf(file, quality, targetKB));
      }
      setResults((current) => [...current, ...compressed]);
      setSelectedFiles([]);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Something went wrong while processing the PDF.");
    } finally {
      setIsCompressing(false);
    }
  };

  const deleteResult = (id) => {
    setResults((current) => {
      const item = current.find((r) => r.id === id);
      if (item) revokeObjectUrl(item.url);
      return current.filter((r) => r.id !== id);
    });
  };

  const activePreset = PRESETS.find((p) => p.value === quality);
  const alreadySmaller =
    targetKB && selectedFiles.some((f) => f.size <= targetKB * 1024);

  return (
    <>
      <Hero type="pdf" />

      <main className="mx-auto w-[92%] max-w-[900px] pb-20">
        <section className="card p-5 sm:p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCompress();
            }}
          >
            <DropZone
              accept="application/pdf,.pdf"
              title="Drop PDFs here"
              description="Add one or more PDF files."
              onFiles={addFiles}
            />

            {error && (
              <div
                className="mt-4 rounded-xl px-4 py-3 text-sm"
                style={{ background: "var(--danger-soft)", color: "var(--danger)" }}
                role="alert"
              >
                {error}
              </div>
            )}

            <SelectedFiles
              files={selectedFiles}
              icon={FileText}
              onRemove={removeSelectedFile}
              onClear={() => setSelectedFiles([])}
            />

            <div className="mt-5">
              <TargetSize {...target} onChange={setTarget} />
              {alreadySmaller && (
                <p className="mt-2 text-xs" style={{ color: "var(--warn)" }}>
                  Some files are already under this size. Compression can&apos;t
                  make a file bigger.
                </p>
              )}
            </div>

            <div className="mt-5">
              <div className="mb-2 text-xs font-medium text-[var(--muted)]">
                Compression level
              </div>
              <Segmented
                options={PRESETS}
                value={quality}
                onChange={setQuality}
                disabled={!!targetKB}
              />
              <p className="mt-2 text-xs text-[var(--muted)]">
                {targetKB
                  ? "Ignored while a size is set. The tool tries stronger levels until it fits."
                  : activePreset?.hint}
              </p>
            </div>

            <p className="mt-5 rounded-xl bg-[var(--surface-soft)] px-4 py-3 text-xs leading-5 text-[var(--muted)]">
              Text and vector graphics are kept as they are. Only embedded images
              are recompressed, so PDFs that are mostly text may shrink very
              little. Password-protected PDFs can&apos;t be processed.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={!selectedFiles.length || isCompressing}
                className="btn btn-primary flex-1"
              >
                {isCompressing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Compressing…
                  </>
                ) : (
                  "Compress PDFs"
                )}
              </button>

              <button
                type="button"
                onClick={clearAll}
                disabled={!selectedFiles.length && !results.length}
                className="btn btn-ghost"
              >
                <RotateCcw size={15} />
                Reset
              </button>
            </div>
          </form>
        </section>

        {results.length > 0 && (
          <>
            <Stats results={results} type="pdf" />
            <ResultsTable results={results} type="pdf" onDelete={deleteResult} />
          </>
        )}

        <p className="mt-8 text-center text-xs text-[var(--muted)]">
          Your PDFs never leave your device.
        </p>
      </main>
    </>
  );
}

export default PdfCompressor;