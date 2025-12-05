import type { Manifest } from '../lib/types'
import clsx from 'clsx'

export default function Tree({ manifest, onSelect, current }: { manifest: Manifest; onSelect: (id: string) => void; current?: string }) {
  return (
    <ul className="tree" role="tree" aria-label="Syllabus">
      {manifest.units.map(u => (
        <li key={u.id} role="treeitem" aria-expanded={true}>
          <div className="node">
            <span className="unit">{u.title}</span>
          </div>
          <ul className="tree" role="group">
            {u.sections.map(s => (
              <li key={s.id} role="treeitem" aria-expanded={true}>
                <div className="section">{s.title}</div>
                <ul className="tree" role="group">
                  {s.lessons.map(l => (
                    <li key={l.id} role="treeitem">
                      <button className={clsx('btn', current === l.id && 'primary')} onClick={() => onSelect(l.id)} aria-current={current === l.id ? 'true' : 'false'}>
                        <div>{stripLabel(l.title)}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

function stripLabel(t: string) {
  return t.replace(/\s*Learning Objectives\s*:?/ig, '').trim() || t
}
