import type { ModaNode } from '../types';
import { ALL_NODES } from '../data/model';

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

export interface SearchHit {
  node: ModaNode;
  score: number;
  /** Character ranges in `node.name` that matched. */
  ranges: [number, number][];
}

function scoreName(name: string, query: string): { score: number; ranges: [number, number][] } | null {
  const target = norm(name);
  if (!target) return null;
  const raw = name.toLowerCase();
  const idx = raw.indexOf(query);
  if (idx >= 0) {
    // exact substring, boosted when it starts the name or matches a whole word
    let score = 60;
    if (idx === 0) score += 40;
    if (target === query) score += 60;
    else if (/^[^a-z0-9]/.test(raw.slice(idx + query.length, idx + query.length + 1))) score += 20;
    return { score, ranges: [[idx, idx + query.length]] };
  }

  // subsequence match: "crm" -> "Customer Relationship Management"
  let si = 0;
  let first = -1;
  let last = -1;
  let gaps = 0;
  for (let i = 0; i < raw.length && si < query.length; i += 1) {
    if (raw[i] === query[si]) {
      if (first < 0) first = i;
      else if (i - last > 1) gaps += 1;
      last = i;
      si += 1;
    }
  }
  if (si < query.length) return null;
  const span = last - first + 1;
  const density = query.length / span;
  const score = Math.round(18 * density + (first === 0 ? 12 : 0) + Math.min(12, span - query.length));
  return { score, ranges: [[first, last + 1]] };
}

export function search(query: string, limit = 40): SearchHit[] {
  const q = norm(query);
  if (q.length < 2) return [];

  const hits: SearchHit[] = [];
  for (const node of ALL_NODES) {
    const direct = scoreName(node.name, q);
    if (direct) {
      hits.push({ node, ...direct });
      continue;
    }
    // fall back to matching against the full breadcrumb
    const crumb = node.path.join(' / ').toLowerCase();
    if (crumb.includes(q)) {
      hits.push({ node, score: 14, ranges: [] });
    }
  }

  hits.sort((a, b) => b.score - a.score || a.node.name.length - b.node.name.length);
  return hits.slice(0, limit);
}