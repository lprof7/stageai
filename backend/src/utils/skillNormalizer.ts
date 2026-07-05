const synonymMap: Record<string, string> = {
  reactjs: 'react',
  'react.js': 'react',
  'react js': 'react',
  nodejs: 'node.js',
  'node js': 'node.js',
  'node.js': 'node.js',
  ts: 'typescript',
  js: 'javascript',
  'c#': 'csharp',
  'c++': 'cpp',
  '.net': 'dotnet',
  'flutter': 'flutter',
  django: 'django',
  laravel: 'laravel',
  springboot: 'spring boot',
  'spring boot': 'spring boot',
  vuejs: 'vue.js',
  'vue.js': 'vue.js',
  'vue js': 'vue.js',
  nextjs: 'next.js',
  'next.js': 'next.js',
  'next js': 'next.js',
  expressjs: 'express.js',
  'express.js': 'express.js',
  'express js': 'express.js',
};

export function normalizeSkill(skill: string): string {
  const trimmed = skill.trim().toLowerCase();
  const cleaned = trimmed.replace(/[^a-z0-9آ-ي._+#]/g, '');
  return synonymMap[cleaned] || cleaned;
}
