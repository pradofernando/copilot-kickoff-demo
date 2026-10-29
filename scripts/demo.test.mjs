import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import { getScenarioStatus, planScenario, scenarioFiles, setScenario } from './demo-scenarios.mjs'

const sourceRoot = fileURLToPath(new URL('../', import.meta.url))

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'servicedesk-scenario-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  const baseline = new Map(planScenario(sourceRoot, 'baseline').map((change) => [change.file, change.after]))
  for (const file of scenarioFiles) {
    const target = join(root, file)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, baseline.get(file) ?? readFileSync(join(sourceRoot, file), 'utf8'))
  }
  return root
}

test('baseline is idempotent', (t) => {
  const root = fixture(t)
  assert.equal(getScenarioStatus(root), 'baseline')
  assert.deepEqual(setScenario(root, 'baseline'), [])
})

test('PR scenario changes three files and is idempotent', (t) => {
  const root = fixture(t)
  assert.equal(setScenario(root, 'pr').length, 3)
  assert.equal(getScenarioStatus(root), 'pr')
  assert.deepEqual(setScenario(root, 'pr'), [])
  assert.equal(setScenario(root, 'baseline').length, 3)
  assert.equal(getScenarioStatus(root), 'baseline')
})

test('review bug changes one file and can be reversed', (t) => {
  const root = fixture(t)
  assert.equal(setScenario(root, 'review-bug').length, 1)
  assert.equal(getScenarioStatus(root), 'review-bug')
  assert.equal(setScenario(root, 'baseline').length, 1)
})

test('switching directly between scenarios never combines them', (t) => {
  const root = fixture(t)
  setScenario(root, 'pr')
  setScenario(root, 'review-bug')
  assert.equal(getScenarioStatus(root), 'review-bug')
  setScenario(root, 'pr')
  assert.equal(getScenarioStatus(root), 'pr')
})

test('unrelated edits are preserved', (t) => {
  const root = fixture(t)
  const file = join(root, 'src', 'domain', 'triage.ts')
  const note = '\nexport const presenterNote = "Preserve my work"\n'
  writeFileSync(file, readFileSync(file, 'utf8') + note)
  setScenario(root, 'pr')
  setScenario(root, 'baseline')
  assert.ok(readFileSync(file, 'utf8').endsWith(note))
})

test('edited anchors abort before any file is written', (t) => {
  const root = fixture(t)
  const file = join(root, 'src', 'domain', 'triage.ts')
  writeFileSync(file, readFileSync(file, 'utf8').replace("if (sortOrder === 'priority')", "if ('priority' === sortOrder)"))
  const before = scenarioFiles.map((path) => readFileSync(join(root, path), 'utf8'))
  assert.throws(() => setScenario(root, 'pr'), /Cannot recognize/)
  assert.deepEqual(scenarioFiles.map((path) => readFileSync(join(root, path), 'utf8')), before)
})

test('edited prepared feature code is not overwritten', (t) => {
  const root = fixture(t)
  setScenario(root, 'pr')
  const file = join(root, 'src', 'domain', 'types.ts')
  writeFileSync(file, readFileSync(file, 'utf8').replace('SLA deadline first', 'Custom SLA order'))
  assert.throws(() => setScenario(root, 'baseline'), /Cannot recognize/)
})

test('Windows CRLF source files are supported without changing line endings', (t) => {
  const root = fixture(t)
  for (const file of scenarioFiles) {
    const path = join(root, file)
    writeFileSync(path, readFileSync(path, 'utf8').replaceAll('\r\n', '\n').replaceAll('\n', '\r\n'))
  }
  setScenario(root, 'pr')
  setScenario(root, 'baseline')
  for (const file of scenarioFiles) {
    assert.equal(readFileSync(join(root, file), 'utf8').replaceAll('\r\n', '').includes('\n'), false)
  }
})

test('unknown scenarios are rejected without changes', (t) => {
  const root = fixture(t)
  assert.throws(() => setScenario(root, 'typo'), /Unknown scenario/)
  assert.equal(getScenarioStatus(root), 'baseline')
})
