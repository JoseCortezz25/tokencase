import { OptionButton } from './OptionButton';

export type SourceMethod = 'styles' | 'variables' | 'both';

interface SourceSelectorProps {
  value: SourceMethod;
  onChange: (method: SourceMethod) => void;
}

const OPTIONS: { value: SourceMethod; label: string; description: string }[] = [
  { value: 'styles', label: 'Local Styles', description: 'Extract from local paint styles' },
  { value: 'variables', label: 'Variables', description: 'Extract from color variables' },
  { value: 'both', label: 'Both', description: 'Extract from styles and variables' },
];

function SourceSelector({ value, onChange }: SourceSelectorProps) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
        Token Source
      </p>
      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map(opt => (
          <OptionButton
            key={opt.value}
            isSelected={value === opt.value}
            label={opt.label}
            description={opt.description}
            onClick={() => onChange(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}

export { SourceSelector };
