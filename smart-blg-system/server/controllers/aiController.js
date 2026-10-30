const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

const TYPOS = {
  teh: 'the', recieve: 'receive', definately: 'definitely', adress: 'address',
  seperate: 'separate', occured: 'occurred', wich: 'which', becuase: 'because',
  untill: 'until', thier: 'their', goverment: 'government', enviroment: 'environment',
};
const STOP = new Set('this that with from have will your their about which would there these those been were what when where also more than then them they into only some such very just like over'.split(' '));
const CATEGORY_WORDS = {
  Education: ['student', 'school', 'university', 'learning', 'teacher', 'education', 'course', 'study'],
  Technology: ['technology', 'software', 'computer', 'internet', 'digital', 'data', 'information', 'system', 'code', 'artificial'],
  Health: ['health', 'medical', 'disease', 'doctor', 'hospital', 'fitness', 'nutrition', 'mental'],
  News: ['government', 'election', 'announced', 'minister', 'today', 'breaking', 'report'],
  Business: ['business', 'market', 'company', 'finance', 'economy', 'investment', 'customer', 'sales'],
};

const sentences = (t) => t.split(/(?<=[.!?።])\s+/).map((s) => s.trim()).filter(Boolean);
const words = (t) => t.match(/[\p{L}']+/gu) || [];

// POST /api/ai/grammar  { text }
exports.checkGrammar = asyncHandler(async (req, res) => {
  const text = req.body.text || '';
  if (!text.trim()) return res.status(400).json({ message: 'Text is required' });

  const issues = [];
  if (/ {2,}/.test(text)) issues.push({ type: 'spacing', message: 'Multiple spaces found' });
  (text.match(/\b(\w+)\s+\1\b/gi) || []).forEach((m) =>
    issues.push({ type: 'repeated', message: `Repeated word: "${m}"` })
  );
  Object.keys(TYPOS).forEach((t) => {
    if (new RegExp(`\\b${t}\\b`, 'i').test(text))
      issues.push({ type: 'spelling', message: `"${t}" → "${TYPOS[t]}"` });
  });
  sentences(text).forEach((s) => {
    if (/^[a-z]/.test(s)) issues.push({ type: 'capital', message: `Sentence should start with a capital: "${s.slice(0, 30)}..."` });
    if (words(s).length > 35) issues.push({ type: 'long', message: `Very long sentence: "${s.slice(0, 40)}..."` });
  });
  if (/[,;:][^\s\d]/.test(text)) issues.push({ type: 'spacing', message: 'Missing space after punctuation' });
  if (!/[.!?።]\s*$/.test(text.trim())) issues.push({ type: 'ending', message: 'Text does not end with punctuation' });

  // Auto-corrected version
  let fixed = text.replace(/ {2,}/g, ' ').replace(/\b(\w+)\s+\1\b/gi, '$1');
  Object.keys(TYPOS).forEach((t) => (fixed = fixed.replace(new RegExp(`\\b${t}\\b`, 'gi'), TYPOS[t])));
  fixed = fixed.replace(/([,;:])(?=[^\s\d])/g, '$1 ');
  fixed = fixed.replace(/(^|[.!?]\s+)([a-z])/g, (m, a, b) => a + b.toUpperCase());
  if (!/[.!?።]\s*$/.test(fixed.trim())) fixed = fixed.trim() + '.';

  res.json({ issues, corrected: fixed, wordCount: words(text).length });
});

// POST /api/ai/suggest  { title, content }
exports.suggest = asyncHandler(async (req, res) => {
  const { title = '', content = '' } = req.body;
  if (!content.trim()) return res.status(400).json({ message: 'Content is required' });

  const all = words(content);
  const freq = {};
  all.map((w) => w.toLowerCase())
    .filter((w) => w.length > 3 && !STOP.has(w))
    .forEach((w) => (freq[w] = (freq[w] || 0) + 1));
  const keywords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([w]) => w);

  const sents = sentences(content);
  const summary = sents.slice(0, 2).join(' ').slice(0, 250);

  const cap = (w = '') => w.charAt(0).toUpperCase() + w.slice(1);
  const titles = [
    sents[0] ? sents[0].replace(/[.!?።]$/, '').slice(0, 70) : null,
    keywords[0] ? `Everything You Need to Know About ${cap(keywords[0])}` : null,
    keywords[1] ? `${cap(keywords[0])} and ${cap(keywords[1])}: A Complete Guide` : null,
  ].filter(Boolean);

  // Category suggestion
  const lower = `${title} ${content}`.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const [name, list] of Object.entries(CATEGORY_WORDS)) {
    const score = list.reduce((s, w) => s + (lower.includes(w) ? 1 : 0), 0);
    if (score > bestScore) { best = name; bestScore = score; }
  }
  let category = null;
  if (best) {
    const [rows] = await pool.query('SELECT * FROM categories WHERE category_name = ?', [best]);
    category = rows[0] || null;
  }

  res.json({
    summary,
    keywords,
    titleSuggestions: titles,
    suggestedCategory: category,
    readingTimeMinutes: Math.max(1, Math.ceil(all.length / 200)),
    wordCount: all.length,
  });
});