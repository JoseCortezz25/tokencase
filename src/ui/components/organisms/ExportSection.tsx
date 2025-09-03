import * as React from 'react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../atoms/Label';
import { OptionButton } from '../molecules/OptionButton';
import { ExportPreview } from '../molecules/ExportPreview';
import { ColorToken, PLUGIN } from '@common/networkSides';
import { UI_CHANNEL } from '@ui/app.network';
import {
  convertNaming,
  generateExportCode,
  copyToClipboard,
  downloadFile
} from '../../utils';

type NamingConvention =
  | 'kebab-case'
  | 'camelCase'
  | 'snake_case'
  | 'PascalCase';
type ExportFormat = 'css' | 'scss' | 'tailwind' | 'js-object';

interface ExportSectionProps {
  tokens: ColorToken[];
}

const namingOptions = [
  { value: 'kebab-case', label: 'kebab-case', example: 'red-100' },
  { value: 'camelCase', label: 'camelCase', example: 'red100' },
  { value: 'snake_case', label: 'snake_case', example: 'red_100' },
  { value: 'PascalCase', label: 'PascalCase', example: 'Red100' }
] as const;

const formatOptions = [
  { value: 'css', label: 'CSS Variables', description: '--color: value' },
  { value: 'scss', label: 'SCSS Variables', description: '$color: value' },
  { value: 'tailwind', label: 'Tailwind Config', description: 'colors: {...}' },
  { value: 'js-object', label: 'JS Object', description: 'export const' }
] as const;

function ExportSection({ tokens }: ExportSectionProps) {
  const [namingConvention, setNamingConvention] =
    useState<NamingConvention>('kebab-case');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('css');

  const exportCode = generateExportCode(tokens, namingConvention, exportFormat);

  const handleCopyCode = () => {
    copyToClipboard(exportCode);
    UI_CHANNEL.emit(PLUGIN, 'showNotification', [
      'Code copied to clipboard! 📋'
    ]);
  };

  const handleDownloadFile = () => {
    downloadFile(exportCode, exportFormat);
  };

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <div className="mb-4 flex items-center">
        <h3 className="text-base font-medium text-gray-900">Export Settings</h3>
      </div>

      <div className="mb-5 rounded-xl bg-gray-50 p-5">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label variant="semibold" className="mb-3 block">
              Naming Style
            </Label>
            <div className="space-y-2">
              {namingOptions.map(option => (
                <OptionButton
                  key={option.value}
                  isSelected={namingConvention === option.value}
                  label={option.label}
                  description={option.example}
                  onClick={() => setNamingConvention(option.value)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label variant="semibold" className="mb-3 block">
              Export Format
            </Label>
            <div className="space-y-2">
              {formatOptions.map(option => (
                <OptionButton
                  key={option.value}
                  isSelected={exportFormat === option.value}
                  label={option.label}
                  description={option.description}
                  onClick={() => setExportFormat(option.value)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <ExportPreview
        code={exportCode}
        tokenCount={tokens.length}
        className="mb-4"
      />

      <div className="flex gap-3">
        <Button
          variant="primary"
          className="flex-1"
          onClick={handleDownloadFile}
        >
          Download File
        </Button>

        <Button variant="secondary" className="flex-1" onClick={handleCopyCode}>
          Copy Code
        </Button>
      </div>
    </div>
  );
}

export { ExportSection };
