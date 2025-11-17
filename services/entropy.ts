import { TOKEN_PROBABILITIES } from '../config/probabilities';

export function CALCULATE_ENTROPY(token: string): number {
  // Get probability from precomputed table
  let pToken = TOKEN_PROBABILITIES[token.toLowerCase()] || 1e-6;
  
  if (pToken <= 0) {
    pToken = 1e-6;
  }
  
  if (pToken >= 1) {
    pToken = 0.999;
  }
  
  // Shannon entropy formula
  const entropy = 
    -1 * pToken * Math.log2(pToken) - 
    (1 - pToken) * Math.log2(1 - pToken);
  
  return entropy;
}

export function calculateTotalEntropy(text: string): number {
  const tokens = text.split(/\s+/);
  let totalEntropy = 0;
  
  for (const token of tokens) {
    totalEntropy += CALCULATE_ENTROPY(token);
  }
  
  return tokens.length > 0 ? totalEntropy / tokens.length : 0;
}
