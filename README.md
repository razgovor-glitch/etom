# MODA Explorer

An interactive React + TypeScript explorer for **MODA — the Model of the Open Digital Architecture**
published by TM Forum.

It presents the architecture as one navigable model rather than eight disconnected documents:

| Layer | Framework | The question it answers |
| --- | --- | --- |
| Business architecture | Domains, Verticals, Business Architecture | What kind of business object are we talking about? |
| Process & function | Business Process Framework (eTOM), Functional Framework, Application Framework | What does the business do, what must be able to do, and which system delivers it? |
| Information & measurement | Information Framework (SID lineage), Business Metrics | Which entities carry the data, and how do we know it worked? |

## What it does

- **Master ODA diagram** — the nine published packages arranged in their architecture bands.
- **Per-framework explorer** — the real package tree, filterable by name and by business domain.
- **Concept map** — 28 business concepts (billing, order, fault, partner, campaign …) resolved to the
  element each framework uses for them, with a matrix of concept × framework.
- **Cross-framework matrices** — business domain × framework coverage, counted from the model, plus
  element-type composition.
- **Global search** (⌘K) across every element of every framework.
- **English / Russian interface** — switchable from the top bar, remembered across sessions and
  defaulting from the browser language. Model content stays verbatim: TM Forum element names,
  domain names and releases are official names from a published standard, so they are shown as
  published (with a Russian gloss where it aids reading) rather than replaced with a translation.
- **Automatic cross-references** — when you open an element, the app finds elements in *other*
  frameworks that share distinctive terminology, e.g. eTOM's *Manage Customer Billing Account*
  surfaces the matching application, information entity and metrics.
- Every element deep-links back to its page in the published TM Forum model.

## Where the data comes from

TM Forum publishes MODA as an Enterprise Architect HTML model at
<https://www.tmforum.org/MODA/index.htm>. That export exposes its entire tree through
GUID-keyed static XML files under `/MODA/js/data/<GUID>.xml`, each listing a node's children with
their names, types, links and GUIDs. This project walks that structure rather than scraping
rendered HTML, so the tree it shows is the published tree.

Two curation rules are applied in `scripts/build-data.mjs`:

- **Tombstones are dropped.** TM Forum keeps retired elements in the model (`Billing Data Mediation
  (Deleted)`); they live in their own `Deleted …` packages and would otherwise swamp the live model.
- **Framework identity comes from the id-path**, not from which file a row arrived in, and any
  element whose parent was not crawled is re-attached to its nearest surviving ancestor.

### Coverage

The largest branches of the published model (a single eTOM domain package carries 250–280 process
elements) exceed the response-size limit of the fetching tool, and direct HTTP requests are blocked
by a Cloudflare challenge, so a few very large listings were captured head-and-tail. Every branch is
therefore **substantially** rather than exhaustively covered: all eight eTOM domains, all nine
business domains, and every framework package spine are present, with a few thousand elements
missing from the middle of the largest listings. The app is built to stay correct as coverage
grows — the raw JSONL is the source of truth, so re-running the crawl and then
`node scripts/build-data.mjs` extends the model without code changes.

## Running it

```bash
npm install
npm run dev        # development server
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

Regenerating `src/data/model.json` from the crawled raw data:

```bash
node scripts/build-data.mjs
```

## Layout

```
src/
  types.ts               shared data contract (ModaNode)
  data/
    raw/*.jsonl          crawl output, one element per line
    model.json           generated payload (npm build step)
    model.ts             typed loader + tree indexes
    meta.ts              framework descriptions and source links
    crossLinks.ts        curated concept → element map
  i18n/
    dictionaries.ts      en + ru strings (en is the checked source of truth)
    index.tsx            provider, locale switching, plural rules
    domains.ts           Russian glosses for the MODA domain names
  lib/
    links.ts             concept resolution + automatic cross-framework matching
    search.ts            search with highlighting
    router.ts            hash routing and theme
  components/            Overview, Explorer, NodeDetail, Matrix, Concepts, SearchPalette
scripts/build-data.mjs   raw JSONL -> model.json
```

## Attribution

MODA, eTOM, SID and the TM Forum frameworks are trademarks and models of **TM Forum**. This project
is an independent visualisation of the publicly published model; every element links back to the
source for verification.