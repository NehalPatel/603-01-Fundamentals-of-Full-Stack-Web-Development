import { useEffect, useMemo, useState } from 'react'
import FlexSearch from 'flexsearch'

export default function Toolbar({ manifest, onSearch, theme, setTheme }: { manifest: any; onSearch: (ids: string[]) => void; theme: string; setTheme: (t: string) => void }) {
  const [q, setQ] = useState('')
  const index = useMemo(() => new FlexSearch.Index({ tokenize: 'forward' }), [])
  useEffect(() => {
    manifest.units.forEach((u: any) => u.sections.forEach((s: any) => s.lessons.forEach((l: any) => index.add(l.id, `${l.title} ${l.path}`))))
  }, [manifest, index])
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme) }, [theme])
  return (
    <div className="toolbar" role="region" aria-label="Toolbar">
      <div className="search" role="search">
        <label className="sr-only" htmlFor="q">Search</label>
        <input id="q" value={q} onChange={e => setQ(e.target.value)} placeholder="Search syllabus" onKeyUp={() => onSearch(q ? index.search(q) : [])} />
      </div>
      <button className="btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-pressed={theme === 'dark'}>Toggle {theme === "dark" ? "Light" : "Dark"}</button>
    </div>
  )
}
