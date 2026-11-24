import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";

import Navbar from "../components/Navbar";

const ImageCompressor = lazy(() => import("../pages/ImageCompressor"));
const PdfCompressor = lazy(() => import("../pages/PdfCompressor"));
const NotFound = lazy(() => import("../pages/NotFound"));

function PageLoader() {
  return (
    <div className="grid min-h-[50vh] place-items-center text-[var(--muted)]">
      <Loader2 size={22} className="animate-spin" />
    </div>
  );
}

function Layout({ theme, onToggleTheme }) {
  return (
    <>
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </>
  );
}

function AppRoutes({ theme, onToggleTheme }) {
  return (
    <Routes>
      <Route element={<Layout theme={theme} onToggleTheme={onToggleTheme} />}>
        <Route index element={<Navigate to="/image-compressor" replace />} />
        <Route path="/image-compressor" element={<ImageCompressor />} />
        <Route path="/pdf-compressor" element={<PdfCompressor />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;