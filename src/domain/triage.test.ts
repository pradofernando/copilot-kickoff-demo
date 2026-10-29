import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { DEMO_NOW, DEMO_REQUESTS } from '../data/requests.ts'
import type { Priority, ServiceRequest } from './types.ts'
import { isSortOrder, SORT_OPTIONS } from './types.ts'
import {
  filterRequests,
  getDashboardStats,
  getDeadline,
  getSlaLabel,
  getSlaStatus,
  sortRequests,
  validateRequestTitle,
} from './triage.ts'

function request(overrides: Partial<ServiceRequest> = {}): ServiceRequest {
  return {
    id: 'SR-TEST',
    title: 'A synthetic test request',
    category: 'Software',
    priority: 'high',
    status: 'open',
    createdAt: '2026-10-29T10:00:00.000Z',
    ...overrides,
  }
}

describe('SLA deadlines', () => {
  const cases: readonly [Priority, number][] = [
    ['critical', 1], ['high', 4], ['normal', 24], ['low', 72],
  ]
  for (const [priority, hours] of cases) {
    test(`${priority} has a ${hours}-hour target`, () => {
      const item = request({ priority })
      assert.equal(getDeadline(item) - Date.parse(item.createdAt), hours * 3_600_000)
    })
  }

  test('an invalid creation timestamp is reported', () => {
    assert.throws(() => getDeadline(request({ createdAt: 'not-a-date' })), RangeError)
  })
})

describe('SLA status', () => {
  test('a deadline in the past is overdue', () => {
    assert.equal(getSlaStatus(request(), new Date('2026-10-29T14:01:00Z')), 'overdue')
  })

  test('the exact SLA deadline is overdue, not due soon', () => {
    assert.equal(getSlaStatus(request(), DEMO_NOW), 'overdue')
  })

  test('a deadline less than one hour away is due soon', () => {
    assert.equal(getSlaStatus(request(), new Date('2026-10-29T13:30:00Z')), 'due-soon')
  })

  test('the exact one-hour warning boundary is due soon', () => {
    assert.equal(getSlaStatus(request(), new Date('2026-10-29T13:00:00Z')), 'due-soon')
  })

  test('more than one hour remaining is on track', () => {
    assert.equal(getSlaStatus(request(), new Date('2026-10-29T12:00:00Z')), 'on-track')
  })

  test('resolved requests never become overdue', () => {
    assert.equal(getSlaStatus(request({ status: 'resolved' }), DEMO_NOW), 'resolved')
  })

  test('an invalid reference clock is reported', () => {
    assert.throws(() => getSlaStatus(request(), new Date('invalid')), RangeError)
  })
})

describe('SLA labels', () => {
  test('the exact deadline has an explicit overdue label', () => {
    assert.equal(getSlaLabel(request(), DEMO_NOW), 'Overdue now')
  })

  test('remaining time is readable', () => {
    assert.equal(getSlaLabel(request(), new Date('2026-10-29T13:30:00Z')), 'Due in 30m')
  })

  test('elapsed time is readable', () => {
    assert.equal(getSlaLabel(request(), new Date('2026-10-29T16:00:00Z')), '2h overdue')
  })

  test('resolved work is marked completed', () => {
    assert.equal(getSlaLabel(request({ status: 'resolved' }), DEMO_NOW), 'Completed')
  })
})

describe('filtering', () => {
  test('active excludes resolved requests', () => {
    assert.equal(filterRequests(DEMO_REQUESTS, '', 'active').length, 6)
  })

  test('resolved and all views are distinct', () => {
    assert.equal(filterRequests(DEMO_REQUESTS, '', 'resolved').length, 2)
    assert.equal(filterRequests(DEMO_REQUESTS, '', 'all').length, 8)
  })

  test('search is trimmed and case insensitive', () => {
    assert.deepEqual(filterRequests(DEMO_REQUESTS, '  vPn  ', 'all').map((item) => item.id), ['SR-1047'])
  })

  test('IDs and categories are searchable', () => {
    assert.equal(filterRequests(DEMO_REQUESTS, '1042', 'all').length, 1)
    assert.equal(filterRequests(DEMO_REQUESTS, 'hardware', 'all').length, 2)
  })

  test('a query with no match produces an empty list', () => {
    assert.deepEqual(filterRequests(DEMO_REQUESTS, 'does-not-exist', 'all'), [])
  })
})

describe('sorting', () => {
  test('newest first has a deterministic ID tie-break', () => {
    const items = [request({ id: 'B' }), request({ id: 'A' })]
    assert.deepEqual(sortRequests(items, 'newest').map((item) => item.id), ['A', 'B'])
  })

  test('priority first places critical work ahead of low priority', () => {
    const items = [request({ id: 'low', priority: 'low' }), request({ id: 'critical', priority: 'critical' })]
    assert.deepEqual(sortRequests(items, 'priority').map((item) => item.id), ['critical', 'low'])
  })

  test('equal priority places older work first', () => {
    const items = [
      request({ id: 'newer', createdAt: '2026-10-29T12:00:00Z' }),
      request({ id: 'older', createdAt: '2026-10-29T10:00:00Z' }),
    ]
    assert.deepEqual(sortRequests(items, 'priority').map((item) => item.id), ['older', 'newer'])
  })

  test('sorting never mutates the input', () => {
    const items = Object.freeze([request({ id: 'B' }), request({ id: 'A' })])
    assert.notEqual(sortRequests(items, 'priority'), items)
    assert.deepEqual(items.map((item) => item.id), ['B', 'A'])
  })

  test('empty lists work for either baseline sort order', () => {
    assert.deepEqual(sortRequests([], 'newest'), [])
    assert.deepEqual(sortRequests([], 'priority'), [])
  })
})

describe('SLA deadline sorting', () => {
  test('the shared options expose and validate SLA deadline first', () => {
    assert.deepEqual(SORT_OPTIONS.map((option) => option.value), ['newest', 'priority', 'sla'])
    assert.equal(SORT_OPTIONS.find((option) => option.value === 'sla')?.label, 'SLA deadline first')
    assert.equal(isSortOrder('sla'), true)
  })

  test('earlier deadlines take precedence over priority and creation time', () => {
    const items = [
      request({ id: 'critical', priority: 'critical', createdAt: '2026-10-29T12:00:00Z' }),
      request({ id: 'normal', priority: 'normal', createdAt: '2026-10-28T14:00:00Z' }),
      request({ id: 'high', createdAt: '2026-10-29T08:00:00Z' }),
    ]
    assert.deepEqual(sortRequests(items, 'sla').map((item) => item.id), ['high', 'critical', 'normal'])
  })

  test('open and in-progress requests precede resolved work even with earlier deadlines', () => {
    const items = [
      request({ id: 'resolved-later', status: 'resolved', createdAt: '2026-10-28T09:00:00Z' }),
      request({ id: 'open', createdAt: '2026-10-29T10:00:00Z' }),
      request({ id: 'resolved-earlier', status: 'resolved', createdAt: '2026-10-28T08:00:00Z' }),
      request({ id: 'in-progress', status: 'in-progress', createdAt: '2026-10-29T09:00:00Z' }),
    ]
    assert.deepEqual(sortRequests(items, 'sla').map((item) => item.id), [
      'in-progress', 'open', 'resolved-earlier', 'resolved-later',
    ])
  })

  for (const status of ['open', 'resolved'] as const) {
    test(`equal deadlines use higher priority then ID for ${status} work`, () => {
      const items = [
        request({ id: 'normal', status, priority: 'normal', createdAt: '2026-10-28T14:00:00Z' }),
        request({ id: 'high', status, createdAt: '2026-10-29T10:00:00Z' }),
        request({ id: 'B', status, priority: 'critical', createdAt: '2026-10-29T13:00:00Z' }),
        request({ id: 'A', status, priority: 'critical', createdAt: '2026-10-29T13:00:00Z' }),
      ]
      assert.equal(new Set(items.map(getDeadline)).size, 1)
      assert.deepEqual(sortRequests(items, 'sla').map((item) => item.id), ['A', 'B', 'high', 'normal'])
    })
  }

  test('empty input returns a new empty array', () => {
    const items = Object.freeze([])
    const sorted = sortRequests(items, 'sla')
    assert.deepEqual(sorted, [])
    assert.notEqual(sorted, items)
  })

  test('sorting preserves frozen input arrays and records', () => {
    const items = Object.freeze([
      Object.freeze(request({ id: 'B' })),
      Object.freeze(request({ id: 'A' })),
    ])
    const snapshot = structuredClone(items)
    const sorted = sortRequests(items, 'sla')
    assert.deepEqual(sorted.map((item) => item.id), ['A', 'B'])
    assert.notEqual(sorted, items)
    assert.equal(sorted[0], items[1])
    assert.equal(sorted[1], items[0])
    assert.deepEqual(items, snapshot)
  })

  test('SR-1042 is first in the active seed queue', () => {
    const active = filterRequests(DEMO_REQUESTS, '', 'active')
    assert.deepEqual(sortRequests(active, 'sla').map((item) => item.id), [
      'SR-1042', 'SR-1043', 'SR-1047', 'SR-1045', 'SR-1044', 'SR-1046',
    ])
  })
})

describe('dashboard totals', () => {
  test('the fixed demo dataset has stable totals', () => {
    assert.deepEqual(getDashboardStats(DEMO_REQUESTS, DEMO_NOW), {
      active: 6, overdue: 2, critical: 2, resolved: 2,
    })
  })

  test('resolved critical work is not active, critical, or overdue', () => {
    assert.deepEqual(getDashboardStats([request({ priority: 'critical', status: 'resolved' })], DEMO_NOW), {
      active: 0, overdue: 0, critical: 0, resolved: 1,
    })
  })

  test('an empty queue has zero totals', () => {
    assert.deepEqual(getDashboardStats([], DEMO_NOW), { active: 0, overdue: 0, critical: 0, resolved: 0 })
  })
})

describe('request titles', () => {
  test('blank and whitespace-only titles are rejected', () => {
    assert.ok(validateRequestTitle(''))
    assert.ok(validateRequestTitle('       '))
  })

  test('five characters are too short but six are valid', () => {
    assert.ok(validateRequestTitle('short'))
    assert.equal(validateRequestTitle('six ok'), null)
  })

  test('120 characters are allowed but 121 are rejected', () => {
    assert.equal(validateRequestTitle('x'.repeat(120)), null)
    assert.ok(validateRequestTitle('x'.repeat(121)))
  })

  test('surrounding spaces do not count toward the minimum', () => {
    assert.ok(validateRequestTitle('  tiny  '))
  })
})
