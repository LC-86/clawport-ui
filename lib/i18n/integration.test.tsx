// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SettingsProvider } from '@/app/settings-provider'
import { ErrorState } from '@/components/ErrorState'
import { SearchTrigger } from '@/components/GlobalSearch'
import { NavLinks } from '@/components/NavLinks'
import { LanguageSection } from '@/components/settings/LanguageSection'
import { I18nProvider, useI18n } from '@/lib/i18n'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}))

function RelativeTimeProbe() {
  const { formatRelativeTime } = useI18n()
  return <div>{formatRelativeTime(new Date(Date.now() - 30_000).toISOString())}</div>
}

function TestApp() {
  return (
    <SettingsProvider>
      <I18nProvider>
        <LanguageSection />
        <SearchTrigger onClick={() => {}} />
        <NavLinks />
        <ErrorState message="boom" onRetry={() => {}} />
        <RelativeTimeProbe />
      </I18nProvider>
    </SettingsProvider>
  )
}

describe('i18n integration', () => {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input)
    if (url.includes('/api/agents')) {
      return { ok: true, json: async () => [] }
    }
    if (url.includes('/api/crons')) {
      return { ok: true, json: async () => [] }
    }
    return { ok: true, json: async () => ({}) }
  })

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockClear()
    localStorage.clear()
    document.documentElement.lang = 'zh-CN'
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('switches the UI between Chinese and English immediately', async () => {
    render(<TestApp />)

    expect(screen.getByText('语言')).toBeTruthy()
    expect(screen.getByText('搜索...')).toBeTruthy()
    expect(screen.getByText('工作区')).toBeTruthy()
    expect(screen.getByText('地图')).toBeTruthy()
    expect(screen.getByText('重试')).toBeTruthy()
    expect(screen.getByText('刚刚')).toBeTruthy()

    fireEvent.click(screen.getByRole('radio', { name: 'English' }))

    await waitFor(() => {
      expect(document.documentElement.lang).toBe('en')
      expect(screen.getByText('Language')).toBeTruthy()
      expect(screen.getByText('Search...')).toBeTruthy()
      expect(screen.getByText('Workspace')).toBeTruthy()
      expect(screen.getByText('Map')).toBeTruthy()
      expect(screen.getByText('Try Again')).toBeTruthy()
      expect(screen.getByText('just now')).toBeTruthy()
    })
  })
})
