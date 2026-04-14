import type { Domain } from '../types';

function extractTokensByCategory(tokens: string[], category: string): string {
  const categoryKeywords: Record<string, string[]> = {
    style: ['cinematic', 'editorial', 'artistic', 'professional', 'casual', 'vintage'],
    subject: ['woman', 'man', 'person', 'character', 'portrait', 'figure'],
    pose: ['sitting', 'standing', 'walking', 'running', 'lying', 'leaning'],
    clothing: ['dress', 'suit', 'casual', 'formal', 'uniform', 'costume'],
    background: ['studio', 'outdoor', 'indoor', 'nature', 'urban', 'abstract'],
    camera: ['close-up', 'wide', 'medium', 'macro', 'telephoto', 'fisheye'],
    lighting: ['natural', 'studio', 'dramatic', 'soft', 'harsh', 'ambient'],
    language: ['python', 'javascript', 'java', 'typescript', 'go', 'rust'],
    task: ['implement', 'create', 'build', 'develop', 'design', 'optimize'],
    requirements: ['fast', 'secure', 'scalable', 'maintainable', 'efficient'],
    role: ['assistant', 'analyst', 'expert', 'advisor', 'consultant'],
    output: ['report', 'summary', 'analysis', 'recommendations', 'insights'],
    claude_task: ['refactor', 'review', 'fix', 'debug', 'test', 'implement', 'optimize'],
    claude_scope: ['file', 'module', 'component', 'function', 'class', 'project'],
    claude_focus: ['security', 'performance', 'coverage', 'lint', 'types', 'clean'],
    claude_action: ['commit', 'pr', 'deploy', 'build', 'merge', 'audit']
  };

  const keywords = categoryKeywords[category] || [];
  
  for (const token of tokens) {
    for (const keyword of keywords) {
      if (token.toLowerCase().includes(keyword)) {
        return token;
      }
    }
  }
  
  return tokens[0] || 'default';
}

export function APPLY_TEMPLATE(tokens: string[], domain: Domain): string {
  
  if (domain === 'image_generation') {
    const style = extractTokensByCategory(tokens, 'style');
    const subject = extractTokensByCategory(tokens, 'subject');
    const pose = extractTokensByCategory(tokens, 'pose');
    const clothing = extractTokensByCategory(tokens, 'clothing');
    const background = extractTokensByCategory(tokens, 'background');
    const camera = extractTokensByCategory(tokens, 'camera');
    const lighting = extractTokensByCategory(tokens, 'lighting');
    
    return [style, subject, pose, clothing, background, camera, lighting]
      .map(segment => segment || 'default')
      .join('|');
  }
  
  else if (domain === 'code_generation') {
    const lang = extractTokensByCategory(tokens, 'language');
    const task = extractTokensByCategory(tokens, 'task');
    const requirements = extractTokensByCategory(tokens, 'requirements');
    const edgeCases = tokens.find(t => t.includes('edge') || t.includes('error')) || 'standard';
    const optimization = tokens.find(t => t.includes('optim') || t.includes('perform')) || 'standard';
    const documentation = tokens.find(t => t.includes('doc') || t.includes('comment')) || 'docstring';
    
    return 'code[' + lang + ']|' + task + '|' + requirements + '|' + edgeCases + '|' + optimization + '|' + documentation;
  }
  
  else if (domain === 'claude_code') {
    const task = extractTokensByCategory(tokens, 'claude_task');
    const scope = extractTokensByCategory(tokens, 'claude_scope');
    const focus = extractTokensByCategory(tokens, 'claude_focus');
    const action = extractTokensByCategory(tokens, 'claude_action');
    const context = tokens.find(t => t.includes('file') || t.includes('@')) || '@src';
    const constraints = tokens.find(t => t.includes('limit') || t.includes('constrain')) || 'none';
    
    return 'agent[' + task + ']|' + scope + '|' + focus + '|' + action + '|' + context + '|' + constraints;
  }
  
  else if (domain === 'llm_dev') {
    const role = extractTokensByCategory(tokens, 'role');
    const task = extractTokensByCategory(tokens, 'task');
    const output = extractTokensByCategory(tokens, 'output');
    const constraints = tokens.find(t => t.includes('limit') || t.includes('constrain')) || 'none';
    
    return 'role:' + role + '|task:' + task + '|output:' + output + '|constraints:' + constraints;
  }
  
  else if (domain === 'research') {
    const methodology = tokens.find(t => t.includes('method') || t.includes('approach')) || 'empirical';
    const focus = tokens.find(t => t.includes('focus') || t.includes('study')) || 'analysis';
    const scope = tokens.find(t => t.includes('scope') || t.includes('range')) || 'comprehensive';
    const deliverable = extractTokensByCategory(tokens, 'output');
    
    return 'research[' + methodology + ']|' + focus + '|' + scope + '|' + deliverable;
  }
  
  else if (domain === 'support') {
    const issueType = tokens.find(t => t.includes('issue') || t.includes('problem')) || 'general';
    const priority = tokens.find(t => t.includes('urgent') || t.includes('critical')) || 'normal';
    const category = tokens.find(t => t.includes('technical') || t.includes('billing')) || 'general';
    const resolution = tokens.find(t => t.includes('fix') || t.includes('resolve')) || 'assist';
    
    return 'support[' + issueType + ']|' + priority + '|' + category + '|' + resolution;
  }
  
  return tokens.slice(0, 6).join('|');
}
