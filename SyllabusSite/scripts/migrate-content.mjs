import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const nested = path.join(root, 'SyllabusSite', 'public', 'content')
const dest = path.join(root, 'public', 'content')
const log = { moved: [], overwrites: [], errors: [] }

if (!fs.existsSync(nested)) {
    console.log('No nested content directory found:', nested)
    process.exit(0)
}

fs.mkdirSync(dest, { recursive: true })

function copyDir(srcDir, destDir) {
    const entries = fs.readdirSync(srcDir, { withFileTypes: true })
    for (const e of entries) {
        const s = path.join(srcDir, e.name)
        const d = path.join(destDir, e.name)
        try {
            if (e.isDirectory()) {
                fs.mkdirSync(d, { recursive: true })
                copyDir(s, d)
            } else if (e.isFile()) {
                const stat = fs.statSync(s)
                const existed = fs.existsSync(d)
                const content = fs.readFileSync(s)
                fs.writeFileSync(d, content)
                fs.chmodSync(d, stat.mode)
                fs.utimesSync(d, stat.atime, stat.mtime)
                log.moved.push({ from: s, to: d })
                if (existed) log.overwrites.push(d)
            }
        } catch (err) {
            log.errors.push({ path: s, error: String(err) })
        }
    }
}

copyDir(nested, dest)

// Remove nested directory after successful copy
try {
    fs.rmSync(path.join(root, 'SyllabusSite'), { recursive: true, force: true })
    log.deletedNested = true
} catch (err) {
    log.deletedNested = false
    log.errors.push({ path: path.join(root, 'SyllabusSite'), error: String(err) })
}

fs.writeFileSync(path.join(dest, 'migrate-log.json'), JSON.stringify(log, null, 2))
console.log('Migrated content to:', dest)
