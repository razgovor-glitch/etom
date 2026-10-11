/**
 * UI strings for MODA Explorer.
 *
 * `en` is the source of truth: it defines the key set, and `ru` is checked
 * against it so a missing Russian string is a compile error rather than an
 * English string leaking into the Russian UI.
 *
 * Entries are either a plain string, or a set of plural forms keyed by
 * `one / few / many / other`. Russian needs the three-form rule (1 элемент,
 * 2 элемента, 5 элементов), English needs two.
 *
 * Model content — TM Forum element names, releases, statuses — is deliberately
 * NOT translated. Those are official names from a published standard, and a
 * translated element name would be a different name.
 */

export type PluralForm = 'one' | 'few' | 'many' | 'other';
export type Entry = string | Record<PluralForm, string>;

export const en = {
  'doc.title': 'MODA Explorer — TM Forum Model of the Open Digital Architecture',

  'aria.menu': 'Menu',
  'aria.theme': 'Toggle theme',
  'aria.language': 'Switch language',

  'brand.sub': 'Model of the Open Digital Architecture · TM Forum',
  'search.trigger': 'Search the model…',
  'search.placeholder': 'Search every layer — e.g. billing, fault, partner, SLA…',
  'search.hint':
    'Type at least two characters. Search covers every element of every framework, including the breadcrumb path.',
  'search.empty': 'Nothing matched.',
  'search.nav': '↑ ↓ navigate',
  'search.open': '↵ open',
  'search.close': 'esc close',
  'search.results': {
    one: '{count} result',
    few: '{count} results',
    many: '{count} results',
    other: '{count} result',
  },

  'nav.group.model': 'Model',
  'nav.group.reference': 'Reference',
  'nav.overview': 'Overview',
  'nav.concepts': 'Concept map',
  'nav.matrices': 'Matrices',
  'nav.about': 'About & sources',
  'nav.tmforum': 'TM Forum model ↗',

  'band.1': 'Business architecture',
  'band.2': 'Process & function',
  'band.3': 'Information & measurement',

  'home.kicker': 'TM Forum · Open Digital Architecture',
  'home.title': 'One architecture, eight views.',
  'home.lede1':
    "MODA is TM Forum's reference architecture for digital business. It does not invent a new way to model a company — it lines up the views an operator already needs: what the business is (domains), what it does (eTOM processes), what it must be able to do (functions), what delivers it (applications), what data it carries (information), and how it knows it worked (metrics).",
  'home.lede2':
    "This explorer reads the model TM Forum publishes and lets you move between those views without losing your place — the point of MODA only shows up when you can trace one process across all of them.",
  'home.cta.etom': 'Start with eTOM →',
  'home.cta.concepts': 'Trace a concept across layers',
  'home.cta.root': 'The model root',
  'home.stat.elements': 'model elements',
  'home.stat.frameworks': 'frameworks',
  'home.stat.domains': 'business domains',
  'home.stat.note':
    'Every element links back to its page in the published TM Forum model, so anything here can be checked against the source.',
  'home.master.title': 'The master ODA diagram',
  'home.master.hint': 'click any layer to open it',
  'home.inside.title': 'Inside each framework',
  'home.inside.hint': 'the published package tree, straight from the model',
  'home.inside.empty': 'No package level published for this branch.',
  'home.relations.title': 'How the layers connect',
  'home.relations.hint': 'the relationships that make MODA one model',

  'rel.processFunction':
    'A process is fulfilled by the capabilities designed to perform it.',
  'rel.functionApplication':
    'A function is delivered by one or more applications and their exposed services.',
  'rel.processInformation':
    'A process reads and writes the business entities of the information model.',
  'rel.processMetrics':
    'Every process area carries the metrics that say whether it is working.',
  'rel.domainInformation': 'Each information domain is the entity view of one business domain.',
  'rel.verticalDomain': 'A vertical is a domain-driven lens applied to the whole architecture.',
  'rel.architectureProcess':
    'Capabilities are assembled from the layers below, never invented separately.',

  'explorer.filter': 'Filter {count} elements…',
  'explorer.empty': 'No data loaded for this framework yet.',
  'explorer.hidden': '{count} hidden by the active filter',
  'explorer.pick': 'Pick an element in the tree to drill in.',
  'explorer.loaded': '{count} elements are loaded from the published TM Forum model.',

  'detail.noSummary':
    'No description is published for this element in the TM Forum model. Follow the source link below for the authoritative page.',
  'detail.count': {
    one: '{count} element',
    few: '{count} elements',
    many: '{count} elements',
    other: '{count} element',
  },
  'detail.packages': '· {count} packages',
  'detail.contains': 'Contains',
  'detail.more': '+{count} more. Use the tree on the left to navigate the full structure.',
  'detail.concepts': 'Concepts',
  'detail.conceptsHint': 'how this element carries a business concept across MODA',
  'detail.related': 'Related across MODA',
  'detail.relatedHint': 'matched by shared terminology in other frameworks',
  'detail.shares': 'shares “{term}”',
  'detail.source': 'Open in TM Forum model ↗',
  'detail.back': '← Back',
  'common.more': '+{count} more',
  'common.empty': '—',

  'matrix.title': 'Cross-framework matrices',
  'matrix.lede':
    'The same business domains run through every layer of MODA. The Customer domain, for example, is a set of processes in eTOM, a set of functions, a set of applications, a set of entities and a set of metrics. This grid is that alignment, counted from the live model.',
  'matrix.grid.title': 'Business domain × framework',
  'matrix.grid.hint': 'element counts · click a cell to expand',
  'matrix.grid.corner': 'Domain ↓',
  'matrix.grid.total': 'Framework total',
  'matrix.types.title': 'Element types by framework',
  'matrix.types.framework': 'Framework',
  'matrix.types.total': 'Total',
  'matrix.types.hint': 'includes {count} eTOM elements',

  'concepts.title': 'Concept map',
  'concepts.lede':
    'The reason MODA is more than a set of documents: business concepts that every framework has an opinion about — billing, order, fault, partner, campaign — and where each one lands. Select any cell to jump straight to that element.',
  'concepts.grid.title': 'Concept × framework',
  'concepts.grid.hint': 'resolved against the live model · up to {count} frameworks per concept',
  'concepts.grid.corner': 'Concept',
  'concepts.detail.title': 'What each concept means',

  'about.title': 'About this explorer',
  'about.lede':
    'MODA is published by TM Forum as a browsable Enterprise Architect model. This app reads the structure of that model — every package, process, function, application, entity and metric it contains — and presents it as one navigable architecture. Nothing here is invented: each element links back to its page on tmforum.org.',
  'about.build.title': 'How it was built',
  'about.build.structure.title': 'Structure',
  'about.build.structure.body':
    'The published model exposes its whole tree through GUID-keyed XML data files. Each node lists its children — name, type, link — so the tree can be walked node by node without scraping rendered HTML.',
  'about.build.links.title': 'Cross-references',
  'about.build.links.body':
    'Concepts like billing or fault are matched to their element in each framework by name, with a curated spine first and automatic terminology matching as a fallback — so the layers stay connected even when upstream names move.',
  'about.build.status.title': 'Status',
  'about.build.status.body':
    'Elements carry the release and lifecycle status published by TM Forum. The model itself evolves; the explorer re-derives everything from the current publication.',
  'about.sources': 'Sources',
  'about.sources.read': 'model read {date}',
} satisfies Record<string, Entry>;

export type TranslationKey = keyof typeof en;

export const ru: Record<TranslationKey, Entry> = {
  'doc.title': 'MODA Explorer — Модель открытой цифровой архитектуры TM Forum',

  'aria.menu': 'Меню',
  'aria.theme': 'Сменить тему',
  'aria.language': 'Сменить язык',

  'brand.sub': 'Модель открытой цифровой архитектуры · TM Forum',
  'search.trigger': 'Поиск по модели…',
  'search.placeholder': 'Поиск по всем слоям — например: биллинг, авария, партнёр, SLA…',
  'search.hint':
    'Введите минимум два символа. Поиск охватывает все элементы всех фреймворков, включая путь навигации.',
  'search.empty': 'Ничего не найдено.',
  'search.nav': '↑ ↓ навигация',
  'search.open': '↵ открыть',
  'search.close': 'esc закрыть',
  'search.results': {
    one: '{count} результат',
    few: '{count} результата',
    many: '{count} результатов',
    other: '{count} результата',
  },

  'nav.group.model': 'Модель',
  'nav.group.reference': 'Справка',
  'nav.overview': 'Обзор',
  'nav.concepts': 'Карта концепций',
  'nav.matrices': 'Матрицы',
  'nav.about': 'О проекте и источниках',
  'nav.tmforum': 'Модель TM Forum ↗',

  'band.1': 'Бизнес-архитектура',
  'band.2': 'Процессы и функции',
  'band.3': 'Информация и измерения',

  'home.kicker': 'TM Forum · Открытая цифровая архитектура',
  'home.title': 'Одна архитектура — восемь представлений.',
  'home.lede1':
    'MODA — эталонная архитектура TM Forum для цифрового бизнеса. Она не изобретает новый способ моделировать компанию, а выстраивает в одну систему те представления, которые оператору и так нужны: чем является бизнес (домены), что он делает (процессы eTOM), что он должен уметь (функции), что это реализует (приложения), какие данные он несёт (информация) и как он понимает, что всё получилось (метрики).',
  'home.lede2':
    'Этот обозреватель читает опубликованную TM Forum модель и позволяет переходить между представлениями, не теряя места, — смысл MODA проявляется только тогда, когда один процесс можно проследить сразу во всех слоях.',
  'home.cta.etom': 'Начать с eTOM →',
  'home.cta.concepts': 'Проследить концепцию по слоям',
  'home.cta.root': 'Корень модели',
  'home.stat.elements': 'элементов модели',
  'home.stat.frameworks': 'фреймворков',
  'home.stat.domains': 'бизнес-доменов',
  'home.stat.note':
    'Каждый элемент ведёт на свою страницу в опубликованной модели TM Forum, поэтому всё здесь можно сверить с источником.',
  'home.master.title': 'Мастер-диаграмма ODA',
  'home.master.hint': 'нажмите на слой, чтобы открыть его',
  'home.inside.title': 'Внутри каждого фреймворка',
  'home.inside.hint': 'опубликованное дерево пакетов прямо из модели',
  'home.inside.empty': 'Для этой ветки не опубликован уровень пакетов.',
  'home.relations.title': 'Как связаны слои',
  'home.relations.hint': 'связи, которые делают MODA единой моделью',

  'rel.processFunction': 'Процесс выполняется теми способностями, которые спроектированы для него.',
  'rel.functionApplication':
    'Функция предоставляется одним или несколькими приложениями и их открытыми сервисами.',
  'rel.processInformation':
    'Процесс читает и пишет бизнес-сущности информационной модели.',
  'rel.processMetrics':
    'У каждой процессной области есть метрики, по которым видно, работает ли она.',
  'rel.domainInformation':
    'Каждый информационный домен — это представление одного бизнес-домена через сущности.',
  'rel.verticalDomain':
    'Вертикаль — это линза, построенная на доменах и применённая ко всей архитектуре.',
  'rel.architectureProcess':
    'Способности собираются из нижних слоёв, а не придумываются отдельно.',

  'explorer.filter': 'Фильтр: {count} элементов…',
  'explorer.empty': 'Для этого фреймворка данные ещё не загружены.',
  'explorer.hidden': 'Скрыто активным фильтром: {count}',
  'explorer.pick': 'Выберите элемент в дереве, чтобы перейти внутрь.',
  'explorer.loaded': 'Загружено {count} элементов из опубликованной модели TM Forum.',

  'detail.noSummary':
    'Для этого элемента в модели TM Forum нет описания. Ниже есть ссылка на авторитетную страницу источника.',
  'detail.count': {
    one: '{count} элемент',
    few: '{count} элемента',
    many: '{count} элементов',
    other: '{count} элемента',
  },
  'detail.packages': '· {count} пакетов',
  'detail.contains': 'Содержит',
  'detail.more': '+{count} ещё. Используйте дерево слева, чтобы увидеть полную структуру.',
  'detail.concepts': 'Концепции',
  'detail.conceptsHint': 'как этот элемент переносит бизнес-концепцию через все слои MODA',
  'detail.related': 'Связанное в других слоях MODA',
  'detail.relatedHint': 'найдено по совпадающей терминологии в других фреймворках',
  'detail.shares': 'совпадает по слову «{term}»',
  'detail.source': 'Открыть в модели TM Forum ↗',
  'detail.back': '← Назад',
  'common.more': 'ещё +{count}',
  'common.empty': '—',

  'matrix.title': 'Матрицы между фреймворками',
  'matrix.lede':
    'Одни и те же бизнес-домены проходят через каждый слой MODA. Домен Customer, например, — это набор процессов в eTOM, набор функций, набор приложений, набор сущностей и набор метрик. Эта сетка показывает такое выравнивание, посчитанное по актуальной модели.',
  'matrix.grid.title': 'Бизнес-домен × фреймворк',
  'matrix.grid.hint': 'количество элементов · нажмите на ячейку, чтобы раскрыть',
  'matrix.grid.corner': 'Домен ↓',
  'matrix.grid.total': 'Всего по фреймворку',
  'matrix.types.title': 'Типы элементов по фреймворкам',
  'matrix.types.framework': 'Фреймворк',
  'matrix.types.total': 'Всего',
  'matrix.types.hint': 'включая {count} элементов eTOM',

  'concepts.title': 'Карта концепций',
  'concepts.lede':
    'Причина, по которой MODA — не просто набор документов: бизнес-концепции, о которых у каждого фреймворка есть своё мнение — биллинг, заказ, авария, партнёр, кампания — и то, где каждая из них выражена. Нажмите на любую ячейку, чтобы перейти к элементу.',
  'concepts.grid.title': 'Концепция × фреймворк',
  'concepts.grid.hint': 'сопоставлено с актуальной моделью · до {count} фреймворков на концепцию',
  'concepts.grid.corner': 'Концепция',
  'concepts.detail.title': 'Что означает каждая концепция',

  'about.title': 'Об этом обозревателе',
  'about.lede':
    'MODA публикуется TM Forum как доступная для просмотра модель Enterprise Architect. Это приложение читает структуру модели — каждый пакет, процесс, функцию, приложение, сущность и метрику — и представляет её как единую навигируемую архитектуру. Ничего здесь не выдумано: каждый элемент ведёт на свою страницу на tmforum.org.',
  'about.build.title': 'Как это устроено',
  'about.build.structure.title': 'Структура',
  'about.build.structure.body':
    'Опубликованная модель отдаёт всё дерево через XML-файлы, адресуемые по GUID. Каждый узел перечисляет своих детей — имя, тип, ссылку, — поэтому по дереву можно идти узел за узлом, не разбирая отрисованный HTML.',
  'about.build.links.title': 'Перекрёстные ссылки',
  'about.build.links.body':
    'Такие концепции, как биллинг или авария, сопоставляются со своим элементом в каждом фреймворке по имени: сначала по выверенному списку, затем автоматическим поиском по терминологии, — поэтому слои остаются связанными, даже если наверху меняются названия.',
  'about.build.status.title': 'Актуальность',
  'about.build.status.body':
    'Элементы несут номер релиза и статус жизненного цикла, опубликованные TM Forum. Сама модель развивается; обозреватель каждый раз отстраивается от текущей публикации.',
  'about.sources': 'Источники',
  'about.sources.read': 'модель прочитана {date}',
};

export type Locale = 'en' | 'ru';

/** Russian plural rule: 1, 2-4, 5-0 with the usual 11-14 exception. */
function pluralForm(locale: Locale, n: number): PluralForm {
  if (locale === 'en') return n === 1 ? 'one' : 'other';
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return 'many';
  if (last === 1) return 'one';
  if (last >= 2 && last <= 4) return 'few';
  return 'many';
}

export function translate(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  const entry = (locale === 'ru' ? ru : en)[key];
  let text: string;
  if (typeof entry === 'string') {
    text = entry;
  } else {
    const n = Number(params?.count ?? 0);
    text = entry[pluralForm(locale, n)] ?? entry.other;
  }
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = params[key];
    if (value === undefined) return match;
    // group numbers the way the active locale writes them (ru: 1 989)
    return typeof value === 'number' ? formatNumber(locale, value) : String(value);
  });
}

/** Locale-aware thousands grouping: "1,989" in English, "1 989" in Russian. */
export function formatNumber(locale: Locale, n: number): string {
  return new Intl.NumberFormat(locale === 'ru' ? 'ru-RU' : 'en-US').format(n);
}