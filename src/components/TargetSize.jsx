function TargetSize({ amount, unit, onChange, label = "Compress to" }) {
  const update = (next) => {
    const a = next.amount ?? amount;
    const u = next.unit ?? unit;
    onChange({ enabled: Number(a) > 0, amount: a, unit: u });
  };

  return (
    <div>
      <label
        htmlFor="target-size"
        className="mb-2 block text-xs font-medium text-[var(--muted)]"
      >
        {label}
      </label>

      <div className="flex max-w-[320px] gap-2">
        <input
          id="target-size"
          type="number"
          min="1"
          step="any"
          inputMode="decimal"
          value={amount}
          placeholder="Enter size, e.g. 200"
          onChange={(e) => update({ amount: e.target.value })}
          className="input"
        />
        <select
          value={unit}
          onChange={(e) => update({ unit: e.target.value })}
          className="input !w-24"
          aria-label="Size unit"
        >
          <option value="KB">KB</option>
          <option value="MB">MB</option>
        </select>
      </div>

      <p className="mt-2 text-xs text-[var(--muted)]">
        {Number(amount) > 0
          ? `Each file will be compressed to under ${amount} ${unit} if possible.`
          : "Leave empty to use the quality settings instead."}
      </p>
    </div>
  );
}

export function toTargetKB({ enabled, amount, unit }) {
  const n = Number(amount);
  if (!enabled || !n || n <= 0) return null;
  return unit === "MB" ? n * 1024 : n;
}

export default TargetSize;