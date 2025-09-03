import { Networker } from 'monorepo-networker';

export interface ColorToken {
  id: string;
  name: string;
  type: 'STYLE' | 'VARIABLE' | 'LOCAL';
  color: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  hex: string;
}

export interface SelectionData {
  hasSelection: boolean;
  nodeCount: number;
  colorTokens: ColorToken[];
}

export const UI = Networker.createSide('UI-side').listens<{
  selectionUpdate(data: SelectionData): void;
}>();

export const PLUGIN = Networker.createSide('Plugin-side').listens<{
  getSelectionTokens(): Promise<SelectionData>;
  showNotification(message: string): void;
  focusFigma(): void;
}>();
