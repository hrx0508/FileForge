import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

function DropZone({ accept, multiple = true, onFiles, title, description }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const processFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length) onFiles(files);
  };

  const open = () => inputRef.current?.click();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        processFiles(e.dataTransfer.files);
      }}
      className={`flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center outline-none transition focus-visible:border-[var(--accent)] ${
        dragging
          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
          : "border-[var(--drop-border)] bg-[var(--surface-soft)] hover:border-[var(--accent)]"
      }`}
    >
      <UploadCloud size={30} className="mb-3 text-[var(--accent-text)]" />

      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1.5 max-w-[420px] text-sm text-[var(--muted)]">
        {description}
      </p>

      <span className="btn btn-primary mt-5">Choose files</span>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          processFiles(e.target.files);
          e.target.value = ""; // allow picking the same file again
        }}
        className="hidden"
      />
    </div>
  );
}

export default DropZone;