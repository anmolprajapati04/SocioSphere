export default function SearchBar({ placeholder, value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '0.45rem 0.75rem',
        borderRadius: '999px',
        border: '1px solid #d1d5db',
        fontSize: '0.85rem',
      }}
    />
  );
}

