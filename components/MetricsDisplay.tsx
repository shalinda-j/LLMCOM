
import React from 'react';
import type { Metrics } from '../types';

interface MetricsDisplayProps {
  metrics: Metrics;
}

const MetricCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
  <div className="flex-1 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">{title}</p>
    <p className={`text-xl font-bold ${color}`}>{value}</p>
  </div>
);

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ metrics }) => {
  return (
    <div>
      <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">📊 Performance Metrics</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <MetricCard title="Original Tokens" value={metrics.originalTokens.toString()} color="text-gray-700 dark:text-gray-300" />
        <MetricCard title="Compressed Tokens" value={metrics.compressedTokens.toString()} color="text-green-600 dark:text-green-400" />
        <MetricCard title="Reduction" value={`${metrics.reduction.toFixed(1)}%`} color="text-blue-600 dark:text-blue-400" />
        
        {metrics.semanticEquivalence && (
          <MetricCard 
            title="Semantic Equiv." 
            value={`${(metrics.semanticEquivalence * 100).toFixed(1)}%`} 
            color="text-purple-600 dark:text-purple-400" 
          />
        )}
        
        {metrics.costSavings && (
          <>
            <MetricCard 
              title="Cost/Request" 
              value={`$${metrics.costSavings.costPerRequest.toFixed(6)}`} 
              color="text-emerald-600 dark:text-emerald-400" 
            />
            <MetricCard 
              title="Tokens Saved" 
              value={metrics.costSavings.tokensSaved.toString()} 
              color="text-orange-600 dark:text-orange-400" 
            />
          </>
        )}
      </div>
      
      {metrics.costSavings && (
        <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">💰 Cost Savings Projection</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Daily:</span>
              <span className="ml-2 font-semibold text-green-700 dark:text-green-300">
                ${metrics.costSavings.dailySavings?.toFixed(2) || '0.00'}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Monthly:</span>
              <span className="ml-2 font-semibold text-green-700 dark:text-green-300">
                ${metrics.costSavings.monthlySavings?.toFixed(2) || '0.00'}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Annual:</span>
              <span className="ml-2 font-semibold text-green-700 dark:text-green-300">
                ${metrics.costSavings.annualSavings?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
