import * as React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'muted';
  size?: 'xs' | 'sm';
  className?: string;
}

function Badge({
  children,
  variant = 'default',
  size = 'xs',
  className = ''
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center rounded px-2 py-1';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    muted: 'text-gray-500'
  };
  
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm'
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  return (
    <span className={combinedClasses}>
      {children}
    </span>
  );
}

export { Badge };