export interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  value: string[];
  options: Option[];
  onChange: (values: string[]) => void;
}

function MultiSelect({ value, options, onChange }: MultiSelectProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map(opt => (
        <button
          key={opt.value}
          className={`px-2 py-1 border rounded ${value.includes(opt.value) ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => {
            if (value.includes(opt.value)) {
              onChange(value.filter(v => v !== opt.value));
            } else {
              onChange([...value, opt.value]);
            }
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default MultiSelect;
