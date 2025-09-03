import { Badge } from '../atoms/Badge';
import { TokenCard } from '../molecules/TokenCard';
import { EmptyStateIcon } from '../molecules/EmptyStateIcon';
import { ExportSection } from './ExportSection';
import { ColorToken } from '@common/networkSides';

interface TokensListProps {
  tokens: ColorToken[];
  nodeCount: number;
}

function TokensList({ tokens, nodeCount }: TokensListProps) {
  if (tokens.length === 0) {
    return (
      <div className="w-full py-8 text-center">
        <EmptyStateIcon variant="warning" />

        <h2 className="text-md mb-1 font-medium text-gray-800">
          No tokens found
        </h2>
        <p className="mb-4 text-gray-600">
          The selected {nodeCount} node{nodeCount !== 1 ? 's' : ''} don't use
          local color styles.
        </p>

        <div className="rounded-lg bg-amber-50 p-3 text-left">
          <p className="mb-1 font-medium text-amber-800">Try selecting:</p>
          <ul className="space-y-1 text-sm text-amber-700">
            <li>• Elements with local color styles applied</li>
            <li>• Frames or groups containing styled elements</li>
            <li>• Components with color tokens</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-medium text-gray-800">
          Found {tokens.length} token{tokens.length !== 1 ? 's' : ''}
        </h2>
        <Badge variant="muted" size="xs">
          from {nodeCount} node{nodeCount !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="mb-6 space-y-3">
        {tokens.map(token => (
          <TokenCard key={token.id} token={token} />
        ))}
      </div>

      <ExportSection tokens={tokens} />
    </div>
  );
}

export { TokensList };
