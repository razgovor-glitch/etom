import type { FrameworkId } from '../types';

/**
 * Curated spine of the architecture: business concepts that appear in more than
 * one framework, with the element names each framework actually uses for them.
 *
 * These names are candidates, not primary keys — `lib/links.ts` resolves them
 * against the crawled model (exact match first, then prefix, then substring) so
 * a rename upstream degrades into a less precise hit instead of a broken one.
 */
export interface ConceptLink {
  concept: string;
  blurb: string;
  targets: Partial<Record<FrameworkId, string[]>>;
}

export const CONCEPTS: ConceptLink[] = [
  {
    concept: 'Customer',
    blurb:
      'The party that buys. Every layer of MODA keeps a Customer view, and most end-to-end processes start here.',
    targets: {
      etom: ['Customer Domain'],
      functional: ['Customer Domain'],
      application: ['Customer Domain'],
      information: ['Customer Domain'],
      metrics: ['Customer Domain Metrics'],
      domains: ['Customer Domain'],
    },
  },
  {
    concept: 'Product & catalogue',
    blurb: 'The commercial offering — what the customer subscribes to and what gets billed.',
    targets: {
      etom: ['Product Domain'],
      functional: ['Product Domain'],
      application: ['Product Domain'],
      information: ['Product Domain'],
      metrics: ['Product Domain Metrics'],
      domains: ['Product Domain'],
    },
  },
  {
    concept: 'Service',
    blurb: 'What the provider operates and delivers, distinct from the product it is sold as.',
    targets: {
      etom: ['Service Domain'],
      functional: ['Service Domain'],
      application: ['Service Domain'],
      information: ['Service Domain'],
      metrics: ['Service Domain Metrics'],
      domains: ['Service Domain'],
    },
  },
  {
    concept: 'Resource & network',
    blurb: 'The physical, network and IT estate that delivers services.',
    targets: {
      etom: ['Resource Domain'],
      functional: ['Resource Domain'],
      application: ['Resource Domain', 'Resource Domain Management'],
      information: ['Resource Domain'],
      metrics: ['Resource Domain Metrics'],
      domains: ['Resource Domain'],
    },
  },
  {
    concept: 'Market & sales',
    blurb: 'Finding, qualifying and converting demand — the commercial entry point of the architecture.',
    targets: {
      etom: ['Market Domain', 'Sales Domain'],
      functional: ['Market Domain', 'Sales Domain'],
      application: ['Market Sales Domain'],
      information: ['Market Domain', 'Sales Domain'],
      metrics: ['Market & Sales Domain Metrics'],
      domains: ['Market Domain', 'Sales Domain'],
    },
  },
  {
    concept: 'Business partner',
    blurb: 'Third parties the provider trades with — supply, aggregation, wholesale and outsourcing.',
    targets: {
      etom: ['Business Partner Domain'],
      functional: ['Business Partner Domain'],
      application: ['Business Partner Domain'],
      information: ['Business Partner Domain'],
      metrics: ['Business Partner Domain Metrics'],
      domains: ['Business Partner Domain'],
    },
  },
  {
    concept: 'Enterprise',
    blurb: 'The internal operating model: strategy, governance and the provider’s own organisation.',
    targets: {
      etom: ['Enterprise Domain'],
      functional: ['Enterprise Domain'],
      application: ['Enterprise Domain'],
      information: ['Enterprise Domain'],
      metrics: ['Enterprise Domain Metrics'],
      domains: ['Enterprise Domain'],
    },
  },
  {
    concept: 'Order & fulfillment',
    blurb:
      'From intent to delivered service — the canonical end-to-end process, assembled across the Customer, Product and Resource views.',
    targets: {
      etom: ['Manage Customer Order Fulfillment', 'Customer Order Processing Management'],
      functional: ['Customer Order Management'],
      application: ['Service Order Management'],
      information: ['Customer Product Order ABE'],
    },
  },
  {
    concept: 'Billing',
    blurb: 'Turning delivered service into a billable position.',
    targets: {
      etom: ['Manage Customer Billing Account'],
      functional: ['Billing Account Administration'],
      application: ['Billing Account Management'],
      information: ['Applied Customer Billing Rate ABE'],
    },
  },
  {
    concept: 'Invoice',
    blurb: 'The bill artefact itself: charges, taxes, adjustments and the service period covered.',
    targets: {
      etom: ['Customer Bill Invoice Management'],
      functional: ['Invoice Management'],
      application: ['Invoice Generation'],
      information: ['Business Partner Bill ABE'],
    },
  },
  {
    concept: 'Payments',
    blurb: 'Collecting what is owed and settling it with those who are owed.',
    targets: {
      etom: ['Manage Customer Payments'],
      functional: ['Payment Management'],
      application: ['Payment Validation & Authorization'],
      information: ['Customer Payment ABE'],
    },
  },
  {
    concept: 'Accounting & settlement',
    blurb: 'The ledger that makes the commercial result auditable.',
    targets: {
      etom: ['Sales Accounting Management'],
      functional: ['Settlement Management'],
      application: ['Payment Settlement'],
      information: ['Accounting ABE'],
    },
  },
  {
    concept: 'Tariff & rating',
    blurb: 'Pricing rules and the conversion of usage events into monetary amounts.',
    targets: {
      functional: ['Tariff Calculation and Rating'],
      application: ['Billing Events Management'],
      information: ['Applied Customer Billing Rate ABE'],
    },
  },
  {
    concept: 'Marketing campaign',
    blurb: 'A coordinated push into a market, measured on reach and response rather than on delivered service.',
    targets: {
      etom: ['Marketing Campaign Management'],
      functional: ['Marketing Campaign Management'],
      application: ['Campaign & Funnel Management'],
      information: ['Marketing Campaign ABE'],
    },
  },
  {
    concept: 'Campaign analytics',
    blurb: 'How campaign performance is measured and turned back into targeting.',
    targets: {
      etom: ['Marketing Performance Management'],
      functional: ['Marketing Campaign Performance Tracking and Analysis'],
      application: ['Campaign Analytics'],
      information: ['Marketing Performance ABE'],
    },
  },
  {
    concept: 'Sales & pipeline',
    blurb: 'Turning a market into a qualified, forecastable pipeline.',
    targets: {
      etom: ['Sales Domain'],
      functional: ['Sales Domain'],
      application: ['Market Sales Domain'],
      information: ['Sales Quote ABE'],
    },
  },
  {
    concept: 'Product configuration & activation',
    blurb: 'Making a product real for a specific customer and turning it on.',
    targets: {
      etom: ['Manage Resource Order Activation'],
      functional: ['Product Configuration & Activation'],
      application: ['Service Configuration Management'],
      information: ['Product Configuration ABE'],
    },
  },
  {
    concept: 'Resource commissioning',
    blurb: 'The operational mirror of activation: preparing and handing over the estate that delivers it.',
    targets: {
      etom: ['Perform Resource Order Activation'],
      functional: ['Network Development'],
      application: ['Resource Commissioning & Configuration Management'],
      information: ['Network Product ABE'],
    },
  },
  {
    concept: 'Fault & problem management',
    blurb: 'Detecting, isolating and clearing faults, then preventing recurrence.',
    targets: {
      functional: ['Customer Product Problem Management'],
      application: ['Fault Management'],
      information: ['Customer Problem ABE', 'Party Problem ABE'],
    },
  },
  {
    concept: 'Performance & SLA',
    blurb: 'Measuring service quality against target, and managing the commitment itself.',
    targets: {
      etom: ['Customer QoS/SLA Management', 'Assess Customer QoS/SLA Performance'],
      functional: ['Product QoS Analysis'],
      application: ['Customer SLA Management'],
      information: ['Party Service Level Agreement ABE', 'Performance ABE'],
      metrics: ['End to End Service Performance'],
    },
  },
  {
    concept: 'Service assurance',
    blurb: 'The closed loop: measure quality, find the cause, fix it, prove it is fixed.',
    targets: {
      etom: ['Assess Customer QoS/SLA Performance'],
      application: ['Service Assurance Control'],
      information: ['Revenue Assurance ABE', 'Network Resource Assurance ABE'],
    },
  },
  {
    concept: 'Usage & mediation',
    blurb: 'Collecting network events, correlating them, and rating them into billable usage.',
    targets: {
      etom: ['Mediate Resource Usage Records', 'Resource Mediation & Reporting'],
      functional: ['Resource Mediation', 'Product Usage Management'],
      application: ['Usage Management', 'Resource Fault & Performance Data Mediation'],
      information: ['Usage ABE'],
    },
  },
  {
    concept: 'Capacity & inventory',
    blurb: 'Knowing what the estate holds and whether there is room to grow it.',
    targets: {
      etom: ['Resource Capacity Management'],
      functional: ['Resource Test Inventory Management'],
      application: ['Service Inventory Management'],
      information: ['Resource Domain'],
    },
  },
  {
    concept: 'Knowledge',
    blurb: 'Turning operational history into reusable knowledge for customers and staff.',
    targets: {
      etom: ['Update Sales Problem Knowledge'],
      application: ['Knowledge Management'],
    },
  },
  {
    concept: 'Contract',
    blurb: 'The commercial and legal envelope around products, partners and enterprise customers.',
    targets: {
      etom: ['Negotiate Sales/Contract', 'Establish Sales Channel Contract'],
      application: ['Contract Management'],
    },
  },
  {
    concept: 'Data & analytics',
    blurb: 'The reporting and insight layer sitting across every other framework.',
    targets: {
      etom: ['Deliver Customer Analytics Capability'],
      application: ['Fault Reporting & Analytics'],
      information: ['Competitor Intelligence ABE'],
      domains: ['Common Domain'],
    },
  },
  {
    concept: 'Security',
    blurb: 'Trust, identity and access across every layer of the model.',
    targets: {
      application: ['Security Management'],
      information: ['Security Entity ABE'],
      domains: ['Common Domain', 'Shared Domain'],
    },
  },
  {
    concept: 'Shared & common',
    blurb:
      'The cross-cutting concerns every domain borrows from rather than owns — the reason MODA has a Shared and Common domain at all.',
    targets: {
      application: ['Common Domain'],
      information: ['Common Domain Structure'],
      domains: ['Common Domain', 'Shared Domain'],
    },
  },
];

/** Word-level stop list used when comparing names automatically. */
export const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'management', 'process',
  'processes', 'service', 'services', 'domain', 'system', 'data', 'model',
  'level', 'capability', 'support', 'other', 'all', 'any', 'new', 'common',
  'shared', 'integration', 'patterns', 'package', 'class', 'diagram', 'text',
  'function', 'functions', 'application', 'applications', 'framework', 'abe',
  'entity', 'entities', 'view', 'views', 'structure', 'overview',
]);