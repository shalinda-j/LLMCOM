import type { Domain } from '../types';

export const DOMAIN_KEYWORDS = {
  image_generation: [
    'portrait', 'photo', 'cinematic', 'camera', 'lighting', 'lens',
    'color', 'composition', 'shot', 'scene', 'visual', 'image',
    'picture', 'photograph', 'render', 'aesthetic', 'style',
    'editorial', 'close-up', 'wide', 'angle', 'bokeh', 'depth',
    'field', 'exposure', 'shadows', 'highlights', 'contrast'
  ],
  code_generation: [
    'function', 'code', 'implement', 'python', 'javascript', 'java',
    'variable', 'return', 'loop', 'array', 'parameter', 'algorithm',
    'class', 'method', 'debug', 'optimize', 'api', 'framework',
    'library', 'module', 'import', 'export', 'async', 'await'
  ],
  claude_code: [
    'claude', 'cursor', 'agent', 'refactor', 'review', 'commit',
    'branch', 'merge', 'test', 'coverage', 'lint', 'fix', 'bug',
    'feature', 'pr', 'pull', 'request', 'workflow', 'ci', 'cd',
    'deploy', 'build', 'security', 'audit', 'performance', 'optimize',
    'rule', 'compress', 'context', 'mcp', 'slash'
  ],
  llm_dev: [
    'analyze', 'summarize', 'explain', 'understand', 'extract',
    'data', 'insights', 'pattern', 'trend', 'anomaly', 'statistics',
    'report', 'findings', 'conclusion', 'assistant', 'llm', 'prompt',
    'chatbot', 'agent', 'model', 'training', 'inference'
  ],
  research: [
    'paper', 'study', 'research', 'methodology', 'findings', 'hypothesis',
    'conclusion', 'experiment', 'analysis', 'literature', 'citation',
    'academic', 'peer-review', 'publication', 'journal', 'conference',
    'dataset', 'survey', 'empirical', 'theoretical'
  ],
  support: [
    'customer', 'issue', 'problem', 'help', 'support', 'solution',
    'error', 'bug', 'fix', 'troubleshoot', 'ticket', 'complaint',
    'service', 'assistance', 'resolve', 'guide', 'tutorial'
  ]
};

function getKeywordSpecificity(keyword: string): number {
  const baseScore = Math.log(keyword.length + 1);
  const technicalTerms = ['cinematic', 'algorithm', 'methodology', 'troubleshoot', 'claude', 'cursor', 'refactor'];
  const technicalBonus = technicalTerms.includes(keyword) ? 0.5 : 0;
  return baseScore + technicalBonus;
}

export function DETECT_DOMAIN(text: string): Domain {
  const textLower = text.toLowerCase();
  const domainScores: Record<string, number> = {};
  
  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    let score = 0;
    let matches = 0;
    for (const keyword of keywords) {
      if (textLower.includes(keyword)) {
        matches++;
        score += getKeywordSpecificity(keyword);
      }
    }
    domainScores[domain] = matches > 0 ? (score / keywords.length) * Math.log(matches + 1) : 0;
  }
  
  let bestDomain: Domain = 'llm_dev';
  let bestScore = 0;
  for (const [domain, score] of Object.entries(domainScores)) {
    if (score > bestScore) {
      bestScore = score;
      bestDomain = domain as Domain;
    }
  }
  
  return bestScore < 0.3 ? 'llm_dev' : bestDomain;
}
