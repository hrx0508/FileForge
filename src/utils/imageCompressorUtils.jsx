import { isImageFile, calcSavedPercent } from "./fileUtils";

const EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Could not load ${file.name}`));
    };
    img.src = objectUrl;
  });
}

function canvasToBlob(canvas, format, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Compression failed."))),
      format,
      quality
    );
  });
}

async function render(img, width, height, format, quality) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported.");

  if (format === "image/jpeg") {
    ctx.fillStyle = "#ffffff"; // JPEG has no transparency
    ctx.fillRect(0, 0, width, height);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await canvasToBlob(
    canvas,
    format,
    format === "image/png" ? undefined : quality
  );
  canvas.width = canvas.height = 0; // free memory
  return blob;
}

// Finds the best result under targetBytes. Lowers quality first, then dimensions.
async function fitToTarget(img, width, height, format, targetBytes) {
  const lossy = format !== "image/png";
  let scale = 1;
  let smallest = null;

  for (let attempt = 0; attempt < 10; attempt++) {
    const w = Math.max(1, Math.round(width * scale));
    const h = Math.max(1, Math.round(height * scale));

    if (lossy) {
      const lowest = await render(img, w, h, format, 0.1);
      if (!smallest || lowest.size < smallest.blob.size) {
        smallest = { blob: lowest, width: w, height: h };
      }

      if (lowest.size <= targetBytes) {
        // Binary search for the highest quality that still fits
        let best = { blob: lowest, width: w, height: h };
        let lo = 0.1;
        let hi = 1;
        for (let i = 0; i < 6; i++) {
          const mid = (lo + hi) / 2;
          const blob = await render(img, w, h, format, mid);
          if (blob.size <= targetBytes) {
            best = { blob, width: w, height: h };
            lo = mid;
          } else {
            hi = mid;
          }
        }
        return { ...best, targetMet: true };
      }
    } else {
      const blob = await render(img, w, h, format);
      if (!smallest || blob.size < smallest.blob.size) {
        smallest = { blob, width: w, height: h };
      }
      if (blob.size <= targetBytes) {
        return { blob, width: w, height: h, targetMet: true };
      }
    }

    scale *= 0.85;
  }

  return { ...smallest, targetMet: false };
}

export async function compressImage(
  file,
  { quality = 80, format = "original", maxWidth = "original", targetSizeKB = null } = {}
) {
  if (!isImageFile(file)) {
    throw new Error(`${file?.name || "File"} is not a supported image (JPG, PNG, WebP).`);
  }

  // "original" keeps the file's own format
  const outFormat = format === "original" ? file.type : format;

  const img = await loadImage(file);

  let width = img.naturalWidth;
  let height = img.naturalHeight;
  let resized = false;

  if (maxWidth !== "original" && width > Number(maxWidth)) {
    const newWidth = Number(maxWidth);
    height = Math.round(height * (newWidth / width));
    width = newWidth;
    resized = true;
  }

  let blob;
  let targetMet = null;

  if (targetSizeKB) {
    const result = await fitToTarget(img, width, height, outFormat, targetSizeKB * 1024);
    blob = result.blob;
    width = result.width;
    height = result.height;
    targetMet = result.targetMet;
  } else {
    const q = Math.min(1, Math.max(0.1, Number(quality) / 100));
    blob = await render(img, width, height, outFormat, q);

    if (!resized && blob.type === file.type && blob.size >= file.size) {
      blob = file;
    }
  }

  const actualFormat = EXTENSIONS[blob.type] ? blob.type : outFormat;
  const baseName = file.name.replace(/\.[^/.]+$/, "");

  return {
    id: crypto.randomUUID(),
    originalName: file.name,
    outputName: `${baseName}-compressed.${EXTENSIONS[actualFormat]}`,
    originalSize: file.size,
    compressedSize: blob.size,
    savedPercent: calcSavedPercent(file.size, blob.size),
    width,
    height,
    format: actualFormat,
    targetMet,
    url: URL.createObjectURL(blob),
  };
}