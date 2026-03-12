'use client'

import { useSettings } from '@/app/settings-provider'
import { useI18n } from '@/lib/i18n'

const OPTIONS = [
  { value: 'zh-CN' as const, labelKey: 'settings.language.zhOption' as const },
  { value: 'en' as const, labelKey: 'settings.language.enOption' as const },
]

export function LanguageSection() {
  const { settings, setLanguage } = useSettings()
  const { t } = useI18n()

  return (
    <section style={{ marginBottom: 'var(--space-8)' }}>
      <div
        style={{
          fontSize: 'var(--text-caption1)',
          fontWeight: 'var(--weight-semibold)',
          letterSpacing: 'var(--tracking-wide)',
          textTransform: 'uppercase',
          color: 'var(--text-tertiary)',
          padding: '0 var(--space-4) var(--space-2)',
        }}
      >
        {t('settings.language.section')}
      </div>
      <div
        style={{
          background: 'var(--material-regular)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--separator)',
          padding: 'var(--space-4)',
        }}
      >
        <div
          style={{
            fontSize: 'var(--text-footnote)',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-3)',
          }}
        >
          {t('settings.language.description')}
        </div>
        <div
          role="radiogroup"
          aria-label={t('settings.language.section')}
          style={{
            display: 'inline-flex',
            gap: 'var(--space-1)',
            padding: 3,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--fill-quaternary)',
          }}
        >
          {OPTIONS.map((option) => {
            const isActive = settings.language === option.value
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => setLanguage(option.value)}
                className="focus-ring"
                style={{
                  minWidth: 108,
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--text-footnote)',
                  fontWeight: isActive ? 'var(--weight-semibold)' : 'var(--weight-medium)',
                  background: isActive ? 'var(--accent-fill)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  transition: 'all 150ms var(--ease-smooth)',
                }}
              >
                {t(option.labelKey)}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
