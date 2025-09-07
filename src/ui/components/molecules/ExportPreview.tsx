import * as React from 'react';
import { Label } from '../atoms/Label';
import { Badge } from '../atoms/Badge';

interface ExportPreviewProps {
  code: string;
  tokenCount: number;
  className?: string;
}

function ExportPreview({ code, tokenCount, className = '' }: ExportPreviewProps) {
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between">
        <Label size="sm" className="text-gray-700">Preview</Label>
        <Badge variant="muted" size="xs">
          {tokenCount} token{tokenCount !== 1 ? 's' : ''}
        </Badge>
      </div>
      <div className="rounded-lg bg-gray-900 p-4 text-sm">
        <pre className="overflow-x-auto font-mono whitespace-pre-wrap text-green-400">
          {code}
        </pre>
      </div>
    </div>
  );
}

export { ExportPreview };