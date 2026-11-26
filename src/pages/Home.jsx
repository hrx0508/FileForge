import { Link } from "react-router-dom";
import { ArrowRight, FileText, Image as ImageIcon, Zap } from "lucide-react";
import { ImageIllustration, PdfIllustration } from "../components/Illustrations";
import { usePageTitle } from "../hooks/usePageTitle";

function Home() {
  usePageTitle("");

  return (
    <main className="mx-auto w-[92%] max-w-[900px] pb-16 pt-8 text-center sm:pt-12">
      <span className="pill">
        <Zap size={13} />
        Compress • Optimize • Share
      </span>

      <h1 className="mt-5 text-6xl font-black leading-none tracking-tight sm:text-7xl">
        File<span className="text-gradient">Forge</span>
      </h1>
      <p className="mt-3 text-2xl font-bold text-[var(--muted)]">Fast. Simple. Powerful.</p>
      <p className="mx-auto mt-3 max-w-[520px] text-base text-[var(--muted)]">
        Compress your images and PDFs effortlessly — save space, share faster.
      </p>

      <div className="mx-auto mt-10 grid max-w-[780px] gap-6 sm:grid-cols-2">
        <div className="tool-card purple">
          <div className="flex justify-center">
            <ImageIllustration size={120} />
          </div>
          <h2 className="mt-3 text-xl font-bold">Image Compress</h2>
          <p className="mx-auto mt-1 max-w-[220px] text-sm text-[var(--muted)]">
            Reduce image size with control over quality.
          </p>
          <Link to="/image-compressor" className="btn btn-primary mt-5 w-full">
            <ImageIcon size={16} />
            Compress Images
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="tool-card blue">
          <div className="flex justify-center">
            <PdfIllustration size={120} />
          </div>
          <h2 className="mt-3 text-xl font-bold">PDF Compress</h2>
          <p className="mx-auto mt-1 max-w-[220px] text-sm text-[var(--muted)]">
            Shrink your PDF files instantly.
          </p>
          <Link to="/pdf-compressor" className="btn btn-blue mt-5 w-full">
            <FileText size={16} />
            Compress PDF
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-[640px] items-center gap-4 text-sm text-[var(--muted)]">
        <span className="h-px flex-1 bg-[var(--border)]" />
        <span className="flex items-center gap-2">
          <Zap size={14} className="text-[var(--accent)]" />
          Smaller Files. Bigger Possibilities.
        </span>
        <span className="h-px flex-1 bg-[var(--border)]" />
      </div>
    </main>
  );
}

export default Home;