# Portfolio

A clean, professional cybersecurity-engineer portfolio: static HTML and CSS
only, no JavaScript, no build step.

## Structure

- `index.html` — the whole page: header/nav, hero/about, projects, certifications,
  and contact sections.
- `css/style.css` — theme (light + dark via `prefers-color-scheme`), layout,
  responsive rules, and focus-visible styles.
- `assets/resume.pdf` — **placeholder**, replace with a real resume.

## Editing content

Everything is plain HTML in `index.html` — edit the text directly. To add a
project, copy an existing `<article class="project-card">` block inside
`#projects` and edit its text. Same pattern for certifications
(`<li>` entries in `.cert-list`) and contact links (`.contact-list`).

## Running locally

No build step, no dependencies. Open `index.html` directly in a browser, or
serve the folder with any static file server.

## Deployment

Static files only — deploy the whole folder to GitHub Pages, Netlify, or any
static host with no code changes.

## Before this goes live

Replace every placeholder — name, bio, project names/descriptions,
certifications, email, LinkedIn, GitHub, and `assets/resume.pdf` — with your
real information.
