import React from 'react';
import type { Domain } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { SparklesIcon } from './icons/SparklesIcon';

interface InputPanelProps {
  inputPrompt: string;
  setInputPrompt: (value: string) => void;
  selectedDomain: Domain;
  setSelectedDomain: (value: Domain) => void;
  compressionLevel: number;
  setCompressionLevel: (value: number) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  inputPrompt,
  setInputPrompt,
  selectedDomain,
  setSelectedDomain,
  compressionLevel,
  setCompressionLevel,
  onGenerate,
  isLoading,
}) => {
  const charCount = inputPrompt.length;
  const estimatedTokens = Math.ceil(inputPrompt.trim().split(/\s+/).filter(Boolean).length * 1.3);

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Input (Plain English)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Select Domain"
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value as Domain)}
            options={[
              { value: 'auto', label: 'Auto-Detect' },
              { value: 'claude_code', label: 'Claude Code / Cursor CLI' },
              { value: 'image_generation', label: 'Image Generation' },
              { value: 'llm_dev', label: 'AI/LLM Development' },
              { value: 'code_generation', label: 'Code Generation' },
              { value: 'research', label: 'Research Paper' },
              { value: 'support', label: 'Customer Support' },
            ]}
          />
          
          <Select
            label="Compression Level"
            value={compressionLevel.toString()}
            onChange={(e) => setCompressionLevel(parseInt(e.target.value))}
            options={[
              { value: '1', label: 'Level 1 - Syntactic (Conservative)' },
              { value: '2', label: 'Level 2 - Semantic (Balanced)' },
              { value: '3', label: 'Level 3 - Aggressive (Maximum)' },
            ]}
          />
        </div>

        <div className="mt-4">
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="A cinematic close-up editorial portrait of a slim young adult woman..."
            className="w-full h-48 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>{charCount} characters</span>
            <span>~{inputPrompt.trim() ? estimatedTokens : 0} tokens</span>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <Button onClick={onGenerate} disabled={isLoading || !inputPrompt} className="flex-grow">
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5 mr-2" />
                Generate LLMCOM
              </>
            )}
          </Button>
          <Button variant="secondary" onClick={() => setInputPrompt('')} disabled={isLoading}>
            Clear
          </Button>
        </div>
      </div>
    </Card>
  );
};
