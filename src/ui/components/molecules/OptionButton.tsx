import * as React from 'react';

interface OptionButtonProps extends React.ComponentProps<'button'> {
  isSelected: boolean;
  label: string;
  description: string;
}

function OptionButton({
  isSelected,
  label,
  description,
  className = '',
  children,
  ...props
}: OptionButtonProps) {
  const baseClasses = 'w-full rounded-lg border p-3 text-left transition-all duration-200';
  const selectedClasses = 'border-blue-600 bg-blue-600 text-white shadow-md';
  const unselectedClasses = 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50';
  
  const combinedClasses = `${baseClasses} ${isSelected ? selectedClasses : unselectedClasses} ${className}`.trim();

  return (
    <button className={combinedClasses} {...props}>
      <div className="mb-1 text-sm font-medium">
        {label}
      </div>
      <div className={`text-xs ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
        {description}
      </div>
      {children}
    </button>
  );
}

export { OptionButton };