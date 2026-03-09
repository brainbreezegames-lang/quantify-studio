import { build } from 'esbuild'
import path from 'node:path'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'

async function main() {
  const outfile = path.join(tmpdir(), 'uno-golden-hashes.cjs')
  const contents = `
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import MD3Renderer from './src/md3/Renderer'
import { AVONTUS_TOKENS, normalizeDesignTokens } from './src/types'
import { generateXamlReport } from './src/services/xaml'

const tree = JSON.parse(
  readFileSync(path.resolve(process.cwd(), 'tests/fixtures/golden-shipping-workflow.tree.json'), 'utf8')
)
const tokens = normalizeDesignTokens(AVONTUS_TOKENS)
const html = renderToStaticMarkup(
  React.createElement(MD3Renderer, {
    node: tree,
    tokens,
    selectedId: null,
    onSelect: () => {},
  })
)
const report = generateXamlReport(tree, tokens)
const normalize = (text) => text.replace(/\\r\\n/g, '\\n').trim()
const hash = (text) => createHash('sha256').update(normalize(text)).digest('hex')

console.log(JSON.stringify({
  html: hash(html),
  xaml: hash(report.xaml),
  diagnostics: report.diagnostics,
}, null, 2))
`

  await build({
    stdin: {
      contents,
      resolveDir: process.cwd(),
      sourcefile: 'uno-golden-hashes.ts',
      loader: 'ts',
    },
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile,
    logLevel: 'silent',
  })

  await import(pathToFileURL(outfile).href)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
