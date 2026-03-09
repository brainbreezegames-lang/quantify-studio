import { build } from 'esbuild'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

async function main() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const workspaceRoot = path.resolve(scriptDir, '..')
  const outDir = path.resolve(workspaceRoot, '.test-dist')
  const entry = path.resolve(workspaceRoot, 'tests/regression.ts')
  const outfile = path.resolve(outDir, 'regression.cjs')

  await mkdir(outDir, { recursive: true })

  await build({
    entryPoints: [entry],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    sourcemap: 'inline',
    outfile,
    logLevel: 'silent',
  })

  await import(pathToFileURL(outfile).href)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
