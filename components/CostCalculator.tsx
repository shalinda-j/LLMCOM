
import React, { useState, useMemo } from 'react';
import type { Metrics } from '../types';
import { Card } from './ui/Card';
import { Slider } from './ui/Slider';
import { CALCULATE_COST_SAVINGS } from '../services/costCalculator';

interface CostCalculatorProps {
  metrics: Metrics;
}

export const CostCalculator: React.FC<CostCalculatorProps> = ({ metrics }) => {
  const [requestsPerDay, setRequestsPerDay] = useState<number>(1000);

  const savings = useMemo(() => {
    // Use the comprehensive cost calculation algorithm
    const result = CALCULATE_COST_SAVINGS(
      metrics.originalTokens,
      metrics.compressedTokens,
      requestsPerDay
    );
    
    return {
      daily: result.dailySavings,
      monthly: result.monthlySavings,
      annual: result.annualSavings,
      tokensSavedDaily: result.tokensSavedDaily,
      compressionRatio: result.compressionRatio,
      costPerRequest: result.costPerRequest
    };
  }, [metrics, requestsPerDay]);

  return (
    <Card className="mb-12">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">💰 Cost Savings Calculator</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <label htmlFor="requests" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Requests per day: <span className="font-bold text-blue-600 dark:text-blue-400">{requestsPerDay.toLocaleString()}</span>
            </label>
            <Slider
              id="requests"
              min={100}
              max={100000}
              step={100}
              value={requestsPerDay}
              onChange={(e) => setRequestsPerDay(Number(e.target.value))}
            />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Daily Savings</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">${savings.daily.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Savings</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">${savings.monthly.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Annual Savings</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">${savings.annual.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-blue-600 dark:text-blue-400 font-semibold">Tokens Saved Daily</p>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{savings.tokensSavedDaily.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <p className="text-purple-600 dark:text-purple-400 font-semibold">Cost per Request</p>
                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">${savings.costPerRequest.toFixed(6)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
