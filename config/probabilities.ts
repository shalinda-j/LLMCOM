// Precomputed token probabilities based on language model training data
export const TOKEN_PROBABILITIES: Record<string, number> = {
  // High frequency words (low entropy)
  'the': 0.070,
  'be': 0.063,
  'to': 0.055,
  'of': 0.052,
  'and': 0.050,
  'a': 0.043,
  'in': 0.041,
  'that': 0.033,
  'have': 0.026,
  'i': 0.025,
  'it': 0.024,
  'for': 0.023,
  'not': 0.022,
  'on': 0.021,
  'with': 0.020,
  'he': 0.019,
  'as': 0.018,
  'you': 0.017,
  'do': 0.016,
  'at': 0.015,
  'this': 0.014,
  'but': 0.013,
  'his': 0.012,
  'by': 0.011,
  'from': 0.010,
  'they': 0.009,
  'we': 0.008,
  'say': 0.007,
  'her': 0.006,
  'she': 0.005,
  'or': 0.004,
  'an': 0.003,
  'will': 0.002,
  'my': 0.001,
  
  // Medium frequency words
  'image': 0.0015,
  'photo': 0.0012,
  'portrait': 0.0008,
  'cinematic': 0.0006,
  'lighting': 0.0004,
  'professional': 0.0003,
  'woman': 0.0025,
  'man': 0.0020,
  'person': 0.0018,
  'character': 0.0010,
  'style': 0.0012,
  'background': 0.0008,
  'camera': 0.0006,
  'shot': 0.0005,
  'close': 0.0015,
  'up': 0.0030,
  'editorial': 0.0002,
  'slim': 0.0001,
  'young': 0.0020,
  
  // Code-related terms
  'function': 0.0008,
  'code': 0.0006,
  'algorithm': 0.0003,
  'python': 0.0004,
  'javascript': 0.0003,
  'implementation': 0.0002,
  'variable': 0.0005,
  'return': 0.0007,
  'class': 0.0006,
  'method': 0.0004,
  
  // LLM/AI terms
  'analysis': 0.0005,
  'model': 0.0008,
  'system': 0.0010,
  'data': 0.0012,
  'assistant': 0.0003,
  'prompt': 0.0002,
  'generate': 0.0004,
  'optimize': 0.0002,
  
  // Research terms
  'research': 0.0006,
  'study': 0.0008,
  'paper': 0.0005,
  'methodology': 0.0001,
  'findings': 0.0003,
  'conclusion': 0.0004,
  'experiment': 0.0003,
  
  // Support terms
  'customer': 0.0008,
  'support': 0.0006,
  'help': 0.0010,
  'issue': 0.0007,
  'problem': 0.0009,
  'solution': 0.0005,
  'error': 0.0004,
  'fix': 0.0006,
  
  // Default for unknown tokens
  'unknown': 1e-6
};

export function getTokenProbability(token: string): number {
  return TOKEN_PROBABILITIES[token.toLowerCase()] || TOKEN_PROBABILITIES['unknown'];
}
