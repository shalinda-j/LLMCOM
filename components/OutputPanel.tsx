
import React from 'react';
import type { Metrics } from '../types';
import { Card } from './ui/Card';
import { MetricsDisplay } from './MetricsDisplay';
import { CopyButton } from './ui/CopyButton';
import { DownloadButton } from './ui/DownloadButton';

interface OutputPanelProps {
  outputLlmcom: string;
  metrics: Metrics | null;
  isLoading: boolean;
  error: string | null;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ outputLlmcom, metrics, isLoading, error }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputLlmcom);
  };

  const downloadFile = (format: 'txt' | 'json') => {
    const content = format === 'json' ? JSON.stringify({ llmcom: outputLlmcom, metrics }, null, 2) : outputLlmcom;
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `llmcom_prompt.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Generating...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center justify-center h-full text-center text-red-500">
          <p>{error}</p>
        </div>
      );
    }
    if (!outputLlmcom) {
      return (
        <div className="flex items-center justify-center h-full text-center">
          <p className="text-gray-500 dark:text-gray-400">Your optimized prompt will appear here.</p>
        </div>
      );
    }
    return (
      <pre className="whitespace-pre-wrap break-words text-sm p-4 bg-gray-50 dark:bg-gray-800 rounded-md h-full font-mono">
        <code>{outputLlmcom}</code>
      </pre>
    );
  };

  return (
    <Card className="flex flex-col">
      <div className="p-6 flex-grow flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">✨ Output (LLMCOM Optimized)</h2>
        <div className="flex-grow min-h-[228px] relative">
          {renderContent()}
        </div>
      </div>
      {metrics && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <MetricsDisplay metrics={metrics} />
          <div className="mt-6 flex items-center gap-4">
             <CopyButton textToCopy={outputLlmcom}/>
             <DownloadButton onDownload={downloadFile} />
          </div>
        </div>
      )}
    </Card>
  );
};
