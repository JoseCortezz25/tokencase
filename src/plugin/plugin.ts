import { PLUGIN, UI } from "@common/networkSides";
import { PLUGIN_CHANNEL } from "@plugin/plugin.network";
import { Networker } from "monorepo-networker";

async function bootstrap() {
  Networker.initialize(PLUGIN, PLUGIN_CHANNEL);

  figma.showUI(__html__, {
    width: 400,
    height: 600,
    title: "TokenCase - Export Design Tokens",
  });

  console.log("Bootstrapped @", Networker.getCurrentSide().name);

  // Send initial selection data
  function sendSelectionUpdate() {
    const selection = figma.currentPage.selection;
    
    if (selection.length === 0) {
      PLUGIN_CHANNEL.emit(UI, "selectionUpdate", [{
        hasSelection: false,
        nodeCount: 0,
        colorTokens: [],
        variableTokens: []
      }]);
    } else {
      // Request tokens for current selection
      const selectionData = getSelectionTokens();
      PLUGIN_CHANNEL.emit(UI, "selectionUpdate", [selectionData]);
    }
  }

  // Helper function to get selection tokens using figma.getSelectionColors()
  function getSelectionTokens() {
    const selection = figma.currentPage.selection;
    console.log('Getting selection tokens. Selection count:', selection.length);
    
    if (selection.length === 0) {
      console.log('No selection found');
      return {
        hasSelection: false,
        nodeCount: 0,
        colorTokens: [],
        variableTokens: []
      };
    }

    // Use Figma's built-in API to get colors from selection
    const selectionColors = figma.getSelectionColors();
    console.log('Selection colors:', selectionColors);

    const styleTokens: any[] = [];

    if (selectionColors && selectionColors.styles && selectionColors.styles.length > 0) {
      console.log('Found', selectionColors.styles.length, 'paint styles in selection');

      for (const style of selectionColors.styles) {
        console.log('Processing style:', style.name, style.id);

        const paint = style.paints[0];
        if (paint && paint.type === "SOLID") {
          styleTokens.push({
            id: style.id,
            name: style.name,
            type: "STYLE",
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

    // Extract color variables from the selection
    const variableTokens: any[] = [];
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
                    const rawValue = variable.valuesByMode[modeIds[0]];
                    const value = rawValue as RGBA;
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

    console.log('Final results - Style tokens:', styleTokens.length, 'Variable tokens:', variableTokens.length);

    return {
      hasSelection: true,
      nodeCount: selection.length,
      colorTokens: styleTokens,
      variableTokens
    };
  }

  function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (value: number) => {
      const hex = Math.round(value * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }


  // Send initial selection data
  sendSelectionUpdate();
  
  // Listen for selection changes
  figma.on("selectionchange", () => {
    sendSelectionUpdate();
  });
}

bootstrap();
