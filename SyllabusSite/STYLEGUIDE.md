# Syllabus Site Style Guide

## Code Blocks
- Use fenced code blocks with language tags (```ts, ```tsx, ```js, ```bash, ```json).
- Code blocks render with Prism.js highlighting, line numbers, and an inline Copy button.
- For terminal examples, prefix commands with `$ ` to render in green; outputs render in white.

## Mermaid Diagrams
- Use fenced blocks with `mermaid` language:
  ```
  ```mermaid
  graph TD
    A --> B
  ```
  ```
- Diagrams render inline responsively. Fallback keeps the code block if rendering fails.

## Markdown Formatting
- Preserve headings (`#`, `##`, `###`) and lists; keep code fences intact.
- The first `#` heading becomes the lesson title in the sidebar.
- The first `##` heading is used as the lesson subtitle in the sidebar.

## Accessibility
- Headings must be sequential (`h1` to `h3`).
- Provide descriptive link texts; avoid "click here".
- Ensure color contrast meets WCAG 2.1 AA.

## Content Build
- Run `npm run content` to copy markdown into `public/content` and regenerate `manifest.json`.
- Metadata lines at the file start (`unit: N topic: ... objectives: ... difficulty: ...`) are removed from all files except the very first markdown file in the project; unit/topic info is extracted for the sidebar.

## Browser Support
- Chrome, Firefox, Safari, Edge; responsive at mobile, tablet, desktop; tested at 100–200% zoom.

## Contributor Notes
- Keep lesson titles concise; avoid adding labels like "Learning Objectives" to titles.
- Prefer language-specific code fences; avoid inline code for long snippets.
