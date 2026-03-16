import { SelectionData } from '@common/networkSides';
import { UI_CHANNEL } from '@ui/app.network';
import { useEffect, useState } from 'react';
import { AppHeader } from './components/organisms/AppHeader';
import { EmptyState } from './components/organisms/EmptyState';
import { TokensList } from './components/organisms/TokensList';
import { SourceSelector, SourceMethod } from './components/molecules/SourceSelector';

import '@ui/styles/main.css';

function App() {
  const [selectionData, setSelectionData] = useState<SelectionData>({
    hasSelection: false,
    nodeCount: 0,
    colorTokens: [],
    variableTokens: []
  });
  const [sourceMethod, setSourceMethod] = useState<SourceMethod>('both');

  useEffect(() => {
    UI_CHANNEL.subscribe('selectionUpdate', (data: SelectionData) => {
      setSelectionData(data);
    });
  }, []);

  const displayedTokens = selectionData.hasSelection
    ? sourceMethod === 'styles'
      ? selectionData.colorTokens
      : sourceMethod === 'variables'
      ? selectionData.variableTokens
      : [...selectionData.colorTokens, ...selectionData.variableTokens]
    : [];

  return (
    <div className="h-full min-h-screen overflow-auto bg-white px-4 pb-4">
      <div className="mx-auto">
        <AppHeader />

        <SourceSelector value={sourceMethod} onChange={setSourceMethod} />

        {!selectionData.hasSelection ? (
          <EmptyState />
        ) : (
          <TokensList
            tokens={displayedTokens}
            nodeCount={selectionData.nodeCount}
            sourceMethod={sourceMethod}
          />
        )}
      </div>
    </div>
  );
}

export default App;
