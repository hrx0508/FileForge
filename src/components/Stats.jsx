import { formatBytes } from "../utils/fileUtils";

function Stats({ results, type }) {
  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalCompressed = results.reduce((sum, r) => sum + r.compressedSize, 0);
  const totalSaved = Math.max(0, totalOriginal - totalCompressed);
  const savedPercent =
    totalOriginal > 0 ? Math.round((totalSaved / totalOriginal) * 100) : 0;

  const stats = [
    { label: type === "image" ? "Images" : "PDFs", value: results.length },
    { label: "Before", value: formatBytes(totalOriginal) },
    { label: "After", value: formatBytes(totalCompressed) },
    {
      label: "Saved",
      value: `${formatBytes(totalSaved)} · ${savedPercent}%`,
      highlight: true,
    },
  ];

  return (
    <div className="card my-6 grid grid-cols-2 divide-[var(--border)] sm:grid-cols-4 sm:divide-x">
      {stats.map((stat) => (
        <div key={stat.label} className="p-4 sm:p-5">
          <div className="text-xs text-[var(--muted)]">{stat.label}</div>
          <div
            className={`mt-1 text-lg font-bold ${
              stat.highlight ? "text-[var(--success)]" : ""
            }`}
          >
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Stats;