import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../../../', import.meta.url))
const result = spawnSync(process.execPath, ['--test', '--test-reporter=spec', join(root, 'src', 'domain', 'triage.test.ts')], {
  cwd: root,
  stdio: 'inherit',
})
if (result.error) throw result.error
if (result.signal) throw new Error(`Domain verification was terminated by ${result.signal}.`)
if (result.status === null) throw new Error('Domain verification did not return an exit code.')
process.exitCode = result.status
