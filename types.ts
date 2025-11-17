
export type Domain = 'image_generation' | 'llm_dev' | 'code_generation' | 'research' | 'support' | 'auto';

export interface IToken {
  token: string;
  entropy: number;
  frequency: number;
  tfIdf: number;
  weight: number;
  importanceScore: number;
  shouldRemove: boolean;
  isAbbreviated: boolean;
}

export interface ICostSavings {
  tokensOriginal: number;
  tokensCompressed: number;
  tokensSaved: number;
  costPerRequest: number;
  dailySavings?: number;
  monthlySavings?: number;
  annualSavings?: number;
  tokensSavedDaily?: number;
  compressionRatio?: number;
  costPerRequestSaved?: number;
}

export interface IValidationResult {
  valid: boolean;
  error?: string;
  recommendation?: string;
  semanticEquivalence?: number;
  tokenPreservation?: number;
  qualityScore?: number;
}

export interface ICompressionResult {
  llmcomFormat: string;
  originalTokens: number;
  compressedTokens: number;
  compressionRatio: number;
  semanticEquivalence: number;
  costSavings: ICostSavings;
  validation: IValidationResult;
  domain: Domain;
  compressionLevel: number;
  processingTimeMs: number;
}

export interface Metrics {
  originalTokens: number;
  compressedTokens: number;
  reduction: number;
  semanticEquivalence?: number;
  costSavings?: ICostSavings;
}

export interface Template {
  id: number;
  name: string;
  domain: Domain;
  prompt: string;
  llmcom: string;
  description?: string;
  compressionRatio?: number;
}

export interface LlmcomGenerationResult {
  llmcom: string;
  originalTokens: number;
  compressedTokens: number;
  compressionRatio?: number;
  semanticEquivalence?: number;
  costSavings?: ICostSavings;
  validation?: IValidationResult;
  domain?: Domain;
  processingTimeMs?: number;
}
