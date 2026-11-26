import { isPdfFile, calcSavedPercent } from "./fileUtils";

let gsScriptPromise = null;

// Loads /gs.js once. The script defines a global `Module` factory function.
function loadGhostscript() {
  if (typeof window.Module === "function") return Promise.resolve();
  if (!gsScriptPromise) {
    gsScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "/gs.js";
      script.onload = () => {
        if (typeof window.Module === "function") resolve();
        else {
          gsScriptPromise = null;
          reject(
            new Error(
              "PDF engine file (gs.js) did not load correctly. Check that it is deployed."
            )
          );
        }
      };
      script.onerror = () => {
        gsScriptPromise = null;
        reject(new Error("Could not download the PDF engine (gs.js)."));
      };
      document.head.appendChild(script);
    });
  }
  return gsScriptPromise;
}

async function runGhostscript(inputBytes, { preset, dpi }) {
  await loadGhostscript();

  // Fresh instance per run: Ghostscript's runtime exits after callMain
  const gs = await window.Module({
    locateFile: (path) => (path.endsWith(".wasm") ? "/gs.wasm" : path),
    print: () => {},
    printErr: () => {},
  });

  gs.FS.writeFile("input.pdf", inputBytes);