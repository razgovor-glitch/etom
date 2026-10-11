import type { FrameworkId } from '../types';
import type { Locale } from '../i18n/dictionaries';

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
  /** Russian display name. */
  nameRu: string;
  /** Russian short name for dense UI. */
  shortRu: string;
  /** The question this framework answers. */
  question: string;
  /** Russian rendering of `question`. */
  questionRu: string;
  summary: string;
  /** Russian rendering of `summary`. */
  summaryRu: string;
  /** Layer band on the master ODA diagram. */
  band: 1 | 2 | 3;
  accent: string;
  url: string;
  quote?: string;
  quoteRu?: string;
  quoteSource?: string;
}

/** Architecture band -> its translated label in the dictionary. */
export const BAND_KEY = { 1: 'band.1', 2: 'band.2', 3: 'band.3' } as const;

export const FRAMEWORKS: FrameworkMeta[] = [
  {
    id: 'verticals',
    name: 'Verticals',
    short: 'Verticals',
    nameRu: 'Вертикали',
    shortRu: 'Вертикали',
    questionRu: 'К какой отрасли это относится?',
    summaryRu:
      'Вертикальные разрезы архитектуры — отраслевые линзы, которые сервисный провайдер или вендор применяет поверх сквозной модели. Вертикаль использует общие домены, процессы и приложения, но переупорядочивает и расставляет акценты под один рынок.',
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
    nameRu: 'Домены',
    shortRu: 'Домены',
    questionRu: 'О каком классе бизнес-объектов идёт речь?',
    summaryRu:
      'Доменная модель в корне MODA: предметные области, из которых состоит бизнес. Market, Sales, Product, Customer, Service, Resource и Business Partner — коммерческие домены; Common, Shared, Integration и Patterns несут сквозные concerns.',
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
    nameRu: 'Бизнес-архитектура',
    shortRu: 'Бизнес-архит.',
    questionRu: 'Как всё это складывается в способности?',
    summaryRu:
      'Сквозное представление способностей, которое сшивает домены, процессы, функции, приложения и информацию в единую бизнес-архитектуру — соединительный слой модели.',
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
    nameRu: 'Фреймворк бизнес-процессов',
    shortRu: 'eTOM',
    questionRu: 'Что делает бизнес и в каком порядке?',
    summaryRu:
      'eTOM — процессный хребет MODA. Уровень 0 задаёт цель; уровень 1 делит сквозной жизненный цикл предприятия на Operations, Management и Platform; каждый следующий уровень раскладывается по вертикалям Market/Sales, Customer и Product до activities уровня 4. Поскольку это фреймворк, а не модель, одни и те же элементы по-разному перекомпоновываются в сквозные процессы — выполнение, гарантирование, биллинг — у разных операторов.',
    question: 'What does the business do, and in what order?',
    band: 2,
    accent: '#f2a65a',
    url: 'https://www.tmforum.org/MODA/EARoot/EA5/EA7369.htm',
    quote:
      'The Business Process Framework is a reference framework or model for categorizing all the business activities that a service provider will use. It is NOT a service provider business model.',
    quoteRu:
      'Бизнес-процессный фреймворк — это эталонный фреймворк или модель для классификации всей бизнес-деятельности, которую будет использовать сервисный провайдер. Это НЕ бизнес-модель сервисного провайдера.',
    quoteSource: 'TM Forum — Business Process Framework (eTOM), Release 26.0.0',
    summary:
      'eTOM is the process backbone of MODA. Level 0 states the purpose; Level 1 splits the enterprise end-to-end lifecycle into Operations, Management and Platform; every level below decomposes along the Market/Sales, Customer and Product verticals down to Level 4 activities. Because it is a framework rather than a model, the same elements recombine into different end-to-end processes — fulfillment, assurance, billing — for different operators.',
  },
  {
    id: 'functional',
    name: 'Functional Framework',
    short: 'Functional',
    nameRu: 'Функциональный фреймворк',
    shortRu: 'Функции',
    questionRu: 'Какая способность должна существовать?',
    summaryRu:
      'Функциональный слой называет бизнес-способности, реализующие процессы eTOM, — «что должно уметь», независимо от конкретной системы. Функции нейтральны к вендору и отображаются на обслуживаемые ими процессные области.',
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
    nameRu: 'Фреймворк приложений',
    shortRu: 'Приложения',
    questionRu: 'Какая система это реализует?',
    summaryRu:
      'Прикладной слой сопоставляет функции с приложениями и модульными сервисами (Open Digital Model), которые отдают их через API. Это мост между нейтральным к вендору миром процессов и функций и тем программным обеспечением, которое провайдер действительно покупает, строит или собирает.',
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
    nameRu: 'Информационный фреймворк',
    shortRu: 'Информация',
    questionRu: 'Какие сущности несут данные?',
    summaryRu:
      'Информационный слой — наследие модели общей информации/данных TM Forum (SID). Он определяет бизнес-сущности и связи между ними, сгруппированные по доменам: Product, Customer, Resource, Service, Partner, Invoice. Процессы и приложения определены через сущности, которые они читают и пишут, — именно это делает интеграцию решаемой.',
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
    nameRu: 'Бизнес-метрики',
    shortRu: 'Метрики',
    questionRu: 'Как понять, что всё получилось?',
    summaryRu:
      'Слой измерений: определения метрик, сгруппированные по той части бизнеса, которую они описывают. Метрики замыкают петлю с eTOM — процессная область завершена только тогда, когда её результат измерим, а метрика без процесса, который можно изменить, инертна.',
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

export interface FrameworkText {
  name: string;
  short: string;
  question: string;
  summary: string;
}

/** The English or Russian rendering of a framework's display text. */
export function fwText(meta: FrameworkMeta | undefined, locale: Locale): FrameworkText {
  if (!meta) return { name: '', short: '', question: '', summary: '' };
  return locale === 'ru'
    ? { name: meta.nameRu, short: meta.shortRu, question: meta.questionRu, summary: meta.summaryRu }
    : { name: meta.name, short: meta.short, question: meta.question, summary: meta.summary };
}

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
  key: RelationKey;
}

/** Dictionary keys for the relationship captions on the overview. */
export type RelationKey =
  | 'rel.processFunction'
  | 'rel.functionApplication'
  | 'rel.processInformation'
  | 'rel.processMetrics'
  | 'rel.domainInformation'
  | 'rel.verticalDomain'
  | 'rel.architectureProcess';

export const RELATIONS: Relation[] = [
  { from: 'etom', to: 'functional', key: 'rel.processFunction' },
  { from: 'functional', to: 'application', key: 'rel.functionApplication' },
  { from: 'etom', to: 'information', key: 'rel.processInformation' },
  { from: 'etom', to: 'metrics', key: 'rel.processMetrics' },
  { from: 'domains', to: 'information', key: 'rel.domainInformation' },
  { from: 'verticals', to: 'domains', key: 'rel.verticalDomain' },
  { from: 'businessArchitecture', to: 'etom', key: 'rel.architectureProcess' },
];