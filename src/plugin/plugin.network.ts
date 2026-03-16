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
      colorTokens: [],
      variableTokens: []
    };
  }

  const selectionColors = figma.getSelectionColors();

  const styleTokens: ColorToken[] = [];
  if (selectionColors && selectionColors.styles && selectionColors.styles.length > 0) {
    for (const style of selectionColors.styles) {
      const paint = style.paints[0];
      if (paint && paint.type === 'SOLID') {
        styleTokens.push({
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

  const variableTokens: ColorToken[] = [];
  const seenVariableIds = new Set<string>();

  function collectVariablesFromNode(node: SceneNode) {
    if ('boundVariables' in node && node.boundVariables) {
      const boundVars = node.boundVariables as Record<string, VariableAlias | VariableAlias[]>;
      for (const aliasOrArray of Object.values(boundVars)) {
        const aliases = Array.isArray(aliasOrArray) ? aliasOrArray : [aliasOrArray];
        for (const alias of aliases) {
          if (alias && alias.type === 'VARIABLE_ALIAS' && !seenVariableIds.has(alias.id)) {
            seenVariableIds.add(alias.id);
            try {
              const variable = figma.variables.getVariableById(alias.id);
              if (variable && variable.resolvedType === 'COLOR') {
                const modeIds = Object.keys(variable.valuesByMode);
                if (modeIds.length > 0) {
                  const value = variable.valuesByMode[modeIds[0]] as RGBA;
                  if (value && typeof value === 'object' && 'r' in value) {
                    variableTokens.push({
                      id: variable.id,
                      name: variable.name,
                      type: 'VARIABLE',
                      color: {
                        r: value.r,
                        g: value.g,
                        b: value.b,
                        a: value.a ?? 1
                      },
                      hex: rgbToHex(value.r, value.g, value.b)
                    });
                  }
                }
              }
            } catch (e) {
              console.log('Error processing variable id:', alias.id, e);
            }
          }
        }
      }
    }
    if ('children' in node) {
      for (const child of (node as ChildrenMixin).children) {
        collectVariablesFromNode(child as SceneNode);
      }
    }
  }

  for (const node of selection) {
    collectVariablesFromNode(node);
  }

  return {
    hasSelection: true,
    nodeCount: selection.length,
    colorTokens: styleTokens,
    variableTokens
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
