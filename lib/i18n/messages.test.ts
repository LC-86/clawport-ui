import { describe, expect, it } from 'vitest'
import { formatRelativeTime } from '@/lib/i18n'
import { messages } from './messages'

describe('i18n messages', () => {
  it('keeps zh-CN keys aligned with the English source dictionary', () => {
    expect(Object.keys(messages['zh-CN']).sort()).toEqual(Object.keys(messages.en).sort())
  })

  it('formats relative time differently for Chinese and English locales', () => {
    const now = new Date('2025-03-01T12:00:00Z').getTime()
    const fiveMinutesAgo = new Date(now - 5 * 60_000).toISOString()

    const originalNow = Date.now
    Date.now = () => now

    try {
      expect(formatRelativeTime(fiveMinutesAgo, 'en')).toBe('5m ago')
      expect(formatRelativeTime(fiveMinutesAgo, 'zh-CN')).toBe('5 分钟前')
    } finally {
      Date.now = originalNow
    }
  })
})
