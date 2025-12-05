import fs from 'node:fs'
import path from 'node:path'

const src = path.resolve(process.cwd(), '..', 'Markdown Files')
const outDir = path.resolve(process.cwd(), 'public/content')
fs.mkdirSync(outDir, { recursive: true })

const units = fs.readdirSync(src).filter(n => n.startsWith('UNIT-')).sort()
const manifest = { units: [] }
const unitSectionMaps = new Map()
const allFiles = []

for (const u of units) {
  const udir = path.join(src, u)
  const files = fs.readdirSync(udir).filter(f => f.endsWith('.md')).sort()
  const unit = { id: u, title: u.replace('UNIT-', 'Unit '), sections: [], unitNumber: u.replace('UNIT-', '') }
  const sectionMap = new Map()
  for (const f of files) {
    const full = path.join(udir, f)
    allFiles.push({ unitDir: udir, unitId: u, file: f, full })
  }
  manifest.units.push(unit)
  unitSectionMaps.set(u, sectionMap)
}

// Determine the single global first file to skip metadata removal
allFiles.sort((a, b) => (a.unitId + a.file).localeCompare(b.unitId + b.file))
const skipFirstPath = allFiles.length ? allFiles[0].full : null

// Build content and manifest
const report = []
for (const entry of allFiles) {
  const { unitDir: udir, unitId: u, file: f, full } = entry
  const unit = manifest.units.find(x => x.id === u)
  const sectionMap = unitSectionMaps.get(u)
  let md = fs.readFileSync(full, 'utf8')
  const lines = md.split('\n')
  let removed = false
  let meta = null
  const metaRe = /^\s*unit:\s*(.*?)\s+topic:\s*(.*?)\s+objectives:\s*(.*?)\s+difficulty:\s*(.*?)\s*$/i
  if (full !== skipFirstPath && lines.length) {
    const m = lines[0].match(metaRe)
    if (m) {
      meta = { unit: m[1].trim(), topic: m[2].trim(), objectives: m[3].trim(), difficulty: m[4].trim() }
      lines.shift()
      removed = true
      md = lines.join('\n')
    }
  }
  // Extract titles
  const h1 = (md.match(/^#\s+(.+)$/m) || [, ''])[1].trim()
  const h2 = (md.match(/^##\s+(.+)$/m) || [, ''])[1].trim()
  const fileTitle = h1 || f.replace(/\.[^/.]+$/, '')
  const subtitle = h2 || toTitle(f.replace(/^\d+[.-]?/, '').replace(/[-_]/g, ' '))
  // Update unit title using metadata if present
  if (meta) {
    unit.title = `Unit ${meta.unit}: ${meta.topic}`
    unit.unitNumber = meta.unit
    unit.topic = meta.topic
  } else if (!unit.topic) {
    unit.topic = h1 || unit.title
  }
  // Section grouping by numeric prefix remains
  const sectionKey = f.split('-')[0]
  const sectionTitle = `Section ${sectionKey}`
  if (!sectionMap.has(sectionKey)) sectionMap.set(sectionKey, { id: sectionKey, title: sectionTitle, lessons: [] })
  const rel = `${u}/${f}`
  const outFile = path.join(outDir, rel)
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, md)
  const lessonId = `${u}/${f}`
  sectionMap.get(sectionKey).lessons.push({ id: lessonId, title: fileTitle, subtitle, path: `content/${rel}` })
  const removedCheck = full === skipFirstPath ? false : !!meta
  report.push({ file: full, skipped: full === skipFirstPath, hadMeta: !!meta, removed: removedCheck })
}

// populate unit sections from maps
for (const u of manifest.units) {
  const map = unitSectionMaps.get(u.id)
  u.sections = Array.from(map.values())
}
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2))
fs.writeFileSync(path.join(outDir, 'cleanup-report.json'), JSON.stringify({ removed: report.filter(r => r.removed).length, total: report.length, details: report }, null, 2))
console.log('Content built:', path.join(outDir, 'manifest.json'))

function toTitle(s) {
  return s.replace(/\b\w+/g, w => w.charAt(0).toUpperCase() + w.slice(1))
}
