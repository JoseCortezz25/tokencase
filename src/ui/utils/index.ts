import { ColorToken } from '@common/networkSides';

export type NamingConvention = 'kebab-case' | 'camelCase' | 'snake_case' | 'PascalCase';
export type ExportFormat = 'css' | 'scss' | 'tailwind' | 'js-object';
export type ColorFormat = 'hex' | 'rgba';

export function convertNaming(name: string, convention: NamingConvention): string {
  const cleanName = name
    .replace(/[\/\\]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_]/g, '')
    .toLowerCase();

  switch (convention) {
    case 'kebab-case':
      return cleanName;
    case 'camelCase':
      return cleanName.replace(/-([a-z])/g, (match, letter) =>
        letter.toUpperCase()
      );
    case 'snake_case':
      return cleanName.replace(/-/g, '_');
    case 'PascalCase':
      return cleanName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
    default:
      return cleanName;
  }
}

export function hexToRgba(hex: string, alpha: number = 1): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getColorValue(token: ColorToken, colorFormat: ColorFormat): string {
  if (colorFormat === 'rgba') {
    // If token has color object with rgba values, use those, otherwise convert from hex
    if (token.color) {
      const { r, g, b, a = 1 } = token.color;
      const rInt = Math.round(r * 255);
      const gInt = Math.round(g * 255);
      const bInt = Math.round(b * 255);
      return `rgba(${rInt}, ${gInt}, ${bInt}, ${a})`;
    } else {
      return hexToRgba(token.hex);
    }
  }
  return token.hex;
}

export function generateExportCode(
  tokens: ColorToken[],
  naming: NamingConvention,
  format: ExportFormat,
  colorFormat: ColorFormat = 'hex'
): string {
  switch (format) {
    case 'css':
      return generateCSS(tokens, naming, colorFormat);
    case 'scss':
      return generateSCSS(tokens, naming, colorFormat);
    case 'tailwind':
      return generateTailwind(tokens, naming, colorFormat);
    case 'js-object':
      return generateJSObject(tokens, naming, colorFormat);
    default:
      return '';
  }
}

function generateCSS(tokens: ColorToken[], naming: NamingConvention, colorFormat: ColorFormat): string {
  const variables = tokens
    .map(token => {
      const varName = convertNaming(token.name, naming);
      const colorValue = getColorValue(token, colorFormat);
      return `  --${varName}: ${colorValue};`;
    })
    .join('\n');

  return `:root {\n${variables}\n}`;
}

function generateSCSS(tokens: ColorToken[], naming: NamingConvention, colorFormat: ColorFormat): string {
  return tokens
    .map(token => {
      const varName = convertNaming(token.name, naming);
      const colorValue = getColorValue(token, colorFormat);
      return `$${varName}: ${colorValue};`;
    })
    .join('\n');
}

function generateTailwind(
  tokens: ColorToken[],
  naming: NamingConvention,
  colorFormat: ColorFormat
): string {
  const colors = tokens.reduce(
    (acc, token) => {
      const varName = convertNaming(token.name, naming);
      const colorValue = getColorValue(token, colorFormat);
      acc[varName] = colorValue;
      return acc;
    },
    {} as Record<string, string>
  );

  return `module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 8).replace(/^/gm, '        ').trim()}
    }
  }
}`;
}

function generateJSObject(
  tokens: ColorToken[],
  naming: NamingConvention,
  colorFormat: ColorFormat
): string {
  const colors = tokens.reduce(
    (acc, token) => {
      const varName = convertNaming(token.name, naming);
      const colorValue = getColorValue(token, colorFormat);
      acc[varName] = colorValue;
      return acc;
    },
    {} as Record<string, string>
  );

  return `export const colors = ${JSON.stringify(colors, null, 2)};`;
}

export function copyToClipboard(text: string): void {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}

export function downloadFile(content: string, format: ExportFormat): void {
  const extensions = {
    css: 'css',
    scss: 'scss',
    tailwind: 'js',
    'js-object': 'js'
  };

  const filename = `tokens.${extensions[format]}`;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}