function TargetSize({ amount, unit, onChange }) {
  const update = (next) => {
    const a = next.amount ?? amount;
    const u = next.unit ?? unit;
    onChange({ enabled: Number(a) > 0, amount: a, unit: u });
  };

  return (
    <div>
      <div className="suffix-field">
        <input
          type="number"
          min="1"
          step="any"
          inputMode="decimal"
          value={amount}
          placeholder={unit === "MB" ? "e.g. 2" : "e.g. 500"}
          onChange={(e) => update({ amount: e.target.value })}
          aria-label="Target size"
        />
        <select
          value={unit}
          onChange={(e) => update({ unit: e.target.value })}
          aria-label="Size unit"
        >
          <option value="KB">KB</option>
          <option value="MB">MB</option>
        </select>
      </div>
      {Number(amount) > 0 && (
        <p className="mt-2 text-xs text-[var(--muted)]">
          Compression level is ignored while a size is set.
        </p>
      )}
    </div>
  );
}

export function toTargetKB({ enabled, amount, unit }) {
  const n = Number(amount);
  if (!enabled || !n || n <= 0) return null;
  return unit === "MB" ? n * 1024 : n;
}

export default TargetSize;