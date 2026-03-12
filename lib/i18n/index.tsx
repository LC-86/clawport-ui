'use client'

import { createContext, useContext, useEffect, useMemo } from 'react'
import { useSettings } from '@/app/settings-provider'
import { messages, type MessageKey } from './messages'
import type { Locale } from './types'

type Primitive = string | number

interface I18nContextValue {
  locale: Locale
  t: (key: MessageKey, params?: Record<string, Primitive>) => string
  formatDate: (value: string | number | Date, options?: Intl.DateTimeFormatOptions) => string
  formatTime: (value: string | number | Date, options?: Intl.DateTimeFormatOptions) => string
  formatDateTime: (value: string | number | Date, options?: Intl.DateTimeFormatOptions) => string
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string
  formatRelativeTime: (value: string | number | Date | null) => string
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'zh-CN',
  t: (key) => key,
  formatDate: (value) => new Date(value).toLocaleDateString('zh-CN'),
  formatTime: (value) => new Date(value).toLocaleTimeString('zh-CN'),
  formatDateTime: (value) => new Date(value).toLocaleString('zh-CN'),
  formatNumber: (value) => new Intl.NumberFormat('zh-CN').format(value),
  formatRelativeTime: () => '刚刚',
})

function interpolate(template: string, params?: Record<string, Primitive>) {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`))
}

function isChinese(locale: Locale) {
  return locale === 'zh-CN'
}

export function formatRelativeTime(value: string | number | Date | null, locale: Locale): string {
  if (!value) return isChinese(locale) ? '从未' : 'never'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'

  const diff = Date.now() - d.getTime()
  const future = diff < 0
  const absDiff = Math.abs(diff)
  const mins = Math.floor(absDiff / 60_000)
  const hrs = Math.floor(absDiff / 3_600_000)
  const days = Math.floor(absDiff / 86_400_000)

  if (mins < 1) return isChinese(locale) ? '刚刚' : 'just now'

  if (future) {
    if (mins < 60) return isChinese(locale) ? `${mins} 分钟后` : `in ${mins}m`
    if (hrs < 24) return isChinese(locale) ? `${hrs} 小时后` : `in ${hrs}h`
    return isChinese(locale) ? `${days} 天后` : `in ${days}d`
  }

  if (mins < 60) return isChinese(locale) ? `${mins} 分钟前` : `${mins}m ago`
  if (hrs < 24) return isChinese(locale) ? `${hrs} 小时前` : `${hrs}h ago`
  return isChinese(locale) ? `${days} 天前` : `${days}d ago`
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings()
  const locale = settings.language

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo<I18nContextValue>(() => {
    const dict = messages[locale]
    const fallback = messages.en

    return {
      locale,
      t: (key, params) => interpolate(dict[key] ?? fallback[key] ?? key, params),
      formatDate: (value, options) => new Intl.DateTimeFormat(locale, options).format(new Date(value)),
      formatTime: (value, options) => new Intl.DateTimeFormat(locale, options).format(new Date(value)),
      formatDateTime: (value, options) => new Intl.DateTimeFormat(locale, options).format(new Date(value)),
      formatNumber: (value, options) => new Intl.NumberFormat(locale, options).format(value),
      formatRelativeTime: (value) => formatRelativeTime(value, locale),
    }
  }, [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}

export function usePageTitle(pageTitle: string) {
  const { settings } = useSettings()

  useEffect(() => {
    const appName = settings.portalName || messages.en['app.name']
    document.title = `${pageTitle} - ${appName}`
  }, [pageTitle, settings.portalName])
}

export type { Locale, MessageKey }

