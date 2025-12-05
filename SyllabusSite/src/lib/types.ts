export type Lesson = { id: string; title: string; subtitle?: string; path: string }
export type Section = { id: string; title: string; lessons: Lesson[] }
export type Unit = { id: string; title: string; unitNumber?: string; topic?: string; sections: Section[] }
export type Manifest = { units: Unit[] }
