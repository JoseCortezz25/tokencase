import { ColorToken } from '@common/networkSides';

export type NamingConvention = 'kebab-case' | 'camelCase' | 'snake_case' | 'PascalCase';
export type ExportFormat = 'css' | 'scss' | 'tailwind' | 'js-object';

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

export function generateExportCode(
  tokens: ColorToken[],
  naming: NamingConvention,
  format: ExportFormat
): string {
  switch (format) {
    case 'css':
      return generateCSS(tokens, naming);
    case 'scss':
      return generateSCSS(tokens, naming);
    case 'tailwind':
      return generateTailwind(tokens, naming);
    case 'js-object':
      return generateJSObject(tokens, naming);
    default:
      return '';
  }
}

function generateCSS(tokens: ColorToken[], naming: NamingConvention): string {
  const variables = tokens
    .map(token => {
      const varName = convertNaming(token.name, naming);
      return `  --${varName}: ${token.hex};`;
    })
    .join('\n');

  return `:root {\n${variables}\n}`;
}

function generateSCSS(tokens: ColorToken[], naming: NamingConvention): string {
  return tokens
    .map(token => {
      const varName = convertNaming(token.name, naming);
      return `$${varName}: ${token.hex};`;
    })
    .join('\n');
}

function generateTailwind(
  tokens: ColorToken[],
  naming: NamingConvention
): string {
  const colors = tokens.reduce(
    (acc, token) => {
      const varName = convertNaming(token.name, naming);
      acc[varName] = token.hex;
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
  naming: NamingConvention
): string {
  const colors = tokens.reduce(
    (acc, token) => {
      const varName = convertNaming(token.name, naming);
      acc[varName] = token.hex;
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