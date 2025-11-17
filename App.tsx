
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { CostCalculator } from './components/CostCalculator';
import { TemplateGallery } from './components/TemplateGallery';
import { generateLlmcomPrompt } from './services/geminiService';
import type { Domain, Metrics, Template } from './types';

const App: React.FC = () => {
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [outputLlmcom, setOutputLlmcom] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<Domain>('auto');
  const [compressionLevel, setCompressionLevel] = useState<number>(2);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!inputPrompt.trim()) {
      setError('Input prompt cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setMetrics(null);
    setOutputLlmcom('');

    try {
      const result = await generateLlmcomPrompt(inputPrompt, selectedDomain, compressionLevel);
      setOutputLlmcom(result.llmcom);
      const newMetrics: Metrics = {
        originalTokens: result.originalTokens,
        compressedTokens: result.compressedTokens,
        reduction: result.compressionRatio || (100 - (result.compressedTokens / result.originalTokens) * 100),
        semanticEquivalence: result.semanticEquivalence,
        costSavings: result.costSavings,
      };
      setMetrics(newMetrics);
    } catch (err) {
      console.error(err);
      setError('Failed to generate LLMCOM prompt. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [inputPrompt, selectedDomain, compressionLevel]);

  const handleTemplateSelect = useCallback((template: Template) => {
    setInputPrompt(template.prompt);
    setSelectedDomain(template.domain);
    setOutputLlmcom('');
    setMetrics(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-400 dark:from-blue-400 dark:to-indigo-300">
            LLMCOM Prompt Generator
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Transform your plain English prompts into highly optimized, token-efficient LLMCOM format with the power of AI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <InputPanel
            inputPrompt={inputPrompt}
            setInputPrompt={setInputPrompt}
            selectedDomain={selectedDomain}
            setSelectedDomain={setSelectedDomain}
            compressionLevel={compressionLevel}
            setCompressionLevel={setCompressionLevel}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
          <OutputPanel
            outputLlmcom={outputLlmcom}
            metrics={metrics}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {metrics && <CostCalculator metrics={metrics} />}
        
        <TemplateGallery onTemplateSelect={handleTemplateSelect} />

      </main>
      <footer className="text-center py-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">© 2024 LLMCOM | MIT License</p>
      </footer>
    </div>
  );
};

export default App;
