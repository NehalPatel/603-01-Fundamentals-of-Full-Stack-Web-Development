import fs from 'node:fs'
import path from 'node:path'

const projectRoot = path.resolve(process.cwd(), '..')
const srcRoot = path.join(projectRoot, 'Markdown Files')
const destRoot = path.join(process.cwd(), 'public', 'content')
fs.mkdirSync(destRoot, { recursive: true })

const isUnitDir = (name) => /^UNIT-\d+$/i.test(name) || /^Unit-\d+$/i.test(name)
const normalizeUnit = (name) => name.toUpperCase().startsWith('UNIT-') ? name.toUpperCase() : name.replace(/^Unit-/i, 'UNIT-')

const units = fs.readdirSync(srcRoot).filter(isUnitDir).map(normalizeUnit)
const log = { moved: [], overwrites: [], errors: [] }

for (const unit of units) {
  const srcUnitDir = path.join(srcRoot, unit)
  const destUnitDir = path.join(destRoot, unit)
  fs.mkdirSync(destUnitDir, { recursive: true })
  const files = fs.readdirSync(srcUnitDir).filter(f => f.toLowerCase().endsWith('.md'))
  for (const f of files) {
    const srcPath = path.join(srcUnitDir, f)
    const destPath = path.join(destUnitDir, f)
    try {
      const stat = fs.statSync(srcPath)
      const existed = fs.existsSync(destPath)

      // Prefer cleaned content if available
      let content = fs.readFileSync(srcPath, 'utf8')
      const cleanedPath = destPath // cleaned copies are already built to destRoot
      if (fs.existsSync(cleanedPath)) {
        const cleaned = fs.readFileSync(cleanedPath, 'utf8')
        if (cleaned) content = cleaned
      }

      fs.writeFileSync(destPath, content)
      fs.chmodSync(destPath, stat.mode)
      fs.utimesSync(destPath, stat.atime, stat.mtime)

      // Delete original to avoid duplicates
      fs.unlinkSync(srcPath)

      log.moved.push({ from: srcPath, to: destPath })
      if (existed) log.overwrites.push(destPath)
    } catch (e) {
      log.errors.push({ file: srcPath, error: String(e) })
    }
  }
}

// Validation
const srcRemaining = units.flatMap(u => fs.readdirSync(path.join(srcRoot, u)).filter(f => f.toLowerCase().endsWith('.md')))
const destFiles = units.flatMap(u => fs.readdirSync(path.join(destRoot, u)).filter(f => f.toLowerCase().endsWith('.md')))

fs.writeFileSync(path.join(destRoot, 'move-log.json'), JSON.stringify({ ...log, srcRemainingCount: srcRemaining.length, destCount: destFiles.length }, null, 2))
console.log('Moved markdown files to:', destRoot)
console.log('Overwrites:', log.overwrites.length)
console.log('Remaining .md in source:', srcRemaining.length)
