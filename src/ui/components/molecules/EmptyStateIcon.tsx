import { Icon } from '../atoms/Icon';

interface EmptyStateIconProps {
  variant?: 'selection' | 'warning';
  className?: string;
}

function EmptyStateIcon({
  variant = 'selection',
  className = ''
}: EmptyStateIconProps) {
  const containerClasses = {
    selection:
      'mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-gray-200 bg-gray-50',
    warning:
      'mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100'
  };

  const iconClasses = {
    selection: 'h-10 w-10 text-gray-400',
    warning: 'h-6 w-6 text-orange-500'
  };

  return (
    <div className={`${containerClasses[variant]} ${className}`}>
      <Icon
        name={variant}
        className={iconClasses[variant]}
        size={variant === 'selection' ? 40 : 24}
      />
    </div>
  );
}

export { EmptyStateIcon };
