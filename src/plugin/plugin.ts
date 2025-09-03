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
        colorTokens: []
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
        colorTokens: []
      };
    }
    
    // Use Figma's built-in API to get colors from selection
    const selectionColors = figma.getSelectionColors();
    console.log('Selection colors:', selectionColors);
    
    if (!selectionColors || !selectionColors.styles) {
      console.log('No colors found in selection');
      return {
        hasSelection: true,
        nodeCount: selection.length,
        colorTokens: []
      };
    }
    
    const allTokens: any[] = [];
    
    // Process paint styles
    if (selectionColors.styles && selectionColors.styles.length > 0) {
      console.log('Found', selectionColors.styles.length, 'paint styles in selection');
      
      for (const style of selectionColors.styles) {
        console.log('Processing style:', style.name, style.id);
        
        const paint = style.paints[0];
        if (paint && paint.type === "SOLID") {
          allTokens.push({
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
          console.log('Added paint style:', style.name, 'hex:', rgbToHex(paint.color.r, paint.color.g, paint.color.b));
        }
      }
    }
    
    // Process variables if they exist (commented out temporarily)
    // if (selectionColors.variables && selectionColors.variables.length > 0) {
    //   console.log('Found', selectionColors.variables.length, 'variables in selection');
      
    //   for (const variable of selectionColors.variables) {
    //     console.log('Processing variable:', variable.name, variable.id);
    //     
    //     try {
    //       const collection = figma.variables.getVariableCollectionById(variable.variableCollectionId);
    //       if (collection) {
    //         const mode = collection.defaultModeId;
    //         const value = variable.valuesByMode[mode];
    //         
    //         if (value && typeof value === 'object' && 'r' in value) {
    //           allTokens.push({
    //             id: variable.id,
    //             name: variable.name,
    //             type: "VARIABLE",
    //             color: {
    //               r: value.r,
    //               g: value.g,
    //               b: value.b,
    //               a: value.a ?? 1
    //             },
    //             hex: rgbToHex(value.r, value.g, value.b)
    //           });
    //           console.log('Added color variable:', variable.name, 'hex:', rgbToHex(value.r, value.g, value.b));
    //         }
    //       }
    //     } catch (e) {
    //       console.log('Error processing variable:', variable.name, e);
    //     }
    //   }
    // }
    
    console.log('Final results - Tokens found:', allTokens.length);
    
    return {
      hasSelection: true,
      nodeCount: selection.length,
      colorTokens: allTokens
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
