import { calculateTotalEntropy } from './entropy';

// Simplified semantic equivalence calculation
// In a production environment, this would use actual embeddings
export async function CALCULATE_SEMANTIC_EQUIVALENCE(
  original: string,
  compressed: string
): Promise<number> {
  
  // Method 1: Jaccard similarity (word overlap)
  const originalWords = new Set(original.toLowerCase().split(/\s+/));
  const compressedWords = new Set(compressed.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...originalWords].filter(x => compressedWords.has(x)));
  const union = new Set([...originalWords, ...compressedWords]);
  
  const jaccardSimilarity = intersection.size / union.size;
  
  // Method 2: Length ratio preservation
  const lengthRatio = Math.min(compressed.length, original.length) / 
                     Math.max(compressed.length, original.length);
  
  // Method 3: Entropy preservation
  const entropyOriginal = calculateTotalEntropy(original);
  const entropyCompressed = calculateTotalEntropy(compressed);
  
  const entropyPreservation = 
    entropyOriginal > 0 ? Math.min(1, entropyCompressed / entropyOriginal) : 0.5;
  
  // Method 4: Key term preservation
  const keyTerms = extractKeyTerms(original);
  const preservedTerms = keyTerms.filter(term => 
    compressed.toLowerCase().includes(term.toLowerCase())
  );
  const keyTermPreservation = keyTerms.length > 0 ? 
    preservedTerms.length / keyTerms.length : 1;
  
  // Weighted combination
  const semanticEquivalence = (
    jaccardSimilarity * 0.3 +
    lengthRatio * 0.2 +
    entropyPreservation * 0.3 +
    keyTermPreservation * 0.2
  );
  
  return Math.min(1.0, Math.max(0, semanticEquivalence));
}

function extractKeyTerms(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  
  // Filter for important terms (nouns, adjectives, technical terms)
  const keyTermPatterns = [
    /^[a-z]{4,}$/,  // Words 4+ characters
    /portrait|photo|image|cinematic|professional/,
    /function|code|algorithm|python|javascript/,
    /analysis|research|study|data|model/,
    /customer|support|issue|problem|solution/
  ];
  
  return words.filter(word => 
    keyTermPatterns.some(pattern => pattern.test(word))
  ).slice(0, 10); // Top 10 key terms
}

// Simplified cosine similarity for vectors
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  
  return dotProduct / (magnitudeA * magnitudeB);
}
