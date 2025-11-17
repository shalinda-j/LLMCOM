import type { ICostSavings } from '../types';

interface CostCalculation extends ICostSavings {
  dailySavings: number;
  monthlySavings: number;
  annualSavings: number;
  tokensSavedDaily: number;
  compressionRatio: number;
  costPerRequestSaved: number;
}

export function CALCULATE_COST_SAVINGS(
  originalTokens: number,
  compressedTokens: number,
  requestsPerDay: number = 1000
): CostCalculation {
  
  // Pricing (OpenAI GPT-4 - $30 per 1M input tokens)
  const pricePerMillion = 30;
  const pricePerToken = pricePerMillion / 1_000_000;
  
  // Calculate daily token usage
  const originalTokensDaily = originalTokens * requestsPerDay;
  const compressedTokensDaily = compressedTokens * requestsPerDay;
  
  // Calculate daily costs
  const costOriginalDaily = originalTokensDaily * pricePerToken;
  const costCompressedDaily = compressedTokensDaily * pricePerToken;
  
  // Calculate savings
  const savingsDaily = costOriginalDaily - costCompressedDaily;
  const savingsMonthly = savingsDaily * 30;
  const savingsAnnual = savingsDaily * 365;
  
  const tokensSavedDaily = originalTokensDaily - compressedTokensDaily;
  const tokensSaved = originalTokens - compressedTokens;
  const compressionRatio = (tokensSaved) / originalTokens;
  const costPerRequest = tokensSaved * pricePerToken;
  
  return {
    tokensOriginal: originalTokens,
    tokensCompressed: compressedTokens,
    tokensSaved,
    costPerRequest: parseFloat(costPerRequest.toFixed(6)),
    dailySavings: parseFloat(savingsDaily.toFixed(2)),
    monthlySavings: parseFloat(savingsMonthly.toFixed(2)),
    annualSavings: parseFloat(savingsAnnual.toFixed(2)),
    tokensSavedDaily: Math.ceil(tokensSavedDaily),
    compressionRatio: parseFloat((compressionRatio * 100).toFixed(1)),
    costPerRequestSaved: parseFloat(costPerRequest.toFixed(6))
  };
}
