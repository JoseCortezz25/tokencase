import { PLUGIN, UI, ColorToken, SelectionData } from '@common/networkSides';

export const PLUGIN_CHANNEL = PLUGIN.channelBuilder()
  .emitsTo(UI, message => {
    figma.ui.postMessage(message);
  })
  .receivesFrom(UI, next => {
    const listener: MessageEventHandler = event => next(event);
    figma.ui.on('message', listener);
    return () => figma.ui.off('message', listener);
  })
  .startListening();

// ---------- Utility functions

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (value: number) => {
    const hex = Math.round(value * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getSelectionTokens(): SelectionData {
  const selection = figma.currentPage.selection;

  if (selection.length === 0) {
    return {
      hasSelection: false,
      nodeCount: 0,
      colorTokens: []
    };
  }

  // Use Figma's built-in API to get colors from selection
  const selectionColors = figma.getSelectionColors();

  if (!selectionColors || !selectionColors.styles) {
    return {
      hasSelection: true,
      nodeCount: selection.length,
      colorTokens: []
    };
  }

  const allTokens: ColorToken[] = [];

  // Process paint styles
  if (selectionColors.styles && selectionColors.styles.length > 0) {
    for (const style of selectionColors.styles) {
      const paint = style.paints[0];
      if (paint && paint.type === 'SOLID') {
        allTokens.push({
          id: style.id,
          name: style.name,
          type: 'STYLE',
          color: {
            r: paint.color.r,
            g: paint.color.g,
            b: paint.color.b,
            a: paint.opacity ?? 1
          },
          hex: rgbToHex(paint.color.r, paint.color.g, paint.color.b)
        });
      }
    }
  }

  return {
    hasSelection: true,
    nodeCount: selection.length,
    colorTokens: allTokens
  };
}

// ---------- Message handlers

PLUGIN_CHANNEL.registerMessageHandler('getSelectionTokens', async () => {
  return getSelectionTokens();
});

PLUGIN_CHANNEL.registerMessageHandler(
  'showNotification',
  async (message: string) => {
    figma.notify(message);
  }
);

PLUGIN_CHANNEL.registerMessageHandler('focusFigma', async () => {
  // This will make the plugin window visible and focused
  figma.showUI(__html__, { visible: true });
  figma.notify('¡Selecciona los nodos que deseas analizar!');
});
