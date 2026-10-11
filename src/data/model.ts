import raw from './model.json';
import type { FrameworkId, ModaNode, NodeKind, ResolvedNode } from '../types';

/** Wire format produced by scripts/build-data.mjs (keys are minified). */
interface RawNode {
  id: string;
  fw: string;
  n: string;
  t: string;
  p?: string;
  d: number;
  u: string;
  c?: string[];
  s?: string;
  r?: string;
  st?: string;
  vt?: string;
  hz?: string;
}

const nodes = (raw.nodes as RawNode[]).map(toNode);
const rootNode: ModaNode = {
  id: raw.root.id,
  fw: '_root',
  depth: raw.root.d,
  name: raw.root.n,
  parent: null,
  level: 'root',
  path: [],
  kind: 'Package',
  tmfUrl: raw.root.u,
};

function toNode(r: RawNode): ModaNode {
  const node: ModaNode = {
    id: r.id,
    fw: r.fw,
    depth: r.d,
    name: r.n,
    parent: r.p ?? null,
    level: `L${r.d - 2}`,
    path: r.c ?? [],
    kind: (r.t as NodeKind) ?? 'Package',
    tmfUrl: r.u,
  };
  if (r.s) node.summary = r.s;
  if (r.r) node.release = r.r;
  if (r.st) node.status = r.st;
  if (r.vt) node.vertical = r.vt;
  if (r.hz) node.horizontal = r.hz;
  return node;
}

export const MODEL_SOURCE = raw.source;
export const MODEL_GENERATED_AT = raw.generatedAt;
export const ALL_NODES: ModaNode[] = [...nodes, rootNode];

export const NODES_BY_ID: Map<string, ModaNode> = new Map(ALL_NODES.map((n) => [n.id, n]));
export const BY_FRAMEWORK: Map<string, ModaNode[]> = (() => {
  const map = new Map<string, ModaNode[]>();
  for (const n of nodes) {
    const list = map.get(n.fw);
    if (list) list.push(n);
    else map.set(n.fw, [n]);
  }
  return map;
})();

/** parent id -> ordered children */
export const CHILDREN_BY_PARENT: Map<string, ModaNode[]> = (() => {
  const map = new Map<string, ModaNode[]>();
  for (const n of nodes) {
    if (!n.parent) continue;
    const list = map.get(n.parent);
    if (list) list.push(n);
    else map.set(n.parent, [n]);
  }
  for (const list of map.values()) list.sort(compareNodes);
  return map;
})();

/**
 * The children a tree row should show: the Package spine, plus any small set of
 * leaf children that would otherwise be unreachable (some branches in the
 * published model hold only classes).
 */
export const PACKAGE_CHILDREN: Map<string, ModaNode[]> = (() => {
  const map = new Map<string, ModaNode[]>();
  const LEAF_TAIL_LIMIT = 40;
  for (const [parent, list] of CHILDREN_BY_PARENT) {
    const pkgs = list.filter((n) => n.kind === 'Package');
    const leaves = list.filter((n) => n.kind !== 'Package');
    map.set(parent, pkgs.length ? [...pkgs, ...(leaves.length <= LEAF_TAIL_LIMIT ? leaves : [])] : list);
  }
  return map;
})();

export function childrenOf(id: string): ModaNode[] {
  return CHILDREN_BY_PARENT.get(id) ?? [];
}

export function packageChildrenOf(id: string): ModaNode[] {
  return PACKAGE_CHILDREN.get(id) ?? [];
}

export function countChildren(id: string): number {
  return (CHILDREN_BY_PARENT.get(id) ?? []).length;
}

export function countPackageChildren(id: string): number {
  return (PACKAGE_CHILDREN.get(id) ?? []).length;
}

export function ancestry(id: string): ModaNode[] {
  const out: ModaNode[] = [];
  let cursor = NODES_BY_ID.get(id);
  const guard = new Set<string>();
  while (cursor && !guard.has(cursor.id)) {
    guard.add(cursor.id);
    out.unshift(cursor);
    cursor = cursor.parent ? NODES_BY_ID.get(cursor.parent) : undefined;
  }
  return out;
}

export function resolveNode(id: string): ResolvedNode | undefined {
  const node = NODES_BY_ID.get(id);
  if (!node) return undefined;
  const chain = ancestry(id);
  return {
    ...node,
    childCount: countChildren(id),
    parentName: chain.length > 1 ? chain[chain.length - 2]!.name : null,
    breadcrumb: chain.slice(0, -1).map((n) => n.name),
  };
}

export function compareNodes(a: ModaNode, b: ModaNode): number {
  return a.name.localeCompare(b.name, 'en', { numeric: true, sensitivity: 'base' });
}

/** Every framework that actually has data, in MODA layer order. */
export function populatedFrameworks(): string[] {
  return [...BY_FRAMEWORK.keys()];
}

export function nodesOf(fw: FrameworkId | string): ModaNode[] {
  return BY_FRAMEWORK.get(fw) ?? [];
}

/** Distinct facets available inside a framework, for the filter chips. */
export function facetsOf(fw: string): { vertical: string[]; horizontal: string[]; kinds: string[] } {
  const list = BY_FRAMEWORK.get(fw) ?? [];
  const vertical = new Set<string>();
  const horizontal = new Set<string>();
  const kinds = new Set<string>();
  for (const n of list) {
    if (n.vertical) vertical.add(n.vertical);
    if (n.horizontal) horizontal.add(n.horizontal);
    kinds.add(n.kind);
  }
  return {
    vertical: [...vertical].sort(),
    horizontal: [...horizontal].sort(),
    kinds: [...kinds].sort(),
  };
}