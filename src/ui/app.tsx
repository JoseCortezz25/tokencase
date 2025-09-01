import { PLUGIN, SelectionData, ColorToken } from '@common/networkSides';
import { UI_CHANNEL } from '@ui/app.network';
import { Button } from '@ui/components/ui/button';
import { useEffect, useState } from 'react';

import '@ui/styles/main.css';

function App() {
  const [selectionData, setSelectionData] = useState<SelectionData>({
    hasSelection: false,
    nodeCount: 0,
    colorTokens: []
  });

  useEffect(() => {
    // Subscribe to selection updates from plugin
    UI_CHANNEL.subscribe('selectionUpdate', (data: SelectionData) => {
      setSelectionData(data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800 mb-2">TokenCase</h1>
          <p className="text-sm text-gray-600">Export design tokens from your Figma styles</p>
        </div>

        {/* Content */}
        {!selectionData.hasSelection ? (
          <EmptyState />
        ) : (
          <TokensList tokens={selectionData.colorTokens} nodeCount={selectionData.nodeCount} />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 000-8z" />
        </svg>
      </div>
      
      <h2 className="text-lg font-medium text-gray-800 mb-2">Select nodes to get started</h2>
      
      <p className="text-sm text-gray-600 mb-4 max-w-xs mx-auto">
        Choose elements in your Figma design that use local color styles. We'll detect and show the tokens for you.
      </p>
      
      <div className="bg-blue-50 rounded-lg p-3 text-left">
        <p className="text-xs font-medium text-blue-800 mb-1">💡 Tip:</p>
        <p className="text-xs text-blue-700">
          Select frames, groups, or individual elements that have local color styles applied to them.
        </p>
      </div>
    </div>
  );
}

function TokensList({ tokens, nodeCount }: { tokens: ColorToken[], nodeCount: number }) {
  if (tokens.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h2 className="text-base font-medium text-gray-800 mb-1">No tokens found</h2>
        <p className="text-sm text-gray-600 mb-4">
          The selected {nodeCount} node{nodeCount !== 1 ? 's' : ''} don't use local color styles.
        </p>
        
        <div className="bg-amber-50 rounded-lg p-3 text-left">
          <p className="text-xs font-medium text-amber-800 mb-1">Try selecting:</p>
          <ul className="text-xs text-amber-700 space-y-1">
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium text-gray-800">
          Found {tokens.length} token{tokens.length !== 1 ? 's' : ''}
        </h2>
        <span className="text-xs text-gray-500">
          from {nodeCount} node{nodeCount !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="space-y-3">
        {tokens.map((token) => (
          <TokenCard key={token.id} token={token} />
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Button 
          className="w-full"
          onClick={() => {
            console.log('Export tokens:', tokens);
            // TODO: Implement export functionality
          }}
        >
          Export Tokens
        </Button>
      </div>
    </div>
  );
}

function TokenCard({ token }: { token: ColorToken }) {
  return (
    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
      <div 
        className="w-8 h-8 rounded border border-gray-300 flex-shrink-0 mr-3"
        style={{ backgroundColor: token.hex }}
      />
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {token.name}
        </p>
        <p className="text-xs text-gray-500">
          {token.hex.toUpperCase()}
        </p>
      </div>
      
      <div className="text-xs text-gray-400 ml-2">
        {token.type}
      </div>
    </div>
  );
}

export default App;
