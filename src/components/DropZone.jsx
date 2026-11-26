import { CloudUpload, FolderOpen } from "lucide-react";
import { useRef, useState } from "react";

function DropZone({
  accept,
  multiple = true,
  onFiles,
  title,
  hint,
  buttonLabel = "Choose Files",
}) {
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
      className={`flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center outline-none transition focus-visible:border-[var(--accent)] ${
        dragging
          ? "scale-[1.01] border-[var(--accent)] bg-[var(--accent-soft)]"
          : "border-[var(--drop-border)] bg-[var(--surface)] hover:border-[var(--accent)]"
      }`}
    >
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
        <CloudUpload size={34} />
      </div>

      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">or click to browse</p>
      {hint && <p className="mt-2 text-xs text-[var(--muted)]">{hint}</p>}

      <span className="btn btn-primary mt-5">
        <FolderOpen size={16} />
        {buttonLabel}
      </span>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          processFiles(e.target.files);
          e.target.value = "";
        }}
        className="hidden"
      />
    </div>
  );
}

export default DropZone;