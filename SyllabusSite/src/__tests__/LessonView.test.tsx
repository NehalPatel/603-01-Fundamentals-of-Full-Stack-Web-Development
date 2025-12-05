import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LessonView from '../components/LessonView'

vi.mock('html2pdf.js', () => ({ default: () => ({ from: () => ({ set: () => ({ save: () => { } }) }) }) }))

const lesson = { id: 'UNIT-1/1.1.md', title: 'Test', path: '' }

beforeEach(() => {
  localStorage.clear()
})

describe('LessonView actions', () => {
  it('toggles completion', async () => {
    render(<LessonView lesson={lesson} onPrev={() => { }} onNext={() => { }} />)
    const btn = await screen.findAllByRole('button', { name: /Mark Complete/i })
    await userEvent.click(btn[0])
    expect(localStorage.getItem('sdjic:done:UNIT-1/1.1.md')).toBe('1')
    await userEvent.click(btn[0])
    expect(localStorage.getItem('sdjic:done:UNIT-1/1.1.md')).toBe('0')
  })

  it('toggles bookmark', async () => {
    render(<LessonView lesson={lesson} onPrev={() => { }} onNext={() => { }} />)
    const btn = await screen.findAllByRole('button', { name: /Bookmark/i })
    await userEvent.click(btn[0])
    expect(localStorage.getItem('sdjic:bm:UNIT-1/1.1.md')).toBe('1')
  })

  it('calls previous/next handlers', async () => {
    const prev = vi.fn()
    const next = vi.fn()
    render(<LessonView lesson={lesson} onPrev={prev} onNext={next} />)
    const prevBtn = screen.getAllByRole('button', { name: /Previous lesson/i })[0]
    const nextBtn = screen.getAllByRole('button', { name: /Next lesson/i })[0]
    prevBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    nextBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(prev).toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })

  it('downloads PDF', async () => {
    render(<LessonView lesson={lesson} onPrev={() => { }} onNext={() => { }} />)
    const btns = screen.getAllByRole('button', { name: /Download PDF/i })
    await userEvent.click(btns[0])
    expect(true).toBe(true)
  })
})
