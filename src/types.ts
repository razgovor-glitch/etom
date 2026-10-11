/**
 * Shared data contract for the MODA model.
 *
 * Every framework in the TM Forum Model of the Open Digital Architecture
 * (eTOM / Business Process, Functional, Application, Information / SID,
 * Business Metrics, Domains, Verticals) is normalised into `ModaNode` so the
 * whole architecture can be searched, filtered and cross-referenced as one
 * model instead of four disconnected trees.
 */

export type FrameworkId =
  | 'etom'
  | 'functional'
  | 'application'
  | 'information'
  | 'metrics'
  | 'domains'
  | 'verticals'
  | 'businessArchitecture';

export type NodeKind =
  | 'Package'
  | 'Process'
  | 'Class'
  | 'Diagram'
  | 'Text'
  | 'Metric'
  | 'Domain'
  | 'Vertical'
  | 'Application'
  | 'Function';

export interface ModaNode {
  /** Stable slug — the id-path inside the published model, e.g. "0.5.1.2". */
  id: string;
  /** Framework this element belongs to (matches FrameworkId, plus "_root"). */
  fw: string;
  /** Distance from the model root; the BPF root sits at depth 2. */
  depth: number;
  /** Official TM Forum element name, classifier suffix only (e.g. "eTOM"). */
  name: string;
  /** id of the parent node, or null for the root of the tree. */
  parent: string | null;
  /**
   * Hierarchical level. For eTOM this is the official L0..L4 decomposition.
   * For other frameworks it is the depth in the published package tree.
   */
  level: string;
  /** Ancestor names from root to (but excluding) this node. */
  path: string[];
  /** Enterprise Architect element type as published by TM Forum. */
  kind: NodeKind;
  /** Short description, taken verbatim-ish from the TM Forum model. */
  summary?: string;
  /** Deep link into the published TM Forum model. */
  tmfUrl?: string;
  /** eTOM vertical grouping: Market/Sales, Customer, Product, … */
  vertical?: string;
  /** eTOM horizontal grouping: Operations, Management, Platform, … */
  horizontal?: string;
  /** Extra classification used for faceted filtering. */
  tags?: string[];
  /** TM Forum release in which the element was last modified. */
  release?: string;
  /** Lifecycle status as published (Validated, Team Approved, …). */
  status?: string;
}

/** A node together with its resolved ancestry — what the UI actually renders. */
export interface ResolvedNode extends ModaNode {
  depth: number;
  childCount: number;
  parentName: string | null;
  breadcrumb: string[];
}