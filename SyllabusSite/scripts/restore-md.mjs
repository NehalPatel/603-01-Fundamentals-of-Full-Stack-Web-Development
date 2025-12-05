import fs from 'node:fs'
import path from 'node:path'

const projectRoot = path.resolve(process.cwd(), '..')
const destRoot = path.join(projectRoot, 'Markdown Files')
const srcRoot = path.join(process.cwd(), 'public', 'content')

const log = { restored: [], overwrites: [], errors: [] }

function ensureDir(p){ fs.mkdirSync(p, { recursive: true }) }

function copyBack(){
  const units = fs.readdirSync(srcRoot).filter(n => /^UNIT-\d+$/.test(n))
  units.forEach(u => {
    const srcUnit = path.join(srcRoot, u)
    const destUnit = path.join(destRoot, u)
    ensureDir(destUnit)
    const files = fs.readdirSync(srcUnit).filter(f => f.toLowerCase().endsWith('.md'))
    files.forEach(f => {
      const from = path.join(srcUnit, f)
      const to = path.join(destUnit, f)
      try {
        const existed = fs.existsSync(to)
        const buf = fs.readFileSync(from)
        fs.writeFileSync(to, buf)
        const stat = fs.statSync(from)
        fs.chmodSync(to, stat.mode)
        fs.utimesSync(to, stat.atime, stat.mtime)
        log.restored.push({ from, to })
        if (existed) log.overwrites.push(to)
      } catch (e) {
        log.errors.push({ file: from, error: String(e) })
      }
    })
  })
}

copyBack()

fs.writeFileSync(path.join(srcRoot, 'restore-log.json'), JSON.stringify(log, null, 2))
console.log('Restored markdown files to:', destRoot)
