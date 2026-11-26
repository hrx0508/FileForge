function CompressionLevel({ options, value, onChange, disabled = false }) {
  return (
    <div className="grid grid-cols-3 gap-2" role="group">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          disabled={disabled}
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className="level"
        >
          {o.label}
          <small>{o.hint}</small>
        </button>
      ))}
    </div>
  );
}

export default CompressionLevel;