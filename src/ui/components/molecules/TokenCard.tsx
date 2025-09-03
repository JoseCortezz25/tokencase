import * as React from 'react';
import { ColorSwatch } from '../atoms/ColorSwatch';
import { Badge } from '../atoms/Badge';
import { ColorToken } from '@common/networkSides';

interface TokenCardProps {
  token: ColorToken;
  className?: string;
}

function TokenCard({ token, className = '' }: TokenCardProps) {
  return (
    <div className={`flex items-center rounded-lg bg-gray-50 p-3 ${className}`}>
      <ColorSwatch color={token.hex} className="mr-3" />
      
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-800">
          {token.name}
        </p>
        <p className="text-xs text-gray-500">{token.hex.toUpperCase()}</p>
      </div>
      
      <Badge variant="muted" size="xs" className="ml-2">
        {token.type}
      </Badge>
    </div>
  );
}

export { TokenCard };