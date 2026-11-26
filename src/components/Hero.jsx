import { Zap } from "lucide-react";
import { ImageIllustration, PdfIllustration } from "./Illustrations";

function Hero({ type }) {
  const isImage = type === "image";

  return (
    <section className="mx-auto w-[92%] max-w-[1000px] pt-8 sm:pt-12">
      <div className="flex items-center justify-between gap-6">
        <div className="max-w-[480px]">
          <span className="pill">
            <Zap size={13} />
            {isImage ? "Compress Images" : "Compress PDF"}
          </span>
          <h1 className="mt-4 text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl">
            {isImage ? "Image" : "PDF"}
            <br />
            <span className="text-gradient">Compress</span>
          </h1>
          <p className="mt-4 text-base text-[var(--muted)] sm:text-lg">
            {isImage
              ? "Reduce image size while keeping control of quality."
              : "Shrink your PDF files instantly."}
          </p>
        </div>

        <div className="hidden shrink-0 sm:block">
          {isImage ? <ImageIllustration size={210} /> : <PdfIllustration size={210} />}
        </div>
      </div>
    </section>
  );
}

export default Hero;