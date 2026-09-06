# Portfolio — Recon Session

A cybersecurity-engineer portfolio: a fake recon/terminal session layered as
progressive enhancement over always-present static content (see
`docs/superpowers/specs/2026-09-06-cybersecurity-portfolio-recon-session-design.md`
for the full design).

## Structure

- `index.html` — the whole page: skip link, terminal widget, and the static
  `#about` / `#projects` / `#certs` / `#contact` sections that hold all real
  content.
- `css/style.css` — theme, static-content layout, terminal chrome, responsive
  and focus-visible rules.
- `js/commands.js` — pure command parser (no DOM). Unit-tested with Node.
- `js/content.js` — reads the static sections into structured data. Tested
  against a browser fixture (no DOM library needed).
- `js/terminal.js` — wires the two modules above into the interactive boot
  sequence, command prompt, and corner-nav buttons.
- `assets/resume.pdf` — **placeholder**, replace with a real resume.

## Editing content

Everything the terminal displays is read live from `index.html` at runtime —
there is no separate data file. To add a project, copy an existing
`<article data-project-id="...">` block in the `#projects` section and edit
its text; the terminal picks it up automatically. Same pattern for
certifications (`<li data-cert="...">` in `#certs`) and contact links
(`<a data-contact="...">` in `#contact`).

## Running locally

No build step. Open `index.html` directly in a browser, or serve the folder
with any static file server.

## Tests

- `node tests/test-commands.js` — command-parser unit tests (Node, no
  dependencies).
- `tests/test-content.html` — open directly in a browser (or via a local
  static server); the page itself reports PASS/FAIL for each check.

## Deployment

Static files only — deploy the whole folder to GitHub Pages, Netlify, or any
static host with no code changes.

## Before this goes live

- Replace every placeholder (name, bio, projects, certs, email, LinkedIn,
  GitHub, `assets/resume.pdf`) with your real information.
- Decide the tone lean (red-team vs. blue-team framing of the `sudo`/`nmap`
  jokes) to match your actual specialization — see the design doc's open
  questions.
