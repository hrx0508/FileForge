import { isPdfFile, calcSavedPercent } from "./fileUtils";

let gsScriptPromise = null;

// Loads /gs.js once. It defines a global `createModule` function.
function loadGhostscriptScript() {
  if (window.createModule) return Promise.resolve();
  if (!gsScriptPromise) {
    gsScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "/gs.js";
      script.onload = resolve;
      script.onerror = () => {
        gsScriptPromise = null;
        reject(new Error("Could not load the PDF engine (gs.js)."));
      };
      document.head.appendChild(script);
    });
  }
  return gsScriptPromise;
}

async function runGhostscript(inputBytes, { preset, dpi }) {
  await loadGhostscriptScript();

  if (typeof window.createModule !== "function") {
    throw new Error("PDF engine failed to initialise (createModule missing).");
  }

  // Fresh instance per run: Ghostscript's runtime exits after callMain
  const gs = await window.createModule({
    locateFile: (path) => (path.endsWith(".wasm") ? "/gs.wasm" : path),
    print: () => {},
    printErr: () => {},
  });

  gs.FS.writeFile("input.pdf", inputBytes);

  const args = [
    "-sDEVICE=pdfwrite",
    "-dCompatibilityLevel=1.5",
    `-dPDFSETTINGS=${preset}`,
    "-dNOPAUSE",
    "-dBATCH",
    "-dQUIET",
    "-dSAFER",
    "-dDetectDuplicateImages=true",
    "-dCompressFonts=true",
    "-dSubsetFonts=true",
    "-dDownsampleColorImages=true",
    "-dDownsampleGrayImages=true",
    "-dDownsampleMonoImages=true",
    "-dColorImageDownsampleType=/Bicubic",
    "-dGrayImageDownsampleType=/Bicubic",
    `-dColorImageResolution=${dpi}`,
    `-dGrayImageResolution=${dpi}`,
    `-dMonoImageResolution=${Math.max(dpi, 150)}`,
    "-sOutputFile=output.pdf",
    "input.pdf",
  ];

  try {
    try {
      gs.callMain(args);
    } catch {
      // Emscripten throws ExitStatus on normal exit; check the output instead
    }
    return gs.FS.readFile("output.pdf");
  } catch {
    throw new Error(
      "This PDF could not be compressed. It may be damaged or password-protected."
    );
  }
}

export async function compressPdf(file, quality = 60, targetSizeKB = null) {
  if (!file || !isPdfFile(file)) {
    throw new Error("Please select a valid PDF file.");
  }

  const level = Math.min(100, Math.max(20, Number(quality) || 60));
  const dpi = Math.round(72 + ((level - 20) * 128) / 80);
  const preset = level < 40 ? "/screen" : level < 80 ? "/ebook" : "/printer";

  const originalBytes = new Uint8Array(await file.arrayBuffer());

  // First attempt uses the chosen preset. With a target, keep trying
  // stronger downsampling until the file fits.
  const attempts = [{ preset, dpi }];
  if (targetSizeKB) {
    attempts.push(
      { preset: "/ebook", dpi: 96 },
      { preset: "/screen", dpi: 72 },
      { preset: "/screen", dpi: 50 },
      { preset: "/screen", dpi: 36 }
    );
  }

  const targetBytes = targetSizeKB ? targetSizeKB * 1024 : null;
  let best = null;

  for (const attempt of attempts) {
    const output = await runGhostscript(originalBytes, attempt);
    if (output.length > 0 && (!best || output.length < best.length)) {
      best = output;
    }
    if (!targetBytes) break;
    if (best && best.length <= targetBytes) break;
  }

  // Never return something larger than the original
  const finalBytes =
    best && best.length < originalBytes.length ? best : originalBytes;
  const targetMet = targetBytes ? finalBytes.length <= targetBytes : null;

  const blob = new Blob([finalBytes], { type: "application/pdf" });

  let pageCount;
  try {
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(finalBytes, { ignoreEncryption: true });
    pageCount = doc.getPageCount();
  } catch {
    pageCount = undefined;
  }

  return {
    id: crypto.randomUUID(),
    originalName: file.name,
    outputName: file.name.replace(/\.pdf$/i, "") + "-compressed.pdf",
    pageCount,
    originalSize: file.size,
    compressedSize: blob.size,
    savedPercent: calcSavedPercent(file.size, blob.size),
    targetMet,
    url: URL.createObjectURL(blob),
  };
}