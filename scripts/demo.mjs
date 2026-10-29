import { fileURLToPath } from 'node:url'
import { getScenarioStatus, scenarioNames, setScenario } from './demo-scenarios.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const scenario = process.argv[2] ?? 'status'
if (scenario === 'status') {
  console.log(`Demo scenario: ${getScenarioStatus(root)}`)
} else if (scenarioNames.includes(scenario)) {
  const changes = setScenario(root, scenario)
  console.log(`Demo scenario: ${scenario} (${changes.length} files changed)`)
  for (const change of changes) console.log(`  ${change.file}`)
  console.log(scenario === 'review-bug'
    ? 'Intentional boundary bug active. npm test MUST fail; do not commit this scenario.'
    : 'Run npm run check before presenting or committing.')
} else {
  console.error(`Unknown scenario "${scenario}". Use status, ${scenarioNames.join(', ')}.`)
  process.exitCode = 1
}
