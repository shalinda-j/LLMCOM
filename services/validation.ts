import type { IValidationResult } from '../types';
import { CALCULATE_SEMANTIC_EQUIVALENCE } from './semanticEquivalence';

export async function VALIDATE_COMPRESSION(
  original: string,
  compressed: string,
  semanticEquivalence: number
): Promise<IValidationResult> {
  
  // Check 1: Semantic Equivalence Threshold
  if (semanticEquivalence < 0.85) {
    return {
      valid: false,
      error: 'Semantic equivalence below 85%',
      recommendation: 'Reduce compression level or improve algorithm',
      semanticEquivalence
    };
  }
  
  // Check 2: Minimum Compression Requirement
  const originalTokens = original.split(/\s+/).length;
  const compressedTokens = compressed.split(/\||\s+/).length;
  const tokenPreservation = compressedTokens / originalTokens;
  
  if (tokenPreservation > 0.95) {
    return {
      valid: false,
      error: 'Insufficient compression achieved (<5%)',
      recommendation: 'Increase compression level or check algorithm parameters',
      tokenPreservation: parseFloat((tokenPreservation * 100).toFixed(1))
    };
  }
  
  // Check 3: Format Validity
  if (!isValidLLMCOMFormat(compressed)) {
    return {
      valid: false,
      error: 'Invalid LLMCOM format structure',
      recommendation: 'Check template application and formatting rules'
    };
  }
  
  // Check 4: Content Preservation
  const keyTermsPreserved = checkKeyTermPreservation(original, compressed);
  if (keyTermsPreserved < 0.7) {
    return {
      valid: false,
      error: 'Critical content loss detected',
      recommendation: 'Preserve more key terms in compression'
    };
  }
  
  // Check 5: Roundtrip Verification (simplified)
  const decodedText = decodeLLMCOM(compressed);
  const roundtripEquivalence = await CALCULATE_SEMANTIC_EQUIVALENCE(original, decodedText);
  
  if (roundtripEquivalence < 0.75) {
    return {
      valid: false,
      error: 'Roundtrip decoding loses significant information',
      recommendation: 'Improve decoder or reduce compression aggressiveness'
    };
  }
  
  // All checks passed
  const qualityScore = (
    semanticEquivalence * 0.4 +
    (1 - tokenPreservation) * 0.3 +
    keyTermsPreserved * 0.2 +
    roundtripEquivalence * 0.1
  );
  
  return {
    valid: true,
    semanticEquivalence: parseFloat(semanticEquivalence.toFixed(3)),
    tokenPreservation: parseFloat((tokenPreservation * 100).toFixed(1)),
    qualityScore: parseFloat(qualityScore.toFixed(3))
  };
}

function isValidLLMCOMFormat(text: string): boolean {
  // Check for required structural elements
  const hasDelimiters = text.includes('|') || text.includes(':');
  const hasContent = text.trim().length > 0;
  const notTooLong = text.length < 1000; // Reasonable upper bound
  const notTooShort = text.length > 3; // Minimum viable content
  
  return hasDelimiters && hasContent && notTooLong && notTooShort;
}

function checkKeyTermPreservation(original: string, compressed: string): number {
  const originalLower = original.toLowerCase();
  const compressedLower = compressed.toLowerCase();
  
  // Extract key terms from original
  const keyTerms = extractImportantTerms(originalLower);
  
  if (keyTerms.length === 0) return 1.0;
  
  // Count preserved terms
  let preservedCount = 0;
  for (const term of keyTerms) {
    if (compressedLower.includes(term) || 
        compressedLower.includes(term.substring(0, 3)) || // Abbreviated form
        hasSemanticMatch(term, compressedLower)) {
      preservedCount++;
    }
  }
  
  return preservedCount / keyTerms.length;
}

function extractImportantTerms(text: string): string[] {
  const words = text.split(/\s+/);
  
  // Priority terms that should be preserved
  const importantPatterns = [
    /portrait|photo|image|picture/,
    /cinematic|professional|editorial/,
    /woman|man|person|character/,
    /function|code|algorithm|implementation/,
    /analysis|research|study|report/,
    /customer|support|issue|problem/
  ];
  
  return words.filter(word => 
    word.length > 3 && 
    importantPatterns.some(pattern => pattern.test(word))
  );
}

function hasSemanticMatch(term: string, compressed: string): boolean {
  // Simple semantic matching for common abbreviations
  const semanticMappings: Record<string, string[]> = {
    'portrait': ['port', 'face', 'head'],
    'professional': ['pro', 'expert'],
    'cinematic': ['cine', 'film', 'movie'],
    'function': ['func', 'def', 'method'],
    'analysis': ['ana', 'eval', 'study'],
    'customer': ['client', 'user'],
    'problem': ['issue', 'bug', 'error']
  };
  
  const mappings = semanticMappings[term] || [];
  return mappings.some(mapping => compressed.includes(mapping));
}

function decodeLLMCOM(llmcom: string): string {
  // Simple decoder: expand abbreviated format back to readable form
  const segments = llmcom.split('|');
  
  // Basic expansion rules
  const expansions: Record<string, string> = {
    'port': 'portrait',
    'pro': 'professional',
    'cine': 'cinematic',
    'wmn': 'woman',
    'char': 'character',
    'ana': 'analysis',
    'dev': 'development',
    'func': 'function',
    'impl': 'implementation'
  };
  
  return segments
    .map(segment => {
      // Remove prefixes like "role:", "task:", etc.
      const cleanSegment = segment.replace(/^[a-z]+:/, '');
      return expansions[cleanSegment] || cleanSegment;
    })
    .join(' ')
    .replace(/-/g, ' ')
    .trim();
}
