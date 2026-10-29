import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const priorityOption = "  { value: 'priority', label: 'Priority first' },"
const sortAnchor = "    if (sortOrder === 'priority') {"
const testAnchor = "describe('sorting', () => {"
const overdueCheck = "  if (deadline <= now.getTime()) return 'overdue'"

const slaSort = `    if (sortOrder === 'sla') {
      return Number(left.status === 'resolved') - Number(right.status === 'resolved')
        || getDeadline(left) - getDeadline(right)
        || PRIORITY_RANK[right.priority] - PRIORITY_RANK[left.priority]
        || Date.parse(left.createdAt) - Date.parse(right.createdAt)
        || left.id.localeCompare(right.id)
    }
${sortAnchor}`

const slaTests = `describe('SLA-first sorting', () => {
  test('active deadlines come first and resolved work stays last', () => {
    const items = [
      request({ id: 'resolved', status: 'resolved', priority: 'critical', createdAt: '2026-10-29T08:00:00Z' }),
      request({ id: 'later', createdAt: '2026-10-29T12:00:00Z' }),
      request({ id: 'first', priority: 'normal', createdAt: '2026-10-28T10:00:00Z' }),
      request({ id: 'second', priority: 'critical', createdAt: '2026-10-29T12:00:00Z' }),
    ]
    assert.deepEqual(sortRequests(items, 'sla').map((item) => item.id), ['first', 'second', 'later', 'resolved'])
  })

  test('equal deadlines use priority, then ID for deterministic ties', () => {
    const items = [
      request({ id: 'high', createdAt: '2026-10-29T10:00:00Z' }),
      request({ id: 'critical-B', priority: 'critical', createdAt: '2026-10-29T13:00:00Z' }),
      request({ id: 'critical-A', priority: 'critical', createdAt: '2026-10-29T13:00:00Z' }),
    ]
    assert.deepEqual(sortRequests(items, 'sla').map((item) => item.id), ['critical-A', 'critical-B', 'high'])
  })

  test('SLA sorting does not mutate input and accepts an empty list', () => {
    const items = Object.freeze([request({ id: 'B' }), request({ id: 'A' })])
    assert.deepEqual(sortRequests(items, 'sla').map((item) => item.id), ['A', 'B'])
    assert.deepEqual(items.map((item) => item.id), ['B', 'A'])
    assert.deepEqual(sortRequests([], 'sla'), [])
  })
})

${testAnchor}`

const variants = [
  {
    file: ['src', 'domain', 'types.ts'],
    scenario: 'pr',
    before: priorityOption,
    after: `${priorityOption}\n  { value: 'sla', label: 'SLA deadline first' },`,
    marker: "{ value: 'sla'",
  },
  {
    file: ['src', 'domain', 'triage.ts'],
    scenario: 'pr',
    before: sortAnchor,
    after: slaSort,
    marker: "if (sortOrder === 'sla')",
  },
  {
    file: ['src', 'domain', 'triage.test.ts'],
    scenario: 'pr',
    before: testAnchor,
    after: slaTests,
    marker: "describe('SLA-first sorting'",
  },
  {
    file: ['src', 'domain', 'triage.ts'],
    scenario: 'review-bug',
    before: overdueCheck,
    after: "  if (deadline < now.getTime()) return 'overdue'",
    marker: "if (deadline < now.getTime())",
  },
]

export const scenarioFiles = [...new Set(variants.map((variant) => join(...variant.file)))]
export const scenarioNames = ['baseline', 'pr', 'review-bug']

function normalizeSnippet(snippet, text) {
  return text.includes('\r\n') ? snippet.replaceAll('\n', '\r\n') : snippet
}

function readVariant(text, variant) {
  const before = normalizeSnippet(variant.before, text)
  const after = normalizeSnippet(variant.after, text)
  const activeCount = text.split(after).length - 1
  const otherAnchors = text.replace(after, '').split(before).length - 1
  if (activeCount === 1 && otherAnchors === 0) return { active: true, before, after }
  if (activeCount === 0 && !text.includes(variant.marker) && text.split(before).length === 2) {
    return { active: false, before, after }
  }
  throw new Error(`Cannot recognize the demo snippet in ${join(...variant.file)}. No files were changed. Save your work and use a clean demo copy; this command will not overwrite edited scenario code.`)
}

export function getScenarioStatus(root) {
  const states = variants.map((variant) => ({
    scenario: variant.scenario,
    active: readVariant(readFileSync(join(root, ...variant.file), 'utf8'), variant).active,
  }))
  const prStates = states.filter((state) => state.scenario === 'pr')
  const hasPr = prStates.every((state) => state.active)
  if (prStates.some((state) => state.active) && !hasPr) return 'mixed'
  const hasBug = states.some((state) => state.scenario === 'review-bug' && state.active)
  if (hasPr && hasBug) return 'mixed'
  return hasPr ? 'pr' : hasBug ? 'review-bug' : 'baseline'
}

export function planScenario(root, scenario) {
  if (!scenarioNames.includes(scenario)) throw new Error(`Unknown scenario: ${scenario}`)
  const files = new Map(scenarioFiles.map((file) => [file, {
    path: join(root, file),
    before: readFileSync(join(root, file), 'utf8'),
  }]))
  const planned = new Map([...files].map(([file, value]) => [file, value.before]))
  for (const variant of variants) {
    const file = join(...variant.file)
    const text = planned.get(file)
    const state = readVariant(text, variant)
    const shouldBeActive = variant.scenario === scenario
    planned.set(file, state.active === shouldBeActive ? text
      : text.replace(state.active ? state.after : state.before, shouldBeActive ? state.after : state.before))
  }
  return [...files].flatMap(([file, value]) =>
    value.before === planned.get(file) ? [] : [{ ...value, file, after: planned.get(file) }],
  )
}

export function setScenario(root, scenario) {
  const changes = planScenario(root, scenario)
  for (const change of changes) writeFileSync(change.path, change.after, 'utf8')
  return changes
}
