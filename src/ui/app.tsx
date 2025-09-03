import { SelectionData } from '@common/networkSides';
import { UI_CHANNEL } from '@ui/app.network';
import { useEffect, useState } from 'react';
import { AppHeader } from './components/organisms/AppHeader';
import { EmptyState } from './components/organisms/EmptyState';
import { TokensList } from './components/organisms/TokensList';

import '@ui/styles/main.css';

function App() {
  const [selectionData, setSelectionData] = useState<SelectionData>({
    hasSelection: false,
    nodeCount: 0,
    colorTokens: []
  });

  useEffect(() => {
    UI_CHANNEL.subscribe('selectionUpdate', (data: SelectionData) => {
      setSelectionData(data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white px-4 pb-4">
      <div className="mx-auto">
        <AppHeader />

        {!selectionData.hasSelection ? (
          <EmptyState />
        ) : (
          <TokensList
            tokens={selectionData.colorTokens}
            nodeCount={selectionData.nodeCount}
          />
        )}
      </div>
    </div>
  );
}

export default App;
