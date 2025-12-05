import { useEffect, useMemo, useState } from 'react'
import { toHtml } from '../lib/markdown'
import { getNote, saveNote, isDone, setDone as setDoneStorage, isBookmarked, toggleBookmark } from '../lib/storage'
import Prism from 'prismjs'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-css'

export default function LessonView({ lesson, onPrev, onNext }: { lesson: { id: string; title: string; path: string } | null; onPrev: () => void; onNext: () => void }) {
  const [html, setHtml] = useState('')
  const [note, setNote] = useState('')
  const [done, setDone] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  useEffect(() => {
    if (!lesson || !lesson.path) return
    fetch(lesson.path).then(r => r.text()).then(async md => setHtml(await toHtml(md))).catch(() => setHtml(''))
    setNote(getNote(lesson.id))
  }, [lesson])
  useEffect(() => {
    if (!html) return
    const container = document.querySelector('.markdown') as HTMLElement
    if (!container) return
    // Syntax highlighting
    Prism.highlightAllUnder(container)
    // Line numbers
    container.querySelectorAll('pre > code').forEach(code => {
      const pre = code.parentElement!
      pre.classList.add('line-numbers')
    })
    // Copy buttons
    container.querySelectorAll('pre').forEach(pre => {
      if (pre.querySelector('.copy-btn')) return
      const btn = document.createElement('button')
      btn.textContent = 'Copy'
      btn.className = 'btn copy-btn'
      btn.addEventListener('click', () => {
        const text = pre.textContent || ''
        navigator.clipboard.writeText(text)
      })
      pre.appendChild(btn)
    })
    // Terminal styling: color lines starting with `$ ` without escaping Prism markup
    container.querySelectorAll('code.language-bash, code.language-sh, code.language-powershell').forEach(code => {
      const htmlLines = code.innerHTML.split('\n')
      const textLines = (code.textContent || '').split('\n')
      const wrapped = htmlLines.map((lineHtml, i) => {
        const t = textLines[i] || ''
        const cls = t.startsWith('$ ') ? 'term-cmd' : 'term-out'
        return `<span class="${cls}">${lineHtml}</span>`
      }).join('\n')
      code.innerHTML = wrapped
      code.parentElement?.classList.add('terminal')
    })
    // Mermaid rendering
    const mermaidBlocks = Array.from(container.querySelectorAll('code.language-mermaid'))
    if (mermaidBlocks.length) {
      import('mermaid').then(async ({ default: mermaid }) => {
        mermaid.initialize({ startOnLoad: false, theme: 'default' })
        let idx = 0
        for (const code of mermaidBlocks) {
          const text = code.textContent || ''
          const pre = code.parentElement as HTMLElement
          const holder = document.createElement('div')
          holder.className = 'mermaid'
          holder.setAttribute('role', 'img')
          holder.setAttribute('aria-label', 'Mermaid diagram')
          try {
            const id = `m-${Date.now()}-${idx++}`
            const { svg } = await mermaid.render(id, text)
            holder.innerHTML = svg
            pre.replaceWith(holder)
          } catch {
            pre.setAttribute('aria-label', 'Mermaid diagram (fallback)')
          }
        }
      }).catch(() => {
        mermaidBlocks.forEach(code => {
          const pre = code.parentElement as HTMLElement
          pre.setAttribute('aria-label', 'Mermaid diagram (fallback)')
        })
      })
    }
  }, [html])
  useEffect(() => {
    if (!lesson) return
    setDone(isDone(lesson.id))
    setBookmarked(isBookmarked(lesson.id))
  }, [lesson])
  if (!lesson) return <div />
  const progress = done ? 100 : 0
  return (
    <div>
      <div className="lesson-nav" role="group" aria-label="Actions">
        <button className="btn" onClick={() => { try { onPrev() } catch {} }} aria-label="Previous lesson" data-testid="prev-btn">Previous</button>
        <button className="btn" onClick={() => { try { onNext() } catch {} }} aria-label="Next lesson" data-testid="next-btn">Next</button>
        <button className="btn" onClick={() => { const v = !done; setDone(v); setDoneStorage(lesson.id, v) }} aria-pressed={done}>{done ? 'Mark Incomplete' : 'Mark Complete'}</button>
        <button className="btn bookmark" onClick={() => { toggleBookmark(lesson.id); setBookmarked(!bookmarked) }} aria-pressed={bookmarked}>{bookmarked ? 'Bookmarked' : 'Bookmark'}</button>
        <button className="btn" onClick={() => downloadPDF(lesson.title)} aria-label="Download PDF">Download PDF</button>
      </div>
      <div className="progress" aria-label="Progress"><div style={{ width: progress + '%' }} /></div>
      <article className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
      <div className="action-bar" role="group" aria-label="Actions (bottom)">
        <button className="btn" onClick={() => { try { onPrev() } catch {} }} aria-label="Previous lesson" data-testid="prev-btn-bottom">Previous</button>
        <button className="btn" onClick={() => { try { onNext() } catch {} }} aria-label="Next lesson" data-testid="next-btn-bottom">Next</button>
        <button className="btn" onClick={() => { const v = !done; setDone(v); setDoneStorage(lesson.id, v) }} aria-pressed={done}>{done ? 'Mark Incomplete' : 'Mark Complete'}</button>
        <button className="btn bookmark" onClick={() => { toggleBookmark(lesson.id); setBookmarked(!bookmarked) }} aria-pressed={bookmarked}>{bookmarked ? 'Bookmarked' : 'Bookmark'}</button>
        <button className="btn" onClick={() => downloadPDF(lesson.title)} aria-label="Download PDF">Download PDF</button>
      </div>
      <h3>Notes</h3>
      <label className="sr-only" htmlFor="note">Notes</label>
      <textarea id="note" className="note" value={note} onChange={e => { setNote(e.target.value); saveNote(lesson.id, e.target.value) }} />
    </div>
  )
}

function downloadPDF(title: string) {
  import('html2pdf.js').then(mod => {
    const el = document.querySelector('.markdown') as HTMLElement
    const opt = { margin: 0.5, filename: `${title}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } }
    // @ts-ignore
    mod.default().from(el).set(opt).save()
  }).catch(() => {
    alert('Failed to generate PDF')
  })
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]!))
}
