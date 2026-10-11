import type { FrameworkId } from '../types';

/**
 * Editorial layer over the crawled model: what each framework of MODA is for,
 * how it sits against the others, and where the authoritative source lives.
 *
 * The `quote` fields are taken verbatim from the TM Forum model pages; the rest
 * is a working summary written for this explorer.
 */

export interface FrameworkMeta {
  id: FrameworkId;
  /** Name as published in the MODA package tree. */
  name: string;
  /** Short name used in dense UI. */
  short: string;
  /** The question this framework answers. */
  question: string;
  summary: string;
  /** Layer band on the master ODA diagram. */
  band: 1 | 2 | 3;
  accent: string;
  url: string;
  quote?: string;
  quoteSource?: string;
}

export const BAND_LABELS: Record<number, string> = {
  1: 'Business architecture',
  2: 'Process & function',
  3: 'Information & measurement',
};

export const FRAMEWORKS: FrameworkMeta[] = [
  {
    id: 'verticals',
    name: 'Verticals',
    short: 'Verticals',
    question: 'Which industry does this apply to?',
    band: 1,
    accent: '#7c8cf8',
    url: 'https://www.tmforum.org/MODA/EARoot/EA3/EA418.htm',
    summary:
      'Vertical views over the architecture — the industry-specific lenses a service provider or vendor applies on top of the horizontal model. A vertical reuses the shared domains, processes and applications but reorders and emphasises them for one market.',
  },
  {
    id: 'domains',
    name: 'Domains',
    short: 'Domains',
    question: 'What kind of business object are we talking about?',
    band: 1,
    accent: '#9d7cf8',
    url: 'https://www.tmforum.org/MODA/EARoot/EA2/EA391.htm',
    summary:
      'The domain model at the root of MODA: the subject areas a business is made of. Market, Sales, Product, Customer, Service, Resource and Business Partner are the commercial domains; Common, Shared, Integration and Patterns carry the cross-cutting concerns.',
  },
  {
    id: 'businessArchitecture',
    name: 'Business Architecture',
    short: 'Business Arch.',
    question: 'How does it all fit together as capabilities?',
    band: 1,
    accent: '#6f9bf8',
    url: 'https://www.tmforum.org/MODA/EARoot/EA9/EA19886.htm',
    summary:
      'The cross-cutting capability view that stitches the domains, processes, functions, applications and information into a single business architecture — the connective tissue layer of the model.',
  },
  {
    id: 'etom',
    name: 'Business Process Framework',
    short: 'eTOM',
    question: 'What does the business do, and in what order?',
    band: 2,
    accent: '#f2a65a',
    url: 'https://www.tmforum.org/MODA/EARoot/EA5/EA7369.htm',
    quote:
      'The Business Process Framework is a reference framework or model for categorizing all the business activities that a service provider will use. It is NOT a service provider business model.',
    quoteSource: 'TM Forum — Business Process Framework (eTOM), Release 26.0.0',
    summary:
      'eTOM is the process backbone of MODA. Level 0 states the purpose; Level 1 splits the enterprise end-to-end lifecycle into Operations, Management and Platform; every level below decomposes along the Market/Sales, Customer and Product verticals down to Level 4 activities. Because it is a framework rather than a model, the same elements recombine into different end-to-end processes — fulfillment, assurance, billing — for different operators.',
  },
  {
    id: 'functional',
    name: 'Functional Framework',
    short: 'Functional',
    question: 'What capability has to exist?',
    band: 2,
    accent: '#5ac8a8',
    url: 'https://www.tmforum.org/MODA/EARoot/EA6/EA11938.htm',
    summary:
      'The functional layer names the business capabilities that realise the eTOM processes — the "what must be able to do", independent of any particular system. Functions are vendor-neutral and map onto the process areas they serve.',
  },
  {
    id: 'application',
    name: 'Application Framework',
    short: 'Application',
    question: 'Which system delivers it?',
    band: 2,
    accent: '#e0709a',
    url: 'https://www.tmforum.org/MODA/EARoot/EA7/EA15405.htm',
    summary:
      'The application layer maps functions onto applications and the modular services (the Open Digital Model) that expose them as APIs. It is the bridge between the vendor-neutral process and function world and the software a provider actually buys, builds or assembles.',
  },
  {
    id: 'information',
    name: 'Information Framework',
    short: 'Information',
    question: 'Which entities carry the data?',
    band: 3,
    accent: '#f2726f',
    url: 'https://www.tmforum.org/MODA/EARoot/EA4/EA432.htm',
    summary:
      'The information layer — the lineage of TM Forum’s Shared Information/Data model (SID). It defines the business entities and their relationships, grouped by domain: a Product, a Customer, a Resource, a Service, a Partner, an Invoice. Processes and applications are defined in terms of the entities they read and write, which is what makes integration tractable.',
  },
  {
    id: 'metrics',
    name: 'Business Metrics',
    short: 'Metrics',
    question: 'How do we know it worked?',
    band: 3,
    accent: '#d9c04f',
    url: 'https://www.tmforum.org/MODA/EARoot/EA8/EA16068.htm',
    summary:
      'The measurement layer: metric definitions grouped by the part of the business they describe. Metrics close the loop with eTOM — a process area is only complete when its outcomes are measurable, and a metric without a process to change it is inert.',
  },
];

export const FRAMEWORK_BY_ID: Map<FrameworkId, FrameworkMeta> = new Map(
  FRAMEWORKS.map((f) => [f.id, f]),
);

export const BAND_ORDER: FrameworkId[] = FRAMEWORKS.map((f) => f.id);

export const SOURCES = [
  {
    label: 'TM Forum — MODA model browser',
    url: 'https://www.tmforum.org/MODA/index.htm',
  },
  {
    label: 'Business Process Framework (eTOM), Release 26.0.0',
    url: 'https://www.tmforum.org/MODA/EARoot/EA5/EA7369.htm',
  },
  {
    label: 'eTOM — Hierarchy Levels',
    url: 'https://www.tmforum.org/MODA/EARoot/EA5/EA7371.htm',
  },
  {
    label: 'Functional Framework',
    url: 'https://www.tmforum.org/MODA/EARoot/EA6/EA11938.htm',
  },
  {
    label: 'Application Framework',
    url: 'https://www.tmforum.org/MODA/EARoot/EA7/EA15405.htm',
  },
  {
    label: 'Information Framework',
    url: 'https://www.tmforum.org/MODA/EARoot/EA4/EA432.htm',
  },
  {
    label: 'Business Metrics',
    url: 'https://www.tmforum.org/MODA/EARoot/EA8/EA16068.htm',
  },
  {
    label: 'TM Forum Open Digital Framework programme',
    url: 'https://www.tmforum.org/open-apis/',
  },
];

/** How the layers connect — rendered on the overview. */
export interface Relation {
  from: FrameworkId;
  to: FrameworkId;
  text: string;
}

export const RELATIONS: Relation[] = [
  {
    from: 'etom',
    to: 'functional',
    text: 'A process is fulfilled by the capabilities designed to perform it.',
  },
  {
    from: 'functional',
    to: 'application',
    text: 'A function is delivered by one or more applications and their exposed services.',
  },
  {
    from: 'etom',
    to: 'information',
    text: 'A process reads and writes the business entities of the information model.',
  },
  {
    from: 'etom',
    to: 'metrics',
    text: 'Every process area carries the metrics that say whether it is working.',
  },
  {
    from: 'domains',
    to: 'information',
    text: 'Each information domain is the entity view of one business domain.',
  },
  {
    from: 'verticals',
    to: 'domains',
    text: 'A vertical is a domain-driven lens applied to the whole architecture.',
  },
  {
    from: 'businessArchitecture',
    to: 'etom',
    text: 'Capabilities are assembled from the layers below, never invented separately.',
  },
];