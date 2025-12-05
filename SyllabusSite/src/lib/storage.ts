const k = (s: string, id: string) => `sdjic:${s}:${id}`
export const saveNote = (id: string, text: string) => localStorage.setItem(k('note', id), text)
export const getNote = (id: string) => localStorage.getItem(k('note', id)) || ''
export const setDone = (id: string, v: boolean) => localStorage.setItem(k('done', id), v ? '1' : '0')
export const isDone = (id: string) => localStorage.getItem(k('done', id)) === '1'
export const toggleBookmark = (id: string) => {
  const v = localStorage.getItem(k('bm', id)) === '1'
  localStorage.setItem(k('bm', id), v ? '0' : '1')
}
export const isBookmarked = (id: string) => localStorage.getItem(k('bm', id)) === '1'
