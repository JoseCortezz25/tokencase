import { PLUGIN, SelectionData, ColorToken } from '@common/networkSides';
import { UI_CHANNEL } from '@ui/app.network';
import { Button } from '@ui/components/ui/button';
import { useEffect, useState } from 'react';

import '@ui/styles/main.css';

type NamingConvention = 'kebab-case' | 'camelCase' | 'snake_case' | 'PascalCase';
type ExportFormat = 'css' | 'scss' | 'tailwind' | 'js-object';

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
  const [namingConvention, setNamingConvention] = useState<NamingConvention>('kebab-case');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('css');
  const [exportedCode, setExportedCode] = useState<string>('');

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
      
      {/* Tokens List */}
      <div className="space-y-3 mb-6">
        {tokens.map((token) => (
          <TokenCard key={token.id} token={token} />
        ))}
      </div>
      
      {/* Export Section */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <div className="flex items-center mb-4">
          <h3 className="text-base font-medium text-gray-900">Export Settings</h3>
        </div>
        
        {/* Export Options */}
        <div className="bg-gray-50 rounded-xl p-5 mb-5">
          <div className="grid grid-cols-2 gap-6">
            {/* Naming Convention */}
            <div>
              <label className="text-sm font-semibold text-gray-800 mb-3 block">
                Naming Style
              </label>
              <div className="space-y-2">
                {[
                  { value: 'kebab-case', label: 'kebab-case', example: 'red-100' },
                  { value: 'camelCase', label: 'camelCase', example: 'red100' },
                  { value: 'snake_case', label: 'snake_case', example: 'red_100' },
                  { value: 'PascalCase', label: 'PascalCase', example: 'Red100' },
                ].map((option) => (
                  <button
                    key={option.value}
                    className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                      namingConvention === option.value
                        ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                    onClick={() => setNamingConvention(option.value as NamingConvention)}
                  >
                    <div className="text-sm font-medium mb-1">
                      {option.label}
                    </div>
                    <div className={`text-xs ${
                      namingConvention === option.value ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {option.example}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Export Format */}
            <div>
              <label className="text-sm font-semibold text-gray-800 mb-3 block">
                Export Format
              </label>
              <div className="space-y-2">
                {[
                  { value: 'css', label: 'CSS Variables', description: '--color: value' },
                  { value: 'scss', label: 'SCSS Variables', description: '$color: value' },
                  { value: 'tailwind', label: 'Tailwind Config', description: 'colors: {...}' },
                  { value: 'js-object', label: 'JS Object', description: 'export const' },
                ].map((option) => (
                  <button
                    key={option.value}
                    className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                      exportFormat === option.value
                        ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                    onClick={() => setExportFormat(option.value as ExportFormat)}
                  >
                    <div className="text-sm font-medium mb-1">
                      {option.label}
                    </div>
                    <div className={`text-xs ${
                      exportFormat === option.value ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Preview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Preview
            </label>
            <span className="text-xs text-gray-500">
              {tokens.length} token{tokens.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-sm">
            <pre className="text-green-400 font-mono whitespace-pre-wrap overflow-x-auto">
              {generateExportCode(tokens, namingConvention, exportFormat)}
            </pre>
          </div>
        </div>
        
        {/* Export Actions */}
        <div className="flex gap-3">
          <Button 
            variant="primary"
            className="flex-1"
            onClick={() => {
              const code = generateExportCode(tokens, namingConvention, exportFormat);
              downloadFile(code, exportFormat);
            }}
          >
            Download File
          </Button>
          
          <Button 
            variant="secondary"
            className="flex-1"
            onClick={() => {
              const code = generateExportCode(tokens, namingConvention, exportFormat);
              copyToClipboard(code);
              UI_CHANNEL.emit(PLUGIN, "showNotification", ["Code copied to clipboard! 📋"]);
            }}
          >
            Copy Code
          </Button>
        </div>
        
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


// Utility Functions
function convertNaming(name: string, convention: NamingConvention): string {
  // Clean the name first (remove special characters, normalize spaces)
  const cleanName = name
    .replace(/[\/\\]/g, '-') // Replace slashes with hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-zA-Z0-9-_]/g, '') // Remove special characters
    .toLowerCase();

  switch (convention) {
    case 'kebab-case':
      return cleanName;
    case 'camelCase':
      return cleanName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
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

function generateExportCode(tokens: ColorToken[], naming: NamingConvention, format: ExportFormat): string {
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
  const variables = tokens.map(token => {
    const varName = convertNaming(token.name, naming);
    return `  --${varName}: ${token.hex};`;
  }).join('\n');

  return `:root {\n${variables}\n}`;
}

function generateSCSS(tokens: ColorToken[], naming: NamingConvention): string {
  return tokens.map(token => {
    const varName = convertNaming(token.name, naming);
    return `$${varName}: ${token.hex};`;
  }).join('\n');
}

function generateTailwind(tokens: ColorToken[], naming: NamingConvention): string {
  const colors = tokens.reduce((acc, token) => {
    const varName = convertNaming(token.name, naming);
    acc[varName] = token.hex;
    return acc;
  }, {} as Record<string, string>);

  return `module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 8).replace(/^/gm, '        ').trim()}
    }
  }
}`;
}

function generateJSObject(tokens: ColorToken[], naming: NamingConvention): string {
  const colors = tokens.reduce((acc, token) => {
    const varName = convertNaming(token.name, naming);
    acc[varName] = token.hex;
    return acc;
  }, {} as Record<string, string>);

  return `export const colors = ${JSON.stringify(colors, null, 2)};`;
}

function copyToClipboard(text: string): void {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}

function downloadFile(content: string, format: ExportFormat): void {
  const extensions = {
    'css': 'css',
    'scss': 'scss',
    'tailwind': 'js',
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

export default App;
