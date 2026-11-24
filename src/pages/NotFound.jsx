import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

function NotFound() {
  usePageTitle("Page not found");

  return (
    <main className="mx-auto w-[92%] max-w-[720px] py-24 text-center">
      <p className="text-sm font-medium text-[var(--muted)]">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>

      <div className="mt-6 flex justify-center gap-3">
        <Link to="/image-compressor" className="btn btn-primary">
          Compress images
        </Link>
        <Link to="/pdf-compressor" className="btn btn-ghost">
          Compress PDFs
        </Link>
      </div>
    </main>
  );
}

export default NotFound;