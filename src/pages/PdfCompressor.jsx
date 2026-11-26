import { useEffect, useRef, useState } from "react";
import { FileText, Loader2 } from "lucide-react";

import Hero from "../components/Hero";
import DropZone from "../components/DropZone";
import SelectedFiles from "../components/SelectedFiles";
import Field from "../components/Field";
import CompressionLevel from "../components/CompressionLevel";
import TargetSize, { toTargetKB } from "../components/TargetSize";
import ResultsTable from "../components/ResultsTable";

import { compressPdf } from "../utils/pdfCompressorUtils";
import { filterPdfFiles, revokeObjectUrl } from "../utils/fileUtils";
import { usePageTitle } from "../hooks/usePageTitle";

const LEVELS = [
  { value: 90, label: "Basic", hint: "(−30%)" },
  { value: 60, label: "Balanced", hint: "(−50%)" },
  { value: 30, label: "Strong", hint: "(−70%)" },
];

const MAX_MB = 50;

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
    const valid = filterPdfFiles(files);

    if (!valid.length) {
      setError("Please select valid PDF files.");
      return;
    }

    const ok = valid.filter((f) => f.size <= MAX_MB * 1024 * 1024);
    if (ok.length < valid.length) {
      setError(`Some files are over ${MAX_MB} MB and were skipped.`);
    }
    if (!ok.length) return;

    setSelectedFiles((current) => {
      const keyOf = (f) => `${f.name}-${f.size}-${f.lastModified}`;
      const existing = new Set(current.map(keyOf));
      return [...current, ...ok.filter((f) => !existing.has(keyOf(f)))];
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
      setResults((current) => [...compressed, ...current]);
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

  const alreadySmaller =
    targetKB && selectedFiles.some((f) => f.size <= targetKB * 1024);

  return (
    <>
      <Hero type="pdf" />

      <main className="mx-auto w-[92%] max-w-[1000px] pb-20 pt-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCompress();
          }}
        >
          <DropZone
            accept="application/pdf,.pdf"
            title="Drag & drop your PDF here"
            hint={`Supports: PDF files  •  Max size: ${MAX_MB}MB`}
            buttonLabel="Choose File"
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

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field
              label="Compression Level"
              info="Stronger levels downsample embedded images more. Text and vectors are kept."
            >
              <CompressionLevel
                options={LEVELS}
                value={quality}
                onChange={setQuality}
                disabled={!!targetKB}
              />
            </Field>

            <Field
              label="Target Size (Optional)"
              info="The tool retries with stronger image downsampling until the file fits."
            >
              <TargetSize {...target} onChange={setTarget} />
            </Field>
          </div>

          <p className="mt-3 text-xs text-[var(--muted)]">
            Text and vector graphics stay sharp. Only embedded images are recompressed, so
            text-only PDFs may shrink very little.
          </p>

          {alreadySmaller && (
            <p className="mt-2 text-xs" style={{ color: "var(--warn)" }}>
              Some files are already under this size. Compression can&apos;t make a file
              bigger.
            </p>
          )}

          {selectedFiles.length > 0 && (
            <button
              type="submit"
              disabled={isCompressing}
              className="btn btn-primary mt-5 w-full !py-3.5"
            >
              {isCompressing ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Compressing…
                </>
              ) : (
                `Compress ${selectedFiles.length > 1 ? `${selectedFiles.length} PDFs` : "PDF"}`
              )}
            </button>
          )}
        </form>

        <ResultsTable
          results={results}
          type="pdf"
          onDelete={deleteResult}
          onReset={clearAll}
        />

        <p className="mt-8 text-center text-xs text-[var(--muted)]">
          Your PDFs never leave your device.
        </p>
      </main>
    </>
  );
}

export default PdfCompressor;