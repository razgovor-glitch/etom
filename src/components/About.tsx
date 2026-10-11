import { SOURCES } from '../data/meta';
import { MODEL_GENERATED_AT, MODEL_SOURCE } from '../data/model';
import { useI18n } from '../i18n';

export default function About() {
  const { t, locale } = useI18n();
  const read = MODEL_GENERATED_AT
    ? t('about.sources.read', {
        date: new Date(MODEL_GENERATED_AT).toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-GB'),
      })
    : null;

  return (
    <>
      <div className="page-title">{t('about.title')}</div>
      <p className="page-lede">{t('about.lede')}</p>

      <div className="section">
        <div className="section-head">
          <h3>{t('about.build.title')}</h3>
        </div>
        <div className="concept-grid">
          <div className="panel concept-card">
            <h4>{t('about.build.structure.title')}</h4>
            <p className="muted small" style={{ margin: 0 }}>
              {t('about.build.structure.body')}
            </p>
          </div>
          <div className="panel concept-card">
            <h4>{t('about.build.links.title')}</h4>
            <p className="muted small" style={{ margin: 0 }}>
              {t('about.build.links.body')}
            </p>
          </div>
          <div className="panel concept-card">
            <h4>{t('about.build.status.title')}</h4>
            <p className="muted small" style={{ margin: 0 }}>
              {t('about.build.status.body')}
            </p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h3>{t('about.sources')}</h3>
          <span className="hint">{read ?? MODEL_SOURCE}</span>
        </div>
        <div className="concept-grid">
          {SOURCES.map((s) => (
            <a key={s.url} className="panel concept-card" href={s.url} target="_blank" rel="noreferrer">
              <h4 style={{ color: 'var(--accent)' }}>{s.label} ↗</h4>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}