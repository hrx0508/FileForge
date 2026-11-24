const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function revokeObjectUrl(url) {
  if (url) URL.revokeObjectURL(url);
}

export function isImageFile(file) {
  return IMAGE_TYPES.includes(file?.type);
}

export function isPdfFile(file) {
  return (
    file?.type === "application/pdf" ||
    file?.name?.toLowerCase().endsWith(".pdf")
  );
}

export function filterImageFiles(files) {
  return Array.from(files).filter(isImageFile);
}

export function filterPdfFiles(files) {
  return Array.from(files).filter(isPdfFile);
}

export function calcSavedPercent(originalSize, compressedSize) {
  if (!originalSize) return 0;
  return Math.max(
    0,
    Math.round(((originalSize - compressedSize) / originalSize) * 100)
  );
}

export function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}