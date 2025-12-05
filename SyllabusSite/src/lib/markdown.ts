import { marked } from 'marked'
marked.setOptions({ gfm: true, breaks: false })
export const toHtml = async (md: string) => marked.parse(md) as string
