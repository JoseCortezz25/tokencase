import * as React from 'react';

interface LabelProps extends React.ComponentProps<'label'> {
  variant?: 'default' | 'semibold';
  size?: 'xs' | 'sm' | 'md';
}

function Label({
  className = '',
  variant = 'default',
  size = 'sm',
  children,
  ...props
}: LabelProps) {
  const baseClasses = 'block text-gray-800';
  
  const variantClasses = {
    default: 'font-medium',
    semibold: 'font-semibold'
  };
  
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base'
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  return (
    <label className={combinedClasses} {...props}>
      {children}
    </label>
  );
}

export { Label };