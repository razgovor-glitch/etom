import type { FrameworkId, ModaNode } from '../types';
import { BY_FRAMEWORK, ALL_NODES } from '../data/model';
import { CONCEPTS, CONCEPT_BLURBS_RU, STOPWORDS, type ConceptLink } from '../data/crossLinks';

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

/** Exact -> prefix -> substring, best match first. */
export function resolveName(fw: FrameworkId | string, candidates: string[]): ModaNode | undefined {
  const pool = BY_FRAMEWORK.get(fw);
  if (!pool || !pool.length) return undefined;

  for (const candidate of candidates) {
    const target = norm(candidate);
    const hit = pool.find((n) => norm(n.name) === target);
    if (hit) return hit;
  }
  for (const candidate of candidates) {
    const target = norm(candidate);
    const hit = pool.find((n) => norm(n.name).startsWith(target));
    if (hit) return hit;
  }
  for (const candidate of candidates) {
    const target = norm(candidate);
    const hit = pool.find((n) => norm(n.name).includes(target));
    if (hit) return hit;
  }
  return undefined;
}

export interface ResolvedConcept extends ConceptLink {
  /** Russian explanation, when one exists for the concept. */
  blurbRu?: string;
  resolved: Partial<Record<FrameworkId, ModaNode>>;
  /** Concepts whose name could not be matched anywhere are still listed. */
  matchedCount: number;
}

let conceptCache: ResolvedConcept[] | null = null;

export function resolvedConcepts(): ResolvedConcept[] {
  if (conceptCache) return conceptCache;
  conceptCache = CONCEPTS.map((concept) => {
    const resolved: Partial<Record<FrameworkId, ModaNode>> = {};
    for (const [fw, names] of Object.entries(concept.targets)) {
      const hit = resolveName(fw as FrameworkId, names ?? []);
      if (hit) resolved[fw as FrameworkId] = hit;
    }
    return {
      ...concept,
      blurbRu: CONCEPT_BLURBS_RU[concept.concept],
      resolved,
      matchedCount: Object.keys(resolved).length,
    };
  });
  return conceptCache;
}

export function conceptsForNode(node: ModaNode): ResolvedConcept[] {
  const nodeId = node.id;
  return resolvedConcepts().filter((c) =>
    Object.values(c.resolved).some((r) => r && r.id === nodeId),
  );
}

/* ------------------------------------------------------------------ */
/* Automatic name-similarity linking                                   */
/* ------------------------------------------------------------------ */

function tokensOf(name: string): string[] {
  return norm(name)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 4 && !STOPWORDS.has(t));
}

let tokenIndex: Map<string, ModaNode[]> | null = null;

function getTokenIndex(): Map<string, ModaNode[]> {
  if (tokenIndex) return tokenIndex;
  const index = new Map<string, ModaNode[]>();
  for (const node of ALL_NODES) {
    for (const token of tokensOf(node.name)) {
      const list = index.get(token);
      if (list) list.push(node);
      else index.set(token, [node]);
    }
  }
  tokenIndex = index;
  return index;
}

export interface RelatedHit {
  node: ModaNode;
  /** The shared word, e.g. "billing". */
  via: string;
  /** 0..1 — higher means a rarer, more distinctive shared word. */
  strength: number;
}

/**
 * Finds elements in *other* frameworks that share a distinctive word with the
 * given node. This is what surfaces, say, "Billing & Revenue Management" in
 * eTOM next to "Customer Bill Invoice" in the Information Framework without
 * anyone having to hand-author the pairing.
 */
export function relatedByName(node: ModaNode, limit = 12): RelatedHit[] {
  const index = getTokenIndex();
  const ownTokens = tokensOf(node.name);
  if (!ownTokens.length) return [];

  const scores = new Map<string, { node: ModaNode; via: string; weight: number }>();

  for (const token of ownTokens) {
    const bucket = index.get(token);
    if (!bucket || bucket.length > 400) continue; // too generic to be a signal
    const weight = token.length >= 6 ? 2 : 1;
    for (const candidate of bucket) {
      if (candidate.id === node.id || candidate.fw === node.fw) continue;
      const existing = scores.get(candidate.id);
      if (existing) {
        existing.weight += weight;
        if (token.length > existing.via.length) existing.via = token;
      } else {
        scores.set(candidate.id, { node: candidate, via: token, weight });
      }
    }
  }

  const max = Math.max(1, ...[...scores.values()].map((s) => s.weight));
  return [...scores.values()]
    .sort(
      (a, b) =>
        b.weight - a.weight ||
        a.node.name.length - b.node.name.length ||
        a.node.name.localeCompare(b.node.name),
    )
    .slice(0, limit)
    .map((s) => ({ node: s.node, via: s.via, strength: s.weight / max }));
}

/** Everything that touches a node: curated concepts first, then by name. */
export function relationsOf(node: ModaNode): {
  concepts: ResolvedConcept[];
  similar: RelatedHit[];
} {
  const similar = relatedByName(node).filter(
    (hit) => !conceptsForNode(node).some((c) => c.resolved[hit.node.fw as FrameworkId]?.id === hit.node.id),
  );
  return { concepts: conceptsForNode(node), similar };
}