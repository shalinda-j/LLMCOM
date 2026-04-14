import type { IToken, ICompressionResult, Domain } from '../types';
import { DETECT_DOMAIN } from './domainDetection';
import { CALCULATE_ENTROPY } from './entropy';
import { APPLY_TEMPLATE } from './templateEngine';
import { CALCULATE_SEMANTIC_EQUIVALENCE } from './semanticEquivalence';
import { VALIDATE_COMPRESSION } from './validation';
import { CALCULATE_COST_SAVINGS } from './costCalculator';
import { getTokenProbability } from '../config/probabilities';

const DOMAIN_WEIGHTS: Record<Domain, Record<string, number>> = {
  image_generation: {
    'portrait': 0.9, 'cinematic': 0.8, 'professional': 0.7, 'lighting': 0.8,
    'woman': 0.6, 'man': 0.6, 'character': 0.7, 'style': 0.6, 'photo': 0.8
  },
  code_generation: {
    'function': 0.9, 'algorithm': 0.8, 'implementation': 0.7, 'python': 0.6,
    'javascript': 0.6, 'code': 0.8, 'method': 0.7, 'class': 0.7
  },
  claude_code: {
    'refactor': 0.95, 'review': 0.9, 'fix': 0.85, 'bug': 0.8,
    'test': 0.8, 'coverage': 0.75, 'lint': 0.7, 'commit': 0.7,
    'security': 0.85, 'audit': 0.8, 'performance': 0.75, 'optimize': 0.7,
    'feature': 0.8, 'branch': 0.6, 'merge': 0.6, 'deploy': 0.7
  },
  llm_dev: {
    'analysis': 0.8, 'model': 0.7, 'assistant': 0.6, 'prompt': 0.8,
    'data': 0.6, 'system': 0.5, 'generate': 0.7
  },
  research: {
    'study': 0.8, 'research': 0.9, 'methodology': 0.7, 'findings': 0.8,
    'analysis': 0.7, 'paper': 0.6, 'experiment': 0.7
  },
  support: {
    'customer': 0.7, 'issue': 0.8, 'problem': 0.8, 'solution': 0.9,
    'help': 0.6, 'support': 0.7, 'fix': 0.8
  },
  auto: {}
};

function loadDomainWeights(domain: Domain): Record<string, number> {
  return DOMAIN_WEIGHTS[domain] || {};
}

function getFrequency(token: string): number {
  const prob = getTokenProbability(token);
  return Math.max(0.1, 1 - prob);
}

function calculateTfIdf(token: string, domain: Domain): number {
  const termFreq = getTokenProbability(token);
  const domainWeight = loadDomainWeights(domain)[token] || 0.5;
  return termFreq * domainWeight * 10;
}

function canAbbreviate(token: string): boolean {
  const abbreviatableTerms = [
    'portrait', 'professional', 'cinematic', 'character', 'implementation',
    'function', 'analysis', 'development', 'generation', 'documentation',
    'refactor', 'review', 'security', 'performance', 'optimize'
  ];
  return abbreviatableTerms.some(term => token.toLowerCase().includes(term)) && token.length > 4;
}

function getAbbreviation(token: string, domain: Domain): string {
  const abbreviations: Record<string, string> = {
    'portrait': 'port', 'professional': 'pro', 'cinematic': 'cine',
    'character': 'char', 'implementation': 'impl', 'function': 'func',
    'analysis': 'ana', 'development': 'dev', 'generation': 'gen',
    'documentation': 'doc', 'requirements': 'req', 'optimization': 'opt',
    'refactor': 'refac', 'review': 'rev', 'security': 'sec',
    'performance': 'perf', 'coverage': 'cov', 'feature': 'feat'
  };
  const lowerToken = token.toLowerCase();
  for (const [full, abbr] of Object.entries(abbreviations)) {
    if (lowerToken.includes(full)) return abbr;
  }
  return token.length > 4 ? token.substring(0, 4) : token;
}

export async function LLMCOM_ENCODE(
  text: string,
  domain: Domain,
  compressionLevel: number = 2
): Promise<ICompressionResult> {
  const startTime = Date.now();
  
  let resolvedDomain = domain;
  if (domain === 'auto') {
    resolvedDomain = DETECT_DOMAIN(text);
  }
  
  const tokens = text.trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
    
  const originalTokenCount = tokens.length * 1.3;
  const domainWeights = loadDomainWeights(resolvedDomain);
  
  const tokenAnalysis: IToken[] = tokens.map(token => {
    const entropy = CALCULATE_ENTROPY(token);
    const frequency = getFrequency(token);
    const tfIdf = calculateTfIdf(token, resolvedDomain);
    const weight = domainWeights[token] || 0.5;
    const importanceScore = (entropy * 0.4) + (frequency * 0.3) + (tfIdf * 0.2) + (weight * 0.1);
    return { token, entropy, frequency, tfIdf, weight, importanceScore, shouldRemove: false, isAbbreviated: false };
  });
  
  if (compressionLevel >= 1) {
    const syntacticThreshold = 3.0;
    const syntacticTokens = ['the', 'a', 'an', 'is', 'are', 'with', 'of', 'to', 'in', 'on', 'at'];
    tokenAnalysis.forEach(tokenInfo => {
      if (syntacticTokens.includes(tokenInfo.token.toLowerCase()) && tokenInfo.entropy < syntacticThreshold) {
        tokenInfo.shouldRemove = true;
      }
    });
  }
  
  if (compressionLevel >= 2) {
    const semanticThreshold = 4.5;
    tokenAnalysis.forEach(tokenInfo => {
      if (!tokenInfo.shouldRemove && tokenInfo.importanceScore < semanticThreshold) {
        tokenInfo.shouldRemove = true;
      }
    });
  }
  
  if (compressionLevel >= 3) {
    const targetCompression = 0.85;
    let currentCompression = tokenAnalysis.filter(t => t.shouldRemove).length / tokens.length;
    if (currentCompression < targetCompression) {
      const sortedTokens = [...tokenAnalysis]
        .filter(t => !t.shouldRemove)
        .sort((a, b) => a.importanceScore - b.importanceScore);
      for (const tokenInfo of sortedTokens) {
        if (currentCompression >= targetCompression) break;
        if (canAbbreviate(tokenInfo.token)) {
          tokenInfo.isAbbreviated = true;
          currentCompression = tokenAnalysis.filter(t => t.shouldRemove).length / tokens.length;
        }
      }
    }
  }
  
  const compressedTokens = tokenAnalysis
    .filter(t => !t.shouldRemove)
    .map(t => t.isAbbreviated ? getAbbreviation(t.token, resolvedDomain) : t.token);
  
  const llmcomFormat = APPLY_TEMPLATE(compressedTokens, resolvedDomain);
  const compressedTokenCount = compressedTokens.length * 1.1;
  const compressionRatio = (originalTokenCount - compressedTokenCount) / originalTokenCount;
  const semanticEquivalence = await CALCULATE_SEMANTIC_EQUIVALENCE(text, llmcomFormat);
  const costSavings = CALCULATE_COST_SAVINGS(Math.ceil(originalTokenCount), Math.ceil(compressedTokenCount));
  const validation = await VALIDATE_COMPRESSION(text, llmcomFormat, semanticEquivalence);
  
  if (!validation.valid && compressionLevel > 1) {
    console.warn('Validation failed. Retrying with lower compression.');
    return LLMCOM_ENCODE(text, resolvedDomain, compressionLevel - 1);
  }
  
  const processingTime = Date.now() - startTime;
  
  return {
    llmcomFormat,
    originalTokens: Math.ceil(originalTokenCount),
    compressedTokens: Math.ceil(compressedTokenCount),
    compressionRatio: parseFloat((compressionRatio * 100).toFixed(1)),
    semanticEquivalence: parseFloat(semanticEquivalence.toFixed(3)),
    costSavings,
    validation,
    domain: resolvedDomain,
    compressionLevel,
    processingTimeMs: processingTime
  };
}
