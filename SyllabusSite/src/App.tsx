import { useEffect, useMemo, useRef, useState, useLayoutEffect } from 'react'
import Tree from './components/Tree'
import Toolbar from './components/Toolbar'
import LessonView from './components/LessonView'
import type { Manifest } from './lib/types'

export default function App() {
  const [manifest, setManifest] = useState<Manifest>({ units: [] })
  const [currentId, setCurrentId] = useState<string>('')
  const [theme, setTheme] = useState<string>('light')
  const [filterIds, setFilterIds] = useState<string[]>([])
  const contentRef = useRef<HTMLDivElement>(null)
  const prevScroll = useRef<{ win: number; content: number }>({ win: 0, content: 0 })

  useEffect(() => { fetch('/content/manifest.json').then(r => r.json()).then(setManifest) }, [])
  const lessons = useMemo(() => manifest.units.flatMap(u => u.sections.flatMap(s => s.lessons)), [manifest])
  const shownLessons = useMemo(() => filterIds.length ? lessons.filter(l => filterIds.includes(l.id)) : lessons, [lessons, filterIds])
  const currentIdx = useMemo(() => shownLessons.findIndex(l => l.id === currentId), [shownLessons, currentId])
  const currentLesson = useMemo(() => shownLessons[currentIdx] || null, [shownLessons, currentIdx])

  useEffect(() => { if (!currentLesson && shownLessons.length) setCurrentId(shownLessons[0].id) }, [shownLessons, currentLesson])

  const saveScroll = () => {
    prevScroll.current.win = window.scrollY
    prevScroll.current.content = contentRef.current?.scrollTop || 0
  }
  const onPrev = () => { if (currentIdx > 0) { saveScroll(); setCurrentId(shownLessons[currentIdx - 1].id) } }
  const onNext = () => { if (currentIdx < shownLessons.length - 1) { saveScroll(); setCurrentId(shownLessons[currentIdx + 1].id) } }

  useLayoutEffect(() => {
    if (!contentRef.current) return
    contentRef.current.scrollTop = prevScroll.current.content
    window.scrollTo({ top: prevScroll.current.win })
  }, [currentLesson])

  return (
    <div className="layout">
      <header className="header">
        <div className="title">SDJIC Full Stack Syllabus</div>
        <div className="theme"><Toolbar manifest={manifest} onSearch={setFilterIds} theme={theme} setTheme={setTheme} /></div>
      </header>
      <aside className="sidebar">
        <Tree manifest={manifest} current={currentId} onSelect={setCurrentId} />
      </aside>
      <main className="content" aria-live="polite" ref={contentRef}>
        <LessonView lesson={currentLesson} onPrev={onPrev} onNext={onNext} />
      </main>
    </div>
  )
}
