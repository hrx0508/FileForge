import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Loader2 } from "lucide-react";

import Hero from "../components/Hero";
import DropZone from "../components/DropZone";
import SelectedFiles from "../components/SelectedFiles";
import Field from "../components/Field";
import CompressionLevel from "../components/CompressionLevel";
import TargetSize, { toTargetKB } from "../components/TargetSize";
import ResultsTable from "../components/ResultsTable";

import { compressImage } from "../utils/imageCompressorUtils";
import { filterImageFiles, revokeObjectUrl } from "../utils/fileUtils";
import { usePageTitle } from "../hooks/usePageTitle";

const LEVELS = [
  { value: 40, label: "Low", hint: "(−70%)" },
  { value: 65, label: "Balanced", hint: "(−50%)" },
  { value: 85, label: "High", hint: "(−30%)" },
];

const FORMATS = [
  { value: "original", label: "Keep Original" },
  { value: "image/webp", label: "WebP" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/png", label: "PNG" },
];

const MAX_MB = 10;

function ImageCompressor() {
  usePageTitle("Compress Images");

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [quality, setQuality] = useState(65);
  const [format, setFormat] = useState("original");
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
    const valid = filterImageFiles(files);

    if (!valid.length) {
      setError("Please select JPG, PNG or WebP images.");
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
            maxWidth: "original",
            targetSizeKB: targetKB,
          })
        );
      }
      setResults((current) => [...compressed, ...current]);
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

  const alreadySmaller =
    targetKB && selectedFiles.some((f) => f.size <= targetKB * 1024);
  const pngNote =
    format === "image/png" ||
    (format === "original" && selectedFiles.some((f) => f.type === "image/png"));

  return (
    <>
      <Hero type="image" />

      <main className="mx-auto w-[92%] max-w-[1000px] pb-20 pt-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCompress();
          }}
        >
          <DropZone
            accept="image/jpeg,image/png,image/webp"
            title="Drag & drop your images here"
            hint={`Supports: JPG, PNG, WEBP  •  Max size: ${MAX_MB}MB`}
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

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <Field
              label="Compression Level"
              info="Higher compression gives smaller files with lower quality. Actual savings vary by image."
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
              info="Enter the size you want. The tool lowers quality, then dimensions, until it fits."
            >
              <TargetSize {...target} onChange={setTarget} />
            </Field>

            <Field label="Format" info="Choose the output format for all images.">
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="input"
              >
                {FORMATS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
              {pngNote && (
                <p className="mt-2 text-xs text-[var(--muted)]">
                  PNG stays lossless, so choose WebP for smaller files.
                </p>
              )}
            </Field>
          </div>

          {alreadySmaller && (
            <p className="mt-3 text-xs" style={{ color: "var(--warn)" }}>
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
                `Compress ${selectedFiles.length > 1 ? `${selectedFiles.length} images` : "image"}`
              )}
            </button>
          )}
        </form>

        <ResultsTable
          results={results}
          type="image"
          onDelete={deleteResult}
          onReset={clearAll}
        />

        <p className="mt-8 text-center text-xs text-[var(--muted)]">
          Your images never leave your device.
        </p>
      </main>
    </>
  );
}

export default ImageCompressor;