function Segmented({ options, value, onChange, disabled = false }) {
  return (
    <div
      className="seg"
      role="group"
      style={{
        gridTemplateColumns: `repeat(${options.length}, 1fr)`,
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          disabled={disabled}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default Segmented;