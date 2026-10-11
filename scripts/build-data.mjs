/**
 * Turns the raw JSONL crawled from the published TM Forum MODA model into a
 * single JSON payload the app imports.
 *
 *   node_modules/.bin  ->  node scripts/build-data.mjs
 *
 * Input : src/data/raw/<framework>.jsonl   (one JSON object per line)
 * Output: src/data/model.json               (consumed by src/data/model.ts)
 *
 * Raw rows look like:
 *   {"n":"Process","t":"Package","p":"0.5.1","h":"EARoot/EA5/EA1/EA7378.htm","g":"..."}
 *
 * `p` is the model id-path ("0.5.1" -> model root, Business Process Framework,
 * Process) and `h` is the href as published, relative to the *parent's*
 * folder. Together they are enough to rebuild the deep link into the model.
 */

import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const rawDir = resolve(root, 'src/data/raw');
const outFile = resolve(root, 'src/data/model.json');

const MODEL_BASE = 'https://www.tmforum.org/MODA/';

/**
 * The model root and the eight framework packages, verified against the
 * published model. A framework root is guaranteed to exist in the output even
 * if the crawl missed it, so every explorer has a clean entry point.
 */
const FRAMEWORK_ROOT = {
  '0.2': { fw: 'domains', name: 'Domains', url: 'EARoot/EA2/EA391.htm' },
  '0.3': { fw: 'verticals', name: 'Verticals', url: 'EARoot/EA3/EA418.htm' },
  '0.4': { fw: 'information', name: 'Information Framework', url: 'EARoot/EA4/EA432.htm' },
  '0.5': { fw: 'etom', name: 'Business Process Framework', url: 'EARoot/EA5/EA7369.htm' },
  '0.6': { fw: 'functional', name: 'Functional Framework', url: 'EARoot/EA6/EA11938.htm' },
  '0.7': { fw: 'application', name: 'Application Framework', url: 'EARoot/EA7/EA15405.htm' },
  '0.8': { fw: 'metrics', name: 'Business Metrics', url: 'EARoot/EA8/EA16068.htm' },
  '0.9': { fw: 'businessArchitecture', name: 'Business Architecture', url: 'EARoot/EA9/EA19886.htm' },
};

/**
 * Rebuilds the absolute URL of a node.
 * folder(p)  : "0.5.1" -> "EA5/EA1"   (colon segments are TOC branches, not folders)
 * url(p, h)  : folder(p) + last segment of h
 */
function nodeUrl(p, h) {
  const segments = p.split(':')[0].replace(/^0\./, '').split('.').filter(Boolean);
  const folder = segments.map((s) => `EA${s}`).join('/');
  const file = String(h || '').split('/').pop();
  return `${MODEL_BASE}EARoot/${folder}/${file}`;
}

/** "0.7.2:4" -> "0.7.2" — parent across both TOC separators. */
function parentOf(p) {
  const cut = Math.max(p.lastIndexOf('.'), p.lastIndexOf(':'));
  return cut > 0 ? p.slice(0, cut) : null;
}

/** Tree depth: every segment, colon branches included. */
function depthOf(p) {
  return p.split(/[.:]/).length;
}

/**
 * Enterprise Architect publishes types as "<Type><index>", e.g. "Package0",
 * "Component diagram0". Normalise to the vocabulary the UI renders.
 */
function normaliseType(raw) {
  const type = String(raw ?? '')
    .replace(/\d+$/, '')
    .trim();
  if (/package/i.test(type)) return 'Package';
  if (/class|entity|object/i.test(type)) return 'Class';
  if (/diagram/i.test(type)) return 'Diagram';
  if (/metric|measure/i.test(type)) return 'Metric';
  if (/text|note/i.test(type)) return 'Text';
  if (/application/i.test(type)) return 'Application';
  if (/function/i.test(type)) return 'Function';
  if (/domain|vertical/i.test(type)) return 'Domain';
  if (/process/i.test(type)) return 'Process';
  return type || 'Package';
}

/**
 * TM Forum keeps tombstones for retired elements ("Billing Data Mediation
 * (Deleted)"). They live in their own "Deleted …" packages and would otherwise
 * swamp the live model, so they are dropped here rather than shown as if they
 * were current.
 */
const DELETED = /^\s*Deleted\b/i;
const DELETED_INLINE = /\(\s*Deleted\s*!?\s*\)/i;

function isTombstone(name, ancestorNames) {
  return DELETED.test(name) || DELETED_INLINE.test(name) || ancestorNames.some((n) => DELETED.test(n));
}

/**
 * MODA's frameworks are aligned by business domain: the same Market/Sales,
 * Customer, Product, Service, Resource, Partner and Enterprise groupings recur
 * in eTOM, the Functional and Application Frameworks, the Information model
 * and the metrics. Classifying every node by the deepest matching ancestor
 * gives the whole model one shared axis to be cross-referenced on.
 */
const VERTICAL_RULES = [
  [/market|sales/i, 'Market & Sales'],
  [/business partner|^partner/i, 'Business Partner'],
  [/customer/i, 'Customer'],
  [/product/i, 'Product'],
  [/service/i, 'Service'],
  [/resource|network/i, 'Resource'],
  [/enterprise/i, 'Enterprise'],
  [/integration/i, 'Integration'],
  [/common/i, 'Common'],
  [/shared/i, 'Shared'],
];

function classifyVertical(name) {
  for (const [re, label] of VERTICAL_RULES) if (re.test(name)) return label;
  return null;
}

function readJsonl(file) {
  return readFileSync(file, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line, i) => {
      try {
        return JSON.parse(line);
      } catch {
        throw new Error(`${file}:${i + 1} is not valid JSON`);
      }
    });
}

if (!existsSync(rawDir)) {
  console.error(`No raw data at ${rawDir}`);
  process.exit(1);
}

const files = readdirSync(rawDir).filter((f) => f.endsWith('.jsonl'));
const all = [];
const stats = {};
const problems = [];

/** The framework a node belongs to, taken from its id-path — never the file. */
function frameworkOf(p, fallback) {
  const prefix = p.split(/[.:]/).slice(0, 2).join('.');
  return FRAMEWORK_ROOT[prefix]?.fw ?? fallback;
}

for (const file of files) {
  const id = file.replace(/\.jsonl$/, '');
  const rows = readJsonl(resolve(rawDir, file));
  const seen = new Set();

  for (const row of rows) {
    if (!row.n || !row.p) {
      problems.push(`${file}: row without name/path -> ${JSON.stringify(row).slice(0, 80)}`);
      continue;
    }
    if (seen.has(row.p)) continue;
    seen.add(row.p);

    const depth = depthOf(row.p);
    const node = {
      id: row.p,
      fw: frameworkOf(row.p, id),
      n: row.n,
      t: normaliseType(row.t),
      parent: parentOf(row.p),
      depth,
      url: nodeUrl(row.p, row.h),
    };
    if (row.s) node.s = row.s;
    if (row.r) node.r = row.r;
    if (row.st) node.st = row.st;
    all.push(node);
  }

  stats[id] = { rows: rows.length, unique: seen.size };
}

/* Guarantee every framework has a root element, even if the crawl missed it. */
for (const [prefix, meta] of Object.entries(FRAMEWORK_ROOT)) {
  if (all.some((n) => n.id === prefix)) continue;
  all.push({
    id: prefix,
    fw: meta.fw,
    n: meta.name,
    t: 'Package',
    parent: '0',
    depth: 2,
    url: `${MODEL_BASE}${meta.url}`,
  });
}

/* ---- second pass: resolve parents, build breadcrumbs, classify eTOM ---- */

/* The model root, so framework roots (0.2 … 0.9) have a parent. */
const ROOT = { id: '0', fw: '_root', n: 'MODA', t: 'Package', parent: null, depth: 1 };

const byId = new Map([[ROOT.id, ROOT], ...all.map((n) => [n.id, n])]);
const withMeta = [];
const droppedTombstones = [];

/**
 * A crawl can skip an intermediate package, leaving a child pointing at a
 * parent that was never recorded. Rather than dropping those elements, hang
 * them off the nearest ancestor that does exist.
 */
function reattach(parentId) {
  let cursor = parentId;
  while (cursor && cursor !== '0') {
    if (byId.has(cursor)) return cursor;
    const cut = Math.max(cursor.lastIndexOf('.'), cursor.lastIndexOf(':'));
    if (cut <= 0) break;
    cursor = cursor.slice(0, cut);
  }
  return cursor === '0' ? '0' : null;
}

for (const node of all) {
  if (node.parent && !byId.has(node.parent)) {
    const fixed = reattach(node.parent);
    problems.push(`reattached ${node.fw}:${node.id} (${node.n}): ${node.parent} -> ${fixed}`);
    node.parent = fixed;
  }

  const crumb = [];
  let cursor = node;
  const guard = new Set();
  while (cursor) {
    guard.add(cursor.id);
    crumb.unshift(cursor.n);
    cursor = cursor.parent ? byId.get(cursor.parent) : undefined;
    if (cursor && guard.has(cursor.id)) break;
  }

  if (isTombstone(node.n, crumb.slice(0, -1))) {
    droppedTombstones.push(`${node.id} ${node.n}`);
    continue;
  }

  if (node.parent && !byId.has(node.parent)) {
    problems.push(`unresolved parent for ${node.fw}:${node.id} (${node.n})`);
  }

  node.crumb = crumb.slice(0, -1); // ancestors only

  // Domain classification applies to every framework: the deepest ancestor
  // that names a business domain wins.
  for (let i = crumb.length - 2; i >= 0; i -= 1) {
    const v = classifyVertical(crumb[i]);
    if (v) {
      node.vt = v;
      break;
    }
  }

  if (node.fw === 'etom') {
    // eTOM also carries a horizontal axis — Operations / Management / Platform —
    // where the framework names it explicitly.
    const l1 = node.crumb.find((c) => /^(Operations|Management|Platform|Purpose|Vision|Strategy)\b/i.test(c));
    if (l1) node.hz = l1.replace(/\s*process(es)?$/i, '').trim();
  }

  withMeta.push(node);
}

/* Packages emptied by the tombstone filter have nothing to offer. */
const withChildren = new Set(withMeta.map((n) => n.parent).filter(Boolean));
const live = withMeta.filter(
  (n) => n.kind !== 'Package' || withChildren.has(n.id) || n.id in FRAMEWORK_ROOT,
);

/* ---- prune empty optional fields to keep the payload small ---- */
const clean = live.map((n) => {
  const out = { id: n.id, fw: n.fw, n: n.n, t: n.t, d: n.depth, u: n.url };
  if (n.parent) out.p = n.parent;
  if (n.crumb && n.crumb.length) out.c = n.crumb;
  if (n.s) out.s = n.s;
  if (n.r) out.r = n.r;
  if (n.st) out.st = n.st;
  if (n.vt) out.vt = n.vt;
  if (n.hz) out.hz = n.hz;
  return out;
});

const payload = {
  generatedAt: new Date().toISOString(),
  source: MODEL_BASE,
  root: { id: '0', fw: '_root', n: 'MODA', t: 'Package', d: 1, u: `${MODEL_BASE}index.htm`, c: [] },
  nodes: clean,
};

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(payload));

const byFw = {};
for (const n of clean) byFw[n.fw] = (byFw[n.fw] ?? 0) + 1;

const kb = (Buffer.byteLength(JSON.stringify(payload)) / 1024).toFixed(0);
console.log(`model.json written — ${clean.length} nodes, ${kb} KB`);
console.table(byFw);
if (droppedTombstones.length) {
  console.log(`dropped ${droppedTombstones.length} retired "Deleted …" elements`);
}
if (problems.length) {
  console.warn(`\n${problems.length} data problem(s):`);
  for (const p of problems.slice(0, 15)) console.warn('  ' + p);
}