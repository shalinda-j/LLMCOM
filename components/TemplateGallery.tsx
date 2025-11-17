
import React from 'react';
import type { Template } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

const exampleTemplates: Template[] = [
  {
    id: 1,
    name: 'Portrait Photography',
    domain: 'image_generation',
    prompt: 'A cinematic close-up editorial portrait of a slim young adult woman with freckles, looking up with a slight smirk. She is wearing a black hijab, a stylish blazer, and a turtleneck. The background is a vibrant orange studio setting. Shot with an 85mm f/1.4 lens, using 2-tone lighting.',
    llmcom: 'ep-portrait|usr-face-young-slim-freckles|L↑-smirk|hijab+blazer+turtleneck-blk|orange-studio|85f4|2T'
  },
  {
    id: 2,
    name: 'Data Analysis Task',
    domain: 'llm_dev',
    prompt: 'You are an expert data scientist. Analyze the provided CSV data to identify key trends, anomalies, and generate actionable insights. The output should be a JSON object containing summary statistics and a list of findings.',
    llmcom: 'role:data-scientist|task:csv-analysis|output:json{stats+trends+anomalies+insights}|constraints:none'
  },
  {
    id: 3,
    name: 'Python Function Creation',
    domain: 'code_gen',
    prompt: 'Write a Python function that takes a list of integers, filters out the even numbers, and sorts the remaining odd numbers in descending order. Include type hints, a docstring, and handle edge cases like an empty list.',
    llmcom: 'code[6]python|filter-sort-desc|list[int]|type-hints+docstr|edge-empty|perf-opt'
  }
];

interface TemplateGalleryProps {
  onTemplateSelect: (template: Template) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onTemplateSelect }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">📚 Template Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exampleTemplates.map((template) => (
          <Card key={template.id} className="flex flex-col">
            <div className="p-6 flex-grow">
              <span className="text-xs uppercase font-semibold px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">{template.domain.replace('_', ' ')}</span>
              <h3 className="text-lg font-semibold mt-3 mb-2 text-gray-800 dark:text-white">{template.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 h-16 overflow-hidden">{template.prompt}</p>
              <pre className="text-xs p-2 bg-gray-100 dark:bg-gray-800 rounded font-mono whitespace-pre-wrap break-words"><code>{template.llmcom}</code></pre>
            </div>
            <div className="p-6 pt-0">
              <Button variant="secondary" onClick={() => onTemplateSelect(template)} className="w-full">
                Use Template
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
