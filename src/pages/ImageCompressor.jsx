import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Loader2, RotateCcw } from "lucide-react";

import Hero from "../components/Hero";
import DropZone from "../components/DropZone";
import SelectedFiles from "../components/SelectedFiles";
import Segmented from "../components/Segmented";
import TargetSize, { toTargetKB } from "../components/TargetSize";
import Stats from "../components/Stats";
import ResultsTable from "../components/ResultsTable";

import { compressImage } from "../utils/imageCompressorUtils";
import { filterImageFiles, revokeObjectUrl } from "../utils/fileUtils";
import { usePageTitle } from "../hooks/usePageTitle";

const FORMATS = [
  { value: "image/webp", label: "WebP" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/png", label: "PNG" },
];

const WIDTHS = ["original", "2560", "1920", "1600", "1280", "1024", "800"];

function ImageCompressor() {
  usePageTitle("Compress Images");

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState("image/webp");
  const [maxWidth, setMaxWidth] = useState("original");
  const [target, setTarget] = useState({ enabled: false, amount: "", unit: "KB" });
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
    const imageFiles = filterImageFiles(files);

    if (!imageFiles.length) {
      setError("Please select JPG, PNG or WebP images.");
      return;
    }

    setSelectedFiles((current) => {
      const keyOf = (f) => `${f.name}-${f.size}-${f.lastModified}`;
      const existing = new Set(current.map(keyOf));
      return [...current, ...imageFiles.filter((f) => !existing.has(keyOf(f)))];
    });
  };

  const removeSelectedFile = (index) =>
    setSelectedFiles((current) => current.filter((_, i) => i !== index));

  const clearAll = () => {
    results.forEach((r) => revokeObjectUrl(r.url));
    setSelectedFiles([]);
    setResults([]);
    setTarget({ enabled: false, amount: "", unit: "KB" });
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
        compressed.push(
          await compressImage(file, {
            quality,
            format,
            maxWidth,
            targetSizeKB: targetKB,
          })
        );
      }
      setResults((current) => [...current, ...compressed]);
      setSelectedFiles([]);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Something went wrong while compressing the images.");
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

  const isLossless = format === "image/png";
  const alreadySmaller =
    targetKB && selectedFiles.some((f) => f.size <= targetKB * 1024);

  return (
    <>
      <Hero type="image" />

      <main className="mx-auto w-[92%] max-w-[900px] pb-20">
        <section className="card p-5 sm:p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCompress();
            }}
          >
            <DropZone
              accept="image/jpeg,image/png,image/webp"
              title="Drop images here"
              description="JPG, PNG or WebP. Add as many as you like."
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
              icon={ImageIcon}
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

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <div className="mb-2 flex items-center justify-between text-xs font-medium text-[var(--muted)]">
                  <span>Quality</span>
                  <span className="text-[var(--text)]">
                    {targetKB ? "Auto" : isLossless ? "Lossless" : `${quality}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  disabled={isLossless || !!targetKB}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="range"
                />
                <p className="mt-1.5 text-xs text-[var(--muted)]">
                  {targetKB
                    ? "Chosen automatically to fit your size."
                    : isLossless
                    ? "PNG ignores quality."
                    : "Lower = smaller file."}
                </p>
              </div>

              <div>
                <div className="mb-2 text-xs font-medium text-[var(--muted)]">
                  Format
                </div>
                <Segmented options={FORMATS} value={format} onChange={setFormat} />
                <p className="mt-1.5 text-xs text-[var(--muted)]">
                  WebP is usually the smallest.
                </p>
              </div>

              <div>
                <div className="mb-2 text-xs font-medium text-[var(--muted)]">
                  Max width
                </div>
                <select
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(e.target.value)}
                  className="input"
                >
                  {WIDTHS.map((w) => (
                    <option key={w} value={w}>
                      {w === "original" ? "Original size" : `${w}px`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

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
                  "Compress images"
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
            <Stats results={results} type="image" />
            <ResultsTable results={results} type="image" onDelete={deleteResult} />
          </>
        )}

        <p className="mt-8 text-center text-xs text-[var(--muted)]">
          Your images never leave your device.
        </p>
      </main>
    </>
  );
}

export default ImageCompressor;