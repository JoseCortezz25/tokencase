import * as React from 'react';

interface ColorSwatchProps {
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12'
};

function ColorSwatch({ color, size = 'md', className = '' }: ColorSwatchProps) {
  return (
    <div
      className={`${sizeClasses[size]} flex-shrink-0 rounded ${className}`}
      style={{ backgroundColor: color }}
      title={color}
    />
  );
}

export { ColorSwatch };
